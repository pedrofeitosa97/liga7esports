#!/bin/sh
set -e

echo "▶ Running database migrations..."
cd /app/backend
npx prisma migrate deploy

echo "▶ Starting LIGA7ESPORTS API..."
exec node dist/main
