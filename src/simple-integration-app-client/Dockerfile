# Use Node 20 instead of 18
FROM node:20-alpine AS development
WORKDIR /app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm install

# Copy source files
COPY . .

# Production build for Remix
FROM node:20-alpine AS remix-build
WORKDIR /app
COPY --from=development /app ./
ENV NODE_ENV=production
# Ensure TypeScript build succeeds before Remix build
RUN npm run typecheck && \
    npm run build

# Production build for Storybook
FROM node:20-alpine AS storybook-build
WORKDIR /app
COPY --from=development /app ./
ENV NODE_ENV=production
# Add Vite environment variables for production build
ENV VITE_ENV=production
RUN npm run build-storybook

# Final stage
FROM node:20-alpine AS final
WORKDIR /app

# Set default environment variables
ENV NODE_ENV=production
ENV REMIX_PORT=3000
ENV STORYBOOK_PORT=6006

# Copy build artifacts and dependencies
COPY --from=remix-build /app/build ./build
COPY --from=remix-build /app/package*.json ./
COPY --from=remix-build /app/node_modules ./node_modules
COPY --from=storybook-build /app/storybook-static ./storybook-static

# Install serve for Storybook static hosting
RUN npm install -g serve

# Copy start script
COPY start.sh ./
RUN chmod +x start.sh

CMD ["./start.sh"]