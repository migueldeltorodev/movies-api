using FluentResults;
using Microsoft.AspNetCore.Identity;
using Movies.Application.Models;
using Movies.Application.Models.Errors;
using Movies.Contracts.Requests.Users;
using Movies.Contracts.Responses.Users;

namespace Identity.Api.Services;

public class UserService : IUserService
{
    private readonly UserManager<User> _userManager;

    public UserService(UserManager<User> userManager)
    {
        _userManager = userManager;
    }

    public async Task<Result<UserProfileResponse>> GetProfileAsync(Guid userId, CancellationToken token = default)
    {
        var user = await _userManager.FindByIdAsync(userId.ToString());
        if (user is null)
        {
            return Result.Fail(new NotFoundError($"User with id {userId} not found"));
        }

        var response = new UserProfileResponse
        {
            Id = user.Id,
            Email = user.Email!,
            UserName = user.UserName!
        };
        return Result.Ok(response);
    }

    public async Task<Result<UserProfileResponse>> UpdateProfileAsync(Guid userId, UpdateUserProfileRequest request,
        CancellationToken token = default)
    {
        var user = await _userManager.FindByIdAsync(userId.ToString());
        if (user is null)
        {
            return Result.Fail(new NotFoundError($"User with id {userId} not found"));
        }

        var newEmail = request.Email;
        var existingUser = await _userManager.FindByEmailAsync(newEmail);
        if (existingUser is not null && existingUser.Id != user.Id)
        {
            return Result.Fail(new ValidationError("A user with this email already exists"));
        }

        user.Email = newEmail;
        user.UserName = newEmail;

        var result = await _userManager.UpdateAsync(user);

        if (!result.Succeeded)
        {
            var errors = result.Errors.Select(e => new ValidationError(e.Description));
            return Result.Fail(errors);
        }

        var response = new UserProfileResponse
        {
            Id = user.Id,
            Email = user.Email!,
            UserName = user.UserName!
        };

        return Result.Ok(response);
    }
}