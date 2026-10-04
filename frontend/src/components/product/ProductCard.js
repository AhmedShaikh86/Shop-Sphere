"use client";

import Link from "next/link";
import { Heart } from "lucide-react";
import { AppImage } from "@/components/ui/AppImage";
import { Rating } from "@/components/ui/Rating";
import { Badge } from "@/components/ui/Badge";
import { formatCurrency } from "@/utils/format";
import { useAuth } from "@/hooks/useAuth";
import { useIsWishlisted, useToggleWishlist } from "@/hooks/useWishlist";
import { useAddToCart } from "@/hooks/useCart";
import { useToastStore } from "@/store/toastStore";
import { cn } from "@/utils/cn";

export function ProductCard({ product }) {
  const { isAuthenticated } = useAuth();
  const isWishlisted = useIsWishlisted(product.id);
  const toggleWishlist = useToggleWishlist();
  const addToCart = useAddToCart();
  const showToast = useToastStore((state) => state.showToast);

  function handleWishlistClick(event) {
    event.preventDefault();

    if (!isAuthenticated) {
      showToast("Log in to save items to your wishlist.", "error");
      return;
    }

    toggleWishlist.mutate(product);
  }

  function handleQuickAdd(event) {
    event.preventDefault();

    if (!isAuthenticated) {
      showToast("Log in to add items to your bag.", "error");
      return;
    }

    if (!product.default_variant_id) {
      showToast("Select options on the product page to add this item.", "error");
      return;
    }

    addToCart.mutate({ variantId: product.default_variant_id, quantity: 1 });
  }

  return (
    <Link href={`/product/${product.slug}`} className="group focus-ring block">
      <div className="relative aspect-[4/5] overflow-hidden bg-surface-alt">
        <AppImage
          src={product.primary_image}
          alt={product.name}
          className="transition-opacity duration-300 group-hover:opacity-0"
        />
        {product.hover_image && (
          <AppImage
            src={product.hover_image}
            alt=""
            className="absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
          />
        )}

        {product.is_on_sale && (
          <Badge variant="accent" className="absolute left-3 top-3">
            Sale
          </Badge>
        )}

        <button
          type="button"
          onClick={handleWishlistClick}
          aria-label={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
          aria-pressed={isWishlisted}
          className="focus-ring absolute right-3 top-3 flex h-8 w-8 items-center justify-center bg-surface/90 text-foreground transition-transform hover:scale-105"
        >
          <Heart className={cn("h-4 w-4", isWishlisted && "fill-accent text-accent")} />
        </button>

        {product.in_stock && (
          <button
            type="button"
            onClick={handleQuickAdd}
            className="focus-ring absolute inset-x-3 bottom-3 translate-y-2 bg-foreground py-2.5 text-xs font-medium uppercase tracking-wide text-background opacity-0 transition-all duration-200 group-hover:translate-y-0 group-hover:opacity-100"
          >
            Quick Add
          </button>
        )}

        {!product.in_stock && (
          <Badge variant="neutral" className="absolute inset-x-3 bottom-3 text-center">
            Out of Stock
          </Badge>
        )}
      </div>

      <div className="mt-3 space-y-1">
        {product.brand && <p className="text-xs uppercase tracking-wide text-muted">{product.brand}</p>}
        <p className="text-sm text-foreground">{product.name}</p>
        <div className="flex items-center gap-2">
          <span className="text-sm text-foreground">{formatCurrency(product.price)}</span>
          {product.is_on_sale && (
            <span className="text-sm text-muted line-through">{formatCurrency(product.compare_at_price)}</span>
          )}
        </div>
        {product.rating_count > 0 && <Rating value={product.rating_average} count={product.rating_count} />}
        {product.colors?.length > 1 && (
          <p className="text-xs text-muted">{product.colors.length} colors</p>
        )}
      </div>
    </Link>
  );
}
