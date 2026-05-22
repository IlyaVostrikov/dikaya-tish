# Деплой Дикой Тиши на Coolify + FirstVDS

## 1. Покупка VPS

1. Идёшь на [firstvds.ru](https://firstvds.ru)
2. Тариф: **Старт** (или **VDS Младший** — 2 vCPU, 2 GB RAM, 30 GB NVMe)
3. OS: **Ubuntu 24.04 LTS**
4. Панель управления: ISPmanager (можно не ставить, экономит память)
5. Дата-центр: Москва (любая площадка)
6. Оплата: карты РФ, СБП, SberPay
7. Цена: **~219-350₽/мес**

После оплаты IP-адрес сервера и пароль root придут на почту.

## 2. DNS

У регистратора домена `dikaya-tish.ru` добавь A-запись:

```
dikaya-tish.ru  →  <IP-сервера>  TTL: 300
```

DNS обновится от 5 минут до пары часов. Проверить: `ping dikaya-tish.ru` (должен резолвиться в IP сервера).

## 3. Установка Coolify

SSH на сервер:

```bash
ssh root@<IP-сервера>
```

Установка одной командой:

```bash
curl -fsSL https://cdn.coollabs.io/coolify/install.sh | bash
```

Жди ~5 минут. В конце появится:

```
Coolify is installed!
Open: http://<IP>:8000
```

Открой этот URL в браузере. Пройди setup wizard:
- Создай аккаунт (email + пароль)
- Придумай имя сервера (любое)

## 4. Подключение сервера в Coolify

Coolify сам найдёт localhost как сервер. Проверь что зелёная галочка.

Если не нашёл автоматически: Servers → Add → Localhost.

## 5. Добавление проекта

1. Projects → New Project → «Дикая Тишь»
2. Внутри проекта: New Resource → **Application**
3. Source: **GitHub** (подключи через GitHub App для приватных репо, или Public Repository если открытый)
4. Repository: выбери `dikaya-tish`
5. Branch: `main`
6. Build Pack: **Dockerfile** (не Nixpacks)

## 6. Переменные окружения

В настройках приложения → Environment Variables:

| Key | Value |
|---|---|
| `UNSPLASH_ACCESS_KEY` | `j0yWL0VpYbPfkuSeFlaTcRG-J3KnI7dN5TJ-99ZOiMk` |
| `DATABASE_URL` | `file:/app/prisma/dev.db` |
| `TELEGRAM_BOT_TOKEN` | `8599298933:AAGENxiVd9vCJTK5KAYVTTSYqQpQ47ydpmE` |
| `TELEGRAM_CHAT_ID` | `595769528` |
| `ADMIN_EMAIL` | `ilyavostrikov90@gmail.com` |
| `ADMIN_TELEGRAM` | `@Ilyavostrikov90` |

Важно: `DATABASE_URL` должен быть **абсолютным путём** (`file:/app/prisma/dev.db`), не относительным.

## 7. Persistent Storage (SQLite)

В настройках приложения → Storages → New Persistent Storage:

- **Host Path**: `/data/dikaya-tish`
- **Container Path**: `/app/prisma`

Это гарантирует что БД не пропадёт при перезапуске контейнера.

## 8. Домен и SSL

В настройках приложения → Domains:

- Domain: `dikaya-tish.ru`
- Port: `3000`

SSL включается автоматически (Coolify → Let's Encrypt). Через пару минут после деплоя сайт будет на `https://dikaya-tish.ru`.

## 9. Health Check

В настройках приложения → Health Check:

- Path: `/api/health`
- Port: `3000`

## 10. Деплой

Жми **Deploy**. Coolify соберёт Docker-образ и запустит контейнер. Логи видны в реальном времени.

Первый деплой: `prisma migrate deploy` создаст `dev.db`. Последующие деплои будут автоматическими при `git push`.

## 11. Проверка

- Открой `https://dikaya-tish.ru`
- Проверь health: `curl https://dikaya-tish.ru/api/health` → `{"status":"ok",...}`
- Сделай тестовый заказ → должно прийти уведомление в Telegram
- `git push` → авто-деплой запускается сам

## 12. Обновление сайта

Просто `git push` в main. Coolify подхватит сам, пересоберёт контейнер, применит миграции и перезапустит.

Ничего на сервер руками заходить не нужно.

---

## Если что-то пошло не так

| Проблема | Решение |
|---|---|
| 502 Bad Gateway | Контейнер ещё стартует, подожди 30 сек. Или проверь health check логи в Coolify |
| Prisma migrate error | Проверь что `DATABASE_URL=file:/app/prisma/dev.db` (абсолютный путь) |
| Container crash loop | Смотри логи в Coolify UI → Deployments → последний билд |
| Нет SSL | Подожди 5 мин после добавления домена, Let's Encrypt не мгновенный |
| DNS не резолвится | `nslookup dikaya-tish.ru` — проверь что A-запись указывает на IP сервера |
| Prisma query engine not found | Пересобери с флагом Build Pack = Dockerfile (не Nixpacks) |
