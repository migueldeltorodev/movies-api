namespace Movies.Contracts.Requests.Users;

public class UpdateUserProfileRequest
{
    public required string Email { get; init; }
}