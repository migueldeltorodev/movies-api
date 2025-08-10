namespace Movies.Contracts.Requests;

public class RefreshTokenRequest
{
    public required string AccessToken { get; init; }
}