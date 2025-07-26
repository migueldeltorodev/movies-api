FROM mcr.microsoft.com/dotnet/aspnet:7.0 AS base
WORKDIR /app
EXPOSE 80
EXPOSE 443

FROM mcr.microsoft.com/dotnet/sdk:7.0 AS build
ARG BUILD_CONFIGURATION=Release
WORKDIR /src
COPY ["1.GettingStarted/Movies.Api/Movies.Api.csproj", "1.GettingStarted/Movies.Api/"]
COPY ["1.GettingStarted/Movies.Application/Movies.Application.csproj", "1.GettingStarted/Movies.Application/"]
COPY ["1.GettingStarted/Movies.Contracts/Movies.Contracts.csproj", "1.GettingStarted/Movies.Contracts/"]
RUN dotnet restore "1.GettingStarted/Movies.Api/Movies.Api.csproj"
COPY . .
WORKDIR "/src/1.GettingStarted/Movies.Api"
RUN dotnet build "Movies.Api.csproj" -c $BUILD_CONFIGURATION -o /app/build

FROM build AS publish
ARG BUILD_CONFIGURATION=Release
RUN dotnet publish "Movies.Api.csproj" -c $BUILD_CONFIGURATION -o /app/publish /p:UseAppHost=false

FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .
ENTRYPOINT ["dotnet", "Movies.Api.dll"]
