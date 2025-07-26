using System.IdentityModel.Tokens.Jwt;
using System.Text;
using Asp.Versioning;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;
using Movies.Api.Auth;
using Movies.Api.Endpoints;
using Movies.Api.Health;
using Movies.Api.Mapping;
using Movies.Api.Swagger;
using Movies.Application;
using Movies.Application.Database;
using Movies.Application.Models;
using Swashbuckle.AspNetCore.SwaggerGen;

var builder = WebApplication.CreateBuilder(args);
var config = builder.Configuration;

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
    JwtSecurityTokenHandler.DefaultInboundClaimTypeMap.Clear();
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

builder.Services.AddScoped<ApiKeyAuthFilter>();
builder.Services.AddScoped<TokenService>();
builder.Services.AddScoped<RoleSeeder>();
builder.Services.AddScoped<AdminUserSeeder>();

builder.Services.AddApiVersioning(x =>
{
    x.DefaultApiVersion = new ApiVersion(1.0);
    x.AssumeDefaultVersionWhenUnspecified = true;
    x.ReportApiVersions = true;
    x.ApiVersionReader = new MediaTypeApiVersionReader("api-version");
}).AddApiExplorer();

builder.Services.AddEndpointsApiExplorer();

builder.Services.AddOutputCache(x =>
{
    x.AddBasePolicy(c => c.Cache());
    x.AddPolicy("MovieCache", c =>
    {
        c.Cache()
            .Expire(TimeSpan.FromMinutes(1))
            .SetVaryByQuery(new[] { "title", "year", "sortBy", "page", "pageSize" })
            .Tag("movies");
    });
});

builder.Services.AddHealthChecks()
    .AddCheck<DatabaseHealthCheck>(DatabaseHealthCheck.Name);

builder.Services.AddTransient<IConfigureOptions<SwaggerGenOptions>, ConfigureSwaggerOptions>();
builder.Services.AddSwaggerGen(x => x.OperationFilter<SwaggerDefaultValues>());

builder.Services.AddCors(options =>
{
    options.AddPolicy("AngularApp", policy =>
    {
        policy.WithOrigins("http://localhost:4200", "https://localhost:4200")
            .AllowAnyHeader()
            .AllowAnyMethod()
            .AllowCredentials();
    });
});

builder.Services.AddApplication();

// Configure EF Core to use PostgreSQL
builder.Services.AddDbContext<ApplicationDbContext>(options =>
    options.UseNpgsql(config["Database:ConnectionString"]));

// This remains for the Dapper-based repositories
builder.Services.AddDatabase(config["Database:ConnectionString"]!);

var app = builder.Build();

app.CreateApiVersionSet();

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI(x =>
    {
        foreach (var description in app.DescribeApiVersions())
        {
            x.SwaggerEndpoint($"/swagger/{description.GroupName}/swagger.json", description.GroupName);
        }
    });
}

app.MapHealthChecks("_health");

app.UseHttpsRedirection();

// Enable CORS
app.UseCors("AngularApp");

// Configure static files for poster uploads
var uploadsPath = Path.Combine(app.Environment.ContentRootPath, "uploads");
var postersPath = Path.Combine(uploadsPath, "posters");
Directory.CreateDirectory(postersPath);

// Servir archivos estáticos desde /uploads
app.UseStaticFiles(new StaticFileOptions
{
    FileProvider = new Microsoft.Extensions.FileProviders.PhysicalFileProvider(uploadsPath),
    RequestPath = "/uploads"
});

app.UseAuthentication();
app.UseAuthorization();

app.UseOutputCache();

app.UseMiddleware<ValidationMappingMiddleware>();
app.MapApiEndpoints();

// Apply EF Core migrations and initialize Dapper DB
using (var scope = app.Services.CreateScope())
{
    var dbContext = scope.ServiceProvider.GetRequiredService<ApplicationDbContext>();
    await dbContext.Database.MigrateAsync();

    var roleSeeder = scope.ServiceProvider.GetRequiredService<RoleSeeder>();
    await roleSeeder.SeedAsync();

    var adminUserSeeder = scope.ServiceProvider.GetRequiredService<AdminUserSeeder>();
    await adminUserSeeder.SeedAsync();

    var dbInitializer = scope.ServiceProvider.GetRequiredService<DbInitializer>();
    await dbInitializer.InitializeAsync();
}


app.Run();