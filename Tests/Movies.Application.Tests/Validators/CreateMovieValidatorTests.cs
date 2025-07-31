using FluentValidation.TestHelper;
using Moq;
using Movies.Application.Models;
using Movies.Application.Repositories;
using Movies.Application.Validators;

namespace Movies.Application.Tests.Validators;

public class CreateMovieValidatorTests
{
    private readonly Mock<IMovieRepository> _movieRepositoryMock = new();
    private readonly CreateMovieValidator _validator;

    public CreateMovieValidatorTests()
    {
        _validator = new CreateMovieValidator(_movieRepositoryMock.Object);
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
            Genres = ["Sci-Fi"],
            CreatedBy = Guid.NewGuid(),
            UpdatedAt = DateTime.UtcNow
        };

        _movieRepositoryMock
            .Setup(r => r.GetBySlugAsync(movie.Slug, It.IsAny<Guid?>(), It.IsAny<CancellationToken>()))
            .ReturnsAsync((Movie?)null); // Simulate slug is unique

        // Act
        var result = await _validator.TestValidateAsync(movie);

        // Assert
        result.ShouldNotHaveAnyValidationErrors();
    }

    [Fact]
    public async Task Validate_ShouldHaveValidationErrorForSlug_WhenSlugAlreadyExists()
    {
        // Arrange
        var movie = new Movie
        {
            Id = Guid.NewGuid(),
            Title = "The Matrix",
            YearOfRelease = 1999,
            Description = "A computer hacker learns from mysterious rebels about the true nature of his reality.",
            Genres = ["Sci-Fi"],
            CreatedBy = Guid.NewGuid(),
            UpdatedAt = DateTime.UtcNow
        };

        var existingMovie = new Movie
        {
            Id = Guid.NewGuid(),
            Title = "The Matrix",
            YearOfRelease = 1999,
            Description = "...",
            Genres = ["Sci-Fi"],
            CreatedBy = Guid.NewGuid(),
            UpdatedAt = DateTime.UtcNow
        };

        _movieRepositoryMock
            .Setup(r => r.GetBySlugAsync(movie.Slug, It.IsAny<Guid?>(), It.IsAny<CancellationToken>()))
            .ReturnsAsync(existingMovie); // Simulate slug is NOT unique

        // Act
        var result = await _validator.TestValidateAsync(movie);

        // Assert
        result.ShouldHaveValidationErrorFor(m => m.Slug)
            .WithErrorMessage("This movie already exists in the system");
    }

    [Fact]
    public async Task Validate_ShouldHaveValidationErrorForTitle_WhenTitleIsEmpty()
    {
        // Arrange
        var movie = new Movie
        {
            Id = Guid.NewGuid(),
            Title = string.Empty, // Invalid property
            YearOfRelease = 2023,
            Description = "A valid description",
            Genres = ["Action"],
            CreatedBy = Guid.NewGuid(),
            UpdatedAt = DateTime.UtcNow
        };

        _movieRepositoryMock
            .Setup(r => r.GetBySlugAsync(It.IsAny<string>(), It.IsAny<Guid?>(), It.IsAny<CancellationToken>()))
            .ReturnsAsync((Movie?)null);

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
            Genres = [], // Invalid property
            CreatedBy = Guid.NewGuid(),
            UpdatedAt = DateTime.UtcNow
        };

        _movieRepositoryMock
            .Setup(r => r.GetBySlugAsync(It.IsAny<string>(), It.IsAny<Guid?>(), It.IsAny<CancellationToken>()))
            .ReturnsAsync((Movie?)null);

        // Act
        var result = await _validator.TestValidateAsync(movie);

        // Assert
        result.ShouldHaveValidationErrorFor(m => m.Genres);
    }

    [Fact]
    public async Task Validate_ShouldHaveValidationErrorForYearOfRelease_WhenYearIsInvalid()
    {
        // Arrange
        var movie = new Movie
        {
            Id = Guid.NewGuid(),
            Title = "A Valid Title",
            YearOfRelease = 1800, // Invalid property
            Description = "A valid description",
            Genres = ["Action"],
            CreatedBy = Guid.NewGuid(),
            UpdatedAt = DateTime.UtcNow
        };

        _movieRepositoryMock
            .Setup(r => r.GetBySlugAsync(It.IsAny<string>(), It.IsAny<Guid?>(), It.IsAny<CancellationToken>()))
            .ReturnsAsync((Movie?)null);

        // Act
        var result = await _validator.TestValidateAsync(movie);

        // Assert
        result.ShouldHaveValidationErrorFor(m => m.YearOfRelease);
    }
}