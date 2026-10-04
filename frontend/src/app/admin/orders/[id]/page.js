"use client";

import { use, useState } from "react";
import { useAdminOrder, useUpdateAdminOrderStatus } from "@/hooks/useAdmin";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Select } from "@/components/ui/Input";
import { Spinner } from "@/components/ui/Spinner";
import { formatCurrency, formatDate, formatStatusLabel } from "@/utils/format";

const STATUS_OPTIONS = ["processing", "packed", "shipped", "out_for_delivery", "delivered", "cancelled", "refunded"];

export default function AdminOrderDetailPage({ params }) {
  const { id } = use(params);
  const { data: order, isLoading } = useAdminOrder(id);
  const updateStatus = useUpdateAdminOrderStatus();
  const [nextStatus, setNextStatus] = useState("");

  if (isLoading) return <Spinner />;
  if (!order) return null;

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-serif text-2xl text-foreground">{order.order_number}</h1>
          <p className="text-sm text-muted">{formatDate(order.created_at)}</p>
        </div>
        <Badge variant="outline">{formatStatusLabel(order.status)}</Badge>
      </div>

      <div className="grid gap-8 lg:grid-cols-[2fr_1fr]">
        <div>
          <ul className="flex flex-col gap-3">
            {order.items.map((item) => (
              <li key={item.id} className="flex justify-between border-b border-border pb-3 text-sm">
                <div>
                  <p className="text-foreground">{item.product_name}</p>
                  <p className="text-muted">{item.variant_label}</p>
                  <p className="text-muted">Store: {item.store_name}</p>
                  <p className="text-muted">Qty {item.quantity}</p>
                </div>
                <span className="text-foreground">{formatCurrency(item.total)}</span>
              </li>
            ))}
          </ul>
          <div className="mt-4 flex justify-between text-base">
            <span className="text-foreground">Total</span>
            <span className="text-foreground">{formatCurrency(order.total)}</span>
          </div>
        </div>

        <div className="flex flex-col gap-6">
          <div className="border border-border p-5">
            <p className="mb-2 text-xs uppercase tracking-wide text-muted">Customer</p>
            <p className="text-sm text-foreground">{order.user?.name}</p>
            <p className="text-sm text-muted">{order.user?.email}</p>
          </div>

          <div className="border border-border p-5">
            <p className="mb-2 text-xs uppercase tracking-wide text-muted">Shipping Address</p>
            {order.shipping_address && (
              <p className="text-sm text-foreground">
                {order.shipping_address.recipient_name}
                <br />
                {order.shipping_address.line1}
                <br />
                {order.shipping_address.city}, {order.shipping_address.state} {order.shipping_address.postal_code}
              </p>
            )}
          </div>

          <div className="border border-border p-5">
            <p className="mb-3 text-xs uppercase tracking-wide text-muted">Update Status</p>
            <Select value={nextStatus} onChange={(e) => setNextStatus(e.target.value)}>
              <option value="">Select new status</option>
              {STATUS_OPTIONS.map((option) => (
                <option key={option} value={option}>
                  {formatStatusLabel(option)}
                </option>
              ))}
            </Select>
            <Button
              className="mt-3 w-full"
              disabled={!nextStatus}
              isLoading={updateStatus.isPending}
              onClick={() => updateStatus.mutate({ id, status: nextStatus }, { onSuccess: () => setNextStatus("") })}
            >
              Update Status
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
