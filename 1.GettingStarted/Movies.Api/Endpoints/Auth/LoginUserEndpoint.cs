using Microsoft.AspNetCore.Identity;
using Movies.Api.Auth;
using Movies.Application.Models;
using Movies.Contracts.Requests;
using Movies.Contracts.Responses;

namespace Movies.Api.Endpoints.Auth;

public static class LoginUserEndpoint
{
    private const string Name = "LoginUser";
    /// <summary>
    /// Maps the user login endpoint, handling authentication and returning an access token upon successful login.
    /// </summary>
    /// <remarks>
    /// This endpoint accepts a POST request with user credentials, verifies the user's existence and password, and returns an <see cref="AuthResponse"/> with an access token if authentication succeeds. Returns 401 Unauthorized if authentication fails. The endpoint is versioned under API version 1.0.
    /// </remarks>
    /// <returns>The <see cref="IEndpointRouteBuilder"/> with the login endpoint mapped.</returns>
    public static IEndpointRouteBuilder MapLoginUser(this IEndpointRouteBuilder app)
    {
        app.MapPost(ApiEndpoints.Auth.Login, async (
                LoginRequest request,
                UserManager<User> userManager,
                TokenService tokenService,
                CancellationToken token) =>
            {
                var user = await userManager.FindByEmailAsync(request.Email);
                if (user is null)
                {
                    return Results.Unauthorized();
                }

                var isPasswordValid = await userManager.CheckPasswordAsync(user, request.Password);
                if (!isPasswordValid)
                {
                    return Results.Unauthorized();
                }

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
            .Produces<AuthResponse>(StatusCodes.Status200OK)
            .Produces(StatusCodes.Status401Unauthorized)
            .WithApiVersionSet(ApiVersioning.VersionSet)
            .HasApiVersion(1.0);
        
        return app;
    }
}
