using Dapper;
using Movies.Application.Database;
using Movies.Application.Models;
using Movies.Application.Repositories.Queries;

namespace Movies.Application.Repositories;

public class MovieRepository : IMovieRepository
{
    private readonly IDbConnectionFactory _dbConnectionFactory;

    public MovieRepository(IDbConnectionFactory dbConnectionFactory)
    {
        _dbConnectionFactory = dbConnectionFactory;
    }

    public async Task<bool> CreateAsync(Movie movie, CancellationToken cancellationToken = default)
    {
        using var connection = await _dbConnectionFactory.CreateConnectionAsync(cancellationToken);
        using var transaction = connection.BeginTransaction();

        var result = await connection.ExecuteAsync(new CommandDefinition("""
                                                                         INSERT INTO movies (
                                                                             id, slug, title, yearofrelease, description, director, duration_minutes, 
                                                                             release_date, country_of_origin, original_language, poster_url, poster_filename,
                                                                             mpaa_rating, status, budget, box_office,
                                                                             created_at, updated_at, created_by, updated_by
                                                                         ) VALUES (
                                                                             @Id, @Slug, @Title, @YearOfRelease, @Description, @Director, @DurationMinutes,
                                                                             @ReleaseDate, @Country, @OriginalLanguage, @PosterUrl, @PosterFileName,
                                                                             @AgeRating, @Status, @Budget, @BoxOffice,
                                                                             @CreatedAt, @UpdatedAt, @CreatedBy, @UpdatedBy
                                                                         )
                                                                         """, movie,
            cancellationToken: cancellationToken));

        if (result > 0)
        {
            foreach (var genre in movie.Genres)
            {
                await connection.ExecuteAsync(new CommandDefinition("""
                                                                    INSERT INTO genres (movieId, name)
                                                                    VALUES (@MovieId, @Name)
                                                                    """, new { MovieId = movie.Id, Name = genre },
                    cancellationToken: cancellationToken));
            }
        }

        transaction.Commit();
        return result > 0;
    }

    public async Task<Movie?> GetByIdAsync(Guid id, Guid? userId = default,
        CancellationToken cancellationToken = default)
    {
        using var connection = await _dbConnectionFactory.CreateConnectionAsync(cancellationToken);
        var movie = await connection.QueryFirstOrDefaultAsync<Movie>(
            new CommandDefinition(MovieQueries.GetByIdQuery, new { id, userId }, cancellationToken: cancellationToken));
        if (movie is null)
        {
            return null;
        }

        var genres = await connection.QueryAsync<string>(
            new CommandDefinition(MovieQueries.GetGenresQuery, new { id }, cancellationToken: cancellationToken));

        foreach (var genre in genres)
        {
            movie.Genres.Add(genre);
        }

        return movie;
    }

    public async Task<Movie?> GetBySlugAsync(string slug, Guid? userId = default,
        CancellationToken cancellationToken = default)
    {
        using var connection = await _dbConnectionFactory.CreateConnectionAsync(cancellationToken);
        var movie = await connection.QueryFirstOrDefaultAsync<Movie>(
            new CommandDefinition(MovieQueries.GetBySlugQuery, new { slug, userId },
                cancellationToken: cancellationToken));
        if (movie is null)
        {
            return null;
        }

        var genres = await connection.QueryAsync<string>(
            new CommandDefinition(MovieQueries.GetGenresQuery, new { id = movie.Id },
                cancellationToken: cancellationToken));

        foreach (var genre in genres)
        {
            movie.Genres.Add(genre);
        }

        return movie;
    }

    public async Task<IEnumerable<Movie>> GetAllAsync(GetAllMoviesOptions options,
        CancellationToken cancellationToken = default)
    {
        using var connection = await _dbConnectionFactory.CreateConnectionAsync(cancellationToken);

        var orderClause = string.Empty;

        if (options.SortField is not null)
        {
            orderClause = $"""
                           , m.{options.SortField}
                           order by m.{options.SortField} {(options.SortOrder == SortOrder.Ascending ? "asc" : "desc")}
                           """;
        }

        var result = await connection.QueryAsync(new CommandDefinition(MovieQueries.GetAllMoviesQuery(orderClause), new
        {
            userId = options.UserId,
            title = options.Title,
            yearofrelease = options.Year,
            pageSize = options.PageSize,
            pageOffset = (options.Page - 1) * options.PageSize
        }, cancellationToken: cancellationToken));

        return result.Select(x => new Movie
        {
            Id = x.id,
            Title = x.title,
            Description = x.description ?? string.Empty,
            Director = x.director,
            DurationMinutes = x.duration_minutes ?? 0,
            YearOfRelease = x.yearofrelease,
            ReleaseDate = x.release_date,
            Country = x.country_of_origin,
            OriginalLanguage = x.original_language,
            PosterUrl = x.poster_url,
            PosterFileName = x.poster_filename,
            AgeRating = x.mpaa_rating,
            Status = (MovieStatus)(x.status ?? 0),
            Budget = x.budget,
            BoxOffice = x.box_office,
            Rating = (float?)x.rating,
            UserRating = (int?)x.userrating,
            CreatedAt = x.created_at ?? DateTime.UtcNow,
            UpdatedAt = x.updated_at ?? DateTime.UtcNow,
            CreatedBy = x.created_by ?? Guid.Empty,
            UpdatedBy = x.updated_by ?? Guid.Empty,
            Genres = ParseGenres(x.genres)
        });
    }

    public async Task<bool> UpdateAsync(Movie movie, CancellationToken cancellationToken = default)
    {
        using var connection = await _dbConnectionFactory.CreateConnectionAsync(cancellationToken);
        using var transaction = connection.BeginTransaction();

        await connection.ExecuteAsync(new CommandDefinition("""
                                                            delete from genres where movieid = @id
                                                            """, new { id = movie.Id },
            cancellationToken: cancellationToken));
        foreach (var genre in movie.Genres)
        {
            await connection.ExecuteAsync(new CommandDefinition("""
                                                                insert into genres (movieId, name)
                                                                values (@MovieId, @Name)
                                                                """, new { MovieId = movie.Id, Name = genre },
                cancellationToken: cancellationToken));
        }

        var result = await connection.ExecuteAsync(new CommandDefinition("""
                                                                         update movies set 
                                                                             slug = @Slug, 
                                                                             title = @Title, 
                                                                             description = @Description,
                                                                             director = @Director,
                                                                             duration_minutes = @DurationMinutes,
                                                                             yearofrelease = @YearOfRelease,
                                                                             release_date = @ReleaseDate,
                                                                             country_of_origin = @Country,
                                                                             original_language = @OriginalLanguage,
                                                                             poster_url = @PosterUrl,
                                                                             poster_filename = @PosterFileName,
                                                                             mpaa_rating = @AgeRating,
                                                                             status = @Status,
                                                                             budget = @Budget,
                                                                             box_office = @BoxOffice,
                                                                             updated_at = @UpdatedAt,
                                                                             updated_by = @UpdatedBy
                                                                         where id = @Id
                                                                         """, movie,
            cancellationToken: cancellationToken));
        transaction.Commit();
        return result > 0;
    }

    public async Task<bool> DeleteByIdAsync(Guid id, CancellationToken cancellationToken = default)
    {
        using var connection = await _dbConnectionFactory.CreateConnectionAsync(cancellationToken);
        using var transaction = connection.BeginTransaction();

        await connection.ExecuteAsync(new CommandDefinition("""
                                                            delete from ratings where movieid = @id
                                                            """, new { id }, transaction,
            cancellationToken: cancellationToken));
        await connection.ExecuteAsync(new CommandDefinition("""
                                                            delete from genres where id = @id
                                                            """, new { id }, cancellationToken: cancellationToken));
        var result = await connection.ExecuteAsync(new CommandDefinition("""
                                                                         delete from movies where id = @id
                                                                         """, new { id },
            cancellationToken: cancellationToken));

        transaction.Commit();
        return result > 0;
    }

    public async Task<bool> ExistsByIdAsync(Guid id, CancellationToken cancellationToken = default)
    {
        using var connection = await _dbConnectionFactory.CreateConnectionAsync(cancellationToken);
        return await connection.ExecuteScalarAsync<bool>(new CommandDefinition("""
                                                                               select count(1) from movies where id = @id
                                                                               """, new { id },
            cancellationToken: cancellationToken));
    }

    public async Task<int> GetCountAsync(string? title, int? year, CancellationToken cancellationToken = default)
    {
        using var connection = await _dbConnectionFactory.CreateConnectionAsync(cancellationToken);
        return await connection.QuerySingleAsync<int>(new CommandDefinition("""
                                                                            select count(id) from movies
                                                                            where (@title is null or title ilike ('%' || @title || '%'))
                                                                            and (@year is null or yearofrelease >= @year)
                                                                            """, new { title, year },
            cancellationToken: cancellationToken));
    }

    private static List<string> ParseGenres(dynamic genres)
    {
        if (genres == null)
            return new List<string>();

        // Handle different possible types that Dapper might return
        return genres switch
        {
            string genreString when string.IsNullOrEmpty(genreString) => new List<string>(),
            string genreString => genreString.Split(',', StringSplitOptions.RemoveEmptyEntries).ToList(),
            string[] genreArray => genreArray.ToList(),
            _ => new List<string>()
        };
    }
}