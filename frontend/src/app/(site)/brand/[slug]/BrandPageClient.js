"use client";

import { Suspense } from "react";
import { ShopView } from "@/components/product/ShopView";
import { useBrand } from "@/hooks/useCatalog";
import { Spinner } from "@/components/ui/Spinner";

export function BrandPageClient({ slug }) {
  const { data: brand, isLoading } = useBrand(slug);

  if (isLoading) return <Spinner />;

  return (
    <Suspense fallback={null}>
      <ShopView
        title={brand?.name || "Brand"}
        description={brand?.description}
        fixedFilters={{ brand_slug: slug }}
        hideBrandFilter
      />
    </Suspense>
  );
}
