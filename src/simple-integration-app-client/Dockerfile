FROM node:20-alpine AS development
WORKDIR /app

# Install pnpm and configure global directory
RUN npm install -g pnpm
ENV PNPM_HOME=/root/.local/share/pnpm
ENV PATH="${PATH}:${PNPM_HOME}"
RUN mkdir -p $PNPM_HOME

# Copy package files
COPY package*.json pnpm-lock.yaml ./

# Install dependencies
RUN pnpm install

# Copy source files
COPY . .

# Production build for Remix
FROM node:20-alpine AS remix-build
WORKDIR /app
COPY --from=development /app ./
ENV NODE_ENV=production
ENV PNPM_HOME=/root/.local/share/pnpm
ENV PATH="${PATH}:${PNPM_HOME}"
RUN mkdir -p $PNPM_HOME
RUN npm install -g pnpm
RUN pnpm run build

# Production build for Storybook
FROM node:20-alpine AS storybook-build
WORKDIR /app
COPY --from=development /app ./
ENV NODE_ENV=production
ENV PNPM_HOME=/root/.local/share/pnpm
ENV PATH="${PATH}:${PNPM_HOME}"
RUN mkdir -p $PNPM_HOME
RUN npm install -g pnpm
RUN pnpm run build-storybook

# Final stage
FROM node:20-alpine AS final
WORKDIR /app

# Install pnpm and configure global directory
RUN npm install -g pnpm
ENV PNPM_HOME=/root/.local/share/pnpm
ENV PATH="${PATH}:${PNPM_HOME}"
RUN mkdir -p $PNPM_HOME

# Set default environment variables
ENV NODE_ENV=production
ENV REMIX_PORT=3000
ENV STORYBOOK_PORT=6006
ENV HOST=0.0.0.0 

# Copy build artifacts and package files
COPY --from=remix-build /app/build ./build
COPY --from=remix-build /app/package.json ./
COPY --from=remix-build /app/pnpm-lock.yaml ./

# Install production dependencies
RUN pnpm install --prod

COPY --from=storybook-build /app/storybook-static ./public/storybook

# Copy and setup start script
COPY start.sh ./
RUN chmod +x start.sh

# Expose the port that Coolify expects
EXPOSE 8000

CMD ["/bin/sh", "./start.sh"]