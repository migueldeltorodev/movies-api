using Movies.Api.Auth;
using Movies.Api.Mapping;
using Movies.Application.Services;
using Movies.Contracts.Requests;
using Movies.Contracts.Responses;

namespace Movies.Api.Endpoints.Movies;

public static class GetAllMoviesEndpoint
{
    private const string Name = "GetMovies";

    /// <summary>
    /// Registers an HTTP GET endpoint for retrieving a paginated list of movies with optional filtering and user context.
    /// </summary>
    /// <returns>The modified <see cref="IEndpointRouteBuilder"/> with the movies endpoint mapped.</returns>
    public static IEndpointRouteBuilder MapGetAllMovies(this IEndpointRouteBuilder app)
    {
        app.MapGet(ApiEndpoints.Movies.GetAll, async (
                [AsParameters] GetAllMoviesRequest request,
                IMovieService movieService,
                HttpContext context,
                CancellationToken token) =>
            {
                var userId = context.GetUserId();
                var options = request.MapToOptions()
                    .WithUserId(userId);
                var movies = await movieService.GetAllAsync(options, token);
                var movieCount = await movieService.GetCountAsync(options.Title, options.Year, token);
                var movieResponse = movies.MapToMoviesResponse(
                    request.Page.GetValueOrDefault(PagedRequest.DefaultPage),
                    request.PageSize.GetValueOrDefault(PagedRequest.DefaultPageSize),
                    movieCount);
                return TypedResults.Ok(movieResponse);
            })
            .WithName(Name)
            .Produces<MoviesResponse>(StatusCodes.Status200OK)
            .CacheOutput("MoviesCache");
        
        return app;
    }
}