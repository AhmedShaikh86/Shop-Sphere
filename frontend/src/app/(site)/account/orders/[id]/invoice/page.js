"use client";

import { use } from "react";
import { Printer } from "lucide-react";
import { useOrder } from "@/hooks/useCheckout";
import { Button } from "@/components/ui/Button";
import { Spinner } from "@/components/ui/Spinner";
import { formatCurrency, formatDate } from "@/utils/format";

export default function InvoicePage({ params }) {
  const { id } = use(params);
  const { data: order, isLoading } = useOrder(id);

  if (isLoading) return <Spinner />;
  if (!order) return null;

  return (
    <div className="mx-auto max-w-3xl px-6 py-12">
      <div className="mb-8 flex items-center justify-between print:hidden">
        <h1 className="font-serif text-2xl text-foreground">Invoice</h1>
        <Button onClick={() => window.print()}>
          <Printer className="h-4 w-4" /> Print / Save as PDF
        </Button>
      </div>

      <div className="border border-border p-8">
        <div className="flex items-start justify-between border-b border-border pb-6">
          <div>
            <p className="font-serif text-xl text-foreground">SHOPSPHERE</p>
            <p className="text-sm text-muted">Style, curated for you.</p>
          </div>
          <div className="text-right text-sm">
            <p className="text-foreground">Invoice #{order.order_number}</p>
            <p className="text-muted">{formatDate(order.created_at)}</p>
          </div>
        </div>

        <div className="mt-6 grid grid-cols-2 gap-6 text-sm">
          <div>
            <p className="text-xs uppercase tracking-wide text-muted">Billed To</p>
            {order.billing_address && (
              <p className="mt-1 text-foreground">
                {order.billing_address.recipient_name}
                <br />
                {order.billing_address.line1}
                <br />
                {order.billing_address.city}, {order.billing_address.state} {order.billing_address.postal_code}
              </p>
            )}
          </div>
          <div>
            <p className="text-xs uppercase tracking-wide text-muted">Payment</p>
            <p className="mt-1 text-foreground">{order.payment?.provider?.toUpperCase()}</p>
            <p className="text-muted">Status: {order.payment?.status}</p>
          </div>
        </div>

        <table className="mt-8 w-full text-left text-sm">
          <thead>
            <tr className="border-b border-border text-muted">
              <th className="py-2">Item</th>
              <th className="py-2 text-right">Qty</th>
              <th className="py-2 text-right">Unit Price</th>
              <th className="py-2 text-right">Total</th>
            </tr>
          </thead>
          <tbody>
            {order.items.map((item) => (
              <tr key={item.id} className="border-b border-border/60">
                <td className="py-2 text-foreground">
                  {item.product_name}
                  <span className="block text-xs text-muted">{item.variant_label}</span>
                </td>
                <td className="py-2 text-right text-foreground">{item.quantity}</td>
                <td className="py-2 text-right text-foreground">{formatCurrency(item.unit_price)}</td>
                <td className="py-2 text-right text-foreground">{formatCurrency(item.total)}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="ml-auto mt-6 flex max-w-xs flex-col gap-1 text-sm">
          <div className="flex justify-between">
            <span className="text-muted">Subtotal</span>
            <span className="text-foreground">{formatCurrency(order.subtotal)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted">Discount</span>
            <span className="text-foreground">-{formatCurrency(order.discount_amount)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted">Shipping</span>
            <span className="text-foreground">{formatCurrency(order.shipping_amount)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted">Tax</span>
            <span className="text-foreground">{formatCurrency(order.tax_amount)}</span>
          </div>
          <div className="mt-2 flex justify-between border-t border-border pt-2 text-base">
            <span className="text-foreground">Total</span>
            <span className="text-foreground">{formatCurrency(order.total)}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
