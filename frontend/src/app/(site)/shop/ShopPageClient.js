"use client";

import { Suspense } from "react";
import { ShopView } from "@/components/product/ShopView";

export function ShopPageClient() {
  return (
    <Suspense fallback={null}>
      <ShopView title="Shop All" description="Every product across ShopSphere, from every seller on the marketplace." />
    </Suspense>
  );
}
