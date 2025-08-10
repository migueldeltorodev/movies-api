namespace Movies.Api.Endpoints.Profile;

public static class ProfileEndpointExtensions
{
    public static IEndpointRouteBuilder MapProfileEndpoints(this IEndpointRouteBuilder app)
    {
        app.MapGetUserProfile();
        app.MapUpdateUserProfile();
        return app;
    }
}