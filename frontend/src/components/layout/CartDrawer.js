"use client";

import { useRef } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import { Minus, Plus, X } from "lucide-react";
import { useUiStore } from "@/store/uiStore";
import { useCart, useRemoveCartItem, useUpdateCartItem } from "@/hooks/useCart";
import { useDialogBehavior } from "@/hooks/useDialogBehavior";
import { AppImage } from "@/components/ui/AppImage";
import { Button } from "@/components/ui/Button";
import { EmptyState } from "@/components/ui/EmptyState";
import { Spinner } from "@/components/ui/Spinner";
import { formatCurrency } from "@/utils/format";
import { ShoppingBag } from "lucide-react";

export function CartDrawer() {
  const { isCartOpen, closeCart } = useUiStore();
  const { data: items, isLoading } = useCart();
  const updateItem = useUpdateCartItem();
  const removeItem = useRemoveCartItem();
  const panelRef = useRef(null);
  useDialogBehavior(isCartOpen, closeCart, panelRef);

  if (!isCartOpen) return null;

  const subtotal = (items || []).reduce((sum, item) => sum + item.line_total, 0);

  return createPortal(
    <div className="fixed inset-0 z-50">
      <button aria-label="Close cart" className="absolute inset-0 bg-foreground/40" onClick={closeCart} />
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-label="Shopping bag"
        tabIndex={-1}
        className="focus-ring absolute right-0 top-0 flex h-full w-full max-w-md flex-col bg-surface"
      >
        <div className="flex items-center justify-between border-b border-border px-6 py-5">
          <h2 className="font-serif text-xl text-foreground">Your Bag</h2>
          <button onClick={closeCart} aria-label="Close" className="focus-ring text-foreground">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-4">
          {isLoading && <Spinner />}
          {!isLoading && (items || []).length === 0 && (
            <EmptyState
              icon={ShoppingBag}
              title="Your bag is empty"
              description="Explore new arrivals and add something you love."
              actionLabel="Shop New Arrivals"
              actionHref="/shop"
            />
          )}
          <ul className="flex flex-col gap-5">
            {(items || []).map((item) => (
              <li key={item.id} className="flex gap-4">
                <div className="relative h-24 w-20 shrink-0 bg-surface-alt">
                  <AppImage src={item.product.image_url} alt={item.product.name} />
                </div>
                <div className="flex flex-1 flex-col justify-between">
                  <div>
                    <p className="text-sm text-foreground">{item.product.name}</p>
                    <p className="text-xs text-muted">
                      {[item.variant.size, item.variant.color].filter(Boolean).join(" / ")}
                    </p>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center border border-border">
                      <button
                        aria-label="Decrease quantity"
                        className="focus-ring px-2 py-1 disabled:opacity-40"
                        disabled={item.quantity <= 1 || updateItem.isPending}
                        onClick={() => updateItem.mutate({ cartItemId: item.id, quantity: item.quantity - 1 })}
                      >
                        <Minus className="h-3 w-3" />
                      </button>
                      <span className="px-3 text-sm">{item.quantity}</span>
                      <button
                        aria-label="Increase quantity"
                        className="focus-ring px-2 py-1"
                        disabled={updateItem.isPending}
                        onClick={() => updateItem.mutate({ cartItemId: item.id, quantity: item.quantity + 1 })}
                      >
                        <Plus className="h-3 w-3" />
                      </button>
                    </div>
                    <span className="text-sm text-foreground">{formatCurrency(item.line_total)}</span>
                  </div>
                </div>
                <button
                  aria-label="Remove item"
                  className="focus-ring self-start text-muted hover:text-danger"
                  onClick={() => removeItem.mutate(item.id)}
                >
                  <X className="h-4 w-4" />
                </button>
              </li>
            ))}
          </ul>
        </div>

        {(items || []).length > 0 && (
          <div className="border-t border-border px-6 py-5">
            <div className="mb-4 flex items-center justify-between text-sm">
              <span className="text-muted">Subtotal</span>
              <span className="text-foreground">{formatCurrency(subtotal)}</span>
            </div>
            <Button as={Link} href="/checkout" onClick={closeCart} className="w-full">
              Checkout
            </Button>
            <Button as={Link} href="/cart" onClick={closeCart} variant="outline" className="mt-2 w-full">
              View Bag
            </Button>
          </div>
        )}
      </div>
    </div>,
    document.body
  );
}
