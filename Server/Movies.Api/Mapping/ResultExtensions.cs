using FluentResults;

namespace Movies.Api.Mapping;

public static class ResultExtensions
{
    public static IResult ToOkResult<T>(this Result<T> result)
    {
        if (!result.IsSuccess)
        {
            return HandleError(result.Errors.First());
        }

        return Results.Ok(result.Value);
    }

    private static IResult HandleError(IError error)
    {
        var statusCode = error.Metadata.TryGetValue("StatusCode", out var status) ? (int)status : 400;

        return Results.Problem(
            statusCode: statusCode,
            title: error.Message
        );
    }
}