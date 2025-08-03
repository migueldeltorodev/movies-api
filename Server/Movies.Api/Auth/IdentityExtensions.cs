using System.Security.Claims;

namespace Movies.Api.Auth;

public static class IdentityExtensions
{
    public static Guid? GetId(this ClaimsPrincipal user)
    {
        var userId = user.Claims.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier)?.Value;
        return userId is not null ? Guid.Parse(userId) : null;
    }
}