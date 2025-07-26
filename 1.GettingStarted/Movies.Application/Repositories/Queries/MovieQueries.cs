namespace Movies.Application.Repositories.Queries;

public static class MovieQueries
{
    public const string SelectFields = """
                                       m.id,
                                       m.title,
                                       m.description,
                                       m.director,
                                       m.yearofrelease,
                                       m.release_date as releasedate,
                                       m.duration_minutes as durationminutes,
                                       m.country_of_origin as country,
                                       m.original_language as originallanguage,
                                       m.poster_url as posterurl,
                                       m.poster_filename as posterfilename,
                                       m.mpaa_rating as agerating,
                                       m.status,
                                       m.budget,
                                       m.box_office as boxoffice,
                                       m.created_at as createdat,
                                       m.updated_at as updatedat,
                                       m.created_by as createdby,
                                       m.updated_by as updatedby
                                       """;

    public const string GetByIdQuery = $"""
                                        select 
                                            {SelectFields},
                                            round(avg(r.rating), 1) as rating,
                                            myr.rating as userrating
                                        from movies m
                                        left join ratings r on m.id = r.movieid
                                        left join ratings myr on m.id = myr.movieid and myr.userid = @userId
                                        where m.id = @id
                                        group by m.id, m.title, m.description, m.director, m.yearofrelease, 
                                                m.release_date, m.duration_minutes, m.country_of_origin, m.original_language,
                                                m.poster_url, m.poster_filename, m.mpaa_rating, 
                                                m.status, m.budget, m.box_office, m.created_at, 
                                                m.updated_at, m.created_by, m.updated_by, myr.rating
                                        """;

    public const string GetBySlugQuery = $"""
                                          select 
                                              {SelectFields},
                                              round(avg(r.rating), 1) as rating,
                                              myr.rating as userrating
                                          from movies m
                                          left join ratings r on m.id = r.movieid
                                          left join ratings myr on m.id = myr.movieid and myr.userid = @userId
                                          where m.slug = @slug
                                          group by m.id, m.title, m.description, m.director, m.yearofrelease, 
                                                  m.release_date, m.duration_minutes, m.country_of_origin, m.original_language,
                                                  m.poster_url, m.poster_filename, m.mpaa_rating, 
                                                  m.status, m.budget, m.box_office, m.created_at, 
                                                  m.updated_at, m.created_by, m.updated_by, myr.rating
                                          """;

    public static string GetAllMoviesQuery(string orderClause) => $"""
                                                                   select 
                                                                       {SelectFields},
                                                                       coalesce(string_agg(distinct g.name, ','), '') as genres,
                                                                       round(avg(r.rating), 1) as rating,
                                                                       myr.rating as userrating
                                                                   from movies m 
                                                                   left join genres g on m.id = g.movieid
                                                                   left join ratings r on m.id = r.movieid
                                                                   left join ratings myr on m.id = myr.movieid and myr.userid = @userId
                                                                   where (@title is null or m.title ilike ('%' || @title || '%'))
                                                                   and (@yearofrelease is null or m.yearofrelease = @yearofrelease)
                                                                   and m.status = 1  -- Only show published movies
                                                                   group by m.id, m.title, m.description, m.director, m.duration_minutes, 
                                                                           m.yearofrelease, m.release_date, m.country_of_origin, m.original_language,
                                                                           m.poster_url, m.poster_filename, m.mpaa_rating, 
                                                                           m.status, m.budget, m.box_office, m.created_at, 
                                                                           m.updated_at, m.created_by, m.updated_by, myr.rating {orderClause}
                                                                   limit @pageSize
                                                                   offset @pageOffset
                                                                   """;

    public const string GetGenresQuery = """
                                         select name from genres where movieId = @id
                                         """;
}