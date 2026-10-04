<?php

namespace App\Http\Middleware;

use App\Enums\UserRole;
use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class EnsureUserHasRole
{
    /**
     * Reject the request unless the authenticated user has one of the given roles.
     * Authorization must live here (or in Policies), never only in frontend UI.
     */
    public function handle(Request $request, Closure $next, string ...$roles): Response
    {
        $user = $request->user();

        if (! $user || ! in_array($user->role, array_map(fn (string $role) => UserRole::from($role), $roles), true)) {
            return response()->json([
                'success' => false,
                'message' => 'You are not authorized to perform this action.',
            ], Response::HTTP_FORBIDDEN);
        }

        return $next($request);
    }
}
