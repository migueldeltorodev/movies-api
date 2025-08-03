using System.Text;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Movies.Application.Database;
using Movies.Application.Models;
using Identity.Api.Auth;
using Identity.Api.Endpoints.Auth;

var builder = WebApplication.CreateBuilder(args);
var config = builder.Configuration;

// Add services to the container.
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

builder.Services.AddIdentity<User, IdentityRole<Guid>>()
    .AddEntityFrameworkStores<ApplicationDbContext>()
    .AddDefaultTokenProviders();

builder.Services.AddAuthentication(x =>
{
    x.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
    x.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
    x.DefaultScheme = JwtBearerDefaults.AuthenticationScheme;
}).AddJwtBearer(x =>
{
    x.TokenValidationParameters = new TokenValidationParameters
    {
        IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(config["Jwt:Key"]!)),
        ValidateIssuerSigningKey = true,
        ValidateLifetime = true,
        ValidIssuer = config["Jwt:Issuer"],
        ValidAudience = config["Jwt:Audience"],
        ValidateIssuer = true,
        ValidateAudience = true
    };
});

builder.Services.AddAuthorization(x =>
{
    x.AddPolicy(AuthConstants.AdminUserPolicyName,
        policy => policy.AddRequirements(new AdminAuthRequirement(config["ApiKey"]!)));

    x.AddPolicy(AuthConstants.TrustedMemberPolicyName,
        policy => policy.RequireRole("Admin", "User"));
});


builder.Services.AddScoped<TokenService>();
builder.Services.AddScoped<RoleSeeder>();
builder.Services.AddScoped<AdminUserSeeder>();

builder.Services.AddDbContext<ApplicationDbContext>(options =>
    options.UseNpgsql(config["Database:ConnectionString"]));

var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

app.UseAuthentication();
app.UseAuthorization();

app.MapAuthEndpoints();

using var scope = app.Services.CreateScope();
var dbContext = scope.ServiceProvider.GetRequiredService<ApplicationDbContext>();
await dbContext.Database.MigrateAsync();

var roleSeeder = scope.ServiceProvider.GetRequiredService<RoleSeeder>();
await roleSeeder.SeedAsync();

var adminUserSeeder = scope.ServiceProvider.GetRequiredService<AdminUserSeeder>();
await adminUserSeeder.SeedAsync();

app.Run();