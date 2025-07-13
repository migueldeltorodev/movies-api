using System.ComponentModel.DataAnnotations;

namespace Movies.Contracts.Requests;

public class RegisterRequest
{
    [Required]
    [EmailAddress]
    public required string Email { get; init; }

    [Required]
    [MinLength(6)]
    public required string Password { get; init; }
}
