using System.Text.RegularExpressions;

namespace Movies.Application.Models;

public partial class Movie
{
    public required Guid Id { get; init; }
    public required string Title { get; set; }
    public string Slug => GenerateSlug();

    public required string Description { get; set; }
    public string? Director { get; set; }
    public required int YearOfRelease { get; set; }
    public DateTime? ReleaseDate { get; set; }
    public int DurationMinutes { get; set; }
    public string? Country { get; set; }
    public string? OriginalLanguage { get; set; }

    public string? AgeRating { get; set; } // G, PG, PG-13, R, NC-17
    public MovieStatus Status { get; set; } = MovieStatus.Draft;

    public decimal? Budget { get; set; }
    public decimal? BoxOffice { get; set; }

    public string? PosterUrl { get; set; }
    public string? PosterFileName { get; set; }

    public float? Rating { get; set; }
    public int? UserRating { get; set; }
    public required List<string> Genres { get; init; } = new();

    public DateTime CreatedAt { get; init; } = DateTime.Now;
    public required DateTime UpdatedAt { get; set; }
    public Guid CreatedBy { get; init; }
    public Guid? UpdatedBy { get; set; }


    public string FormattedDuration => FormatDuration();
    public bool IsPublished => Status == MovieStatus.Published;

    private string FormatDuration()
    {
        if (DurationMinutes <= 0)
            return "Duration not specified";

        var hours = DurationMinutes / 60;
        var minutes = DurationMinutes % 60;

        if (hours > 0 && minutes > 0)
            return $"{hours}h {minutes}m";
        else if (hours > 0)
            return $"{hours}h";
        else
            return $"{minutes}m";
    }

    private string GenerateSlug()
    {
        if (string.IsNullOrWhiteSpace(Title))
            return $"untitled-{YearOfRelease}";

        try
        {
            var normalizedTitle = Title.Trim();
            var cleanTitle = SlugRegex().Replace(normalizedTitle, string.Empty);

            var slugTitle = cleanTitle.ToLowerInvariant()
                .Replace(" ", "-")
                .Replace("--", "-")
                .Trim('-');

            if (string.IsNullOrWhiteSpace(slugTitle))
                slugTitle = "movie";

            return $"{slugTitle}-{YearOfRelease}";
        }
        catch (RegexMatchTimeoutException)
        {
            var safeTitle = Title.ToLowerInvariant()
                .Replace(" ", "-")
                .Substring(0, Math.Min(Title.Length, 50));
            return $"{safeTitle}-{YearOfRelease}";
        }
    }

    [GeneratedRegex(@"[^\w\s-]", RegexOptions.Compiled | RegexOptions.IgnoreCase, 1000)]
    private static partial Regex SlugRegex();
}