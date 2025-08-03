using FluentValidation.TestHelper;
using Moq;
using Movies.Application.Models;
using Movies.Application.Repositories;
using Movies.Application.Validators;

namespace Movies.Application.Tests.Validators;

public class UpdateMovieValidatorTests
{
    private readonly Mock<IMovieRepository> _movieRepositoryMock = new();
    private readonly UpdateMovieValidator _validator;

    public UpdateMovieValidatorTests()
    {
        _validator = new UpdateMovieValidator(_movieRepositoryMock.Object);
    }

    [Fact]
    public async Task Validate_ShouldNotHaveAnyValidationErrors_WhenMovieIsValid()
    {
        // Arrange
        var movie = new Movie
        {
            Id = Guid.NewGuid(),
            Title = "A New Hope",
            YearOfRelease = 1977,
            Description = "A long time ago in a galaxy far, far away...",
            Genres = new List<string>
            {
                "Sci-Fi"
            },
            UpdatedBy = Guid.NewGuid(),
            UpdatedAt = DateTime.Now
        };

        _movieRepositoryMock
            .Setup(r => r.GetBySlugAsync(movie.Slug, It.IsAny<Guid?>(), It.IsAny<CancellationToken>()))
            .ReturnsAsync((Movie?)null); // Simulate slug is unique or belongs to the same movie

        // Act
        var result = await _validator.TestValidateAsync(movie);

        // Assert
        result.ShouldNotHaveAnyValidationErrors();
    }

    [Fact]
    public async Task Validate_ShouldNotHaveValidationErrorForSlug_WhenSlugExistsForSameMovie()
    {
        // Arrange
        var movie = new Movie
        {
            Id = Guid.NewGuid(),
            Title = "The Matrix",
            YearOfRelease = 1999,
            Description = "A computer hacker learns from mysterious rebels about the true nature of his reality.",
            Genres = new List<string> { "Sci-Fi" },
            UpdatedBy = Guid.NewGuid(),
            UpdatedAt = DateTime.Now
        };

        _movieRepositoryMock
            .Setup(r => r.GetBySlugAsync(movie.Slug, It.IsAny<Guid?>(), It.IsAny<CancellationToken>()))
            .ReturnsAsync(movie); // Simulate slug exists, but for the movie being updated

        // Act
        var result = await _validator.TestValidateAsync(movie);

        // Assert
        result.ShouldNotHaveValidationErrorFor(m => m.Slug);
    }

    [Fact]
    public async Task Validate_ShouldHaveValidationErrorForSlug_WhenSlugExistsForDifferentMovie()
    {
        // Arrange
        var movieToUpdate = new Movie
        {
            Id = Guid.NewGuid(),
            Title = "Existing Title",
            YearOfRelease = 2000,
            Description = "Description",
            Genres = new List<string> { "Action" },
            UpdatedBy = Guid.NewGuid(),
            UpdatedAt = DateTime.Now
        };

        var existingMovieWithSameSlug = new Movie
        {
            Id = Guid.NewGuid(),
            Title = "Existing Title",
            YearOfRelease = 2001,
            Description = "Another Description",
            Genres = new List<string> { "Adventure" },
            UpdatedBy = Guid.NewGuid(),
            UpdatedAt = DateTime.Now
        };

        _movieRepositoryMock
            .Setup(r => r.GetBySlugAsync(movieToUpdate.Slug, It.IsAny<Guid?>(), It.IsAny<CancellationToken>()))
            .ReturnsAsync(existingMovieWithSameSlug);

        // Act
        var result = await _validator.TestValidateAsync(movieToUpdate);

        // Assert
        result.ShouldHaveValidationErrorFor(m => m.Slug)
            .WithErrorMessage("This movie title conflicts with an existing movie");
    }

    [Fact]
    public async Task Validate_ShouldHaveValidationErrorForTitle_WhenTitleIsEmpty()
    {
        // Arrange
        var movie = new Movie
        {
            Id = Guid.NewGuid(),
            Title = string.Empty,
            YearOfRelease = 2023,
            Description = "A valid description",
            Genres = new List<string> { "Action" },
            UpdatedBy = Guid.NewGuid(),
            UpdatedAt = DateTime.Now
        };

        // Act
        var result = await _validator.TestValidateAsync(movie);

        // Assert
        result.ShouldHaveValidationErrorFor(m => m.Title);
    }

    [Fact]
    public async Task Validate_ShouldHaveValidationErrorForGenres_WhenGenresAreEmpty()
    {
        // Arrange
        var movie = new Movie
        {
            Id = Guid.NewGuid(),
            Title = "A Valid Title",
            YearOfRelease = 2023,
            Description = "A valid description",
            Genres = new List<string>(),
            UpdatedBy = Guid.NewGuid(),
            UpdatedAt = DateTime.Now
        };

        // Act
        var result = await _validator.TestValidateAsync(movie);

        // Assert
        result.ShouldHaveValidationErrorFor(m => m.Genres);
    }

    [Fact]
    public async Task Validate_ShouldHaveValidationErrorForId_WhenIdIsEmpty()
    {
        // Arrange
        var movie = new Movie
        {
            Id = Guid.Empty,
            Title = "Valid Title",
            YearOfRelease = 2023,
            Description = "A valid description",
            Genres = new List<string> { "Action" },
            UpdatedBy = Guid.NewGuid(),
            UpdatedAt = DateTime.Now
        };

        // Act
        var result = await _validator.TestValidateAsync(movie);

        // Assert
        result.ShouldHaveValidationErrorFor(m => m.Id);
    }
}