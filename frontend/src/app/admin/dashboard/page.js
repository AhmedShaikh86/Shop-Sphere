"use client";

import Link from "next/link";
import { DollarSign, ShoppingBag, Users, Store, Package, AlertTriangle } from "lucide-react";
import { useAdminDashboard } from "@/hooks/useAdmin";
import { StatCard } from "@/components/dashboard/StatCard";
import { RevenueChart } from "@/components/dashboard/RevenueChart";
import { Spinner } from "@/components/ui/Spinner";
import { Badge } from "@/components/ui/Badge";
import { formatCurrency, formatDate } from "@/utils/format";

export default function AdminDashboardPage() {
  const { data, isLoading } = useAdminDashboard();

  if (isLoading) return <Spinner />;
  if (!data) return null;

  return (
    <div className="flex flex-col gap-8">
      <h1 className="font-serif text-2xl text-foreground">Overview</h1>

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-3 xl:grid-cols-6">
        <StatCard label="Total Sales" value={formatCurrency(data.total_sales)} icon={DollarSign} />
        <StatCard label="Orders" value={data.total_orders} icon={ShoppingBag} />
        <StatCard label="Customers" value={data.total_customers} icon={Users} />
        <StatCard label="Sellers" value={data.total_sellers} icon={Store} />
        <StatCard label="Products" value={data.total_products} icon={Package} />
        <StatCard label="Low Stock" value={data.low_stock_products} icon={AlertTriangle} />
      </div>

      {(data.pending_seller_approvals > 0 || data.pending_product_approvals > 0) && (
        <div className="flex flex-wrap gap-4 border border-accent/30 bg-accent/5 p-4 text-sm">
          {data.pending_seller_approvals > 0 && (
            <Link href="/admin/sellers?status=pending" className="text-foreground underline">
              {data.pending_seller_approvals} seller{data.pending_seller_approvals > 1 ? "s" : ""} awaiting approval
            </Link>
          )}
          {data.pending_product_approvals > 0 && (
            <Link href="/admin/products?status=pending_review" className="text-foreground underline">
              {data.pending_product_approvals} product{data.pending_product_approvals > 1 ? "s" : ""} awaiting review
            </Link>
          )}
        </div>
      )}

      <div className="grid gap-8 lg:grid-cols-2">
        <section>
          <h2 className="mb-4 font-serif text-lg text-foreground">Revenue (30 Days)</h2>
          <RevenueChart data={data.revenue_chart} dataKey="revenue" />
        </section>
        <section>
          <h2 className="mb-4 font-serif text-lg text-foreground">Orders (30 Days)</h2>
          <RevenueChart data={data.order_chart} dataKey="orders" valueFormatter={(v) => v} />
        </section>
      </div>

      <div className="grid gap-8 lg:grid-cols-2">
        <section>
          <h2 className="mb-4 font-serif text-lg text-foreground">Top Categories</h2>
          {data.top_categories.length === 0 ? (
            <p className="text-sm text-muted">No sales yet.</p>
          ) : (
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-border text-muted">
                  <th className="py-2">Category</th>
                  <th className="py-2 text-right">Revenue</th>
                </tr>
              </thead>
              <tbody>
                {data.top_categories.map((row) => (
                  <tr key={row.name} className="border-b border-border/60">
                    <td className="py-2 text-foreground">{row.name}</td>
                    <td className="py-2 text-right text-foreground">{formatCurrency(row.revenue)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </section>

        <section>
          <h2 className="mb-4 font-serif text-lg text-foreground">Top Products</h2>
          {data.top_products.length === 0 ? (
            <p className="text-sm text-muted">No sales yet.</p>
          ) : (
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-border text-muted">
                  <th className="py-2">Product</th>
                  <th className="py-2 text-right">Revenue</th>
                </tr>
              </thead>
              <tbody>
                {data.top_products.map((row) => (
                  <tr key={row.product_name} className="border-b border-border/60">
                    <td className="py-2 text-foreground">{row.product_name}</td>
                    <td className="py-2 text-right text-foreground">{formatCurrency(row.revenue)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </section>
      </div>

      <div className="grid gap-8 lg:grid-cols-2">
        <section>
          <h2 className="mb-4 font-serif text-lg text-foreground">Recent Orders</h2>
          <ul className="flex flex-col gap-2">
            {data.recent_orders.map((order) => (
              <li key={order.id} className="flex items-center justify-between border border-border p-3 text-sm">
                <div>
                  <p className="text-foreground">{order.order_number}</p>
                  <p className="text-muted">{order.user?.name}</p>
                </div>
                <Badge variant="outline">{formatCurrency(order.total)}</Badge>
              </li>
            ))}
          </ul>
        </section>

        <section>
          <h2 className="mb-4 font-serif text-lg text-foreground">Recent Users</h2>
          <ul className="flex flex-col gap-2">
            {data.recent_users.map((user) => (
              <li key={user.id} className="flex items-center justify-between border border-border p-3 text-sm">
                <div>
                  <p className="text-foreground">{user.name}</p>
                  <p className="text-muted">{user.email}</p>
                </div>
                <span className="text-muted">{formatDate(user.created_at)}</span>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </div>
  );
}
