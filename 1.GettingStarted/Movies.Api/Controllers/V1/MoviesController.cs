using Asp.Versioning;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.OutputCaching;
using Movies.Api.Auth;
using Movies.Api.Mapping;
using Movies.Application.Services;
using Movies.Contracts.Requests;
using Movies.Contracts.Responses;

namespace Movies.Api.Controllers.V1;

[ApiController]
[ApiVersion(1.0)]
public class MoviesController : ControllerBase
{
    private readonly IMovieService _movieService;
    private readonly IOutputCacheStore _outputCacheStore;

    public MoviesController(IMovieService movieService, IOutputCacheStore outputCacheStore)
    {
        _movieService = movieService;
        _outputCacheStore = outputCacheStore;
    }

    [Authorize(AuthConstants.TrustedMemberPolicyName)]
    [ServiceFilter(typeof(ApiKeyAuthFilter))]
    [HttpPost(ApiEndpoints.Movies.Create)]
    [ProducesResponseType(typeof(MovieResponse), StatusCodes.Status201Created)]
    [ProducesResponseType(typeof(ValidationFailureResponse), StatusCodes.Status400BadRequest)]
    public async Task<IActionResult> Create([FromBody] CreateMovieRequest request, CancellationToken cancellationToken)
    {
        var movie = request.MapToMovie();
        await _movieService.CreateAsync(movie, cancellationToken);
        await _outputCacheStore.EvictByTagAsync("movies", cancellationToken);
        var response = movie.MapToMovieResponse();
        return CreatedAtAction(nameof(Get), new { idOrSlug = movie.Id }, response);
    }
    
    [HttpGet(ApiEndpoints.Movies.Get)]
    [OutputCache(PolicyName = "MovieCache")]
    [ProducesResponseType(typeof(MovieResponse), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> Get([FromRoute]string idOrSlug,
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
        
        movieResponse.Links.Add(new Link
        {
            Href = linkGenerator.GetPathByAction(HttpContext, nameof(Get), values: movieObj),
            Rel = "self",
            Type = "GET"
        });
        
        movieResponse.Links.Add(new Link
        {
            Href = linkGenerator.GetPathByAction(HttpContext, nameof(Update), values: movieObj),
            Rel = "self",
            Type = "PUT"
        });
        
        movieResponse.Links.Add(new Link
        {
            Href = linkGenerator.GetPathByAction(HttpContext, nameof(Update), values: movieObj),
            Rel = "self",
            Type = "DELETE"
        });
        
        return Ok(movieResponse);
    }

    [HttpGet(ApiEndpoints.Movies.GetAll)]
    [OutputCache(PolicyName = "MovieCache")]
    [ProducesResponseType(typeof(MoviesResponse), StatusCodes.Status200OK)]
    public async Task<IActionResult> GetAll([FromQuery]GetAllMoviesRequest request, CancellationToken cancellationToken)
    {
        var userId = HttpContext.GetUserId();
        var options = request.MapToOptions()
            .WithUserId(userId);
        var movies = await _movieService.GetAllAsync(options, cancellationToken);
        var movieCount = await _movieService.GetCountAsync(options.Title, options.Year, cancellationToken);
        var movieResponse = movies.MapToMoviesResponse(
            request.Page.GetValueOrDefault(PagedRequest.DefaultPage), 
            request.PageSize.GetValueOrDefault(PagedRequest.DefaultPageSize), 
            movieCount);
        return Ok(movieResponse);
    }

    [Authorize(AuthConstants.AdminUserPolicyName)]
    [HttpPut(ApiEndpoints.Movies.Update)]
    [ProducesResponseType(typeof(MovieResponse), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    [ProducesResponseType(typeof(ValidationFailureResponse), StatusCodes.Status400BadRequest)]
    public async Task<IActionResult> Update([FromRoute]Guid id, [FromBody] UpdateMovieRequest request, CancellationToken cancellationToken)
    {
        var userId = HttpContext.GetUserId();
        var movie = request.MapToMovie(id);
        var updatedMovie = await _movieService.UpdateAsync(movie, userId, cancellationToken);
        if (updatedMovie is null)
        {
            return NotFound();
        }
        await _outputCacheStore.EvictByTagAsync("movies", cancellationToken);
        var response = movie.MapToMovieResponse();
        return Ok(response);
    }

    [Authorize(AuthConstants.AdminUserPolicyName)]
    [HttpDelete(ApiEndpoints.Movies.Delete)]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> Delete([FromRoute]Guid id, CancellationToken cancellationToken)
    {
        var deleted = await _movieService.DeleteByIdAsync(id, cancellationToken);
        
        if (!deleted)
        {
            return NotFound();
        }
        await _outputCacheStore.EvictByTagAsync("movies", cancellationToken);
        return Ok();
    }
}