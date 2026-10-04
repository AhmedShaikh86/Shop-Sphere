"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Heart, Minus, Plus, Truck, RotateCcw } from "lucide-react";
import { useProduct } from "@/hooks/useProducts";
import { useAddToCart } from "@/hooks/useCart";
import { useIsWishlisted, useToggleWishlist } from "@/hooks/useWishlist";
import { useAuth } from "@/hooks/useAuth";
import { useToastStore } from "@/store/toastStore";
import { useUiStore } from "@/store/uiStore";
import { ProductGallery } from "@/components/product/ProductGallery";
import { VariantSelector } from "@/components/product/VariantSelector";
import { SizeGuide } from "@/components/product/SizeGuide";
import { ReviewList } from "@/components/product/ReviewList";
import { ProductCard } from "@/components/product/ProductCard";
import { RecentlyViewed, useRecordRecentlyViewed } from "@/components/product/RecentlyViewed";
import { Rating } from "@/components/ui/Rating";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Spinner } from "@/components/ui/Spinner";
import { ErrorState } from "@/components/ui/ErrorState";
import { formatCurrency } from "@/utils/format";
import { cn } from "@/utils/cn";

const TABS = [
  { id: "description", label: "Description" },
  { id: "materials", label: "Materials & Care" },
  { id: "shipping", label: "Shipping & Returns" },
];

export function ProductPageClient({ slug }) {
  const { data, isLoading, isError, refetch } = useProduct(slug);
  const [selectedSize, setSelectedSize] = useState(null);
  const [selectedColor, setSelectedColor] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState("description");

  const router = useRouter();
  const { isAuthenticated } = useAuth();
  const addToCart = useAddToCart();
  const showToast = useToastStore((state) => state.showToast);
  const openCart = useUiStore((state) => state.openCart);

  const product = data?.product;
  useRecordRecentlyViewed(product);

  const isWishlisted = useIsWishlisted(product?.id);
  const toggleWishlist = useToggleWishlist();

  const selectedVariant = useMemo(() => {
    if (!product) return null;

    return product.variants.find(
      (v) => (v.size || null) === selectedSize && (v.color || null) === selectedColor
    );
  }, [product, selectedSize, selectedColor]);

  if (isLoading) return <Spinner />;
  if (isError || !product) return <ErrorState title="Product not found" onRetry={refetch} />;

  function requireSelection() {
    const needsSize = product.variants.some((v) => v.size) && !selectedSize;
    const needsColor = product.variants.some((v) => v.color) && !selectedColor;

    if (needsSize || needsColor) {
      showToast("Please select a size and color.", "error");
      return false;
    }

    if (!selectedVariant) {
      showToast("This combination is unavailable.", "error");
      return false;
    }

    if (!selectedVariant.in_stock) {
      showToast("This item is out of stock.", "error");
      return false;
    }

    return true;
  }

  function handleAddToCart() {
    if (!isAuthenticated) {
      router.push("/login");
      return;
    }
    if (!requireSelection()) return;

    addToCart.mutate(
      { variantId: selectedVariant.id, quantity },
      { onSuccess: () => openCart() }
    );
  }

  function handleBuyNow() {
    if (!isAuthenticated) {
      router.push("/login");
      return;
    }
    if (!requireSelection()) return;

    addToCart.mutate(
      { variantId: selectedVariant.id, quantity },
      { onSuccess: () => router.push("/checkout") }
    );
  }

  const isShoe = product.category?.name === "Shoes";
  const relatedProducts = data.related_products || [];

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="grid gap-10 lg:grid-cols-2">
        <ProductGallery images={product.images} productName={product.name} />

        <div>
          {product.brand && <p className="text-sm uppercase tracking-wide text-muted">{product.brand.name}</p>}
          <h1 className="mt-1 font-serif text-3xl text-foreground">{product.name}</h1>

          <div className="mt-3 flex items-center gap-3">
            <span className="text-xl text-foreground">{formatCurrency(selectedVariant?.price || product.base_price)}</span>
            {product.is_on_sale && (
              <span className="text-base text-muted line-through">{formatCurrency(product.compare_at_price)}</span>
            )}
            {product.is_on_sale && <Badge variant="accent">Sale</Badge>}
          </div>

          {product.rating_count > 0 && (
            <div className="mt-2">
              <Rating value={product.rating_average} count={product.rating_count} />
            </div>
          )}

          <p className="mt-5 text-sm leading-relaxed text-muted">{product.description}</p>

          <div className="mt-6 flex items-center justify-between">
            <VariantSelector
              variants={product.variants}
              selectedSize={selectedSize}
              selectedColor={selectedColor}
              onSelectSize={setSelectedSize}
              onSelectColor={setSelectedColor}
            />
          </div>
          {product.variants.some((v) => v.size) && (
            <div className="mt-2">
              <SizeGuide isShoe={isShoe} />
            </div>
          )}

          <div className="mt-6 flex items-center gap-4">
            <div className="flex items-center border border-border">
              <button
                aria-label="Decrease quantity"
                className="focus-ring px-3 py-2"
                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
              >
                <Minus className="h-3.5 w-3.5" />
              </button>
              <span className="px-4 text-sm">{quantity}</span>
              <button
                aria-label="Increase quantity"
                className="focus-ring px-3 py-2"
                onClick={() => setQuantity((q) => Math.min(10, q + 1))}
              >
                <Plus className="h-3.5 w-3.5" />
              </button>
            </div>

            <Button onClick={handleAddToCart} isLoading={addToCart.isPending} className="flex-1">
              Add to Cart
            </Button>
            <button
              type="button"
              onClick={() => (isAuthenticated ? toggleWishlist.mutate(product) : router.push("/login"))}
              aria-label={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
              aria-pressed={isWishlisted}
              className="focus-ring flex h-11 w-11 items-center justify-center border border-border"
            >
              <Heart className={cn("h-5 w-5", isWishlisted && "fill-accent text-accent")} />
            </button>
          </div>

          <Button onClick={handleBuyNow} variant="outline" className="mt-3 w-full">
            Buy Now
          </Button>

          <div className="mt-6 flex flex-col gap-2 border-t border-border pt-6 text-sm text-muted">
            <p className="flex items-center gap-2">
              <Truck className="h-4 w-4" /> Free shipping on orders over $150
            </p>
            <p className="flex items-center gap-2">
              <RotateCcw className="h-4 w-4" /> Free returns within 30 days
            </p>
          </div>
        </div>
      </div>

      <div className="mt-16 border-t border-border">
        <div className="flex gap-8">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                "focus-ring border-b-2 py-4 text-sm uppercase tracking-wide",
                activeTab === tab.id ? "border-foreground text-foreground" : "border-transparent text-muted"
              )}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="max-w-2xl py-8 text-sm leading-relaxed text-muted">
          {activeTab === "description" && (
            <ul className="flex flex-col gap-2">
              {product.fit && <li>Fit: {product.fit}</li>}
              {product.pattern && <li>Pattern: {product.pattern}</li>}
              {product.season && <li>Season: {product.season}</li>}
              {product.gender && <li>Category: {product.gender}</li>}
            </ul>
          )}
          {activeTab === "materials" && (
            <div className="flex flex-col gap-3">
              {product.material && <p>Material: {product.material}</p>}
              {product.care_instructions && <p>{product.care_instructions}</p>}
              {product.sustainability_info && <p>{product.sustainability_info}</p>}
            </div>
          )}
          {activeTab === "shipping" && (
            <div className="flex flex-col gap-3">
              <p>Orders ship within 1-2 business days. Standard delivery takes 3-7 business days.</p>
              <p>Free standard shipping on orders over $150 — otherwise a flat $9.99 applies.</p>
              <p>Unworn items with tags attached can be returned within 30 days of delivery for a full refund.</p>
            </div>
          )}
        </div>
      </div>

      {relatedProducts.length > 0 && (
        <section className="mt-4 border-t border-border pt-12">
          <h2 className="mb-8 font-serif text-2xl text-foreground">You May Also Like</h2>
          <div className="grid grid-cols-2 gap-x-4 gap-y-10 sm:grid-cols-3 lg:grid-cols-4">
            {relatedProducts.slice(0, 4).map((related) => (
              <ProductCard key={related.id} product={related} />
            ))}
          </div>
        </section>
      )}

      {relatedProducts.length > 4 && (
        <section className="border-t border-border pt-12">
          <h2 className="mb-8 font-serif text-2xl text-foreground">Frequently Bought Together</h2>
          <div className="grid grid-cols-2 gap-x-4 gap-y-10 sm:grid-cols-3 lg:grid-cols-4">
            {relatedProducts.slice(4, 8).map((related) => (
              <ProductCard key={related.id} product={related} />
            ))}
          </div>
        </section>
      )}

      <div className="border-t border-border pt-12">
        <h2 className="mb-8 font-serif text-2xl text-foreground">Reviews</h2>
        <ReviewList productId={product.id} />
      </div>

      <RecentlyViewed excludeId={product.id} />
    </div>
  );
}
