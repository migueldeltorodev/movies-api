using Movies.Api.Endpoints.Auth;
using Movies.Api.Endpoints.Movies;
using Movies.Api.Endpoints.Ratings;

namespace Movies.Api.Endpoints;

public static class EndpointsExtensions
{
    /// <summary>
    /// Registers movie, rating, and authentication API endpoints with the specified endpoint route builder.
    /// </summary>
    /// <param name="app">The endpoint route builder to configure.</param>
    /// <returns>The configured endpoint route builder.</returns>
    public static IEndpointRouteBuilder MapApiEndpoints(this IEndpointRouteBuilder app)
    {
        app.MapMovieEndpoints();
        app.MapRatingEndpoints();
        app.MapAuthEndpoints();
        return app;;
    }
}