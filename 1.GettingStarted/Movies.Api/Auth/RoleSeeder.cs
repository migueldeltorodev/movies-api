using Microsoft.AspNetCore.Identity;

namespace Movies.Api.Auth;

public class RoleSeeder
{
    private readonly RoleManager<IdentityRole<Guid>> _roleManager;

    public RoleSeeder(RoleManager<IdentityRole<Guid>> roleManager)
    {
        _roleManager = roleManager;
    }

    public async Task SeedAsync()
    {
        await SeedRoleAsync("Admin");
        await SeedRoleAsync("User");
    }

    private async Task SeedRoleAsync(string roleName)
    {
        var roleExists = await _roleManager.RoleExistsAsync(roleName);
        if (!roleExists)
        {
            await _roleManager.CreateAsync(new IdentityRole<Guid>(roleName));
        }
    }
}
