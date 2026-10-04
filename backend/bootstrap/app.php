<?php

use App\Exceptions\EmptyCartException;
use App\Exceptions\InsufficientStockException;
use App\Exceptions\InvalidCouponException;
use App\Exceptions\InvalidOrderTransitionException;
use App\Exceptions\PaymentFailedException;
use App\Http\Middleware\EnsureUserHasRole;
use Illuminate\Auth\Access\AuthorizationException;
use Illuminate\Auth\AuthenticationException;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;
use Illuminate\Http\Request;
use Illuminate\Validation\ValidationException;
use Symfony\Component\HttpKernel\Exception\HttpException;

return Application::configure(basePath: dirname(__DIR__))
    ->withRouting(
        web: __DIR__.'/../routes/web.php',
        api: __DIR__.'/../routes/api.php',
        commands: __DIR__.'/../routes/console.php',
        health: '/up',
    )
    ->withMiddleware(function (Middleware $middleware): void {
        $middleware->alias([
            'role' => EnsureUserHasRole::class,
        ]);

        // Rate limit every /api/* request; the "api" limiter is defined in AppServiceProvider.
        $middleware->throttleApi();
    })
    ->withExceptions(function (Exceptions $exceptions): void {
        $exceptions->shouldRenderJsonWhen(
            fn (Request $request) => $request->is('api/*') || $request->expectsJson(),
        );

        $exceptions->render(function (ValidationException $e, Request $request) {
            if ($request->is('api/*') || $request->expectsJson()) {
                return response()->json([
                    'success' => false,
                    'message' => 'The given data was invalid.',
                    'errors' => $e->errors(),
                ], 422);
            }
        });

        $exceptions->render(function (AuthenticationException $e, Request $request) {
            if ($request->is('api/*') || $request->expectsJson()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Unauthenticated.',
                ], 401);
            }
        });

        $exceptions->render(function (AuthorizationException $e, Request $request) {
            if ($request->is('api/*') || $request->expectsJson()) {
                return response()->json([
                    'success' => false,
                    'message' => $e->getMessage() ?: 'This action is unauthorized.',
                ], 403);
            }
        });

        // Catches everything else that carries an HTTP status code: plain
        // abort($code, $message) calls (used all over the controllers for
        // simple ownership/state checks) and ModelNotFoundException, which
        // Laravel converts into a 404 NotFoundHttpException — a subclass of
        // this — before any render() callback runs. Without this, any of
        // those would fall through to Laravel's default renderer and leak a
        // full debug stack trace instead of the API's usual JSON envelope.
        $exceptions->render(function (HttpException $e, Request $request) {
            if (! $request->is('api/*') && ! $request->expectsJson()) {
                return null;
            }

            // A bare ModelNotFoundException ("No query results for model
            // [App\Models\Product] 123") is an implementation detail, not
            // something an API consumer should see — use the same generic
            // message any other missing route/record gets instead.
            $message = $e->getPrevious() instanceof ModelNotFoundException
                ? 'The requested resource was not found.'
                : ($e->getMessage() ?: 'The requested resource was not found.');

            return response()->json(['success' => false, 'message' => $message], $e->getStatusCode());
        });

        $exceptions->render(function (InsufficientStockException $e, Request $request) {
            return response()->json(['success' => false, 'message' => $e->getMessage()], 422);
        });

        $exceptions->render(function (InvalidCouponException $e, Request $request) {
            return response()->json(['success' => false, 'message' => $e->getMessage()], 422);
        });

        $exceptions->render(function (PaymentFailedException $e, Request $request) {
            return response()->json(['success' => false, 'message' => $e->getMessage()], 402);
        });

        $exceptions->render(function (EmptyCartException $e, Request $request) {
            return response()->json(['success' => false, 'message' => $e->getMessage()], 422);
        });

        $exceptions->render(function (InvalidOrderTransitionException $e, Request $request) {
            return response()->json(['success' => false, 'message' => $e->getMessage()], 422);
        });
    })->create();
