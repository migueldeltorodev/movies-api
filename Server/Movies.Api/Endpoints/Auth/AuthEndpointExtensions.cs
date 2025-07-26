namespace Movies.Api.Endpoints.Auth;

public static class AuthEndpointExtensions
{
    public static IEndpointRouteBuilder MapAuthEndpoints(this IEndpointRouteBuilder app)
    {
        app.MapRegisterUser();
        app.MapLoginUser();
        app.MapPromoteUser();
        return app;
    }
}