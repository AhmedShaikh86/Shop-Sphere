"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Search as SearchIcon } from "lucide-react";
import { useSearch } from "@/hooks/useProducts";
import { ProductCard } from "@/components/product/ProductCard";
import { EmptyState } from "@/components/ui/EmptyState";
import { Input } from "@/components/ui/Input";
import { Spinner } from "@/components/ui/Spinner";
import { usePageTitle } from "@/hooks/usePageTitle";

function SearchPageContent() {
  usePageTitle("Search");

  const searchParams = useSearchParams();
  const router = useRouter();
  const [keyword, setKeyword] = useState(searchParams.get("q") || "");
  const { data, isFetching } = useSearch(keyword);

  useEffect(() => {
    const timeout = setTimeout(() => {
      const params = new URLSearchParams();
      if (keyword) params.set("q", keyword);
      router.replace(`/search?${params.toString()}`, { scroll: false });
    }, 400);

    return () => clearTimeout(timeout);
  }, [keyword, router]);

  return (
    <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="mb-8 flex items-center gap-3 border-b border-border pb-6">
        <SearchIcon className="h-5 w-5 text-muted" />
        <Input
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          placeholder="Search products, brands and categories"
          className="border-none px-0 text-lg focus-visible:outline-none"
          autoFocus
        />
      </div>

      {isFetching && <Spinner />}

      {!isFetching && keyword && data?.products.length === 0 && (
        <EmptyState icon={SearchIcon} title="No results found" description={`Nothing matched "${keyword}".`} />
      )}

      {data?.products.length > 0 && (
        <div className="grid grid-cols-2 gap-x-4 gap-y-10 sm:grid-cols-3 lg:grid-cols-4">
          {data.products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={<Spinner />}>
      <SearchPageContent />
    </Suspense>
  );
}
