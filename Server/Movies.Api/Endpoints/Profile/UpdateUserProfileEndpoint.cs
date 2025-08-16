using System.Security.Claims;
using Microsoft.AspNetCore.Mvc;
using Movies.Api.Auth;
using Movies.Api.Mapping;
using Movies.Application.Services;
using Movies.Contracts.Requests;
using Movies.Contracts.Requests.Users;
using Movies.Contracts.Responses.Users;

namespace Movies.Api.Endpoints.Profile;

public static class UpdateUserProfileEndpoint
{
    private const string Name = "UpdateUserProfile";

    public static void MapUpdateUserProfile(this IEndpointRouteBuilder app)
    {
        app.MapPut(ApiEndpoints.Profile.Me, async (
                [FromBody] UpdateUserProfileRequest request,
                IUserService userService,
                HttpContext context,
                CancellationToken token) =>
            {
                var userId = context.User.GetId();
                if (userId is null)
                {
                    return Results.Unauthorized();
                }

                var result = await userService.UpdateProfileAsync(userId.Value, request, token);
                return result.ToOkResult();
            })
            .WithName(Name)
            .Produces<UserProfileResponse>()
            .Produces(StatusCodes.Status404NotFound)
            .Produces(StatusCodes.Status400BadRequest)
            .RequireAuthorization();
    }
}