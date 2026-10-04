"use client";

import { useState } from "react";
import Link from "next/link";
import { useAdminOrders } from "@/hooks/useAdmin";
import { Badge } from "@/components/ui/Badge";
import { Select } from "@/components/ui/Input";
import { Pagination } from "@/components/ui/Pagination";
import { Spinner } from "@/components/ui/Spinner";
import { formatCurrency, formatDate, formatStatusLabel } from "@/utils/format";

export default function AdminOrdersPage() {
  const [status, setStatus] = useState("");
  const [page, setPage] = useState(1);
  const { data, isLoading } = useAdminOrders({ status: status || undefined, page });

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <h1 className="font-serif text-2xl text-foreground">Orders</h1>
        <Select value={status} onChange={(e) => setStatus(e.target.value)} className="max-w-[200px]">
          <option value="">All Statuses</option>
          <option value="pending_payment">Pending Payment</option>
          <option value="paid">Paid</option>
          <option value="processing">Processing</option>
          <option value="packed">Packed</option>
          <option value="shipped">Shipped</option>
          <option value="out_for_delivery">Out for Delivery</option>
          <option value="delivered">Delivered</option>
          <option value="cancelled">Cancelled</option>
          <option value="refunded">Refunded</option>
        </Select>
      </div>

      {isLoading && <Spinner />}

      <div className="flex flex-col gap-3">
        {data?.items.map((order) => (
          <Link
            key={order.id}
            href={`/admin/orders/${order.id}`}
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

      {data && <Pagination currentPage={data.meta.current_page} lastPage={data.meta.last_page} onPageChange={setPage} />}
    </div>
  );
}
