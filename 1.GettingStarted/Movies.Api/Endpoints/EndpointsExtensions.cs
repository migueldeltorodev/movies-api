using Movies.Api.Endpoints.Auth;
using Movies.Api.Endpoints.Movies;
using Movies.Api.Endpoints.Ratings;

namespace Movies.Api.Endpoints;

public static class EndpointsExtensions
{
    public static IEndpointRouteBuilder MapApiEndpoints(this IEndpointRouteBuilder app)
    {
        app.MapMovieEndpoints();
        app.MapRatingEndpoints();
        app.MapAuthEndpoints();
        return app;;
    }
}