# Deploy elSaco lên VPS (103.75.183.225)

SSH: `ssh crm-vps` (key: `id_ed25519_crm`)

## Ports

| Service | Port | Domain |
|---------|------|--------|
| Frontend | **4020** | elsaco.dosutech.site |
| API | **4021** | api-elsaco.dosutech.site |

## Deploy nhanh

```bash
cd /home/elsaco
git pull origin main
bash scripts/deploy-vps.sh
```

## Database

```
postgresql://postgres:test1234@localhost:5432/elsaco
```

## Nginx + SSL

```bash
# 1. HTTP proxy
sudo cp deploy/nginx/elsaco.dosutech.site.conf /etc/nginx/sites-available/
sudo cp deploy/nginx/api-elsaco.dosutech.site.conf /etc/nginx/sites-available/
sudo ln -sf /etc/nginx/sites-available/elsaco.dosutech.site.conf /etc/nginx/sites-enabled/
sudo ln -sf /etc/nginx/sites-available/api-elsaco.dosutech.site.conf /etc/nginx/sites-enabled/
sudo nginx -t && sudo systemctl reload nginx

# 2. Xin cert (nginx plugin — không cần webroot)
sudo certbot certonly --nginx \
  -d elsaco.dosutech.site \
  -d api-elsaco.dosutech.site

# 3. Bật HTTPS
sudo cp deploy/nginx/elsaco.dosutech.site.conf.https /etc/nginx/sites-available/elsaco.dosutech.site.conf
sudo cp deploy/nginx/api-elsaco.dosutech.site.conf.https /etc/nginx/sites-available/api-elsaco.dosutech.site.conf
sudo nginx -t && sudo systemctl reload nginx
```

## Demo accounts

| Role | Email | Password |
|------|-------|----------|
| Admin | admin@elsaco.com | admin123 |
| User | user@elsaco.com | user123 |
