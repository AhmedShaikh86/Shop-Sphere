"use client";

import { useState } from "react";
import Link from "next/link";
import { ShoppingCart } from "lucide-react";
import { useSellerOrders } from "@/hooks/useSeller";
import { Badge } from "@/components/ui/Badge";
import { EmptyState } from "@/components/ui/EmptyState";
import { Pagination } from "@/components/ui/Pagination";
import { Spinner } from "@/components/ui/Spinner";
import { formatCurrency, formatDate, formatStatusLabel } from "@/utils/format";

export default function SellerOrdersPage() {
  const [page, setPage] = useState(1);
  const { data, isLoading } = useSellerOrders({ page });

  if (isLoading) return <Spinner />;

  return (
    <div>
      <h1 className="mb-6 font-serif text-2xl text-foreground">Orders</h1>

      {data?.items.length === 0 && <EmptyState icon={ShoppingCart} title="No orders yet" description="Orders containing your products will appear here." />}

      <div className="flex flex-col gap-3">
        {data?.items.map((order) => (
          <Link
            key={order.id}
            href={`/seller/orders/${order.id}`}
            className="focus-ring flex flex-col gap-2 border border-border p-4 text-sm hover:border-foreground sm:flex-row sm:items-center sm:justify-between"
          >
            <div>
              <p className="text-foreground">{order.order_number}</p>
              <p className="text-muted">{formatDate(order.created_at)}</p>
            </div>
            <div className="flex items-center gap-3">
              <Badge variant="outline">{formatStatusLabel(order.status)}</Badge>
              <span className="text-foreground">
                {formatCurrency(order.items.reduce((sum, item) => sum + Number(item.total), 0))}
              </span>
            </div>
          </Link>
        ))}
      </div>

      {data && <Pagination currentPage={data.meta.current_page} lastPage={data.meta.last_page} onPageChange={setPage} />}
    </div>
  );
}
