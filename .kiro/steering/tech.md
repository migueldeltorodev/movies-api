# Technology Stack

## Framework & Runtime
- .NET 9 SDK
- ASP.NET Core with Minimal APIs
- C# with nullable reference types enabled
- Implicit usings enabled

## Database & Data Access
- PostgreSQL database
- Entity Framework Core 9.0.0 with Npgsql provider
- Dapper for lightweight data access
- DbUp for database migrations and schema management
- Embedded SQL scripts for database setup

## Authentication & Security
- JWT Bearer authentication
- API Key authentication for admin operations
- Role-based authorization (Public, TrustedMember, Admin)
- User Secrets for local development configuration

## Key Libraries
- FluentValidation for input validation
- Swashbuckle.AspNetCore for API documentation
- Asp.Versioning for API versioning
- Refit for HTTP client SDK generation

## Development Tools
- Docker Compose for local database setup
- Swagger UI for API testing and documentation
- Postman collection included for testing

## Common Commands

### Database Setup
```bash
# Start PostgreSQL database
docker-compose up -d
```

### User Secrets Configuration
```bash
# Navigate to API project
cd "1.GettingStarted\Movies.Api"

# Initialize user secrets
dotnet user-secrets init

# Set required secrets
dotnet user-secrets set "Database:ConnectionString" "Server=localhost;Port=5432;Database=movies;User Id=migueldeltorodev;Password=migueldeltorodev;"
dotnet user-secrets set "Jwt:Key" "unaClaveSecretaSuperLargaYComplejaParaJwt"
dotnet user-secrets set "Jwt:Issuer" "https://localhost:5001"
dotnet user-secrets set "Jwt:Audience" "https://localhost:5001"
dotnet user-secrets set "ApiKey" "unaApiKeySuperSecretaParaUsuariosAdmin"
```

### Build & Run
```bash
# Build entire solution
dotnet build

# Run main API
cd "1.GettingStarted\Movies.Api"
dotnet run

# Run Identity API (for JWT token generation)
cd "Helpers\Identity.Api"
dotnet run

# Run SDK consumer example
cd "Movies.Api.Sdk.Consumer"
dotnet run
```

### Testing
- API available at: https://localhost:5001
- Swagger UI at: https://localhost:5001/swagger
- Identity API typically at: https://localhost:7148