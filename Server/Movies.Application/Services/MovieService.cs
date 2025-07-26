using FluentValidation;
using Movies.Application.Models;
using Movies.Application.Repositories;
using Movies.Application.Validators;

namespace Movies.Application.Services;

public class MovieService : IMovieService
{
    private readonly IMovieRepository _movieRepository;
    private readonly CreateMovieValidator _createMovieValidator;
    private readonly UpdateMovieValidator _updateMovieValidator;
    private readonly IRatingRepository _ratingRepository;
    private readonly IValidator<GetAllMoviesOptions> _getAllMoviesOptionsValidator;
    private readonly IFileService _fileService;

    public MovieService(
        IMovieRepository movieRepository,
        CreateMovieValidator createMovieValidator,
        UpdateMovieValidator updateMovieValidator,
        IRatingRepository ratingRepository,
        IValidator<GetAllMoviesOptions> getAllMoviesOptionsValidator,
        IFileService fileService)
    {
        _movieRepository = movieRepository;
        _createMovieValidator = createMovieValidator;
        _updateMovieValidator = updateMovieValidator;
        _ratingRepository = ratingRepository;
        _getAllMoviesOptionsValidator = getAllMoviesOptionsValidator;
        _fileService = fileService;
    }

    public async Task<bool> CreateAsync(Movie movie, CancellationToken cancellationToken = default)
    {
        movie.UpdatedAt = DateTime.UtcNow;

        await _createMovieValidator.ValidateAndThrowAsync(movie, cancellationToken: cancellationToken);
        return await _movieRepository.CreateAsync(movie, cancellationToken);
    }

    public async Task<Movie?> GetByIdAsync(Guid id, Guid? userId = default,
        CancellationToken cancellationToken = default)
    {
        return await _movieRepository.GetByIdAsync(id, userId, cancellationToken);
    }

    public async Task<Movie?> GetBySlugAsync(string slug, Guid? userId = default,
        CancellationToken cancellationToken = default)
    {
        return await _movieRepository.GetBySlugAsync(slug, userId, cancellationToken);
    }

    public async Task<IEnumerable<Movie>> GetAllAsync(GetAllMoviesOptions options,
        CancellationToken cancellationToken = default)
    {
        await _getAllMoviesOptionsValidator.ValidateAndThrowAsync(options, cancellationToken: cancellationToken);
        return await _movieRepository.GetAllAsync(options, cancellationToken);
    }

    public async Task<Movie?> UpdateAsync(Movie movie, Guid? userId = default,
        CancellationToken cancellationToken = default)
    {
        var movieExists = await _movieRepository.ExistsByIdAsync(movie.Id, cancellationToken);

        if (!movieExists)
        {
            return null;
        }

        movie.UpdatedAt = DateTime.UtcNow;

        if (userId.HasValue)
        {
            movie.UpdatedBy = userId.Value;
        }

        await _updateMovieValidator.ValidateAndThrowAsync(movie, cancellationToken: cancellationToken);

        await _movieRepository.UpdateAsync(movie, cancellationToken);

        if (!userId.HasValue)
        {
            var rating = await _ratingRepository.GetRatingAsync(movie.Id, cancellationToken);
            movie.Rating = rating;
            return movie;
        }

        var ratings = await _ratingRepository.GetRatingAsync(movie.Id, userId.Value, cancellationToken);
        movie.Rating = ratings.Rating;
        movie.UserRating = ratings.UserRating;
        return movie;
    }

    public async Task<Movie?> UploadPosterAsync(Guid movieId, Stream fileStream, string fileName, Guid userId,
        CancellationToken cancellationToken = default)
    {
        var movie = await _movieRepository.GetByIdAsync(movieId, userId, cancellationToken);
        if (movie is null)
        {
            return null;
        }

        if (!string.IsNullOrEmpty(movie.PosterFileName))
        {
            await _fileService.DeletePosterAsync(movie.PosterFileName, cancellationToken);
        }

        var uploadResult = await _fileService.UploadPosterAsync(fileStream, fileName, movieId, cancellationToken);

        movie.PosterUrl = uploadResult.Url;
        movie.PosterFileName = uploadResult.FileName;
        movie.UpdatedAt = DateTime.UtcNow;
        movie.UpdatedBy = userId;

        await _movieRepository.UpdateAsync(movie, cancellationToken);

        return movie;
    }

    public async Task<bool> DeletePosterAsync(Guid movieId, Guid userId, CancellationToken cancellationToken = default)
    {
        var movie = await _movieRepository.GetByIdAsync(movieId, userId, cancellationToken);
        if (movie is null || string.IsNullOrEmpty(movie.PosterFileName))
        {
            return false;
        }

        var deleted = await _fileService.DeletePosterAsync(movie.PosterFileName, cancellationToken);

        if (deleted)
        {
            movie.PosterUrl = null;
            movie.PosterFileName = null;
            movie.UpdatedAt = DateTime.UtcNow;
            movie.UpdatedBy = userId;

            await _movieRepository.UpdateAsync(movie, cancellationToken);
        }

        return deleted;
    }

    public async Task<Movie?> ChangeStatusAsync(Guid movieId, MovieStatus newStatus, Guid userId,
        CancellationToken cancellationToken = default)
    {
        var movie = await _movieRepository.GetByIdAsync(movieId, userId, cancellationToken);
        if (movie is null)
        {
            return null;
        }

        movie.Status = newStatus;
        movie.UpdatedAt = DateTime.UtcNow;
        movie.UpdatedBy = userId;

        await _movieRepository.UpdateAsync(movie, cancellationToken);

        return movie;
    }

    public async Task<bool> DeleteByIdAsync(Guid id, CancellationToken cancellationToken = default)
    {
        return await _movieRepository.DeleteByIdAsync(id, cancellationToken);
    }

    public async Task<int> GetCountAsync(string? title, int? year, CancellationToken cancellationToken = default)
    {
        return await _movieRepository.GetCountAsync(title, year, cancellationToken);
    }
}