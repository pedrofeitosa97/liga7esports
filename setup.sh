#!/bin/bash

echo "🚀 LIGA7ESPORTS — Setup"
echo "========================="

# Remove the conflicting page (route group page that conflicts with root app/page.tsx)
if [ -f "frontend/src/app/(main)/page.tsx" ]; then
  rm "frontend/src/app/(main)/page.tsx"
  echo "✅ Removed conflicting (main)/page.tsx"
fi

# Install all dependencies
echo ""
echo "📦 Installing dependencies..."
npm install

echo ""
echo "🎉 Setup complete!"
echo ""
echo "Next steps:"
echo "  1. Configure backend/.env with your PostgreSQL connection string"
echo "  2. cd backend && npx prisma@5 migrate dev --name init"
echo "  3. cd backend && npx ts-node prisma/seed.ts"
echo "  4. npm run dev  (from project root)"
echo ""
echo "  Demo account: demo@liga7.gg / demo123"
echo "  Frontend: http://localhost:3000"
echo "  Backend:  http://localhost:3001/api"
echo "  Swagger:  http://localhost:3001/api/docs"
