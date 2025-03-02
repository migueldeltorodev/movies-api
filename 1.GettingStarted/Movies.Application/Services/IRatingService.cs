namespace Movies.Application.Services;

public interface IRatingService
{
    Task<bool> RateMovieAsync(Guid movieId, int rating, Guid userId, CancellationToken cancellationToken = default);
    Task<bool> DeleteRatingAsync(Guid movieId, Guid userId, CancellationToken cancellationToken = default);
}