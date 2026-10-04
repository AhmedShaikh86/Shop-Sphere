"use client";

import { DollarSign, ShoppingBag, Package, TrendingUp } from "lucide-react";
import { useSellerDashboard } from "@/hooks/useSeller";
import { StatCard } from "@/components/dashboard/StatCard";
import { RevenueChart } from "@/components/dashboard/RevenueChart";
import { Spinner } from "@/components/ui/Spinner";
import { Badge } from "@/components/ui/Badge";
import { formatCurrency } from "@/utils/format";

export default function SellerDashboardPage() {
  const { data, isLoading } = useSellerDashboard();

  if (isLoading) return <Spinner />;
  if (!data) return null;

  return (
    <div className="flex flex-col gap-8">
      <h1 className="font-serif text-2xl text-foreground">Overview</h1>

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard label="Revenue" value={formatCurrency(data.revenue)} icon={DollarSign} />
        <StatCard label="Orders" value={data.orders} icon={ShoppingBag} />
        <StatCard label="Units Sold" value={data.units_sold} icon={Package} />
        <StatCard label="Avg. Order Value" value={formatCurrency(data.average_order_value)} icon={TrendingUp} />
      </div>

      <section>
        <h2 className="mb-4 font-serif text-lg text-foreground">Sales Trend (30 Days)</h2>
        <RevenueChart data={data.sales_trend} />
      </section>

      <div className="grid gap-8 lg:grid-cols-2">
        <section>
          <h2 className="mb-4 font-serif text-lg text-foreground">Top Products</h2>
          {data.top_products.length === 0 ? (
            <p className="text-sm text-muted">No sales yet.</p>
          ) : (
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-border text-muted">
                  <th className="py-2">Product</th>
                  <th className="py-2 text-right">Units</th>
                  <th className="py-2 text-right">Revenue</th>
                </tr>
              </thead>
              <tbody>
                {data.top_products.map((product) => (
                  <tr key={product.product_name} className="border-b border-border/60">
                    <td className="py-2 text-foreground">{product.product_name}</td>
                    <td className="py-2 text-right text-foreground">{product.units_sold}</td>
                    <td className="py-2 text-right text-foreground">{formatCurrency(product.revenue)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </section>

        <section>
          <h2 className="mb-4 font-serif text-lg text-foreground">Low Stock</h2>
          {data.low_stock_variants.length === 0 ? (
            <p className="text-sm text-muted">Nothing is running low right now.</p>
          ) : (
            <ul className="flex flex-col gap-2">
              {data.low_stock_variants.map((variant) => (
                <li key={variant.sku} className="flex items-center justify-between border border-border p-3 text-sm">
                  <div>
                    <p className="text-foreground">{variant.product_name}</p>
                    <p className="text-muted">{variant.sku}</p>
                  </div>
                  <Badge variant="danger">{variant.available_quantity} left</Badge>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </div>
  );
}
