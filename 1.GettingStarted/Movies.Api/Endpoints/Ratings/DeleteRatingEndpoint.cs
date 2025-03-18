using Movies.Api.Auth;
using Movies.Application.Services;

namespace Movies.Api.Endpoints.Ratings;

public static class DeleteRatingEndpoint
{
    private const string Name = "DeleteRating";

    public static IEndpointRouteBuilder MapDeleteRating(this IEndpointRouteBuilder app)
    {
        app.MapDelete(ApiEndpoints.Movies.DeleteRating, async (
                Guid id,
                IRatingService ratingService, 
                HttpContext context, 
                CancellationToken token) =>
            {
                var userId = context.GetUserId();
                var result = await ratingService.DeleteRatingAsync(id, userId!.Value, token);
                return result ? Results.Ok() : Results.NotFound();
            })
            .WithName(Name);

        return app;
    }
}