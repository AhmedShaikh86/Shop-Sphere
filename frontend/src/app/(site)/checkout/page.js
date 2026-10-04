"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ShieldCheck } from "lucide-react";
import { useCart } from "@/hooks/useCart";
import { useAddresses } from "@/hooks/useProfile";
import { useAuth } from "@/hooks/useAuth";
import { usePlaceOrder, useValidateCoupon } from "@/hooks/useCheckout";
import { Button } from "@/components/ui/Button";
import { Input, FormField } from "@/components/ui/Input";
import { Modal } from "@/components/ui/Modal";
import { AddressForm } from "@/components/account/AddressForm";
import { Spinner } from "@/components/ui/Spinner";
import { formatCurrency } from "@/utils/format";
import { apiErrorMessage } from "@/lib/api-client";
import { cn } from "@/utils/cn";
import { usePageTitle } from "@/hooks/usePageTitle";

const SHIPPING_FLAT_RATE = 9.99;
const FREE_SHIPPING_THRESHOLD = 150;
const TAX_RATE = 0.08;

export default function CheckoutPage() {
  usePageTitle("Checkout");

  const router = useRouter();
  const { isAuthenticated } = useAuth();
  const { data: items, isLoading: isLoadingCart } = useCart();
  const { data: addresses, isLoading: isLoadingAddresses } = useAddresses();

  const [selectedAddressId, setSelectedAddressId] = useState(null);
  const [isAddressModalOpen, setIsAddressModalOpen] = useState(false);
  const [couponCode, setCouponCode] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [couponError, setCouponError] = useState(null);
  const [cardNumber, setCardNumber] = useState("4242 4242 4242 4242");
  const [placeOrderError, setPlaceOrderError] = useState(null);

  const validateCoupon = useValidateCoupon();
  const placeOrder = usePlaceOrder();

  // Derived at render time instead of synced via effect: falls back to the
  // default (or first) address until the shopper picks one explicitly.
  const effectiveAddressId =
    selectedAddressId ?? addresses?.find((a) => a.is_default)?.id ?? addresses?.[0]?.id ?? null;

  useEffect(() => {
    if (!isAuthenticated) router.push("/login");
  }, [isAuthenticated, router]);

  if (!isAuthenticated || isLoadingCart || isLoadingAddresses) return <Spinner />;

  if (!items || items.length === 0) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-20 text-center">
        <p className="text-sm text-muted">Your bag is empty.</p>
        <Button as={Link} href="/shop" className="mt-6">
          Continue Shopping
        </Button>
      </div>
    );
  }

  const subtotal = items.reduce((sum, item) => sum + item.line_total, 0);
  const discount = appliedCoupon?.discount_amount || 0;
  const shipping = subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_FLAT_RATE;
  const tax = Math.round((subtotal - discount) * TAX_RATE * 100) / 100;
  const total = Math.round((subtotal - discount + shipping + tax) * 100) / 100;

  async function handleApplyCoupon() {
    setCouponError(null);

    try {
      const result = await validateCoupon.mutateAsync({ code: couponCode, subtotal });
      setAppliedCoupon(result);
    } catch (error) {
      setAppliedCoupon(null);
      setCouponError(apiErrorMessage(error, "This coupon could not be applied."));
    }
  }

  function handlePlaceOrder() {
    setPlaceOrderError(null);

    if (!effectiveAddressId) {
      setPlaceOrderError("Please select a shipping address.");
      return;
    }

    placeOrder.mutate(
      {
        shipping_address_id: effectiveAddressId,
        coupon_code: appliedCoupon ? couponCode : undefined,
        payment: { card_number: cardNumber.replace(/\s/g, "") },
      },
      {
        onSuccess: (order) => router.push(`/checkout/confirmation/${order.id}`),
        onError: (error) => setPlaceOrderError(apiErrorMessage(error, "We could not process your payment.")),
      }
    );
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
      <h1 className="mb-8 border-b border-border pb-8 font-serif text-3xl text-foreground">Checkout</h1>

      <div className="grid gap-10 lg:grid-cols-[2fr_1fr]">
        <div className="flex flex-col gap-10">
          <section>
            <div className="mb-4 flex items-center justify-between">
              <h2 className="font-serif text-lg text-foreground">Shipping Address</h2>
              <button onClick={() => setIsAddressModalOpen(true)} className="focus-ring text-xs uppercase tracking-wide text-muted underline">
                Add New
              </button>
            </div>

            {(!addresses || addresses.length === 0) && (
              <p className="text-sm text-muted">
                No saved addresses yet.{" "}
                <button onClick={() => setIsAddressModalOpen(true)} className="underline">
                  Add one
                </button>{" "}
                to continue.
              </p>
            )}

            <div className="flex flex-col gap-3">
              {addresses?.map((address) => (
                <label
                  key={address.id}
                  className={cn(
                    "flex cursor-pointer items-start gap-3 border p-4 text-sm",
                    effectiveAddressId === address.id ? "border-foreground" : "border-border"
                  )}
                >
                  <input
                    type="radio"
                    name="shipping_address"
                    checked={effectiveAddressId === address.id}
                    onChange={() => setSelectedAddressId(address.id)}
                    className="mt-1"
                  />
                  <span>
                    <span className="block font-medium text-foreground">{address.recipient_name}</span>
                    <span className="block text-muted">
                      {address.line1}, {address.city}, {address.state} {address.postal_code}, {address.country}
                    </span>
                  </span>
                </label>
              ))}
            </div>
          </section>

          <section>
            <h2 className="mb-4 font-serif text-lg text-foreground">Payment</h2>
            <div className="border border-border p-5">
              <p className="mb-3 flex items-center gap-2 text-xs text-muted">
                <ShieldCheck className="h-4 w-4" /> Demo payment — no real charge will occur. Use a card ending
                in 0002 to simulate a decline.
              </p>
              <FormField label="Card Number" htmlFor="card_number">
                <Input id="card_number" value={cardNumber} onChange={(e) => setCardNumber(e.target.value)} />
              </FormField>
            </div>
          </section>
        </div>

        <div className="h-fit border border-border p-6">
          <h2 className="font-serif text-lg text-foreground">Order Summary</h2>

          <ul className="mt-4 flex flex-col gap-3 border-b border-border pb-4 text-sm">
            {items.map((item) => (
              <li key={item.id} className="flex justify-between text-muted">
                <span>
                  {item.product.name} &times; {item.quantity}
                </span>
                <span>{formatCurrency(item.line_total)}</span>
              </li>
            ))}
          </ul>

          <div className="mt-4 flex gap-2">
            <Input
              placeholder="Coupon code"
              value={couponCode}
              onChange={(e) => setCouponCode(e.target.value)}
            />
            <Button type="button" variant="outline" onClick={handleApplyCoupon} isLoading={validateCoupon.isPending}>
              Apply
            </Button>
          </div>
          {couponError && <p className="mt-2 text-xs text-danger">{couponError}</p>}
          {appliedCoupon && <p className="mt-2 text-xs text-success">Coupon applied.</p>}

          <div className="mt-4 flex flex-col gap-2 border-t border-border pt-4 text-sm">
            <div className="flex justify-between">
              <span className="text-muted">Subtotal</span>
              <span className="text-foreground">{formatCurrency(subtotal)}</span>
            </div>
            {discount > 0 && (
              <div className="flex justify-between">
                <span className="text-muted">Discount</span>
                <span className="text-success">-{formatCurrency(discount)}</span>
              </div>
            )}
            <div className="flex justify-between">
              <span className="text-muted">Shipping</span>
              <span className="text-foreground">{shipping === 0 ? "Free" : formatCurrency(shipping)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted">Tax</span>
              <span className="text-foreground">{formatCurrency(tax)}</span>
            </div>
            <div className="mt-2 flex justify-between border-t border-border pt-2 text-base">
              <span className="text-foreground">Total</span>
              <span className="text-foreground">{formatCurrency(total)}</span>
            </div>
          </div>

          {placeOrderError && <p className="mt-4 text-xs text-danger">{placeOrderError}</p>}

          <Button onClick={handlePlaceOrder} isLoading={placeOrder.isPending} className="mt-6 w-full">
            Place Order
          </Button>
        </div>
      </div>

      <Modal isOpen={isAddressModalOpen} onClose={() => setIsAddressModalOpen(false)} title="Add Address">
        <AddressForm onSaved={() => setIsAddressModalOpen(false)} />
      </Modal>
    </div>
  );
}
