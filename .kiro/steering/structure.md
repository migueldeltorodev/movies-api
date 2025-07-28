# Project Structure

## Root Level
```
├── RestApiCourse.sln          # Main solution file
├── compose.yaml               # PostgreSQL database container
├── Documentation/             # Project documentation
├── Server/                    # Backend .NET projects
└── movies-frontend/           # Angular frontend application
```

## Backend Structure (Server/)

### Clean Architecture Layers
```
Server/
├── Movies.Api/                # 🌐 API Layer (Entry point)
│   ├── Endpoints/            # Minimal API endpoint definitions
│   ├── Auth/                 # Authentication/authorization
│   └── Program.cs            # App configuration & DI setup
│
├── Movies.Application/        # 🏗️ Business Logic Layer
│   ├── Services/             # Business services (MovieService, RatingService)
│   ├── Repositories/         # Repository interfaces
│   ├── Models/               # Domain models
│   ├── Database/             # EF Context & migrations
│   └── Validators/           # FluentValidation rules
│
├── Movies.Contracts/          # 📄 Data Transfer Objects
│   ├── Requests/             # API request DTOs
│   └── Responses/            # API response DTOs
│
├── Movies.Api.Sdk/           # 📦 Client SDK
└── Movies.Api.Sdk.Consumer/  # 🔧 SDK usage example
```

### Helper Projects
```
Server/Helpers/
└── Identity.Api/             # JWT token generation for testing
```

## Frontend Structure (movies-frontend/)

### Angular 20 Application
```
movies-frontend/
├── src/
│   ├── app/
│   │   ├── components/       # UI components
│   │   │   ├── movie/        # Movie-related components
│   │   │   └── shared/       # Reusable components
│   │   ├── services/         # HTTP services & business logic
│   │   ├── models/           # TypeScript interfaces
│   │   ├── interceptors/     # HTTP interceptors (auth)
│   │   ├── shared/           # Shared utilities
│   │   ├── app.config.ts     # App configuration
│   │   └── app.routes.ts     # Routing configuration
│   ├── environments/         # Environment configs
│   ├── locale/               # i18n translation files
│   └── styles.scss           # Global styles
├── angular.json              # Angular CLI configuration
├── package.json              # Dependencies & scripts
└── tsconfig.json             # TypeScript configuration
```

## Key Architectural Patterns

### Backend Conventions
- **Minimal APIs**: Endpoint definitions in separate files
- **Repository Pattern**: Data access abstraction
- **Clean Architecture**: Clear separation of concerns
- **Dependency Injection**: Constructor injection throughout
- **FluentValidation**: Centralized validation rules

### Frontend Conventions
- **Standalone Components**: No NgModules, modern Angular approach
- **Signals**: Reactive state management
- **Services**: HTTP communication & state management
- **Interceptors**: Cross-cutting concerns (auth, error handling)
- **SCSS**: Component-scoped styling with global variables

## File Naming Conventions

### Backend (.NET)
- **Controllers/Endpoints**: `MoviesEndpoints.cs`
- **Services**: `MovieService.cs`, `IMovieService.cs`
- **Models**: `Movie.cs`, `Rating.cs`
- **DTOs**: `CreateMovieRequest.cs`, `MovieResponse.cs`
- **Validators**: `CreateMovieRequestValidator.cs`

### Frontend (Angular)
- **Components**: `movie-list.component.ts/html/scss`
- **Services**: `movies-api.service.ts`
- **Models**: `movie.model.ts`
- **Interceptors**: `auth.interceptor.ts`
- **Kebab-case**: All file and folder names

## Configuration Files
- **Backend**: `appsettings.json`, User Secrets, `Program.cs`
- **Frontend**: `environment.ts`, `angular.json`, `app.config.ts`
- **Database**: `compose.yaml` for PostgreSQL container
- **Build**: `.csproj` files, `package.json`

## Documentation Location
All project documentation is centralized in the `Documentation/` folder with comprehensive guides for setup, architecture, and development practices.