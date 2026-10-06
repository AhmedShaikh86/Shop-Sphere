<?php

/**
 * Serverless entry point for hosting the API on Vercel (vercel-php runtime).
 *
 * Vercel's filesystem is read-only except /tmp, so caches and compiled views go there,
 * and stateful drivers use in-memory or database stores. Values set in the Vercel
 * dashboard take precedence over these defaults.
 */
$defaults = [
    'APP_ENV' => 'production',
    'APP_DEBUG' => 'false',
    'APP_CONFIG_CACHE' => '/tmp/config.php',
    'APP_EVENTS_CACHE' => '/tmp/events.php',
    'APP_PACKAGES_CACHE' => '/tmp/packages.php',
    'APP_ROUTES_CACHE' => '/tmp/routes.php',
    'APP_SERVICES_CACHE' => '/tmp/services.php',
    'VIEW_COMPILED_PATH' => '/tmp/views',
    'CACHE_STORE' => 'array',
    'SESSION_DRIVER' => 'array',
    'QUEUE_CONNECTION' => 'sync',
    'LOG_CHANNEL' => 'stderr',
];

foreach ($defaults as $key => $value) {
    if (getenv($key) === false) {
        putenv("{$key}={$value}");
        $_ENV[$key] = $_SERVER[$key] = $value;
    }
}

if (! is_dir('/tmp/views')) {
    mkdir('/tmp/views', 0755, true);
}

// Requests arrive at /api/index.php; without this Laravel treats "/api" as the base path
// and strips it from every URL, so /api/v1/... routes would 404.
$_SERVER['SCRIPT_NAME'] = $_SERVER['PHP_SELF'] = '/index.php';
$_SERVER['SCRIPT_FILENAME'] = __DIR__.'/../public/index.php';

// Same bootstrap as public/index.php. That file is left out of the Vercel upload
// (see .vercelignore) because Vercel serves public/ as static files and would show its source.
define('LARAVEL_START', microtime(true));

require __DIR__.'/../vendor/autoload.php';

$app = require_once __DIR__.'/../bootstrap/app.php';

$app->handleRequest(Illuminate\Http\Request::capture());
