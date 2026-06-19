const fs = require('fs');
const crypto = require('crypto');
const path = require('path');

function secret() {
  return crypto.randomBytes(64).toString('hex');
}

const backendEnv = `# Auto-generated — run: node scripts/generate-env.js
DATABASE_URL="postgresql://postgres:test1234@localhost:5432/elsaco?schema=public"
JWT_SECRET="${secret()}"
JWT_REFRESH_SECRET="${secret()}"
PORTAL_JWT_SECRET="${secret()}"
PORTAL_JWT_REFRESH_SECRET="${secret()}"
JWT_EXPIRES_IN="15m"
JWT_REFRESH_EXPIRES_IN="7d"
PORT=4021
FRONTEND_URL="http://localhost:4020"
COOKIE_DOMAIN=""
NODE_ENV="development"
`;

const backendEnvProd = `# Production — copy to VPS backend/.env and adjust if needed
DATABASE_URL="postgresql://postgres:test1234@localhost:5432/elsaco?schema=public"
JWT_SECRET="${secret()}"
JWT_REFRESH_SECRET="${secret()}"
PORTAL_JWT_SECRET="${secret()}"
PORTAL_JWT_REFRESH_SECRET="${secret()}"
JWT_EXPIRES_IN="15m"
JWT_REFRESH_EXPIRES_IN="7d"
PORT=4021
FRONTEND_URL="https://elsaco.dosutech.site"
API_PUBLIC_URL="https://api-elsaco.dosutech.site/api"
COOKIE_DOMAIN=".dosutech.site"
NODE_ENV="production"
`;

const frontendEnvLocal = `# Local development
NEXT_PUBLIC_API_URL=/api
API_INTERNAL_URL=http://localhost:4021
PORT=4020
`;

const frontendEnvProd = `# Production — copy to VPS frontend/.env.production
NEXT_PUBLIC_API_URL=/api
API_INTERNAL_URL=http://localhost:4021
PORT=4020
`;

const root = path.join(__dirname, '..');
fs.writeFileSync(path.join(root, 'backend', '.env'), backendEnv);
fs.writeFileSync(path.join(root, 'backend', '.env.production.example'), backendEnvProd);
fs.writeFileSync(path.join(root, 'backend', '.env.production'), backendEnvProd);
fs.writeFileSync(path.join(root, 'frontend', '.env.local'), frontendEnvLocal);
fs.writeFileSync(path.join(root, 'frontend', '.env.production.example'), frontendEnvProd);
fs.writeFileSync(path.join(root, 'frontend', '.env.production'), frontendEnvProd);

console.log('Generated:');
console.log('  backend/.env');
console.log('  backend/.env.production');
console.log('  backend/.env.production.example');
console.log('  frontend/.env.local');
console.log('  frontend/.env.production');
console.log('  frontend/.env.production.example');
console.log('');
console.log('Database: postgresql://postgres:test1234@localhost:5432/elsaco');
