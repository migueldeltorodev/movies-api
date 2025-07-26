using Microsoft.AspNetCore.OutputCaching;
using Movies.Api.Auth;
using Movies.Api.Mapping;
using Movies.Application.Services;
using Movies.Contracts.Requests;
using Movies.Contracts.Responses;

namespace Movies.Api.Endpoints.Movies;

public static class CreateMovieEndpoint
{
    private const string Name = "CreateMovie";
    public static IEndpointRouteBuilder MapCreateMovie(this IEndpointRouteBuilder app)
    {
        app.MapPost(ApiEndpoints.Movies.Create, async (
            CreateMovieRequest request, 
            IMovieService movieService, 
            IOutputCacheStore outputCacheStore,
            HttpContext context,
            CancellationToken token) =>
        {
            var userId = context.GetUserId();

            if (userId is null)
            {
                return Results.Unauthorized();
            }
            
            var movie = request.MapToMovie(userId.Value);
            await movieService.CreateAsync(movie, token);
            await outputCacheStore.EvictByTagAsync("movies", token);
            var response = movie.MapToMovieResponse();
            return TypedResults.CreatedAtRoute(response, GetMovieEndpoint.Name, new { idOrSlug = movie.Id });
        })
        .WithName(Name)
        .Produces<MovieResponse>(StatusCodes.Status201Created)
        .Produces<ValidationFailureResponse>(StatusCodes.Status400BadRequest)
        .WithApiVersionSet(ApiVersioning.VersionSet)
        .HasApiVersion(1.0)
        .RequireAuthorization(AuthConstants.TrustedMemberPolicyName);
        
        return app;
    }
}