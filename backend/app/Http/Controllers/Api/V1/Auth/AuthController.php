<?php

namespace App\Http\Controllers\Api\V1\Auth;

use App\Enums\StoreStatus;
use App\Enums\UserRole;
use App\Http\Controllers\Controller;
use App\Http\Requests\Auth\ChangePasswordRequest;
use App\Http\Requests\Auth\ForgotPasswordRequest;
use App\Http\Requests\Auth\LoginRequest;
use App\Http\Requests\Auth\RegisterRequest;
use App\Http\Requests\Auth\ResetPasswordRequest;
use App\Http\Resources\UserResource;
use App\Http\Responses\ApiResponse;
use App\Models\Cart;
use App\Models\Store;
use App\Models\User;
use App\Models\Wishlist;
use Illuminate\Auth\Events\Registered;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Password;
use Illuminate\Support\Str;

class AuthController extends Controller
{
    public function register(RegisterRequest $request): JsonResponse
    {
        $data = $request->validated();

        // One user "signing up" is really several inserts (user, cart,
        // wishlist, maybe a store) — a transaction keeps a failure partway
        // through from leaving a user row with no cart/wishlist behind it.
        $user = DB::transaction(function () use ($data) {
            $user = User::create([
                'name' => $data['name'],
                'email' => $data['email'],
                'password' => $data['password'],
                'role' => $data['role'] ?? UserRole::Customer->value,
            ]);

            // Every customer gets an empty cart and wishlist ready to use immediately.
            Cart::create(['user_id' => $user->id]);
            Wishlist::create(['user_id' => $user->id]);

            // A seller also gets a store shell, pending admin approval before it can publish products.
            if ($user->role === UserRole::Seller) {
                Store::create([
                    'user_id' => $user->id,
                    'name' => "{$user->name}'s Store",
                    'slug' => Str::slug($user->name).'-'.Str::lower(Str::random(6)),
                    'status' => StoreStatus::Pending->value,
                ]);
            }

            return $user;
        });

        // Fired after commit: if QUEUE_CONNECTION=sync, the welcome email
        // send happens inline, and a mail failure must never undo a
        // successful registration.
        event(new Registered($user));

        $token = $user->createToken('shopsphere')->plainTextToken;

        return ApiResponse::success([
            'user' => new UserResource($user),
            'token' => $token,
        ], 'Account created successfully.', 201);
    }

    public function login(LoginRequest $request): JsonResponse
    {
        $data = $request->validated();

        $user = User::where('email', $data['email'])->first();

        if (! $user || ! Hash::check($data['password'], $user->password)) {
            return ApiResponse::error('These credentials do not match our records.', 401);
        }

        $token = $user->createToken('shopsphere')->plainTextToken;

        return ApiResponse::success([
            'user' => new UserResource($user),
            'token' => $token,
        ], 'Logged in successfully.');
    }

    public function logout(Request $request): JsonResponse
    {
        $request->user()->currentAccessToken()->delete();

        return ApiResponse::success(null, 'Logged out successfully.');
    }

    public function me(Request $request): JsonResponse
    {
        return ApiResponse::success(new UserResource($request->user()));
    }

    public function forgotPassword(ForgotPasswordRequest $request): JsonResponse
    {
        $status = Password::sendResetLink($request->only('email'));

        if ($status !== Password::RESET_LINK_SENT) {
            return ApiResponse::error('Unable to send the password reset link.', 422);
        }

        return ApiResponse::success(null, 'Password reset link sent to your email.');
    }

    public function resetPassword(ResetPasswordRequest $request): JsonResponse
    {
        $status = Password::reset(
            $request->only('email', 'password', 'password_confirmation', 'token'),
            function (User $user, string $password) {
                $user->forceFill(['password' => Hash::make($password)])->save();
            }
        );

        if ($status !== Password::PASSWORD_RESET) {
            return ApiResponse::error('This password reset token is invalid or has expired.', 422);
        }

        return ApiResponse::success(null, 'Password reset successfully.');
    }

    public function changePassword(ChangePasswordRequest $request): JsonResponse
    {
        $request->user()->forceFill([
            'password' => Hash::make($request->validated('password')),
        ])->save();

        return ApiResponse::success(null, 'Password changed successfully.');
    }
}
