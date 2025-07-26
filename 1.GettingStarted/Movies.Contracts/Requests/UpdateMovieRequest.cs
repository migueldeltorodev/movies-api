namespace Movies.Contracts.Requests;

public class UpdateMovieRequest
{
    public required string Title { get; init; }
    public required string Description { get; init; }
    public required int YearOfRelease { get; init; }
    public string? Director { get; init; }
    public int? DurationMinutes { get; init; }
    public DateTime? ReleaseDate { get; init; }
    public string? Country { get; init; }
    public string? OriginalLanguage { get; init; }
    public string? AgeRating { get; init; }
    public int? Status { get; init; }
    public required IEnumerable<string> Genres { get; init; } = Enumerable.Empty<string>();
}
