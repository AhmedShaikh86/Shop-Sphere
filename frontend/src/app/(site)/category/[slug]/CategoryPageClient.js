"use client";

import { Suspense } from "react";
import { ShopView } from "@/components/product/ShopView";
import { useCategory } from "@/hooks/useCatalog";
import { Spinner } from "@/components/ui/Spinner";

export function CategoryPageClient({ slug }) {
  const { data: category, isLoading } = useCategory(slug);

  if (isLoading) return <Spinner />;

  return (
    <Suspense fallback={null}>
      <ShopView
        title={category?.name || "Category"}
        description={category?.description}
        fixedFilters={{ category_slug: slug }}
      />
    </Suspense>
  );
}
