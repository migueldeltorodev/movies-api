using System.Text.RegularExpressions;

namespace Movies.Application.Models;

public partial class Movie
{
    public required Guid Id { get; init; }
    public required string Title { get; set; }
    public string Slug => GenerateSlug();
    public float? Rating { get; set; }
    public int? UserRating { get; set; }
    public required int YearOfRelease { get; set; }
    public required List<string> Genres { get; init; } = new();

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