# Base stage with common setup
FROM node:20-alpine AS base

# Set working directory
WORKDIR /app

# Setup PNPM without corepack
ENV PNPM_HOME="/pnpm"
ENV PATH="${PATH}:${PNPM_HOME}"
RUN mkdir -p $PNPM_HOME
# Remove corepack and install pnpm directly
RUN npm install -g pnpm@9.15.3

# Copy package files for dependency installation
COPY package.json pnpm-lock.yaml ./

# Add packageManager field to avoid corepack warning
RUN node -e "const pkg=require('./package.json'); pkg.packageManager='pnpm@9.15.3'; require('fs').writeFileSync('package.json', JSON.stringify(pkg, null, 2))"

# Production dependencies stage
FROM base AS prod-deps
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --prod --frozen-lockfile

# Development dependencies stage
FROM base AS dev-deps
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --frozen-lockfile

# Build stage
FROM dev-deps AS builder
# Set build environment
ENV NODE_ENV=production
ENV REMIX_BUILD_SERVER_PORT=3000
ENV REMIX_BUILD_MODE=production

# Copy source code
COPY . .

# Build the app
RUN pnpm run build

# Production stage
FROM node:20-alpine AS runner
WORKDIR /app

# Setup PNPM in production stage
ENV PNPM_HOME="/pnpm"
ENV PATH="${PATH}:${PNPM_HOME}"
RUN mkdir -p $PNPM_HOME
RUN corepack enable

# Copy production dependencies
COPY --from=prod-deps /app/node_modules ./node_modules
COPY --from=builder /app/build ./build
COPY --from=builder /app/public ./public
COPY --from=builder /app/package.json ./package.json

# Set production environment
ENV NODE_ENV=production
ENV PORT=3000
ENV HOST=0.0.0.0
ENV REMIX_BUILD_MODE=production

# Expose port
EXPOSE 3000

# Start the app
CMD ["pnpm", "run", "start"]