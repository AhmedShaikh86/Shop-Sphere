"use client";

import { useState } from "react";
import Link from "next/link";
import { Package } from "lucide-react";
import { useOrders } from "@/hooks/useCheckout";
import { Badge } from "@/components/ui/Badge";
import { EmptyState } from "@/components/ui/EmptyState";
import { Pagination } from "@/components/ui/Pagination";
import { Spinner } from "@/components/ui/Spinner";
import { formatCurrency, formatDate, formatStatusLabel } from "@/utils/format";

export default function OrdersPage() {
  const [page, setPage] = useState(1);
  const { data, isLoading } = useOrders(page);

  if (isLoading) return <Spinner />;

  if (data?.items.length === 0) {
    return (
      <EmptyState
        icon={Package}
        title="No orders yet"
        description="When you place an order, it will show up here."
        actionLabel="Start Shopping"
        actionHref="/shop"
      />
    );
  }

  return (
    <div>
      <h2 className="mb-6 font-serif text-lg text-foreground">Order History</h2>
      <div className="flex flex-col gap-3">
        {data?.items.map((order) => (
          <Link
            key={order.id}
            href={`/account/orders/${order.id}`}
            className="focus-ring flex flex-col gap-2 border border-border p-4 text-sm hover:border-foreground sm:flex-row sm:items-center sm:justify-between"
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
      <Pagination currentPage={data.meta.current_page} lastPage={data.meta.last_page} onPageChange={setPage} />
    </div>
  );
}
