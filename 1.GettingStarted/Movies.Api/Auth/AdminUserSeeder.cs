using System.Security.Claims;
using Microsoft.AspNetCore.Identity;
using Movies.Application.Models;

namespace Movies.Api.Auth;

public class AdminUserSeeder
{
    private readonly UserManager<User> _userManager;
    private readonly IConfiguration _config;

    public AdminUserSeeder(UserManager<User> userManager, IConfiguration config)
    {
        _userManager = userManager;
        _config = config;
    }

    public async Task SeedAsync()
    {
        const string adminEmail = "admin@movies.com";
        const string adminPassword = "Admin123!";

        var adminUser = await _userManager.FindByEmailAsync(adminEmail);
        
        if (adminUser is null)
        {
            adminUser = new User
            {
                UserName = adminEmail,
                Email = adminEmail,
                EmailConfirmed = true
            };

            var result = await _userManager.CreateAsync(adminUser, adminPassword);
            
            if (!result.Succeeded)
            {
                throw new Exception($"Failed to create admin user: {string.Join(", ", result.Errors.Select(e => e.Description))}");
            }
        }

        if (!await _userManager.IsInRoleAsync(adminUser, "Admin"))
        {
            await _userManager.AddToRoleAsync(adminUser, "Admin");
        }

        var adminClaims = await _userManager.GetClaimsAsync(adminUser);
        if (!adminClaims.Any(c => c.Type == AuthConstants.AdminUserClaimName && c.Value == "true"))
        {
            await _userManager.AddClaimAsync(adminUser, new Claim(AuthConstants.AdminUserClaimName, "true"));
        }
    }
}