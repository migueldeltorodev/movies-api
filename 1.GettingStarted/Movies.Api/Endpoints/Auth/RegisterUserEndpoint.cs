using System.Security.Claims;
using Microsoft.AspNetCore.Identity;
using Movies.Api.Auth;
using Movies.Application.Models;
using Movies.Contracts.Requests;
using Movies.Contracts.Responses;

namespace Movies.Api.Endpoints.Auth;

public static class RegisterUserEndpoint
{
    private const string Name = "RegisterUser";
    /// <summary>
    /// Maps the user registration HTTP POST endpoint, handling new user creation, role assignment, and access token generation.
    /// </summary>
    /// <returns>The modified <see cref="IEndpointRouteBuilder"/> with the registration endpoint mapped.</returns>
    public static IEndpointRouteBuilder MapRegisterUser(this IEndpointRouteBuilder app)
    {
        app.MapPost(ApiEndpoints.Auth.Register, async (
                RegisterRequest request,
                UserManager<User> userManager,
                TokenService tokenService,
                CancellationToken token) =>
            {
                var userExists = await userManager.FindByEmailAsync(request.Email);
                if (userExists is not null)
                {
                    return Results.Conflict(new { message = "User with this email already exists." });
                }

                var user = new User
                {
                    UserName = request.Email,
                    Email = request.Email,
                };

                var result = await userManager.CreateAsync(user, request.Password);

                if (!result.Succeeded)
                {
                    return Results.BadRequest(result.Errors);
                }
            
                await userManager.AddToRoleAsync(user, "User");

                var accessToken = await tokenService.GenerateTokenAsync(user);
                var response = new AuthResponse
                {
                    UserId = user.Id,
                    Email = user.Email!,
                    AccessToken = accessToken
                };

                return Results.Ok(response);
            })
            .WithName(Name)
            .Produces<AuthResponse>(StatusCodes.Status201Created)
            .WithApiVersionSet(ApiVersioning.VersionSet)
            .HasApiVersion(1.0);
        
        return app;
    }
}