using System.Web;
using Identity.Api.Services;
using Microsoft.AspNetCore.Identity;
using Movies.Api;
using Movies.Application.Models;
using Movies.Contracts.Requests;

namespace Identity.Api.Endpoints.Auth;

public static class RegisterUserEndpoint
{
    private const string Name = "RegisterUser";

    public static IEndpointRouteBuilder MapRegisterUser(this IEndpointRouteBuilder app)
    {
        app.MapPost(ApiEndpoints.Auth.Register, async (
                RegisterRequest request,
                HttpContext context,
                UserManager<User> userManager,
                IEmailSender emailSender,
                CancellationToken token) =>
            {
                var userExists = await userManager.FindByEmailAsync(request.Email);
                if (userExists is not null)
                {
                    return Results.Conflict(new { message = "User with this email already exists." });
                }

                var user = new User
                {
                    UserName = request.Email,
                    Email = request.Email,
                };

                var result = await userManager.CreateAsync(user, request.Password);

                if (!result.Succeeded)
                {
                    return Results.BadRequest(result.Errors);
                }

                await userManager.AddToRoleAsync(user, "User");

                var confirmationToken = await userManager.GenerateEmailConfirmationTokenAsync(user);
                var encodedToken = HttpUtility.UrlEncode(confirmationToken);

                var confirmationLink =
                    $"{context.Request.Scheme}://{context.Request.Host}{ApiEndpoints.Auth.ConfirmEmail}?userId={user.Id}&token={encodedToken}";

                await emailSender.SendEmailAsync(user.Email!, "Confirm your email",
                    $"Please confirm your account by <a href='{confirmationLink}'>clicking here</a>.");

                return Results.Ok(new
                    { message = "Registration successful. Please check your email to confirm your account." });
            })
            .WithName(Name)
            .Produces(StatusCodes.Status200OK)
            .Produces(StatusCodes.Status400BadRequest)
            .Produces(StatusCodes.Status409Conflict);

        return app;
    }
}