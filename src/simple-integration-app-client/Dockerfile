FROM node:18-alpine AS development
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .

# Production build for Remix
FROM node:18-alpine AS remix-build
WORKDIR /app
COPY --from=development /app ./
RUN npm run build

# Production build for Storybook
FROM node:18-alpine AS storybook-build
WORKDIR /app
COPY --from=development /app ./
RUN npm run build-storybook

# Final stage for both Remix and Storybook
FROM node:18-alpine AS final
WORKDIR /app

# Set default environment variables
ENV REMIX_PORT=3000
ENV STORYBOOK_PORT=6006

# Copy Remix build artifacts
COPY --from=remix-build /app/build ./build
COPY --from=remix-build /app/package*.json ./
COPY --from=remix-build /app/node_modules ./node_modules

# Copy Storybook static files
COPY --from=storybook-build /app/storybook-static ./storybook-static

# Install serve for Storybook static hosting
RUN npm install -g serve

# Copy start script
COPY start.sh ./
RUN chmod +x start.sh

CMD ["./start.sh"]