using System.Security.Claims;
using Movies.Api.Auth;
using Movies.Api.Mapping;
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

                var result = await userService.GetProfileAsync(userId.Value, token);
                return result.ToOkResult();
            })
            .WithName(Name)
            .Produces<UserProfileResponse>()
            .Produces(StatusCodes.Status404NotFound)
            .RequireAuthorization();
    }
}