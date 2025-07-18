# Product Overview

This is a Movies API REST service built as an educational project demonstrating clean architecture principles in .NET 7. The API provides comprehensive movie management functionality including CRUD operations, user ratings, and authentication/authorization.

## Core Features
- Movie catalog management (create, read, update, delete)
- User rating system for movies
- JWT-based authentication with role-based authorization
- API versioning support
- Swagger documentation
- SDK for client consumption

## Target Users
- Developers learning REST API development
- Students studying clean architecture patterns
- Anyone needing a reference implementation of a .NET 7 API

## Key Business Rules
- Movies have unique slugs generated from titles
- Users can rate movies (1-5 scale)
- Three authorization levels: Public, TrustedMember, Admin
- Admin operations require API key authentication
- All data is persisted in PostgreSQL database