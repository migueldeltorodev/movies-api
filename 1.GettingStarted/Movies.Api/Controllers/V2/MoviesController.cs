using Asp.Versioning;
using Microsoft.AspNetCore.Mvc;
using Movies.Api.Auth;
using Movies.Api.Mapping;
using Movies.Application.Services;

namespace Movies.Api.Controllers.V2;

[ApiController]
[ApiVersion("2.0")]
public class MoviesController : ControllerBase
{
    private readonly IMovieService _movieService;

    public MoviesController(IMovieService movieService)
    {
        _movieService = movieService;
    }

    [HttpGet(ApiEndpoints.Movies.Get)]
    public async Task<IActionResult> GetV2([FromRoute]string idOrSlug,
        [FromServices] LinkGenerator linkGenerator,
        CancellationToken cancellationToken)
    {
        var userId = HttpContext.GetUserId();
        var movie = Guid.TryParse(idOrSlug, out var id) 
            ? await _movieService.GetByIdAsync(id, userId, cancellationToken) 
            : await _movieService.GetBySlugAsync(idOrSlug, userId, cancellationToken);
        
        if (movie is null)
        {
            return NotFound();
        }
        
        var movieResponse = movie.MapToMovieResponse();

        var movieObj = new { id = movie.Id };
        return Ok(movieResponse);
    }
}