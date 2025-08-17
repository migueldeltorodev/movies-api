using FluentResults;

namespace Movies.Application.Models.Errors;

public class NotFoundError : Error
{
    public NotFoundError(string message) : base(message)
    {
        Metadata.Add("StatusCode", 404);
    }
}

public class ValidationError : Error
{
    public ValidationError(string message) : base(message)
    {
        Metadata.Add("StatusCode", 400);
    }

    public ValidationError(IEnumerable<string> messages) : base(string.Join(", ", messages))
    {
        Metadata.Add("StatusCode", 400);
    }
}