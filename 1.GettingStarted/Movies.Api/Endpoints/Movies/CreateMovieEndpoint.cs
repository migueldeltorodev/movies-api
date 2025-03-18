using Microsoft.AspNetCore.OutputCaching;
using Movies.Api.Mapping;
using Movies.Application.Services;
using Movies.Contracts.Requests;

namespace Movies.Api.Endpoints.Movies;

public static class CreateMovieEndpoint
{
    public const string Name = "CreateMovie";
    public static IEndpointRouteBuilder MapCreateMovie(this IEndpointRouteBuilder app)
    {
        app.MapPost(ApiEndpoints.Movies.Create, async (
            CreateMovieRequest request, 
            IMovieService movieService, 
            IOutputCacheStore outputCacheStore,
            CancellationToken token) =>
        {
            var movie = request.MapToMovie();
            await movieService.CreateAsync(movie, token);
            await outputCacheStore.EvictByTagAsync("movies", token);
            var response = movie.MapToMovieResponse();
            return TypedResults.CreatedAtRoute(response, GetMovieEndpoint.Name, new { idOrSlug = movie.Id });
        })
        .WithName(Name);
        
        return app;
    }
}