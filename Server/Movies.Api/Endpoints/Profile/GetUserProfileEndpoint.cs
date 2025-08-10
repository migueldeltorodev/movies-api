using System.Security.Claims;
using Microsoft.AspNetCore.Mvc;
using Movies.Api.Auth;
using Movies.Application.Services;
using Movies.Contracts.Responses.Users;

namespace Movies.Api.Endpoints.Profile;

public static class GetUserProfileEndpoint
{
    private const string Name = "GetUserProfile";

    public static void MapGetUserProfile(this IEndpointRouteBuilder app)
    {
        app.MapGet(ApiEndpoints.Profile.Me, async (
                IUserService userService,
                HttpContext context,
                CancellationToken token) =>
            {
                var userId = context.User.GetId();
                if (userId is null)
                {
                    return Results.Unauthorized();
                }

                var profile = await userService.GetProfileAsync(userId.Value, token);
                return profile is not null ? Results.Ok(profile) : Results.NotFound();
            })
            .WithName(Name)
            .Produces<UserProfileResponse>()
            .Produces(StatusCodes.Status404NotFound)
            .RequireAuthorization();
    }
}