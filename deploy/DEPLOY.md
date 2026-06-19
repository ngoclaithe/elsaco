# Deploy elSaco lên VPS (103.75.183.225)

## Ports

| Service | Port | Domain |
|---------|------|--------|
| Frontend | **4020** | elsaco.dosutech.site |
| API | **4021** | api-elsaco.dosutech.site |

Kiểm tra port trống trước khi deploy:

```bash
ss -tlnp | grep -E '4020|4021'
# Không có output = port trống
```

## 1. Chuẩn bị trên VPS

```bash
# Clone/copy project vào /home/elsaco
cd /home/elsaco

# Tạo database PostgreSQL
sudo -u postgres psql -c "CREATE DATABASE elsaco;"
sudo -u postgres psql -c "ALTER USER postgres PASSWORD 'test1234';"

# Generate env (chạy trên máy dev, copy .env lên VPS)
npm run env:generate
# Copy backend/.env.production.example → backend/.env trên VPS
# Copy frontend/.env.production.example → frontend/.env.production trên VPS
```

## 2. Build & migrate

```bash
npm install
cd backend && npx prisma migrate deploy && npm run prisma:seed && npm run build
cd ../frontend && npm run build
```

## 3. PM2

```bash
cd /home/elsaco
pm2 start ecosystem.config.js
pm2 save
```

## 4. Nginx — HTTP (bước 1)

```bash
sudo mkdir -p /var/www/certbot
sudo cp deploy/nginx/elsaco.dosutech.site.conf /etc/nginx/sites-available/
sudo cp deploy/nginx/api-elsaco.dosutech.site.conf /etc/nginx/sites-available/
sudo ln -sf /etc/nginx/sites-available/elsaco.dosutech.site.conf /etc/nginx/sites-enabled/
sudo ln -sf /etc/nginx/sites-available/api-elsaco.dosutech.site.conf /etc/nginx/sites-enabled/
sudo nginx -t && sudo systemctl reload nginx
```

Trỏ DNS A record:
- `elsaco.dosutech.site` → 103.75.183.225
- `api-elsaco.dosutech.site` → 103.75.183.225

## 5. Certbot — HTTPS (bước 2)

```bash
sudo certbot certonly --webroot -w /var/www/certbot \
  -d elsaco.dosutech.site \
  -d api-elsaco.dosutech.site

# Thay conf HTTP bằng HTTPS
sudo cp deploy/nginx/elsaco.dosutech.site.conf.https /etc/nginx/sites-available/elsaco.dosutech.site.conf
sudo cp deploy/nginx/api-elsaco.dosutech.site.conf.https /etc/nginx/sites-available/api-elsaco.dosutech.site.conf
sudo nginx -t && sudo systemctl reload nginx
```

## Demo accounts

| Role | Email | Password |
|------|-------|----------|
| Admin | admin@elsaco.com | admin123 |
| User | user@elsaco.com | user123 |
