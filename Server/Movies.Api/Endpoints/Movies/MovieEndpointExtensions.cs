namespace Movies.Api.Endpoints.Movies;

public static class MovieEndpointExtensions
{
    public static IEndpointRouteBuilder MapMovieEndpoints(this IEndpointRouteBuilder app)
    {
        app.MapCreateMovie();
        app.MapGetMovie();
        app.MapGetAllMovies();
        app.MapUpdateMovie();
        app.MapDeleteMovie();
        app.MapUploadPoster();
        app.MapDeletePoster();
        app.MapChangeMovieStatusEndpoint();
        return app;
    }
}