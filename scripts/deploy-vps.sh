#!/bin/bash
set -e
cd "$(dirname "$0")/.."

echo "=== 1. Setup database ==="
bash scripts/setup-db.sh

echo "=== 2. Generate env ==="
node scripts/generate-env.js
cp backend/.env.production backend/.env
cp frontend/.env.production.example frontend/.env.production

echo "=== 3. Install dependencies ==="
npm install

echo "=== 4. Prisma migrate + seed ==="
cd backend
npx prisma migrate deploy
npm run prisma:seed
npm run build
cd ..

echo "=== 5. Build frontend ==="
cd frontend
npm run build
cd ..

echo "=== 6. PM2 ==="
pm2 delete elsaco-api elsaco-web 2>/dev/null || true
pm2 start ecosystem.config.js
pm2 save

echo "=== Done ==="
pm2 list | grep elsaco
