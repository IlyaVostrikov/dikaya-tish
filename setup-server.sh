#!/bin/bash
set -e

echo "============================================"
echo " Дикая Тишь — установка сайта"
echo "============================================"
echo ""

# ---------- 1. Node.js 22 ----------
echo "[1/7] Установка Node.js 22..."
if ! command -v node &>/dev/null; then
  curl -fsSL https://deb.nodesource.com/setup_22.x | bash -
  apt-get install -y nodejs
fi
echo "  Node.js $(node -v), npm $(npm -v)"

# ---------- 2. Nginx ----------
echo "[2/7] Установка Nginx..."
apt-get install -y nginx
systemctl enable nginx
systemctl start nginx

# ---------- 3. Клонирование репо ----------
echo "[3/7] Клонирование проекта..."
cd /opt
if [ -d dikaya-tish ]; then
  cd dikaya-tish
  git pull origin experimental-redesign
else
  git clone -b experimental-redesign https://github.com/IlyaVostrikov/dikaya-tish.git
  cd dikaya-tish
fi

# ---------- 4. .env ----------
echo "[4/7] Настройка .env..."
cat > .env << 'ENVEOF'
UNSPLASH_ACCESS_KEY=j0yWL0VpYbPfkuSeFlaTcRG-J3KnI7dN5TJ-99ZOiMk
DATABASE_URL="file:./dev.db"
TELEGRAM_BOT_TOKEN=8599298933:AAGENxiVd9vCJTK5KAYVTTSYqQpQ47ydpmE
TELEGRAM_CHAT_ID=595769528
ADMIN_EMAIL=ilyavostrikov90@gmail.com
ADMIN_TELEGRAM=@Ilyavostrikov90
ENVEOF

# ---------- 5. Зависимости + Prisma ----------
echo "[5/7] Установка зависимостей и сборка..."
npm ci
npx prisma generate
npx prisma migrate deploy
npm run build

# ---------- 6. PM2 ----------
echo "[6/7] Установка PM2 и запуск..."
npm install -g pm2
pm2 start npm --name dikaya-tish -- start
pm2 save
pm2 startup systemd -u root --hp /root
echo "  PM2 запущен. Статус:"
pm2 status

# ---------- 7. Nginx + SSL ----------
echo "[7/7] Настройка Nginx..."
cat > /etc/nginx/sites-available/dikaya-tish << 'NGINXEOF'
server {
    listen 80;
    server_name dikaya-tish.ru www.dikaya-tish.ru;

    location / {
        proxy_pass http://127.0.0.1:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
NGINXEOF

ln -sf /etc/nginx/sites-available/dikaya-tish /etc/nginx/sites-enabled/
rm -f /etc/nginx/sites-enabled/default
nginx -t && systemctl reload nginx

# ---------- SSL ----------
echo ""
echo "Установка SSL-сертификата..."
apt-get install -y certbot python3-certbot-nginx
certbot --nginx -d dikaya-tish.ru -d www.dikaya-tish.ru --non-interactive --agree-tos --email ilyavostrikov90@gmail.com || echo "SSL отложен — запусти вручную: certbot --nginx"

echo ""
echo "============================================"
echo " ГОТОВО!"
echo " Сайт: https://dikaya-tish.ru"
echo " PM2:  pm2 status"
echo " Логи: pm2 logs dikaya-tish"
echo "============================================"
