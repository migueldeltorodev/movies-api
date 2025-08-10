namespace Movies.Contracts.Responses.Users;

public class UserProfileResponse
{
    public required Guid Id { get; init; }
    public required string Email { get; init; }
    public required string UserName { get; init; }
}