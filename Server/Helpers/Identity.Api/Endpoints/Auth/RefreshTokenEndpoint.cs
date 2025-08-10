using System.Security.Claims;
using Identity.Api.Auth;
using Microsoft.AspNetCore.Identity;
using Movies.Api;
using Movies.Application.Models;
using Movies.Contracts.Requests;
using Movies.Contracts.Responses;

namespace Identity.Api.Endpoints.Auth;

public static class RefreshTokenEndpoint
{
    private const string Name = "RefreshToken";

    public static IEndpointRouteBuilder MapRefreshToken(this IEndpointRouteBuilder app)
    {
        app.MapPost(ApiEndpoints.Auth.Refresh, async (
                RefreshTokenRequest request,
                HttpContext context,
                UserManager<User> userManager,
                TokenService tokenService,
                CancellationToken token) =>
            {
                var refreshToken = context.Request.Cookies["refreshToken"];
                if (string.IsNullOrEmpty(refreshToken))
                {
                    return Results.BadRequest("Invalid client request");
                }

                var principal = tokenService.GetPrincipalFromExpiredToken(request.AccessToken);
                var username = principal.Identity!.Name;
                var user = await userManager.FindByNameAsync(username!);

                if (user is null || user.RefreshToken is null || user.RefreshTokenExpiryTime <= DateTime.UtcNow)
                {
                    return Results.BadRequest("Invalid client request");
                }

                var refreshTokenHash = tokenService.HashRefreshToken(refreshToken);
                if (user.RefreshToken != refreshTokenHash)
                {
                    // This is made in case that user's token are not valid
                    // then the system will invalidate all user tokens for security
                    user.RefreshToken = null;
                    await userManager.UpdateAsync(user);
                    return Results.BadRequest("Invalid client request");
                }

                var newAccessToken = await tokenService.GenerateTokenAsync(user);
                var newRefreshToken = tokenService.GenerateRefreshToken();

                user.RefreshToken = tokenService.HashRefreshToken(newRefreshToken);
                var refreshTokenValidityInDays = tokenService.GetRefreshTokenValidityInDays();
                user.RefreshTokenExpiryTime = DateTime.UtcNow.AddDays(refreshTokenValidityInDays);

                await userManager.UpdateAsync(user);

                context.Response.Cookies.Append("refreshToken", newRefreshToken, new CookieOptions
                {
                    HttpOnly = true,
                    Secure = true,
                    SameSite = SameSiteMode.Strict,
                    Expires = DateTime.UtcNow.AddDays(refreshTokenValidityInDays)
                });

                return Results.Ok(new AuthResponse
                {
                    UserId = user.Id,
                    Email = user.Email!,
                    AccessToken = newAccessToken
                });
            })
            .WithName(Name)
            .Produces<AuthResponse>(StatusCodes.Status200OK)
            .Produces(StatusCodes.Status400BadRequest);

        return app;
    }
}