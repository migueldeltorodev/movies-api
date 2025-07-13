using System.ComponentModel.DataAnnotations;

namespace Movies.Contracts.Requests;

public class LoginRequest
{
    [Required]
    [EmailAddress]
    public required string Email { get; init; }

    [Required]
    public required string Password { get; init; }
}
