# Simple Integration Application

## Overview

See the [High-Level Design document](./documents/design.md) for an overview of the Simple Integration Application.

## Getting Started

### Prerequisites

- [.NET 8.0](https://dotnet.microsoft.com/download/dotnet/8.0)
- [Node.js](https://nodejs.org/en/download/)
- [pnpm](https://pnpm.io/installation)

### Installation

- Clone the repository:
  ```bash
  git clone
    ```
- Install the dependencies:
    ```bash
    cd SimpleIntegrationApp && dotnet restore
    cd simple-integration-app && pnpm install
    ```
### Running the Application

Start the server application by running the following command:
`cd SimpleIntegrationApp && dotnet run`

Start the client application by running the following command:
`cd simple-integration-app && pnpm install && pnpm run dev`

The application will be available at [http://localhost:3000](http://localhost:3000).

## Testing

### Backend

Run the following command to execute the backend tests:
`cd SimpleIntegrationApp && dotnet test`

### Frontend

Run the following command to execute the frontend tests:
`cd simple-integration-app && pnpm test`

Run the following command to serve Storybook for visual testing:
`cd simple-integration-app && pnpm storybook`

## Deployment

The application is deployed using Docker on Coolify and Hetzner Cloud. The deployment process is automated using webhooks.