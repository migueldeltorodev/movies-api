using Dapper;
using Movies.Application.Database;
using Movies.Application.Models;

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
            INSERT INTO movies (id, slug, title, yearofrelease)
            values (@Id, @Slug, @Title, @YearOfRelease)
            """, movie, cancellationToken : cancellationToken));
        
        if (result > 0)
        {
            foreach (var genre in movie.Genres)
            {
                await connection.ExecuteAsync(new CommandDefinition("""
                      INSERT INTO genres (movieId, name)
                      VALUES (@MovieId, @Name)
                      """, new { MovieId = movie.Id, Name = genre }, cancellationToken : cancellationToken));
            }
        }
        
        transaction.Commit();
        return result > 0;
    }

    public async Task<Movie?> GetByIdAsync(Guid id, Guid? userId = default, CancellationToken cancellationToken = default)
    {
        using var connection = await _dbConnectionFactory.CreateConnectionAsync(cancellationToken);
        var movie = await connection.QueryFirstOrDefaultAsync<Movie>(
            new CommandDefinition("""
                                  select m.*, round(avg(r.rating), 1) as rating, myr.rating as userrating 
                                  from movies m
                                  left join ratings r on m.id = r.movieid
                                  left join ratings myr on m.id = myr.movieid
                                    and myr.userid = @userId
                                  where id = @id
                                  group by id, userrating
                                  """, new { id, userId }, cancellationToken : cancellationToken));
        if (movie is null)
        {
            return null;
        }
        
        var genres = await connection.QueryAsync<string>(
            new CommandDefinition("""
                                  select name from genres where movieId = @id
                                  """, new { id }, cancellationToken : cancellationToken));

        foreach (var genre in genres)
        {
            movie.Genres.Add(genre);
        }

        return movie;
    }

    public async Task<Movie?> GetBySlugAsync(string slug, Guid? userId = default, CancellationToken cancellationToken = default)
    {
        using var connection = await _dbConnectionFactory.CreateConnectionAsync(cancellationToken);
        var movie = await connection.QueryFirstOrDefaultAsync<Movie>(
            new CommandDefinition("""
                                  select m.*, round(avg(r.rating), 1) as rating, myr.rating as userrating 
                                  from movies m
                                  left join ratings r on m.id = r.movieid
                                  left join ratings myr on m.id = myr.movieid
                                    and myr.userid = @userId
                                  where slug = @slug
                                  group by id, userrating
                                  """, new { slug, userId }, cancellationToken : cancellationToken));
        if (movie is null)
        {
            return null;
        }
        
        var genres = await connection.QueryAsync<string>(
            new CommandDefinition("""
                                  select name from genres where movieId = @id
                                  """, new { id = movie.Id }, cancellationToken : cancellationToken));

        foreach (var genre in genres)
        {
            movie.Genres.Add(genre);
        }

        return movie;
    }

    public async Task<IEnumerable<Movie>> GetAllAsync(GetAllMoviesOptions options, CancellationToken cancellationToken = default)
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
        
        var result = await connection.QueryAsync(new CommandDefinition($"""
                                 select m.*, 
                                        string_agg(distinct g.name, ',') as genres,
                                        round(avg(r.rating), 1) as rating,
                                        myr.rating as userrating
                                 from movies m 
                                 left join genres g on m.id = g.movieid
                                 left join ratings r on m.id = r.movieid
                                 left join ratings myr on m.id = myr.movieid
                                    and myr.userid = @userId
                                 where (@title is null or m.title ilike ('%' || @title || '%'))
                                 and (@yearofrelease is null or m.yearofrelease = @yearofrelease)
                                 group by id, userrating {orderClause}
                                 limit @pageSize
                                 offset @pageOffset
                                """, new
                                {
                                    userId = options.UserId, 
                                    title = options.Title,
                                    yearofrelease = options.Year,
                                    pageSize = options.PageSize,
                                    pageOffset = (options.Page - 1) * options.PageSize
                                }, cancellationToken : cancellationToken));
        
        return result.Select(x => new Movie
        {
            Id = x.id,
            Title = x.title,
            YearOfRelease = x.yearofrelease,
            Rating = (float?)x.rating,
            UserRating = (int?)x.userrating,
            Genres = Enumerable.ToList(x.genres.Split(','))
        });
    }

    public async Task<bool> UpdateAsync(Movie movie, CancellationToken cancellationToken = default)
    {
        using var connection = await _dbConnectionFactory.CreateConnectionAsync(cancellationToken);
        using var transaction = connection.BeginTransaction();

        await connection.ExecuteAsync(new CommandDefinition("""
                                                            delete from genres where movieid = @id
                                                            """, new { id = movie.Id }, cancellationToken : cancellationToken));
        foreach (var genre in movie.Genres)
        {
            await connection.ExecuteAsync(new CommandDefinition("""
                                                                insert into genres (movieId, name)
                                                                values (@MovieId, @Name)
                                                                """, new { MovieId = movie.Id, Name = genre }, cancellationToken : cancellationToken));
        }

        var result = await connection.ExecuteAsync(new CommandDefinition("""
                                                                         update movies set slug = @Slug, title = @Title, yearofrelease = @YearOfRelease
                                                                         where id = @Id
                                                                         """, movie, cancellationToken : cancellationToken));
        transaction.Commit();
        return result > 0;
    }

    public async Task<bool> DeleteByIdAsync(Guid id, CancellationToken cancellationToken = default)
    {
        using var connection = await _dbConnectionFactory.CreateConnectionAsync(cancellationToken);
        using var transaction = connection.BeginTransaction();

        await connection.ExecuteAsync(new CommandDefinition("""
                                                            delete from genres where id = @id
                                                            """, new { id }, cancellationToken : cancellationToken));
        var result = await connection.ExecuteAsync(new CommandDefinition("""
                                                            delete from movies where id = @id
                                                            """, new { id }, cancellationToken : cancellationToken));
        
        transaction.Commit();
        return result > 0;
    }

    public async Task<bool> ExistsByIdAsync(Guid id, CancellationToken cancellationToken = default)
    {
        using var connection = await _dbConnectionFactory.CreateConnectionAsync(cancellationToken);
        return await connection.ExecuteScalarAsync<bool>(new CommandDefinition("""
                                                                               select count(1) from movies where id = @id
                                                                               """, new { id }, cancellationToken : cancellationToken));
    }

    public async Task<int> GetCountAsync(string? title, int? year, CancellationToken cancellationToken = default)
    {
        using var connection = await _dbConnectionFactory.CreateConnectionAsync(cancellationToken);
        return await connection.QuerySingleAsync<int>(new CommandDefinition("""
                                                                            select count(id) from movies
                                                                            where (@title is null or title ilike ('%' || @title || '%'))
                                                                            and (@year is null or yearofrelease >= @year)
                                                                            """, new {title, year}, cancellationToken : cancellationToken));
    }
}