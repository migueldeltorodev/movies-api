using Microsoft.AspNetCore.Identity;
using Movies.Api;
using Movies.Application.Models;

namespace Identity.Api.Endpoints.Auth;

public static class ConfirmEmailEndpoint
{
    private const string Name = "ConfirmEmail";

    public static IEndpointRouteBuilder MapConfirmEmail(this IEndpointRouteBuilder app)
    {
        app.MapGet(ApiEndpoints.Auth.ConfirmEmail, async (
                string userId,
                string token,
                UserManager<User> userManager) =>
            {
                var user = await userManager.FindByIdAsync(userId);
                if (user is null)
                {
                    return Results.NotFound();
                }

                var result = await userManager.ConfirmEmailAsync(user, token);
                if (!result.Succeeded)
                {
                    return Results.BadRequest(result.Errors);
                }

                return Results.Ok(new { message = "Email confirmed successfully." });
            })
            .WithName(Name)
            .Produces(StatusCodes.Status200OK)
            .Produces(StatusCodes.Status400BadRequest)
            .Produces(StatusCodes.Status404NotFound);

        return app;
    }
}