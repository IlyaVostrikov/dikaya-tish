#!/bin/sh
set -e

DB_PATH="${DATABASE_URL#file:}"
DB_DIR="$(dirname "$DB_PATH")"
mkdir -p "$DB_DIR" 2>/dev/null || true

npx prisma migrate deploy

exec node server.js
