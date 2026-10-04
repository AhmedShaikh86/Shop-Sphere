"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { SlidersHorizontal, PackageSearch } from "lucide-react";
import { useState } from "react";
import { useProducts } from "@/hooks/useProducts";
import { ProductCard } from "@/components/product/ProductCard";
import { ProductFilters, ProductSort } from "@/components/product/ProductFilters";
import { ProductGridSkeleton } from "@/components/ui/Skeleton";
import { EmptyState } from "@/components/ui/EmptyState";
import { ErrorState } from "@/components/ui/ErrorState";
import { Pagination } from "@/components/ui/Pagination";

/**
 * Shared by /shop, /category/[slug], /brand/[slug] and /collection/[slug] —
 * only the fixed filters and heading differ between those pages.
 */
export function ShopView({ title, description, fixedFilters = {}, hideBrandFilter = false }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [showFilters, setShowFilters] = useState(false);

  const urlFilters = Object.fromEntries(searchParams.entries());
  const filters = { ...urlFilters, ...fixedFilters, page: urlFilters.page || 1 };

  const { data, isLoading, isError, refetch } = useProducts(filters);

  function updateFilters(nextFilters) {
    const params = new URLSearchParams({ ...nextFilters, ...fixedFilters });
    router.push(`?${params.toString()}`, { scroll: false });
  }

  function handlePageChange(page) {
    updateFilters({ ...filters, page });
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="mb-8 flex flex-col gap-2 border-b border-border pb-8">
        <h1 className="font-serif text-3xl text-foreground">{title}</h1>
        {description && <p className="max-w-2xl text-sm text-muted">{description}</p>}
      </div>

      <div className="flex flex-col gap-8 lg:flex-row">
        <button
          type="button"
          onClick={() => setShowFilters((v) => !v)}
          className="focus-ring flex items-center gap-2 text-sm text-foreground lg:hidden"
        >
          <SlidersHorizontal className="h-4 w-4" /> Filters
        </button>

        <aside className={`w-full shrink-0 lg:block lg:w-56 ${showFilters ? "block" : "hidden"}`}>
          <ProductFilters filters={filters} onChange={updateFilters} hideBrand={hideBrandFilter} />
        </aside>

        <div className="flex-1">
          <div className="mb-6 flex items-center justify-between">
            <p className="text-sm text-muted">{data ? `${data.meta.total} items` : ""}</p>
            <ProductSort value={filters.sort} onChange={(sort) => updateFilters({ ...filters, sort, page: 1 })} />
          </div>

          {isLoading && <ProductGridSkeleton />}

          {isError && <ErrorState onRetry={refetch} />}

          {!isLoading && !isError && data?.items.length === 0 && (
            <EmptyState
              icon={PackageSearch}
              title="No products found"
              description="Try adjusting your filters or check back soon for new arrivals."
            />
          )}

          {!isLoading && !isError && data?.items.length > 0 && (
            <>
              <div className="grid grid-cols-2 gap-x-4 gap-y-10 sm:grid-cols-3 xl:grid-cols-4">
                {data.items.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
              <Pagination
                currentPage={data.meta.current_page}
                lastPage={data.meta.last_page}
                onPageChange={handlePageChange}
              />
            </>
          )}
        </div>
      </div>
    </div>
  );
}
