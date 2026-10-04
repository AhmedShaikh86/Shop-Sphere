"use client";

import Link from "next/link";
import { ShoppingBag, Minus, Plus, X } from "lucide-react";
import { useCart, useRemoveCartItem, useUpdateCartItem } from "@/hooks/useCart";
import { useAuth } from "@/hooks/useAuth";
import { AppImage } from "@/components/ui/AppImage";
import { Button } from "@/components/ui/Button";
import { EmptyState } from "@/components/ui/EmptyState";
import { Spinner } from "@/components/ui/Spinner";
import { formatCurrency } from "@/utils/format";
import { usePageTitle } from "@/hooks/usePageTitle";

export default function CartPage() {
  usePageTitle("Your Bag");

  const { isAuthenticated } = useAuth();
  const { data: items, isLoading } = useCart();
  const updateItem = useUpdateCartItem();
  const removeItem = useRemoveCartItem();

  if (!isAuthenticated) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <EmptyState
          icon={ShoppingBag}
          title="Log in to view your bag"
          description="Your bag is saved to your account once you log in."
          actionLabel="Log In"
          actionHref="/login"
        />
      </div>
    );
  }

  if (isLoading) return <Spinner />;

  const subtotal = (items || []).reduce((sum, item) => sum + item.line_total, 0);

  return (
    <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
      <h1 className="mb-8 border-b border-border pb-8 font-serif text-3xl text-foreground">Your Bag</h1>

      {items?.length === 0 && (
        <EmptyState
          icon={ShoppingBag}
          title="Your bag is empty"
          description="Explore new arrivals and add something you love."
          actionLabel="Shop New Arrivals"
          actionHref="/shop"
        />
      )}

      {items?.length > 0 && (
        <div className="grid gap-10 lg:grid-cols-[2fr_1fr]">
          <ul className="flex flex-col gap-6">
            {items.map((item) => (
              <li key={item.id} className="flex gap-4 border-b border-border pb-6">
                <div className="relative h-32 w-24 shrink-0 bg-surface-alt">
                  <AppImage src={item.product.image_url} alt={item.product.name} />
                </div>
                <div className="flex flex-1 flex-col justify-between">
                  <div>
                    <Link href={`/product/${item.product.slug}`} className="focus-ring text-sm text-foreground hover:underline">
                      {item.product.name}
                    </Link>
                    <p className="mt-1 text-xs text-muted">
                      {[item.variant.size, item.variant.color].filter(Boolean).join(" / ")}
                    </p>
                    <p className="mt-1 text-sm text-foreground">{formatCurrency(item.variant.price)}</p>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center border border-border">
                      <button
                        aria-label="Decrease quantity"
                        className="focus-ring px-2 py-1 disabled:opacity-40"
                        disabled={item.quantity <= 1}
                        onClick={() => updateItem.mutate({ cartItemId: item.id, quantity: item.quantity - 1 })}
                      >
                        <Minus className="h-3 w-3" />
                      </button>
                      <span className="px-3 text-sm">{item.quantity}</span>
                      <button
                        aria-label="Increase quantity"
                        className="focus-ring px-2 py-1"
                        onClick={() => updateItem.mutate({ cartItemId: item.id, quantity: item.quantity + 1 })}
                      >
                        <Plus className="h-3 w-3" />
                      </button>
                    </div>
                    <button
                      onClick={() => removeItem.mutate(item.id)}
                      className="focus-ring flex items-center gap-1 text-xs text-muted hover:text-danger"
                    >
                      <X className="h-3.5 w-3.5" /> Remove
                    </button>
                  </div>
                </div>
              </li>
            ))}
          </ul>

          <div className="h-fit border border-border p-6">
            <h2 className="font-serif text-lg text-foreground">Order Summary</h2>
            <div className="mt-4 flex justify-between text-sm">
              <span className="text-muted">Subtotal</span>
              <span className="text-foreground">{formatCurrency(subtotal)}</span>
            </div>
            <p className="mt-2 text-xs text-muted">Shipping and taxes calculated at checkout.</p>
            <Button as={Link} href="/checkout" className="mt-6 w-full">
              Proceed to Checkout
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
