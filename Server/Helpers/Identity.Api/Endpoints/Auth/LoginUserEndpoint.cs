using Identity.Api.Auth;
using Microsoft.AspNetCore.Identity;
using Movies.Api;
using Movies.Application.Models;
using Movies.Contracts.Requests;
using Movies.Contracts.Responses;

namespace Identity.Api.Endpoints.Auth;

public static class LoginUserEndpoint
{
    private const string Name = "LoginUser";

    public static IEndpointRouteBuilder MapLoginUser(this IEndpointRouteBuilder app)
    {
        app.MapPost(ApiEndpoints.Auth.Login, async (
                LoginRequest request,
                HttpContext context,
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
                var refreshToken = tokenService.GenerateRefreshToken();

                user.RefreshToken = tokenService.HashRefreshToken(refreshToken);
                var refreshTokenValidityInDays = tokenService.GetRefreshTokenValidityInDays();
                user.RefreshTokenExpiryTime = DateTime.UtcNow.AddDays(refreshTokenValidityInDays);

                await userManager.UpdateAsync(user);

                context.Response.Cookies.Append("refreshToken", refreshToken, new CookieOptions
                {
                    HttpOnly = true,
                    Secure = true,
                    SameSite = SameSiteMode.Strict,
                    Expires = DateTime.UtcNow.AddDays(refreshTokenValidityInDays)
                });

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
            .Produces(StatusCodes.Status401Unauthorized);

        return app;
    }
}