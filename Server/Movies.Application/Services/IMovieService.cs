using Movies.Application.Models;

namespace Movies.Application.Services;

public interface IMovieService
{
    Task<bool> CreateAsync(Movie movie, CancellationToken cancellationToken = default);
    Task<Movie?> GetByIdAsync(Guid id, Guid? userId = default, CancellationToken cancellationToken = default);
    Task<Movie?> GetBySlugAsync(string slug, Guid? userId = default, CancellationToken cancellationToken = default);
    Task<IEnumerable<Movie>> GetAllAsync(GetAllMoviesOptions options, CancellationToken cancellationToken = default);
    Task<Movie?> UpdateAsync(Movie movie, Guid? userId = default, CancellationToken cancellationToken = default);
    Task<bool> DeleteByIdAsync(Guid id, CancellationToken cancellationToken = default);
    Task<int> GetCountAsync(string? title, int? year, CancellationToken cancellationToken = default);

    Task<Movie?> UploadPosterAsync(Guid movieId, Stream fileStream, string fileName, Guid userId,
        CancellationToken cancellationToken = default);

    Task<bool> DeletePosterAsync(Guid movieId, Guid userId, CancellationToken cancellationToken = default);

    Task<Movie?> ChangeStatusAsync(Guid movieId, MovieStatus newStatus, Guid userId,
        CancellationToken cancellationToken = default);
}