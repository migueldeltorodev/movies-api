// using Asp.Versioning;
// using Microsoft.AspNetCore.Mvc;
// using Movies.Api.Auth;
// using Movies.Api.Mapping;
// using Movies.Application.Services;
// using Movies.Contracts.Responses;
//
// namespace Movies.Api.Controllers.V2;
//
// [ApiController]
// [ApiVersion("2.0")]
// public class MoviesController : ControllerBase
// {
//     private readonly IMovieService _movieService;
//
//     public MoviesController(IMovieService movieService)
//     {
//         _movieService = movieService;
//     }
//
//     [HttpGet(ApiEndpoints.Movies.Get)]
//     [ProducesResponseType(typeof(MovieResponse), StatusCodes.Status200OK)]
//     [ProducesResponseType(StatusCodes.Status404NotFound)]
//     public async Task<IActionResult> GetV2([FromRoute]string idOrSlug, CancellationToken cancellationToken)
//     {
//         var userId = HttpContext.GetUserId();
//         var movie = Guid.TryParse(idOrSlug, out var id) 
//             ? await _movieService.GetByIdAsync(id, userId, cancellationToken) 
//             : await _movieService.GetBySlugAsync(idOrSlug, userId, cancellationToken);
//         
//         if (movie is null)
//         {
//             return NotFound();
//         }
//         
//         var movieResponse = movie.MapToMovieResponse();
//         return Ok(movieResponse);
//     }
// }