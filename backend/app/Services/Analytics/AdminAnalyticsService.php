<?php

namespace App\Services\Analytics;

use App\Enums\OrderStatus;
use App\Enums\ProductStatus;
use App\Enums\StoreStatus;
use App\Enums\UserRole;
use App\Models\Order;
use App\Models\OrderItem;
use App\Models\Product;
use App\Models\ProductVariant;
use App\Models\Store;
use App\Models\User;
use Illuminate\Support\Carbon;

class AdminAnalyticsService
{
    public function overview(): array
    {
        $countedStatuses = array_map(fn ($status) => $status->value, OrderStatus::countedForRevenue());
        $paidOrders = Order::whereIn('status', $countedStatuses);

        return [
            'total_sales' => round((float) (clone $paidOrders)->sum('total'), 2),
            'total_orders' => (clone $paidOrders)->count(),
            'total_customers' => User::where('role', UserRole::Customer)->count(),
            'total_sellers' => User::where('role', UserRole::Seller)->count(),
            'total_products' => Product::count(),
            'pending_seller_approvals' => Store::where('status', StoreStatus::Pending)->count(),
            'pending_product_approvals' => Product::where('status', ProductStatus::PendingReview)->count(),
            'low_stock_products' => ProductVariant::whereRaw('stock_quantity - reserved_quantity <= ?', [config('shop.low_stock_threshold')])->count(),
            'recent_orders' => Order::with('user')->latest()->limit(5)->get(),
            'recent_users' => User::latest()->limit(5)->get(),
            'revenue_chart' => $this->revenueChart($countedStatuses),
            'order_chart' => $this->orderChart($countedStatuses),
            'top_categories' => $this->topCategories($countedStatuses),
            'top_products' => $this->topProducts($countedStatuses),
        ];
    }

    private function revenueChart(array $countedStatuses): array
    {
        $since = Carbon::now()->subDays(29)->startOfDay();

        $rows = Order::whereIn('status', $countedStatuses)
            ->where('created_at', '>=', $since)
            ->selectRaw('DATE(created_at) as date')
            ->selectRaw('SUM(total) as revenue')
            ->groupBy('date')
            ->get()
            ->keyBy('date');

        $chart = [];

        for ($i = 0; $i < 30; $i++) {
            $date = $since->copy()->addDays($i)->toDateString();
            $chart[] = ['date' => $date, 'revenue' => round((float) ($rows[$date]->revenue ?? 0), 2)];
        }

        return $chart;
    }

    private function orderChart(array $countedStatuses): array
    {
        $since = Carbon::now()->subDays(29)->startOfDay();

        $rows = Order::whereIn('status', $countedStatuses)
            ->where('created_at', '>=', $since)
            ->selectRaw('DATE(created_at) as date')
            ->selectRaw('COUNT(*) as orders')
            ->groupBy('date')
            ->get()
            ->keyBy('date');

        $chart = [];

        for ($i = 0; $i < 30; $i++) {
            $date = $since->copy()->addDays($i)->toDateString();
            $chart[] = ['date' => $date, 'orders' => (int) ($rows[$date]->orders ?? 0)];
        }

        return $chart;
    }

    private function topCategories(array $countedStatuses): array
    {
        return OrderItem::query()
            ->join('product_variants', 'product_variants.id', '=', 'order_items.product_variant_id')
            ->join('products', 'products.id', '=', 'product_variants.product_id')
            ->join('categories', 'categories.id', '=', 'products.category_id')
            ->whereHas('order', fn ($q) => $q->whereIn('status', $countedStatuses))
            ->select('categories.name')
            ->selectRaw('SUM(order_items.total) as revenue')
            ->groupBy('categories.name')
            ->orderByDesc('revenue')
            ->limit(5)
            ->get()
            ->toArray();
    }

    private function topProducts(array $countedStatuses): array
    {
        return OrderItem::query()
            ->whereHas('order', fn ($q) => $q->whereIn('status', $countedStatuses))
            ->select('product_name')
            ->selectRaw('SUM(quantity) as units_sold')
            ->selectRaw('SUM(total) as revenue')
            ->groupBy('product_name')
            ->orderByDesc('revenue')
            ->limit(5)
            ->get()
            ->toArray();
    }
}
