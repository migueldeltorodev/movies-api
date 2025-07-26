using Microsoft.AspNetCore.Authorization;
using Movies.Api.Auth;
using Movies.Api.Mapping;
using Movies.Application.Models;
using Movies.Application.Services;
using Movies.Contracts.Requests;
using Movies.Contracts.Responses;
using Movies.Contracts.Utils;

namespace Movies.Api.Endpoints.Movies;

public static class ChangeMovieStatusEndpoint
{
    private const string Name = "ChangeMovieStatus";

    public static void MapChangeMovieStatusEndpoint(this IEndpointRouteBuilder app)
    {
        app.MapPatch(ApiEndpoints.Movies.ChangeStatus, ChangeMovieStatusAsync)
            .WithName(Name)
            .WithOpenApi()
            .Produces<MovieResponse>(StatusCodes.Status200OK)
            .Produces<ValidationFailureResponse>(StatusCodes.Status400BadRequest)
            .Produces(StatusCodes.Status404NotFound)
            .RequireAuthorization(AuthConstants.TrustedMemberPolicyName);
    }

    private static async Task<IResult> ChangeMovieStatusAsync(
        Guid id,
        ChangeMovieStatusRequest request,
        IMovieService movieService,
        HttpContext context,
        CancellationToken cancellationToken)
    {
        var userId = context.GetUserId();
        var updated = await movieService.ChangeStatusAsync(id, (MovieStatus)request.Status, userId ?? Guid.Empty, cancellationToken);
        
        if (updated is null)
        {
            return Results.NotFound();
        }

        var response = updated.MapToMovieResponse();
        return TypedResults.Ok(response);
    }
}