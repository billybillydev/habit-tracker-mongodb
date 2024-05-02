# syntax=docker/dockerfile:1

# Adjust BUN_VERSION as desired
ARG BUN_VERSION=1.0.25-slim
FROM oven/bun:${BUN_VERSION} as base

LABEL fly_launch_runtime="Bun"

WORKDIR /app
COPY package.json bun.lockb ./

FROM base AS build

# Install node modules
COPY --link bun.lockb package.json drizzle.config.ts ./
# Seems like you have to install oslo with cpu = wasm32 (bun add oslo --cpu=wasm32)
ARG NODE_ENV
RUN if [ "$NODE_ENV" = "development" ]; \
    then bun install \
    else apt-get update -qq && \
        apt-get install --no-install-recommends -y build-essential node-gyp pkg-config python-is-python3 && \
        bun install --only=production; \
    fi;
    
# Copy application code
COPY --link . .

# Need to generate schema and migration
# RUN bun run db:generate;
RUN bun run db:migrate

# Final stage for app image
FROM base

# Copy built application
COPY --from=build /app /app
ENV PORT 3000
EXPOSE $PORT
CMD ["bun", "run", "start:prod"]