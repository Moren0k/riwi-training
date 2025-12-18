# Runtime base
FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS base
WORKDIR /app
EXPOSE 8080

# Build stage
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
ARG BUILD_CONFIGURATION=Release
WORKDIR /src

COPY ["src/TalentoPlus.Api/TalentoPlus.Api.csproj", "src/TalentoPlus.Api/"]
COPY ["src/TalentoPlus.Application/TalentoPlus.Application.csproj", "src/TalentoPlus.Application/"]
COPY ["src/TalentoPlus.Domain/TalentoPlus.Domain.csproj", "src/TalentoPlus.Domain/"]
COPY ["src/TalentoPlus.Infrastructure/TalentoPlus.Infrastructure.csproj", "src/TalentoPlus.Infrastructure/"]

RUN dotnet restore "src/TalentoPlus.Api/TalentoPlus.Api.csproj"

COPY . .
WORKDIR "/src/src/TalentoPlus.Api"
RUN dotnet build "./TalentoPlus.Api.csproj" -c $BUILD_CONFIGURATION -o /app/build

# Publish stage
FROM build AS publish
ARG BUILD_CONFIGURATION=Release
RUN dotnet publish "./TalentoPlus.Api.csproj" -c $BUILD_CONFIGURATION -o /app/publish /p:UseAppHost=false

# Final image
FROM base AS final
WORKDIR /app

# Kestrel escuchando en 8080 dentro del contenedor
ENV ASPNETCORE_URLS=http://+:8080

COPY --from=publish /app/publish .
ENTRYPOINT ["dotnet", "TalentoPlus.Api.dll"]
