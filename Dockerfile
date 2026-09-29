# syntax=docker/dockerfile:1

FROM node:24-slim AS base
WORKDIR /app

# ---- build: full install, generate Prisma client, compile ----
# Also used by the `migrate` service in docker-compose.yml, since it has the Prisma CLI.
FROM base AS build
# Prisma's schema engine (used by `migrate deploy`) needs OpenSSL
RUN apt-get update && apt-get install -y --no-install-recommends openssl \
    && rm -rf /var/lib/apt/lists/*
COPY package.json package-lock.json ./
RUN npm ci
COPY . .
RUN npx prisma generate && npm run build

# ---- production: runtime deps + compiled output only ----
FROM base AS production
ENV NODE_ENV=production
COPY package.json package-lock.json ./
RUN npm ci --omit=dev && npm cache clean --force
COPY --from=build /app/dist ./dist
USER node
EXPOSE 3000
CMD ["node", "dist/main.js"]
