namespace Movies.Contracts.Responses;

public class MovieResponse : HalResponse
{
    public required Guid Id { get; init; }
    public required string Title { get; init; }
    public required string Slug { get; init; }
    public required string Description { get; init; }
    public string? Director { get; init; }
    public int? DurationMinutes { get; init; }
    public string? FormattedDuration { get; init; }
    public required int YearOfRelease { get; init; }
    public DateTime? ReleaseDate { get; init; }
    public string? Country { get; init; }
    public string? OriginalLanguage { get; init; }

    public string? PosterUrl { get; init; }

    public required IEnumerable<string> Genres { get; init; } = Enumerable.Empty<string>();
    public string? AgeRating { get; init; }

    public float? Rating { get; init; }
    public int? UserRating { get; init; }

    public int Status { get; init; }
    public bool IsPublished { get; init; }
    public DateTime CreatedAt { get; init; }
    public DateTime UpdatedAt { get; init; }
}