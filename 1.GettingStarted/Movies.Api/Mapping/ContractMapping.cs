using Movies.Application.Models;
using Movies.Contracts.Requests;
using Movies.Contracts.Responses;

namespace Movies.Api.Mapping;

public static class ContractMapping
{
    public static Movie MapToMovie(this CreateMovieRequest createMovieRequest, Guid userId)
    {
        return new Movie
        {
            Id = Guid.NewGuid(),
            Title = createMovieRequest.Title,
            Description = createMovieRequest.Description,
            YearOfRelease = createMovieRequest.YearOfRelease,
            Director = createMovieRequest.Director,
            DurationMinutes = createMovieRequest.DurationMinutes ?? 0,
            ReleaseDate = createMovieRequest.ReleaseDate,
            Country = createMovieRequest.Country,
            OriginalLanguage = createMovieRequest.OriginalLanguage,
            AgeRating = createMovieRequest.AgeRating,
            Genres = createMovieRequest.Genres.ToList(),
            Status = MovieStatus.Draft,
            CreatedAt = DateTime.UtcNow,
            UpdatedAt = DateTime.UtcNow,
            CreatedBy = userId,
            UpdatedBy = userId
        };
    }

    public static MovieResponse MapToMovieResponse(this Movie movie)
    {
        return new MovieResponse
        {
            Id = movie.Id,
            Title = movie.Title,
            Slug = movie.Slug,
            Description = movie.Description,
            Director = movie.Director,
            DurationMinutes = movie.DurationMinutes,
            FormattedDuration = movie.FormattedDuration,
            YearOfRelease = movie.YearOfRelease,
            ReleaseDate = movie.ReleaseDate,
            Country = movie.Country,
            OriginalLanguage = movie.OriginalLanguage,
            PosterUrl = movie.PosterUrl,
            AgeRating = movie.AgeRating,
            Rating = movie.Rating,
            UserRating = movie.UserRating,
            Status = (int)movie.Status,
            IsPublished = movie.IsPublished,
            CreatedAt = movie.CreatedAt,
            UpdatedAt = movie.UpdatedAt,
            Genres = movie.Genres
        };
    }

    public static MoviesResponse MapToMoviesResponse(
        this IEnumerable<Movie> movies,
        int page,
        int pageSize,
        int totalCount)
    {
        return new MoviesResponse
        {
            Items = movies.Select(MapToMovieResponse),
            PageSize = pageSize,
            Page = page,
            Total = totalCount
        };
    }

    public static Movie MapToMovie(this UpdateMovieRequest request, Guid id, Guid? userId)
    {
        return new Movie
        {
            Id = id,
            Title = request.Title,
            Description = request.Description,
            YearOfRelease = request.YearOfRelease,
            Director = request.Director,
            DurationMinutes = request.DurationMinutes ?? 0,
            ReleaseDate = request.ReleaseDate,
            Country = request.Country,
            OriginalLanguage = request.OriginalLanguage,
            AgeRating = request.AgeRating,
            Status = request.Status.HasValue ? (MovieStatus)request.Status.Value : MovieStatus.Draft,
            Genres = request.Genres.ToList(),
            UpdatedAt = DateTime.UtcNow,
            UpdatedBy = userId
        };
    }

    private static Guid GetCreatedBy(Guid movieId)
    {
        return Guid.NewGuid();
    }

    public static IEnumerable<MovieRatingResponse> MapToResponse(this IEnumerable<MovieRating> ratings)
    {
        return ratings.Select(x => new MovieRatingResponse
        {
            Rating = x.Rating,
            Slug = x.Slug,
            MovieId = x.MovieId
        });
    }

    public static GetAllMoviesOptions MapToOptions(this GetAllMoviesRequest request)
    {
        return new GetAllMoviesOptions
        {
            Title = request.Title,
            Year = request.Year,
            SortField = request.SortBy?.Trim('+', '-'),
            SortOrder = request.SortBy is null ? SortOrder.Unsorted :
                request.SortBy.StartsWith('-') ? SortOrder.Descending : SortOrder.Ascending,
            Page = request.Page.GetValueOrDefault(PagedRequest.DefaultPage),
            PageSize = request.PageSize.GetValueOrDefault(PagedRequest.DefaultPageSize),
        };
    }

    public static GetAllMoviesOptions WithUserId(this GetAllMoviesOptions options, Guid? userId)
    {
        options.UserId = userId;
        return options;
    }
}