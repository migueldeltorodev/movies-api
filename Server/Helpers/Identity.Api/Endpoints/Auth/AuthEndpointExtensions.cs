namespace Identity.Api.Endpoints.Auth;

public static class AuthEndpointExtensions
{
    public static IEndpointRouteBuilder MapAuthEndpoints(this IEndpointRouteBuilder app)
    {
        app.MapRegisterUser();
        app.MapLoginUser();
        app.MapPromoteUser();
        app.MapRefreshToken();
        app.MapConfirmEmail();
        return app;
    }
}