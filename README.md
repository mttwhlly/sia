# Simple Integration Application

Start the server application by running the following command:
`cd SimpleIntegrationApp && dotnet run`

Start the client application by running the following command:
`cd simple-integration-app && pnpm install && pnpm run dev`

Docker:

Development
```bash
# Start local development environment
docker compose -f docker-compose.local.yml up -d

# Stop local development environment
docker compose -f docker-compose.local.yml down
```

Production (on Coolify)
```bash
# Build and start all services
docker-compose up --build

# To run in detached mode
docker-compose up -d --build

# To stop all services
docker-compose down
```