# ── Build stage ───────────────────────────────────────────────────────────────
FROM node:20-alpine AS builder
WORKDIR /app

RUN apk add --no-cache openssl

ENV HUSKY=0

# Copy workspace manifests first (layer cache)
COPY package.json package-lock.json ./
COPY backend/package.json  ./backend/package.json
COPY shared/package.json   ./shared/package.json

# Install all deps (includes dev — needed for tsc + prisma CLI)
RUN npm ci

# Copy source
COPY shared/   ./shared/
COPY backend/  ./backend/

# Generate Prisma client BEFORE build (enums são necessários para o tsc)
RUN cd backend && npx prisma generate

# Build NestJS → backend/dist/
RUN npm run build --workspace=backend

# ── Production stage ──────────────────────────────────────────────────────────
FROM node:20-alpine AS runner
WORKDIR /app

RUN apk add --no-cache openssl

ENV NODE_ENV=production
# Husky não existe em prod — evita falha no "prepare" script do root package.json
ENV HUSKY=0

# Copy workspace manifests
COPY package.json package-lock.json ./
COPY backend/package.json  ./backend/package.json
COPY shared/package.json   ./shared/package.json

# Production deps only (+ prisma moved to deps for migrate deploy)
RUN npm ci --omit=dev

# Built output from builder
COPY --from=builder /app/backend/dist     ./backend/dist

# Prisma schema + migrations (needed for migrate deploy at runtime)
COPY --from=builder /app/backend/prisma   ./backend/prisma

# Re-generate Prisma client in production node_modules
RUN cd backend && npx prisma generate

# Entrypoint script
COPY docker-entrypoint.sh ./
RUN chmod +x docker-entrypoint.sh

EXPOSE 3001

CMD ["./docker-entrypoint.sh"]
