using FluentValidation;
using Movies.Application.Models;
using Movies.Application.Repositories;

namespace Movies.Application.Validators;

public class UpdateMovieValidator : AbstractValidator<Movie>
{
    private readonly IMovieRepository _movieRepository;
    
    public UpdateMovieValidator(IMovieRepository movieRepository)
    {
        _movieRepository = movieRepository;
        
        RuleFor(m => m.Id)
            .NotEmpty()
            .WithMessage("Movie ID is required");
            
        RuleFor(m => m.Title)
            .NotEmpty()
            .WithMessage("Title is required")
            .MaximumLength(200)
            .WithMessage("Title cannot exceed 200 characters");
            
        RuleFor(m => m.Description)
            .NotEmpty()
            .WithMessage("Description is required")
            .MaximumLength(2000)
            .WithMessage("Description cannot exceed 2000 characters");
            
        RuleFor(m => m.Genres)
            .NotEmpty()
            .WithMessage("At least one genre is required")
            .Must(genres => genres.Count <= 5)
            .WithMessage("Maximum 5 genres allowed");
            
        RuleFor(m => m.YearOfRelease)
            .GreaterThan(1888)
            .WithMessage("Year of release must be after 1888")
            .LessThanOrEqualTo(DateTime.UtcNow.Year + 2)
            .WithMessage("Year of release cannot be more than 2 years in the future");
            
        RuleFor(m => m.ReleaseDate)
            .LessThanOrEqualTo(DateTime.UtcNow.AddYears(2))
            .WithMessage("Release date cannot be more than 2 years in the future")
            .When(m => m.ReleaseDate.HasValue);
            
        RuleFor(m => m.Director)
            .MaximumLength(100)
            .WithMessage("Director name cannot exceed 100 characters")
            .When(m => !string.IsNullOrEmpty(m.Director));
            
        RuleFor(m => m.DurationMinutes)
            .GreaterThan(0)
            .WithMessage("Duration must be greater than 0")
            .LessThan(1000)
            .WithMessage("Duration cannot exceed 1000 minutes")
            .When(m => m.DurationMinutes > 0);
            
        RuleFor(m => m.Country)
            .MaximumLength(100)
            .WithMessage("Country cannot exceed 100 characters")
            .When(m => !string.IsNullOrEmpty(m.Country));
            
        RuleFor(m => m.OriginalLanguage)
            .MaximumLength(50)
            .WithMessage("Original language cannot exceed 50 characters")
            .When(m => !string.IsNullOrEmpty(m.OriginalLanguage));
            
        RuleFor(m => m.AgeRating)
            .Must(rating => string.IsNullOrEmpty(rating) || IsValidMpaaRating(rating))
            .WithMessage("Invalid MPAA rating. Valid ratings: G, PG, PG-13, R, NC-17")
            .When(m => !string.IsNullOrEmpty(m.AgeRating));
            
        RuleFor(m => m.PosterUrl)
            .Must(BeValidUrl)
            .WithMessage("Invalid poster URL")
            .When(m => !string.IsNullOrEmpty(m.PosterUrl));
            
        RuleFor(m => m.Slug)
            .MustAsync(ValidateSlugForUpdate)
            .WithMessage("This movie title conflicts with an existing movie");
            
        RuleFor(m => m.UpdatedBy)
            .NotEmpty()
            .WithMessage("Updated by is required")
            .When(m => m.UpdatedBy != Guid.Empty);
    }

    private async Task<bool> ValidateSlugForUpdate(Movie movie, string slug, CancellationToken cancellationToken)
    {
        var existingMovie = await _movieRepository.GetBySlugAsync(slug);
        
        if (existingMovie is not null)
        {
            return existingMovie.Id == movie.Id;
        }

        return true;
    }

    private static bool IsValidMpaaRating(string rating)
    {
        var validRatings = new[] { "G", "PG", "PG-13", "R", "NC-17" };
        return validRatings.Contains(rating.ToUpperInvariant());
    }

    private static bool BeValidUrl(string? url)
    {
        return Uri.TryCreate(url, UriKind.Absolute, out var result) 
               && (result.Scheme == Uri.UriSchemeHttp || result.Scheme == Uri.UriSchemeHttps);
    }
}