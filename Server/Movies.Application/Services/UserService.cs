using Microsoft.AspNetCore.Identity;
using Movies.Application.Models;
using Movies.Contracts.Requests.Users;
using Movies.Contracts.Responses.Users;

namespace Movies.Application.Services;

public class UserService : IUserService
{
    private readonly UserManager<User> _userManager;

    public UserService(UserManager<User> userManager)
    {
        _userManager = userManager;
    }

    public async Task<UserProfileResponse?> GetProfileAsync(Guid userId, CancellationToken token = default)
    {
        var user = await _userManager.FindByIdAsync(userId.ToString());
        if (user is null)
        {
            return null;
        }

        return new UserProfileResponse
        {
            Id = user.Id,
            Email = user.Email!,
            UserName = user.UserName!
        };
    }

    public async Task<UserProfileResponse?> UpdateProfileAsync(Guid userId, UpdateUserProfileRequest request,
        CancellationToken token = default)
    {
        var user = await _userManager.FindByIdAsync(userId.ToString());
        if (user is null)
        {
            return null;
        }

        var newEmail = request.Email;
        var existingUser = await _userManager.FindByEmailAsync(newEmail);
        if (existingUser is not null && existingUser.Id != user.Id)
        {
            // User with this email already exists
            // Here we can return a specific error or just null
            return null;
        }

        user.Email = newEmail;
        user.UserName = newEmail; // Assuming username should also be updated

        var result = await _userManager.UpdateAsync(user);

        if (!result.Succeeded)
        {
            // Handle errors, maybe log them or return a specific error response
            return null;
        }

        return new UserProfileResponse
        {
            Id = user.Id,
            Email = user.Email!,
            UserName = user.UserName!
        };
    }
}