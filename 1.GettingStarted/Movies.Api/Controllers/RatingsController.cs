using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Movies.Api.Auth;
using Movies.Application.Services;
using Movies.Contracts.Requests;

namespace Movies.Api.Controllers;

[ApiController]
public class RatingsController : ControllerBase
{
    private readonly IRatingService _ratingService;

    public RatingsController(IRatingService ratingService)
    {
        _ratingService = ratingService;
    }

    [Authorize]
    [HttpPut(ApiEndpoints.Movies.Rate)]
    public async Task<IActionResult> RateMovie([FromRoute]Guid id, 
        [FromBody]RateMovieRequest request, 
        CancellationToken cancellationToken = default)
    {
        var userId = HttpContext.GetUserId();
        var result = await _ratingService.RateMovieAsync(id, request.Rating, userId!.Value, cancellationToken);
        return result ? Ok() : NotFound();
    }

    [Authorize]
    [HttpDelete(ApiEndpoints.Movies.DeleteRating)]
    public async Task<IActionResult> DeleteRating([FromRoute] Guid id,
        CancellationToken cancellationToken = default)
    {
        var userId = HttpContext.GetUserId();
        var result = await _ratingService.DeleteRatingAsync(id, userId!.Value, cancellationToken);
        return result ? Ok() : NotFound();
    }
}