# elSaco — Streetwear E-commerce

Next.js + NestJS + Prisma + PostgreSQL

## Quick start

```bash
npm install
npm run env:generate          # Tạo JWT secrets + .env files

# Tạo DB PostgreSQL (không dùng Docker)
# psql -U postgres -c "CREATE DATABASE elsaco;"

npm run db:migrate
npm run db:seed
npm run dev                   # Web :4020 | API :4021
```

## Auth

- HTTP-only cookies (`elsaco_access`, `elsaco_refresh`)
- Không lưu token trong localStorage
- Dev: Next.js rewrite `/api` → `localhost:4021` (same-origin cookies)
- Prod: cross-subdomain cookies với `COOKIE_DOMAIN=.dosutech.site`

## Frontend architecture

```
src/
├── hooks/        # Business logic (useAuth, useCart, useShop...)
├── stores/       # Zustand state
├── lib/api/      # API layer (credentials: include)
├── lib/types/    # TypeScript types
└── components/   # UI only (dumb components)
```

## Deploy

Xem [deploy/DEPLOY.md](deploy/DEPLOY.md)

## Demo

| Role | Email | Password |
|------|-------|----------|
| Admin | admin@elsaco.com | admin123 |
| User | user@elsaco.com | user123 |
