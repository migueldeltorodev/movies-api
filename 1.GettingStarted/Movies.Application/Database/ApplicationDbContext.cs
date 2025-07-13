using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using Movies.Application.Models;

namespace Movies.Application.Database;

public class ApplicationDbContext : IdentityDbContext<User, IdentityRole<Guid>, Guid>
{
    /// <summary>
    /// Initializes a new instance of the <see cref="ApplicationDbContext"/> class using the specified database context options.
    /// </summary>
    /// <param name="options">The options to be used by the database context.</param>
    public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options) : base(options)
    {
    }
}
