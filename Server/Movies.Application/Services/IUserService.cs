using Movies.Contracts.Requests.Users;
using Movies.Contracts.Responses.Users;

namespace Movies.Application.Services;

public interface IUserService
{
    Task<UserProfileResponse?> GetProfileAsync(Guid userId, CancellationToken token = default);

    Task<UserProfileResponse?> UpdateProfileAsync(Guid userId, UpdateUserProfileRequest request,
        CancellationToken token = default);
}