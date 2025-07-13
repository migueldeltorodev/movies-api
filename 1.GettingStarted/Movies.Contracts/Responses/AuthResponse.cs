namespace Movies.Contracts.Responses;

public class AuthResponse
{
    public required Guid UserId { get; init; }
    public required string Email { get; init; }
    public required string AccessToken { get; init; }
}
