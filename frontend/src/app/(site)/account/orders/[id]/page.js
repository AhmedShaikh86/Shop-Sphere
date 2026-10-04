"use client";

import { use, useState } from "react";
import Link from "next/link";
import { Printer } from "lucide-react";
import { useOrder, useCancelOrder } from "@/hooks/useCheckout";
import { checkoutService } from "@/services/checkoutService";
import { useMutation } from "@tanstack/react-query";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { Modal } from "@/components/ui/Modal";
import { Textarea } from "@/components/ui/Input";
import { Spinner } from "@/components/ui/Spinner";
import { useToastStore } from "@/store/toastStore";
import { apiErrorMessage } from "@/lib/api-client";
import { formatCurrency, formatDate, formatStatusLabel } from "@/utils/format";

const CANCELLABLE_STATUSES = ["pending_payment", "paid", "processing"];

export default function OrderDetailPage({ params }) {
  const { id } = use(params);
  const { data: order, isLoading } = useOrder(id);
  const cancelOrder = useCancelOrder();
  const showToast = useToastStore((state) => state.showToast);

  const [isCancelOpen, setIsCancelOpen] = useState(false);
  const [isReturnOpen, setIsReturnOpen] = useState(false);
  const [returnReason, setReturnReason] = useState("");

  const requestReturn = useMutation({
    mutationFn: () => checkoutService.requestReturn(id, returnReason),
    onSuccess: (message) => {
      showToast(message || "Return request submitted.");
      setIsReturnOpen(false);
      setReturnReason("");
    },
    onError: (error) => showToast(apiErrorMessage(error), "error"),
  });

  if (isLoading) return <Spinner />;
  if (!order) return null;

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="font-serif text-lg text-foreground">{order.order_number}</h2>
          <p className="text-sm text-muted">{formatDate(order.created_at)}</p>
        </div>
        <div className="flex items-center gap-3">
          <Badge variant="outline">{formatStatusLabel(order.status)}</Badge>
          <Button as={Link} href={`/account/orders/${id}/invoice`} variant="outline" size="sm">
            <Printer className="h-3.5 w-3.5" /> Invoice
          </Button>
        </div>
      </div>

      <div className="grid gap-8 lg:grid-cols-[2fr_1fr]">
        <div>
          <ul className="flex flex-col gap-3">
            {order.items.map((item) => (
              <li key={item.id} className="flex justify-between border-b border-border pb-3 text-sm">
                <div>
                  <p className="text-foreground">{item.product_name}</p>
                  <p className="text-muted">{item.variant_label}</p>
                  <p className="text-muted">Qty {item.quantity}</p>
                </div>
                <span className="text-foreground">{formatCurrency(item.total)}</span>
              </li>
            ))}
          </ul>

          <div className="mt-6 flex flex-wrap gap-3">
            {CANCELLABLE_STATUSES.includes(order.status) && (
              <Button variant="outline" onClick={() => setIsCancelOpen(true)}>
                Cancel Order
              </Button>
            )}
            {order.status === "delivered" && (
              <Button variant="outline" onClick={() => setIsReturnOpen(true)}>
                Request a Return
              </Button>
            )}
          </div>
        </div>

        <div className="flex flex-col gap-6">
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

          <div className="border border-border p-5 text-sm">
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

      <ConfirmDialog
        isOpen={isCancelOpen}
        onClose={() => setIsCancelOpen(false)}
        onConfirm={() => cancelOrder.mutate(id, { onSuccess: () => setIsCancelOpen(false) })}
        title="Cancel this order?"
        description="This cannot be undone. Any reserved stock will be released."
        confirmLabel="Cancel Order"
        isLoading={cancelOrder.isPending}
      />

      <Modal isOpen={isReturnOpen} onClose={() => setIsReturnOpen(false)} title="Request a Return">
        <Textarea
          value={returnReason}
          onChange={(e) => setReturnReason(e.target.value)}
          rows={3}
          placeholder="Tell us why you'd like to return this order…"
        />
        <Button
          onClick={() => requestReturn.mutate()}
          isLoading={requestReturn.isPending}
          disabled={!returnReason.trim()}
          className="mt-4 w-full"
        >
          Submit Request
        </Button>
      </Modal>
    </div>
  );
}
