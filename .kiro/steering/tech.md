# Technology Stack

## Backend (.NET 9)
- **Framework**: .NET 9 with Minimal APIs
- **Database**: PostgreSQL with Entity Framework Core 9
- **Authentication**: JWT Bearer tokens with role-based authorization
- **Validation**: FluentValidation
- **Database Migrations**: DbUp with embedded SQL scripts
- **API Documentation**: Swagger/OpenAPI
- **Architecture**: Clean Architecture (API → Application → Contracts)

### Key Libraries
- `Asp.Versioning.Http` (8.1.0) - API versioning
- `Microsoft.AspNetCore.Authentication.JwtBearer` (9.0.0) - JWT auth
- `Npgsql.EntityFrameworkCore.PostgreSQL` (9.0.2) - PostgreSQL provider
- `FluentValidation.DependencyInjectionExtensions` (11.9.0) - Validation
- `Dapper` (2.1.66) - Micro ORM for queries

## Frontend (Angular 20)
- **Framework**: Angular 20 with Zoneless change detection
- **UI Library**: Angular Material 20
- **Styling**: SCSS with responsive design
- **Package Manager**: Bun (configured in angular.json)
- **Build System**: Angular CLI with SSR support
- **Internationalization**: Angular i18n (Spanish default, English support)

### Key Dependencies
- `@angular/material` (20.1.2) - UI components
- `@angular/cdk` (20.1.2) - Component dev kit
- `@angular/ssr` (20.0.2) - Server-side rendering
- `rxjs` (7.8.0) - Reactive programming

## Development Environment
- **Database**: Docker Compose with PostgreSQL
- **IDE**: Visual Studio/.NET + VS Code/Angular
- **Platform**: Windows (cmd shell)

## Common Commands

### Backend
```bash
# Start database
docker-compose up -d

# Run main API (from Server/Movies.Api)
dotnet run

# Run Identity API (from Server/Helpers/Identity.Api)
dotnet run

# Build solution
dotnet build

# Setup user secrets (from Movies.Api directory)
dotnet user-secrets init
dotnet user-secrets set "Database:ConnectionString" "Server=localhost;Port=5432;Database=movies;User Id=migueldeltorodev;Password=migueldeltorodev;"
```

### Frontend
```bash
# Install dependencies (from movies-frontend)
bun install
# or npm install

# Start dev server
npm start
# or ng serve

# Build for production
npm run build

# Run tests
npm test
```

## Configuration Notes
- Backend uses User Secrets for local development
- Frontend configured for development with `NODE_TLS_REJECT_UNAUTHORIZED=0`
- CORS configured for Angular app communication
- JWT tokens obtained from separate Identity API for testing