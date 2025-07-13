namespace Movies.Api.Endpoints.Auth;

public static class AuthEndpointExtensions
{
    /// <summary>
    /// Registers authentication-related endpoints for user registration and login on the specified endpoint route builder.
    /// </summary>
    /// <param name="app">The endpoint route builder to which authentication endpoints will be mapped.</param>
    /// <returns>The same endpoint route builder instance with authentication endpoints registered.</returns>
    public static IEndpointRouteBuilder MapAuthEndpoints(this IEndpointRouteBuilder app)
    {
        app.MapRegisterUser();
        app.MapLoginUser();
        return app;
    }
}