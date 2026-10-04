"use client";

import Link from "next/link";
import { Heart, X } from "lucide-react";
import { useWishlist } from "@/hooks/useWishlist";
import { useAddToCart } from "@/hooks/useCart";
import { wishlistService } from "@/services/wishlistService";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AppImage } from "@/components/ui/AppImage";
import { Button } from "@/components/ui/Button";
import { EmptyState } from "@/components/ui/EmptyState";
import { Spinner } from "@/components/ui/Spinner";
import { useToastStore } from "@/store/toastStore";
import { formatCurrency } from "@/utils/format";

export default function WishlistPage() {
  const { data: items, isLoading } = useWishlist();
  const addToCart = useAddToCart();
  const queryClient = useQueryClient();
  const showToast = useToastStore((state) => state.showToast);

  const removeFromWishlist = useMutation({
    mutationFn: (productId) => wishlistService.remove(productId),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["wishlist"] }),
  });

  if (isLoading) return <Spinner />;

  if (items?.length === 0) {
    return (
      <EmptyState
        icon={Heart}
        title="Your wishlist is empty"
        description="Save items you love to find them here later."
        actionLabel="Shop Now"
        actionHref="/shop"
      />
    );
  }

  function handleMoveToCart(item) {
    if (!item.product.default_variant_id) {
      showToast("Open the product page to choose a size or color.", "error");
      return;
    }

    addToCart.mutate(
      { variantId: item.product.default_variant_id, quantity: 1 },
      { onSuccess: () => removeFromWishlist.mutate(item.product.id) }
    );
  }

  return (
    <div>
      <h2 className="mb-6 font-serif text-lg text-foreground">Your Wishlist</h2>
      <div className="grid grid-cols-2 gap-6 sm:grid-cols-3">
        {items?.map((item) => (
          <div key={item.id} className="group relative">
            <button
              onClick={() => removeFromWishlist.mutate(item.product.id)}
              aria-label="Remove from wishlist"
              className="focus-ring absolute right-2 top-2 z-10 flex h-7 w-7 items-center justify-center bg-surface/90"
            >
              <X className="h-3.5 w-3.5" />
            </button>
            <Link href={`/product/${item.product.slug}`} className="focus-ring block">
              <div className="relative aspect-[4/5] bg-surface-alt">
                <AppImage src={item.product.primary_image} alt={item.product.name} />
              </div>
              <p className="mt-2 text-sm text-foreground">{item.product.name}</p>
              <p className="text-sm text-muted">{formatCurrency(item.product.price)}</p>
            </Link>
            <Button size="sm" variant="outline" className="mt-2 w-full" onClick={() => handleMoveToCart(item)}>
              Move to Bag
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
}
