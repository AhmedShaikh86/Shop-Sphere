"use client";

import Link from "next/link";
import { useAuth } from "@/hooks/useAuth";
import { useOrders } from "@/hooks/useCheckout";
import { formatCurrency, formatDate, formatStatusLabel } from "@/utils/format";
import { Badge } from "@/components/ui/Badge";

export default function AccountOverviewPage() {
  const { user } = useAuth();
  const { data } = useOrders(1);

  return (
    <div className="flex flex-col gap-8">
      <section className="border border-border p-6">
        <p className="text-xs uppercase tracking-wide text-muted">Account Details</p>
        <p className="mt-2 text-sm text-foreground">{user?.name}</p>
        <p className="text-sm text-muted">{user?.email}</p>
      </section>

      <section>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="font-serif text-lg text-foreground">Recent Orders</h2>
          <Link href="/account/orders" className="focus-ring text-xs uppercase tracking-wide text-muted underline">
            View All
          </Link>
        </div>

        {data?.items.length === 0 && <p className="text-sm text-muted">You haven&apos;t placed any orders yet.</p>}

        <div className="flex flex-col gap-3">
          {data?.items.slice(0, 3).map((order) => (
            <Link
              key={order.id}
              href={`/account/orders/${order.id}`}
              className="focus-ring flex items-center justify-between border border-border p-4 text-sm hover:border-foreground"
            >
              <div>
                <p className="text-foreground">{order.order_number}</p>
                <p className="text-muted">{formatDate(order.created_at)}</p>
              </div>
              <div className="flex items-center gap-3">
                <Badge variant="outline">{formatStatusLabel(order.status)}</Badge>
                <span className="text-foreground">{formatCurrency(order.total)}</span>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
