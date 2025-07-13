using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Microsoft.AspNetCore.Identity;
using Microsoft.IdentityModel.Tokens;
using Movies.Application.Models;

namespace Movies.Api.Auth;

public class TokenService
{
    private readonly IConfiguration _config;
    private readonly UserManager<User> _userManager;

    /// <summary>
    /// Initializes a new instance of the <see cref="TokenService"/> class with the specified configuration and user manager.
    /// </summary>
    public TokenService(IConfiguration config, UserManager<User> userManager)
    {
        _config = config;
        _userManager = userManager;
    }

    /// <summary>
    /// Asynchronously generates a JSON Web Token (JWT) for the specified user, including user claims and roles.
    /// </summary>
    /// <param name="user">The user for whom the JWT is generated.</param>
    /// <returns>A serialized JWT string containing the user's claims and roles.</returns>
    public async Task<string> GenerateTokenAsync(User user)
    {
        var claims = new List<Claim>
        {
            new(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString()),
            new(JwtRegisteredClaimNames.Sub, user.Id.ToString()),
            new(JwtRegisteredClaimNames.Email, user.Email!)
        };

        var userClaims = await _userManager.GetClaimsAsync(user);
        claims.AddRange(userClaims);

        var userRoles = await _userManager.GetRolesAsync(user);
        foreach (var userRole in userRoles)
        {
            claims.Add(new Claim(ClaimTypes.Role, userRole));
        }

        var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_config["Jwt:Key"]!));
        var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);
        var expires = DateTime.UtcNow.AddHours(Convert.ToDouble(_config["Jwt:ExpireHours"] ?? "2"));

        var token = new JwtSecurityToken(
            issuer: _config["Jwt:Issuer"],
            audience: _config["Jwt:Audience"],
            claims: claims,
            expires: expires,
            signingCredentials: creds
        );

        return new JwtSecurityTokenHandler().WriteToken(token);
    }
}
