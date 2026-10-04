"use client";

import { use } from "react";
import Link from "next/link";
import { CheckCircle2 } from "lucide-react";
import { useOrder } from "@/hooks/useCheckout";
import { Button } from "@/components/ui/Button";
import { Spinner } from "@/components/ui/Spinner";
import { formatCurrency, formatStatusLabel } from "@/utils/format";

export default function OrderConfirmationPage({ params }) {
  const { orderId } = use(params);
  const { data: order, isLoading } = useOrder(orderId);

  if (isLoading) return <Spinner />;
  if (!order) return null;

  return (
    <div className="mx-auto max-w-2xl px-4 py-16 text-center sm:px-6">
      <CheckCircle2 className="mx-auto h-12 w-12 text-success" />
      <h1 className="mt-4 font-serif text-3xl text-foreground">Thank you for your order</h1>
      <p className="mt-2 text-sm text-muted">
        Your order <span className="text-foreground">{order.order_number}</span> has been placed and a
        confirmation has been sent to your email.
      </p>

      <div className="mt-8 border border-border p-6 text-left">
        <div className="flex justify-between text-sm">
          <span className="text-muted">Status</span>
          <span className="text-foreground">{formatStatusLabel(order.status)}</span>
        </div>
        <ul className="mt-4 flex flex-col gap-2 border-t border-border pt-4 text-sm">
          {order.items.map((item) => (
            <li key={item.id} className="flex justify-between text-muted">
              <span>
                {item.product_name} &times; {item.quantity}
              </span>
              <span>{formatCurrency(item.total)}</span>
            </li>
          ))}
        </ul>
        <div className="mt-4 flex justify-between border-t border-border pt-4 text-base">
          <span className="text-foreground">Total</span>
          <span className="text-foreground">{formatCurrency(order.total)}</span>
        </div>
      </div>

      <div className="mt-8 flex flex-wrap justify-center gap-4">
        <Button as={Link} href={`/account/orders/${order.id}`}>
          View Order
        </Button>
        <Button as={Link} href="/shop" variant="outline">
          Continue Shopping
        </Button>
      </div>
    </div>
  );
}
