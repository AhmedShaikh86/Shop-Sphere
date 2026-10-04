"use client";

import { Suspense } from "react";
import { ShopView } from "@/components/product/ShopView";
import { useCollection } from "@/hooks/useCatalog";
import { Spinner } from "@/components/ui/Spinner";

export function CollectionPageClient({ slug }) {
  const { data: collection, isLoading } = useCollection(slug);

  if (isLoading) return <Spinner />;

  return (
    <Suspense fallback={null}>
      <ShopView
        title={collection?.name || "Collection"}
        description={collection?.description}
        fixedFilters={{ collection_slug: slug }}
      />
    </Suspense>
  );
}
