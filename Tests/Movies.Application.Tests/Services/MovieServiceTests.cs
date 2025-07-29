using FluentAssertions;
using FluentValidation;
using FluentValidation.Results;
using Moq;
using Movies.Application.Models;
using Movies.Application.Repositories;
using Movies.Application.Services;

namespace Movies.Application.Tests.Services;

public class MovieServiceTests
{
    private readonly MovieService _sut; // System Under Test

    private readonly Mock<IMovieRepository> _movieRepositoryMock = new();
    private readonly Mock<IRatingRepository> _ratingRepositoryMock = new();
    private readonly Mock<IFileService> _fileServiceMock = new();

    private readonly Mock<IValidator<Movie>> _createValidatorMock = new();
    private readonly Mock<IValidator<Movie>> _updateValidatorMock = new();
    private readonly Mock<IValidator<GetAllMoviesOptions>> _getAllMoviesOptionsValidatorMock = new();

    public MovieServiceTests()
    {
        _sut = new MovieService(
            _movieRepositoryMock.Object,
            _createValidatorMock.Object,
            _updateValidatorMock.Object,
            _ratingRepositoryMock.Object,
            _getAllMoviesOptionsValidatorMock.Object,
            _fileServiceMock.Object
        );
    }

    [Fact]
    public async Task CreateAsync_ShouldCreateMovie_WhenValidationIsSuccessful()
    {
        // Arrange
        var movie = new Movie
        {
            Id = Guid.NewGuid(),
            Title = "A Trip to the Moon",
            YearOfRelease = 1902,
            Genres = ["Sci-Fi"],
            CreatedBy = Guid.NewGuid(),
            Description = "This is a test movie added from the create new movie test",
            UpdatedAt = default
        };

        _createValidatorMock
            .Setup(v => v.ValidateAsync(It.IsAny<Movie>(), It.IsAny<CancellationToken>()))
            .ReturnsAsync(new ValidationResult());

        _movieRepositoryMock
            .Setup(r => r.CreateAsync(movie, It.IsAny<CancellationToken>()))
            .ReturnsAsync(true);

        // Act
        var result = await _sut.CreateAsync(movie);

        // Assert
        result.Should().BeTrue();
        _movieRepositoryMock.Verify(r => r.CreateAsync(movie, It.IsAny<CancellationToken>()), Times.Once);
    }

    [Fact]
    public async Task CreateAsync_ShouldThrowException_WhenValidationFails()
    {
        // Arrange
        var movie = new Movie
        {
            Id = Guid.NewGuid(),
            Title = null,
            YearOfRelease = 1902,
            Genres = ["Sci-Fi"],
            CreatedBy = Guid.NewGuid(),
            Description = "",
            UpdatedAt = default
        };

        var validationFailures = new List<ValidationFailure>
        {
            new("Title", "Title is required")
        };

        _createValidatorMock
            .Setup(v => v.ValidateAsync(It.IsAny<Movie>(), It.IsAny<CancellationToken>()))
            .ReturnsAsync(new ValidationResult(validationFailures));

        // Act
        Func<Task> action = async () => await _sut.CreateAsync(movie);

        // Assert
        await action.Should().ThrowAsync<ValidationException>();
        _movieRepositoryMock.Verify(r => r.CreateAsync(It.IsAny<Movie>(), It.IsAny<CancellationToken>()), Times.Never);
    }

    [Fact]
    public async Task GetByIdAsync_ShouldReturnMovie_WhenMovieExists()
    {
        // Arrange
        var movie = new Movie
        {
            Id = Guid.NewGuid(),
            Title = "Inception",
            YearOfRelease = 2010,
            Genres = new List<string>
            {
                "Sci-Fi",
                "Action"
            },
            Description = "",
            UpdatedAt = default
        };

        _movieRepositoryMock
            .Setup(r => r.GetByIdAsync(movie.Id, It.IsAny<Guid?>(), It.IsAny<CancellationToken>()))
            .ReturnsAsync(movie);

        // Act
        var result = await _sut.GetByIdAsync(movie.Id);

        // Assert
        result.Should().BeEquivalentTo(movie);
    }

    [Fact]
    public async Task GetByIdAsync_ShouldReturnNull_WhenMovieDoesNotExist()
    {
        // Arrange
        var movieId = Guid.NewGuid();
        _movieRepositoryMock
            .Setup(r => r.GetByIdAsync(movieId, It.IsAny<Guid?>(), It.IsAny<CancellationToken>()))
            .ReturnsAsync((Movie?)null);

        // Act
        var result = await _sut.GetByIdAsync(movieId);

        // Assert
        result.Should().BeNull();
    }

    [Fact]
    public async Task GetBySlugAsync_ShouldReturnMovie_WhenMovieExists()
    {
        // Arrange
        var movie = new Movie
        {
            Id = Guid.NewGuid(),
            Title = "Inception",
            YearOfRelease = 2010,
            Genres = new List<string>
            {
                "Sci-Fi",
                "Action"
            },
            Description = "",
            UpdatedAt = default
        };

        const string slug = "inception-2010";

        _movieRepositoryMock
            .Setup(r => r.GetBySlugAsync(slug, It.IsAny<Guid?>(), It.IsAny<CancellationToken>()))
            .ReturnsAsync(movie);

        // Act
        var result = await _sut.GetBySlugAsync(slug);

        // Assert
        result.Should().BeEquivalentTo(movie);
    }

    [Fact]
    public async Task GetBySlugAsync_ShouldReturnNull_WhenMovieDoesNotExist()
    {
        // Arrange
        const string slug = "non-existent-movie";
        _movieRepositoryMock
            .Setup(r => r.GetBySlugAsync(slug, It.IsAny<Guid?>(), It.IsAny<CancellationToken>()))
            .ReturnsAsync((Movie?)null);

        // Act
        var result = await _sut.GetBySlugAsync(slug);

        // Assert
        result.Should().BeNull();
    }

    [Fact]
    public async Task GetAllAsync_ShouldReturnMovies_WhenSomeExist()
    {
        // Arrange
        var options = new GetAllMoviesOptions();

        var movies = new List<Movie>
        {
            new()
            {
                Title = "Spiderman",
                Id = Guid.NewGuid(),
                Description = "",
                YearOfRelease = 2001,
                Genres = ["Action", "Drama"],
                UpdatedAt = default
            },
            new()
            {
                Title = "Spiderman 2",
                Id = Guid.NewGuid(),
                Description = "",
                YearOfRelease = 2002,
                Genres = ["Action", "Drama"],
                UpdatedAt = default
            }
        };

        _getAllMoviesOptionsValidatorMock
            .Setup(v => v.ValidateAsync(options, It.IsAny<CancellationToken>()))
            .ReturnsAsync(new ValidationResult());

        _movieRepositoryMock
            .Setup(r => r.GetAllAsync(options, It.IsAny<CancellationToken>()))
            .ReturnsAsync(movies);

        // Act
        var result = await _sut.GetAllAsync(options);

        // Assert
        result.Should().BeEquivalentTo(movies);
    }

    [Fact]
    public async Task GetAllAsync_ShouldReturnEmptyList_WhenNoMoviesExist()
    {
        // Arrange
        var options = new GetAllMoviesOptions();

        _getAllMoviesOptionsValidatorMock
            .Setup(v => v.ValidateAsync(options, It.IsAny<CancellationToken>()))
            .ReturnsAsync(new ValidationResult());

        _movieRepositoryMock
            .Setup(r => r.GetAllAsync(options, It.IsAny<CancellationToken>()))
            .ReturnsAsync(Enumerable.Empty<Movie>());

        // Act
        var result = await _sut.GetAllAsync(options);

        // Assert
        result.Should().BeEmpty();
    }

    [Fact]
    public async Task GetAllAsync_ShouldThrowException_WhenValidationFails()
    {
        // Arrange
        var options = new GetAllMoviesOptions();
        var validationFailures = new List<ValidationFailure>
        {
            new("SortField", "SortField is not valid")
        };

        _getAllMoviesOptionsValidatorMock
            .Setup(v => v.ValidateAsync(options, It.IsAny<CancellationToken>()))
            .ReturnsAsync(new ValidationResult(validationFailures));

        // Act
        Func<Task> action = async () => await _sut.GetAllAsync(options);

        // Assert
        await action.Should().ThrowAsync<ValidationException>();
        _movieRepositoryMock.Verify(r => r.GetAllAsync(It.IsAny<GetAllMoviesOptions>(), It.IsAny<CancellationToken>()),
            Times.Never);
    }

    [Fact]
    public async Task UpdateAsync_ShouldUpdateMovie_WhenValidationIsSuccessful()
    {
        // Arrange
        var movie = new Movie
        {
            Id = Guid.NewGuid(),
            Title = "Updated Title",
            YearOfRelease = 2023,
            Genres = new List<string>
            {
                "Action"
            },
            Description = "",
            UpdatedAt = default
        };

        _movieRepositoryMock
            .Setup(r => r.ExistsByIdAsync(movie.Id, It.IsAny<CancellationToken>()))
            .ReturnsAsync(true);

        _updateValidatorMock
            .Setup(v => v.ValidateAsync(It.IsAny<Movie>(), It.IsAny<CancellationToken>()))
            .ReturnsAsync(new ValidationResult());

        _movieRepositoryMock
            .Setup(r => r.UpdateAsync(movie, It.IsAny<CancellationToken>()))
            .ReturnsAsync(true);

        _ratingRepositoryMock
            .Setup(r => r.GetRatingAsync(movie.Id, It.IsAny<CancellationToken>()))
            .ReturnsAsync(0);

        // Act
        var result = await _sut.UpdateAsync(movie);

        // Assert
        result.Should().NotBeNull();
        result.Should().BeEquivalentTo(movie);
        _movieRepositoryMock.Verify(r => r.UpdateAsync(movie, It.IsAny<CancellationToken>()), Times.Once);
    }

    [Fact]
    public async Task UpdateAsync_ShouldReturnNull_WhenMovieDoesNotExist()
    {
        // Arrange
        var movie = new Movie
        {
            Id = Guid.NewGuid(),
            Title = "Non-existent movie",
            Description = "",
            YearOfRelease = 2000,
            Genres = ["Action", "Drama"],
            UpdatedAt = default
        };

        _movieRepositoryMock
            .Setup(r => r.ExistsByIdAsync(movie.Id, It.IsAny<CancellationToken>()))
            .ReturnsAsync(false);

        // Act
        var result = await _sut.UpdateAsync(movie);

        // Assert
        result.Should().BeNull();
        _movieRepositoryMock.Verify(r => r.UpdateAsync(It.IsAny<Movie>(), It.IsAny<CancellationToken>()), Times.Never);
    }

    [Fact]
    public async Task UpdateAsync_ShouldThrowException_WhenValidationFails()
    {
        // Arrange
        var movie = new Movie
        {
            Id = Guid.NewGuid(),
            Title = "",
            Description = "",
            YearOfRelease = 2000,
            Genres = ["Drama"],
            UpdatedAt = default
        };

        var validationFailures = new List<ValidationFailure>
        {
            new("Title", "Title is invalid")
        };

        _movieRepositoryMock
            .Setup(r => r.ExistsByIdAsync(movie.Id, It.IsAny<CancellationToken>()))
            .ReturnsAsync(true);

        _updateValidatorMock
            .Setup(v => v.ValidateAsync(It.IsAny<Movie>(), It.IsAny<CancellationToken>()))
            .ReturnsAsync(new ValidationResult(validationFailures));

        // Act
        Func<Task> action = async () => await _sut.UpdateAsync(movie);

        // Assert
        await action.Should().ThrowAsync<ValidationException>();
        _movieRepositoryMock.Verify(r => r.UpdateAsync(It.IsAny<Movie>(), It.IsAny<CancellationToken>()), Times.Never);
    }

    [Fact]
    public async Task DeleteByIdAsync_ShouldDeleteMovie_WhenMovieExists()
    {
        // Arrange
        var movieId = Guid.NewGuid();
        _movieRepositoryMock
            .Setup(r => r.DeleteByIdAsync(movieId, It.IsAny<CancellationToken>()))
            .ReturnsAsync(true);

        // Act
        var result = await _sut.DeleteByIdAsync(movieId);

        // Assert
        result.Should().BeTrue();
        _movieRepositoryMock.Verify(r => r.DeleteByIdAsync(movieId, It.IsAny<CancellationToken>()), Times.Once);
    }

    [Fact]
    public async Task DeleteByIdAsync_ShouldReturnFalse_WhenMovieDoesNotExist()
    {
        // Arrange
        var movieId = Guid.NewGuid();
        _movieRepositoryMock
            .Setup(r => r.DeleteByIdAsync(movieId, It.IsAny<CancellationToken>()))
            .ReturnsAsync(false);

        // Act
        var result = await _sut.DeleteByIdAsync(movieId);

        // Assert
        result.Should().BeFalse();
        _movieRepositoryMock.Verify(r => r.DeleteByIdAsync(movieId, It.IsAny<CancellationToken>()), Times.Once);
    }
}