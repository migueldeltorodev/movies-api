using Microsoft.AspNetCore.Identity;

namespace Movies.Application.Models;

public class User : IdentityUser<Guid>
{
    public string? RefreshToken { get; set; }

    public DateTime RefreshTokenExpiryTime { get; set; }
}