namespace Movies.Application.Models.Utils;

public static class ChangeMovieStatus
{
    public static MovieStatus ChangeStatus(this int movieStatus)
    {
        return (MovieStatus)movieStatus;
    }
}