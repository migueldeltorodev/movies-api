namespace Movies.Contracts.Requests;

public class ChangeMovieStatusRequest
{
    public required int Status { get; init; }
}