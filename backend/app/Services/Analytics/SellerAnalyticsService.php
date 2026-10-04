<?php

namespace App\Services\Analytics;

use App\Enums\OrderStatus;
use App\Models\OrderItem;
use App\Models\Store;
use Illuminate\Support\Carbon;

/**
 * Every query here is scoped to one store, which is what keeps a seller
 * from ever seeing another seller's revenue or orders.
 */
class SellerAnalyticsService
{
    public function overview(Store $store): array
    {
        $countedStatuses = array_map(fn ($status) => $status->value, OrderStatus::countedForRevenue());

        $soldItems = OrderItem::query()
            ->where('store_id', $store->id)
            ->whereHas('order', fn ($q) => $q->whereIn('status', $countedStatuses));

        $revenue = (clone $soldItems)->sum('total');
        $unitsSold = (clone $soldItems)->sum('quantity');
        $orderCount = (clone $soldItems)->distinct('order_id')->count('order_id');

        return [
            'revenue' => round((float) $revenue, 2),
            'orders' => $orderCount,
            'units_sold' => (int) $unitsSold,
            'average_order_value' => $orderCount > 0 ? round($revenue / $orderCount, 2) : 0,
            'top_products' => $this->topProducts($store, $countedStatuses),
            'low_stock_variants' => $this->lowStockVariants($store),
            'sales_trend' => $this->salesTrend($store, $countedStatuses),
        ];
    }

    private function topProducts(Store $store, array $countedStatuses): array
    {
        return OrderItem::query()
            ->where('order_items.store_id', $store->id)
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

    private function lowStockVariants(Store $store): array
    {
        $threshold = (int) config('shop.low_stock_threshold');

        return $store->products()
            ->with(['variants' => fn ($q) => $q->whereRaw('stock_quantity - reserved_quantity <= ?', [$threshold])])
            ->get()
            ->flatMap(fn ($product) => $product->variants->map(fn ($variant) => [
                'product_name' => $product->name,
                'sku' => $variant->sku,
                'available_quantity' => $variant->available_quantity,
            ]))
            ->values()
            ->toArray();
    }

    private function salesTrend(Store $store, array $countedStatuses): array
    {
        $since = Carbon::now()->subDays(29)->startOfDay();

        $rows = OrderItem::query()
            ->where('order_items.store_id', $store->id)
            ->whereHas('order', fn ($q) => $q->whereIn('status', $countedStatuses)->where('created_at', '>=', $since))
            ->join('orders', 'orders.id', '=', 'order_items.order_id')
            ->selectRaw('DATE(orders.created_at) as date')
            ->selectRaw('SUM(order_items.total) as revenue')
            ->groupBy('date')
            ->orderBy('date')
            ->get()
            ->keyBy('date');

        $trend = [];

        for ($i = 0; $i < 30; $i++) {
            $date = $since->copy()->addDays($i)->toDateString();
            $trend[] = ['date' => $date, 'revenue' => round((float) ($rows[$date]->revenue ?? 0), 2)];
        }

        return $trend;
    }
}
