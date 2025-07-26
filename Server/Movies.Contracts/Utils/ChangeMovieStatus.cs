using Movies.Application.Models;

namespace Movies.Contracts.Utils;

public static class ChangeMovieStatus
{
    public static MovieStatus ChangeStatus(this int movieStatus)
    {
        return (MovieStatus)movieStatus;
    }
}