<?php

use App\Http\Controllers\Api\V1\AddressController;
use App\Http\Controllers\Api\V1\Admin\ActivityLogController;
use App\Http\Controllers\Api\V1\Admin\BrandController as AdminBrandController;
use App\Http\Controllers\Api\V1\Admin\CategoryController as AdminCategoryController;
use App\Http\Controllers\Api\V1\Admin\CollectionController as AdminCollectionController;
use App\Http\Controllers\Api\V1\Admin\CouponController as AdminCouponController;
use App\Http\Controllers\Api\V1\Admin\DashboardController as AdminDashboardController;
use App\Http\Controllers\Api\V1\Admin\OrderController as AdminOrderController;
use App\Http\Controllers\Api\V1\Admin\ProductController as AdminProductController;
use App\Http\Controllers\Api\V1\Admin\ReviewController as AdminReviewController;
use App\Http\Controllers\Api\V1\Admin\SellerController;
use App\Http\Controllers\Api\V1\Admin\UserController as AdminUserController;
use App\Http\Controllers\Api\V1\Auth\AuthController;
use App\Http\Controllers\Api\V1\BrandController;
use App\Http\Controllers\Api\V1\CartController;
use App\Http\Controllers\Api\V1\CategoryController;
use App\Http\Controllers\Api\V1\CheckoutController;
use App\Http\Controllers\Api\V1\CollectionController;
use App\Http\Controllers\Api\V1\ImageUploadController;
use App\Http\Controllers\Api\V1\NotificationController;
use App\Http\Controllers\Api\V1\OrderController;
use App\Http\Controllers\Api\V1\ProductController;
use App\Http\Controllers\Api\V1\ProfileController;
use App\Http\Controllers\Api\V1\ReviewController;
use App\Http\Controllers\Api\V1\SearchController;
use App\Http\Controllers\Api\V1\Seller\CouponController as SellerCouponController;
use App\Http\Controllers\Api\V1\Seller\CustomerController;
use App\Http\Controllers\Api\V1\Seller\DashboardController as SellerDashboardController;
use App\Http\Controllers\Api\V1\Seller\OrderController as SellerOrderController;
use App\Http\Controllers\Api\V1\Seller\ProductController as SellerProductController;
use App\Http\Controllers\Api\V1\Seller\ReviewController as SellerReviewController;
use App\Http\Controllers\Api\V1\Seller\StoreController;
use App\Http\Controllers\Api\V1\SiteImageController;
use App\Http\Controllers\Api\V1\Webhooks\StripeWebhookController;
use App\Http\Controllers\Api\V1\WishlistController;
use Illuminate\Support\Facades\Route;

Route::prefix('v1')->group(function () {

    // ---- Public ----
    Route::middleware('throttle:auth')->group(function () {
        Route::post('auth/register', [AuthController::class, 'register']);
        Route::post('auth/login', [AuthController::class, 'login']);
        Route::post('auth/forgot-password', [AuthController::class, 'forgotPassword']);
        Route::post('auth/reset-password', [AuthController::class, 'resetPassword']);
    });

    // {model:slug} scopes route-model binding to this route only — the
    // frontend always looks these up by slug (for readable URLs), while
    // the admin CRUD routes below still bind by numeric id as normal.
    Route::get('categories', [CategoryController::class, 'index']);
    Route::get('categories/{category:slug}', [CategoryController::class, 'show']);
    Route::get('brands', [BrandController::class, 'index']);
    Route::get('brands/{brand:slug}', [BrandController::class, 'show']);
    Route::get('collections', [CollectionController::class, 'index']);
    Route::get('collections/{collection:slug}', [CollectionController::class, 'show']);

    Route::get('site-images', [SiteImageController::class, 'index']);

    Route::get('products', [ProductController::class, 'index']);
    Route::get('products/new-arrivals', [ProductController::class, 'newArrivals']);
    Route::get('products/best-sellers', [ProductController::class, 'bestSellers']);
    Route::get('products/on-sale', [ProductController::class, 'onSale']);
    Route::get('products/{slug}', [ProductController::class, 'show']);
    Route::get('products/{product}/reviews', [ReviewController::class, 'index']);

    Route::get('reviews/featured', [ReviewController::class, 'featured']);

    Route::get('search', [SearchController::class, 'index']);

    Route::post('webhooks/stripe', [StripeWebhookController::class, 'handle']);

    // ---- Authenticated (any role) ----
    Route::middleware('auth:sanctum')->group(function () {
        Route::post('auth/logout', [AuthController::class, 'logout']);
        Route::get('auth/me', [AuthController::class, 'me']);
        Route::post('auth/change-password', [AuthController::class, 'changePassword']);

        Route::get('profile', [ProfileController::class, 'show']);
        Route::put('profile', [ProfileController::class, 'update']);

        Route::apiResource('addresses', AddressController::class)->except(['show']);

        Route::get('wishlist', [WishlistController::class, 'index']);
        Route::post('wishlist', [WishlistController::class, 'store']);
        Route::delete('wishlist/{product}', [WishlistController::class, 'destroy']);

        Route::get('cart', [CartController::class, 'index']);
        Route::post('cart', [CartController::class, 'store']);
        Route::put('cart/{cartItem}', [CartController::class, 'update']);
        Route::delete('cart/{cartItem}', [CartController::class, 'destroy']);

        Route::post('checkout', [CheckoutController::class, 'placeOrder']);
        Route::post('checkout/validate-coupon', [CheckoutController::class, 'validateCoupon']);

        Route::get('orders', [OrderController::class, 'index']);
        Route::get('orders/{order}', [OrderController::class, 'show']);
        Route::post('orders/{order}/cancel', [OrderController::class, 'cancel']);
        Route::post('orders/{order}/return-request', [OrderController::class, 'requestReturn']);

        Route::post('products/{product}/reviews', [ReviewController::class, 'store']);
        Route::delete('reviews/{review}', [ReviewController::class, 'destroy']);

        Route::post('uploads/image', [ImageUploadController::class, 'store']);

        Route::get('notifications', [NotificationController::class, 'index']);
        Route::post('notifications/{notification}/read', [NotificationController::class, 'markAsRead']);
        Route::post('notifications/read-all', [NotificationController::class, 'markAllAsRead']);

        // ---- Seller only ----
        Route::middleware('role:seller')->prefix('seller')->group(function () {
            Route::get('dashboard', [SellerDashboardController::class, 'index']);

            Route::get('store', [StoreController::class, 'show']);
            Route::put('store', [StoreController::class, 'update']);

            Route::get('products', [SellerProductController::class, 'index']);
            Route::post('products', [SellerProductController::class, 'store']);
            Route::get('products/{product}', [SellerProductController::class, 'show']);
            Route::put('products/{product}', [SellerProductController::class, 'update']);
            Route::post('products/{product}/submit-for-review', [SellerProductController::class, 'submitForReview']);
            Route::post('products/{product}/archive', [SellerProductController::class, 'archive']);

            Route::get('orders', [SellerOrderController::class, 'index']);
            Route::get('orders/{order}', [SellerOrderController::class, 'show']);
            Route::put('orders/{order}/status', [SellerOrderController::class, 'updateStatus']);

            Route::get('customers', [CustomerController::class, 'index']);
            Route::get('reviews', [SellerReviewController::class, 'index']);

            Route::apiResource('coupons', SellerCouponController::class)->except(['show']);
        });

        // ---- Admin only ----
        Route::middleware('role:admin')->prefix('admin')->group(function () {
            Route::get('dashboard', [AdminDashboardController::class, 'index']);

            Route::get('users', [AdminUserController::class, 'index']);
            Route::get('users/{user}', [AdminUserController::class, 'show']);

            Route::get('sellers', [SellerController::class, 'index']);
            Route::post('sellers/{store}/approve', [SellerController::class, 'approve']);
            Route::post('sellers/{store}/suspend', [SellerController::class, 'suspend']);

            Route::get('products', [AdminProductController::class, 'index']);
            Route::post('products/{product}/approve', [AdminProductController::class, 'approve']);
            Route::post('products/{product}/reject', [AdminProductController::class, 'reject']);

            Route::apiResource('categories', AdminCategoryController::class)->except(['show']);
            Route::apiResource('brands', AdminBrandController::class)->except(['show']);
            Route::apiResource('collections', AdminCollectionController::class)->except(['show']);
            Route::apiResource('coupons', AdminCouponController::class)->except(['show']);

            Route::get('orders', [AdminOrderController::class, 'index']);
            Route::get('orders/{order}', [AdminOrderController::class, 'show']);
            Route::put('orders/{order}/status', [AdminOrderController::class, 'updateStatus']);

            Route::get('reviews', [AdminReviewController::class, 'index']);
            Route::delete('reviews/{review}', [AdminReviewController::class, 'destroy']);

            Route::get('activity-logs', [ActivityLogController::class, 'index']);
        });
    });
});
