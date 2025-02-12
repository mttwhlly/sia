# Stage 1: Build the application
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build

# Set the working directory
WORKDIR /src

# Copy the .csproj file and restore dependencies
COPY ["SimpleIntegrationApi.csproj", "./"]
RUN dotnet restore

# Copy the rest of the application files
COPY . .

# Build and publish the application in release mode
RUN dotnet publish -c Release -o /app/publish

# Stage 2: Create the runtime container
FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS final

# Set the working directory for the runtime container
WORKDIR /app

# Copy the published files from the build stage
COPY --from=build /app/publish .

# Expose port 80 (optional, adjust as needed)
EXPOSE 80

# Set the entry point to run the application
ENTRYPOINT ["dotnet", "SimpleIntegrationApi.dll"]
