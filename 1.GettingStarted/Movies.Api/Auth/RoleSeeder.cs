using Microsoft.AspNetCore.Identity;

namespace Movies.Api.Auth;

public class RoleSeeder
{
    private readonly RoleManager<IdentityRole<Guid>> _roleManager;

    /// <summary>
    /// Initializes a new instance of the <see cref="RoleSeeder"/> class with the specified role manager.
    /// </summary>
    public RoleSeeder(RoleManager<IdentityRole<Guid>> roleManager)
    {
        _roleManager = roleManager;
    }

    /// <summary>
    /// Ensures that the "Admin" and "User" roles exist in the identity store, creating them if necessary.
    /// </summary>
    public async Task SeedAsync()
    {
        await SeedRoleAsync("Admin");
        await SeedRoleAsync("User");
    }

    /// <summary>
    /// Ensures that a role with the specified name exists in the identity store, creating it if it does not.
    /// </summary>
    /// <param name="roleName">The name of the role to check and create if missing.</param>
    private async Task SeedRoleAsync(string roleName)
    {
        var roleExists = await _roleManager.RoleExistsAsync(roleName);
        if (!roleExists)
        {
            await _roleManager.CreateAsync(new IdentityRole<Guid>(roleName));
        }
    }
}
