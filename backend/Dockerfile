# Production image for hosting the ShopSphere API (e.g. on Render or Hugging Face Spaces).
# Works with PostgreSQL or a SQLite file inside the container; see docker/start.sh for the boot steps.
# Folders are world-writable because some hosts run the container as an arbitrary user.
FROM php:8.4-cli

RUN apt-get update \
    && apt-get install -y --no-install-recommends git unzip libpq-dev libzip-dev libicu-dev \
    && docker-php-ext-install pdo_pgsql zip intl bcmath \
    && rm -rf /var/lib/apt/lists/*

COPY --from=composer:2 /usr/bin/composer /usr/bin/composer

WORKDIR /app

# Install dependencies first so this layer is cached between code changes.
COPY composer.json composer.lock ./
RUN composer install --no-dev --no-scripts --no-autoloader --prefer-dist --no-interaction

COPY . .
RUN composer dump-autoload --optimize --no-dev \
    && php artisan package:discover --ansi \
    && chmod +x docker/start.sh \
    && chmod -R a+rwX storage bootstrap/cache database public

ENV APP_ENV=production \
    APP_DEBUG=false \
    LOG_CHANNEL=stderr \
    PHP_CLI_SERVER_WORKERS=4

EXPOSE 10000

CMD ["docker/start.sh"]
