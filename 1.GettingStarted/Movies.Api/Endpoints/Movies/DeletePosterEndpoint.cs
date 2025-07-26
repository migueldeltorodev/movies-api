using Microsoft.AspNetCore.Authorization;
using Movies.Api.Auth;
using Movies.Application.Services;

namespace Movies.Api.Endpoints.Movies;

public static class DeletePosterEndpoint
{
    private const string Name = "DeletePoster";

    public static IEndpointRouteBuilder MapDeletePoster(this IEndpointRouteBuilder app)
    {
        app.MapDelete(ApiEndpoints.Movies.DeletePoster, DeletePosterAsync)
            .WithName(Name)
            .WithOpenApi(operation => new(operation)
            {
                Summary = "Delete a movie poster",
                Description = "Deletes the poster image for the specified movie. Only admins can delete posters."
            })
            .Produces(StatusCodes.Status204NoContent)
            .ProducesProblem(StatusCodes.Status404NotFound)
            .ProducesProblem(StatusCodes.Status401Unauthorized)
            .RequireAuthorization(AuthConstants.AdminUserPolicyName);

        return app;
    }

    private static async Task<IResult> DeletePosterAsync(
        Guid id,
        IMovieService movieService,
        HttpContext context,
        CancellationToken cancellationToken)
    {
        var userId = context.GetUserId();
        if (!userId.HasValue)
        {
            return Results.Unauthorized();
        }

        var deleted = await movieService.DeletePosterAsync(id, userId.Value, cancellationToken);

        return !deleted ? Results.NotFound() : Results.NoContent();
    }
}