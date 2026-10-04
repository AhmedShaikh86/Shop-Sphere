"use client";

import { useEffect, useState } from "react";
import { ProductCard } from "@/components/product/ProductCard";

const STORAGE_KEY = "shopsphere-recently-viewed";
const MAX_ITEMS = 8;

/**
 * Tracks viewed products client-side only (no backend model for this) —
 * enough to power a "recently viewed" rail without extra API calls.
 */
export function useRecordRecentlyViewed(product) {
  useEffect(() => {
    if (!product) return;

    const card = {
      id: product.id,
      slug: product.slug,
      name: product.name,
      brand: product.brand?.name,
      price: product.base_price,
      compare_at_price: product.compare_at_price,
      is_on_sale: product.is_on_sale,
      rating_average: product.rating_average,
      rating_count: product.rating_count,
      primary_image: product.images?.[0]?.url,
      colors: [],
      in_stock: true,
    };

    const existing = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
    const updated = [card, ...existing.filter((item) => item.id !== product.id)].slice(0, MAX_ITEMS);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  }, [product]);
}

export function RecentlyViewed({ excludeId }) {
  const [items, setItems] = useState([]);

  // Re-reads localStorage (an external store, not React state) whenever the
  // viewed product changes, since navigating between product pages doesn't
  // remount this component.
  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setItems(stored.filter((item) => item.id !== excludeId));
  }, [excludeId]);

  if (items.length === 0) return null;

  return (
    <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      <h2 className="mb-8 font-serif text-2xl text-foreground">Recently Viewed</h2>
      <div className="grid grid-cols-2 gap-x-4 gap-y-10 sm:grid-cols-3 lg:grid-cols-4">
        {items.slice(0, 4).map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </section>
  );
}
