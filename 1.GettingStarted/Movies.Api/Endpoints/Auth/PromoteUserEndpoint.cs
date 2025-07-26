using System.Security.Claims;
using Microsoft.AspNetCore.Identity;
using Movies.Api.Auth;
using Movies.Application.Models;
using Movies.Contracts.Requests;

namespace Movies.Api.Endpoints.Auth;

public static class PromoteUserEndpoint
{
    private const string Name = "PromoteUser";
    
    public static IEndpointRouteBuilder MapPromoteUser(this IEndpointRouteBuilder app)
    {
        app.MapPost(ApiEndpoints.Auth.Promote, async (
                PromoteUserRequest request,
                UserManager<User> userManager,
                CancellationToken token) =>
            {
                var user = await userManager.FindByEmailAsync(request.Email);
                if (user is null)
                {
                    return Results.NotFound(new { message = "User not found." });
                }

                var addToRoleResult = await userManager.AddToRoleAsync(user, "Admin");
                if (!addToRoleResult.Succeeded)
                {
                    return Results.BadRequest(addToRoleResult.Errors);
                }

                var adminClaim = new Claim(AuthConstants.AdminUserClaimName, "true");
                var addClaimResult = await userManager.AddClaimAsync(user, adminClaim);
                
                if (!addClaimResult.Succeeded)
                {
                    return Results.BadRequest(addClaimResult.Errors);
                }

                return Results.Ok(new { 
                    message = $"User {request.Email} has been promoted to administrator.",
                    userId = user.Id 
                });
            })
            .WithName(Name)
            .Produces(StatusCodes.Status200OK)
            .Produces(StatusCodes.Status404NotFound)
            .Produces(StatusCodes.Status400BadRequest)
            .RequireAuthorization(AuthConstants.AdminUserPolicyName);

        return app;
    }
}