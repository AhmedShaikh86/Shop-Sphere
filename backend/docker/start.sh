#!/bin/sh
# Container entrypoint: prepare caches, run migrations, seed an empty database, then serve.
set -e

php artisan config:cache
php artisan route:cache
php artisan migrate --force
php artisan storage:link || true

# Hosts like Render's free tier have no shell, so fill the demo data on first boot.
if [ "$SEED_ON_EMPTY" = "true" ]; then
    users=$(php artisan tinker --execute='echo \App\Models\User::count();' | tail -n 1)
    if [ "$users" = "0" ]; then
        php artisan db:seed --force
    fi
fi

exec php artisan serve --host=0.0.0.0 --port="${PORT:-10000}"
