FROM node:20-slim
WORKDIR /app

ENV NODE_ENV=production
ENV HUSKY=0

# OpenSSL para o Prisma (necessário no Debian slim)
RUN apt-get update -y && apt-get install -y openssl && rm -rf /var/lib/apt/lists/*

# Workspace manifests (cache de camadas)
COPY package.json package-lock.json ./
COPY backend/package.json  ./backend/package.json
COPY shared/package.json   ./shared/package.json

# Instala nest CLI globalmente (evita problema de PATH com npm workspaces)
RUN npm install -g @nestjs/cli

# Instala todas as deps (dev incluída — necessário para tsc + prisma CLI)
RUN npm ci

# Copia o fonte
COPY shared/   ./shared/
COPY backend/  ./backend/

# Gera o Prisma client ANTES do build (enums necessários para o tsc)
RUN cd backend && npx prisma generate

# Compila NestJS → backend/dist/
RUN cd backend && nest build

# Remove devDependencies após o build
RUN npm prune --omit=dev

COPY docker-entrypoint.sh ./
RUN chmod +x docker-entrypoint.sh

EXPOSE 3001

CMD ["./docker-entrypoint.sh"]
