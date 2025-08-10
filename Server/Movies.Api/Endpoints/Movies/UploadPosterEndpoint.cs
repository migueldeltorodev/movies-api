using Movies.Api.Auth;
using Movies.Api.Mapping;
using Movies.Application.Services;
using Movies.Contracts.Requests;
using Movies.Contracts.Responses;

namespace Movies.Api.Endpoints.Movies;

public static class UploadPosterEndpoint
{
    private const string Name = "UploadPoster";

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

        var userId = context.User.GetId();
        if (!userId.HasValue)
        {
            return Results.Unauthorized();
        }

        var request = new FileUploadRequest
        {
            FileName = poster.FileName,
            Content = poster.OpenReadStream(),
            ContentType = poster.ContentType,
            ContentLength = poster.Length
        };

        var movie = await movieService.UploadPosterAsync(id, request, userId.Value, cancellationToken);

        if (movie is null)
        {
            return Results.NotFound();
        }

        var response = movie.MapToMovieResponse();
        return Results.Ok(response);
    }
}