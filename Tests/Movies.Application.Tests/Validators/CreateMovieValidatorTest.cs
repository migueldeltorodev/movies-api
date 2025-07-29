using FluentAssertions;
using Moq;
using Movies.Application.Models;
using Movies.Application.Repositories;
using Movies.Application.Validators;
using Movies.Contracts.Requests;
using Xunit;

namespace Movies.Application.Tests.Validators;

public class CreateMovieValidatorTest
{
    private readonly Mock<IMovieRepository> _movieRepositoryMock = new();
    private readonly CreateMovieValidator _validator;

    public CreateMovieValidatorTest()
    {
        _validator = new CreateMovieValidator(_movieRepositoryMock.Object);
    }

    [Fact]
    public async Task Validate_WithMissingTitle_ShouldHaveValidationError()
    {
        var movie = new Movie
        {
            Id = Guid.NewGuid(),
            Title = string.Empty,
            YearOfRelease = 2023,
            Director = "David",
            Description = "",
            DurationMinutes = 120,
            Country = "Spain",
            OriginalLanguage = "Spanish",
            AgeRating = "PG-13",
            Genres = ["Action", "Comedy"],
            UpdatedAt = default
        };

        var result = await _validator.ValidateAsync(movie);

        result.IsValid.Should().BeFalse();
        result.Errors.Should().Contain(x => x.PropertyName == nameof(movie.Title));
    }

    [Fact]
    public async Task Validate_WithEmptyGenres_ShouldHaveValidationError()
    {
        var movie = new Movie
        {
            Id = Guid.NewGuid(),
            Title = "A Trip to the Moon",
            YearOfRelease = 2023,
            Director = "David",
            Description = "",
            DurationMinutes = 120,
            Country = "Spain",
            OriginalLanguage = "Spanish",
            AgeRating = "PG-13",
            Genres = new List<string>(),
            UpdatedAt = default
        };

        var result = await _validator.ValidateAsync(movie);

        result.IsValid.Should().BeFalse();
        result.Errors.Should().Contain(x => x.PropertyName == nameof(movie.Genres));
    }

    [Fact]
    public async Task Validate_WithInvalidYear_ShouldHaveValidationError()
    {
        var movie = new Movie
        {
            Id = Guid.NewGuid(),
            Title = "A Trip to the Moon",
            YearOfRelease = 1888,
            Director = "David",
            Description = "",
            DurationMinutes = 120,
            Country = "Spain",
            OriginalLanguage = "Spanish",
            AgeRating = "PG-13",
            Genres = ["Action", "Comedy"],
            UpdatedAt = default
        };

        var result = await _validator.ValidateAsync(movie);

        result.IsValid.Should().BeFalse();
        result.Errors.Should().Contain(x => x.PropertyName == nameof(movie.YearOfRelease));
    }
}