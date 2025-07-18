# Project Structure

## Solution Organization
The solution follows Clean Architecture principles with clear separation of concerns across multiple projects.

## Core Projects (1.GettingStarted/)

### Movies.Api
- **Purpose**: Main API entry point and HTTP layer
- **Responsibilities**: 
  - Minimal API endpoint definitions
  - HTTP pipeline configuration (CORS, authentication, etc.)
  - Dependency injection setup
  - Swagger configuration
- **Dependencies**: Movies.Application, Movies.Contracts
- **Key Files**: Program.cs, endpoint definitions

### Movies.Application  
- **Purpose**: Business logic and domain layer
- **Responsibilities**:
  - Service implementations (MovieService, RatingService)
  - Repository interfaces (IMovieRepository)
  - Domain models and business rules
  - Database migrations and initialization
- **Dependencies**: Entity Framework, Dapper, FluentValidation
- **Key Patterns**: Repository pattern, service layer

### Movies.Contracts
- **Purpose**: Data Transfer Objects (DTOs)
- **Responsibilities**:
  - Request/Response models
  - API contract definitions
  - Decouples internal models from public API
- **Dependencies**: None (pure POCO classes)

## SDK Projects

### Movies.Api.Sdk
- **Purpose**: Client SDK for consuming the API
- **Technology**: Refit HTTP client
- **Dependencies**: Movies.Contracts

### Movies.Api.Sdk.Consumer
- **Purpose**: Example implementation showing SDK usage
- **Dependencies**: Movies.Api.Sdk

## Helper Projects (Helpers/)

### Identity.Api
- **Purpose**: Standalone JWT token generation service
- **Use Case**: Testing and development authentication
- **Port**: Typically runs on https://localhost:7148

### Course.postman_collection.json
- **Purpose**: Postman collection for API testing
- **Contains**: Pre-configured requests for all endpoints

### movies.json
- **Purpose**: Sample data for database seeding

## Configuration Files

### Root Level
- `RestApiCourse.sln`: Visual Studio solution file
- `compose.yaml`: Docker Compose for PostgreSQL database
- `.dockerignore`: Docker build exclusions
- `.gitignore`: Git exclusions

## Naming Conventions
- Projects: PascalCase with descriptive names
- Folders: Match project/namespace structure
- Files: PascalCase for C# files, lowercase for config files

## Architecture Principles
- **Dependency Direction**: API → Application → Contracts
- **Clean Architecture**: Each layer has specific responsibilities
- **Separation of Concerns**: HTTP, business logic, and data contracts are separated
- **Testability**: Business logic isolated from HTTP concerns