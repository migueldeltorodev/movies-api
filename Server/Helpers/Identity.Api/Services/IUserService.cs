using FluentResults;
using Movies.Contracts.Requests.Users;
using Movies.Contracts.Responses.Users;

namespace Identity.Api.Services;

public interface IUserService
{
    Task<Result<UserProfileResponse>> GetProfileAsync(Guid userId, CancellationToken token = default);

    Task<Result<UserProfileResponse>> UpdateProfileAsync(Guid userId, UpdateUserProfileRequest request,
        CancellationToken token = default);
}