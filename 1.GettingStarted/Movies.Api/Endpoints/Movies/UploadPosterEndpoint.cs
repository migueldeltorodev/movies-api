using Microsoft.AspNetCore.Authorization;
using Movies.Api.Auth;
using Movies.Api.Mapping;
using Movies.Application.Services;
using Movies.Contracts.Requests;
using Movies.Contracts.Responses;

namespace Movies.Api.Endpoints.Movies;

public static class UploadPosterEndpoint
{
    public const string Name = "UploadPoster";

    public static IEndpointRouteBuilder MapUploadPoster(this IEndpointRouteBuilder app)
    {
        app.MapPost(ApiEndpoints.Movies.UploadPoster, UploadPosterAsync)
            .WithName(Name)
            .WithOpenApi(operation => new(operation)
            {
                Summary = "Upload a poster for a movie",
                Description = "Uploads a poster image for the specified movie. Only admins can upload posters."
            })
            .Produces<MovieResponse>()
            .ProducesProblem(StatusCodes.Status400BadRequest)
            .ProducesProblem(StatusCodes.Status404NotFound)
            .ProducesProblem(StatusCodes.Status401Unauthorized)
            .RequireAuthorization(AuthConstants.AdminUserPolicyName)
            .DisableAntiforgery();

        return app;
    }

    private static async Task<IResult> UploadPosterAsync(
        Guid id,
        IFormFile? poster,
        IMovieService movieService,
        HttpContext context,
        CancellationToken cancellationToken)
    {
        if (poster is null || poster.Length == 0)
        {
            return Results.BadRequest("No file provided");
        }

        var allowedTypes = new[] { "image/jpeg", "image/png", "image/webp" };
        if (!allowedTypes.Contains(poster.ContentType))
        {
            return Results.BadRequest("Invalid file type. Only JPEG, PNG, and WebP are allowed.");
        }

        const long maxSize = 5 * 1024 * 1024;
        if (poster.Length > maxSize)
        {
            return Results.BadRequest("File too large. Maximum size is 5MB.");
        }

        var userId = context.GetUserId();
        if (!userId.HasValue)
        {
            return Results.Unauthorized();
        }

        try
        {
            using var stream = poster.OpenReadStream();
            var movie = await movieService.UploadPosterAsync(id, stream, poster.FileName, userId.Value, cancellationToken);

            if (movie == null)
            {
                return Results.NotFound();
            }

            var response = movie.MapToMovieResponse();
            return Results.Ok(response);
        }
        catch (InvalidOperationException ex)
        {
            return Results.BadRequest(ex.Message);
        }
        catch (Exception)
        {
            return Results.Problem("An error occurred while uploading the poster");
        }
    }
}