"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import { Search, X } from "lucide-react";
import { useUiStore } from "@/store/uiStore";
import { useSearch } from "@/hooks/useProducts";
import { useDialogBehavior } from "@/hooks/useDialogBehavior";
import { AppImage } from "@/components/ui/AppImage";
import { formatCurrency } from "@/utils/format";

const RECENT_SEARCHES_KEY = "shopsphere-recent-searches";

function readRecentSearches() {
  if (typeof window === "undefined") return [];
  return JSON.parse(localStorage.getItem(RECENT_SEARCHES_KEY) || "[]");
}

export function SearchOverlay() {
  const { isSearchOpen, closeSearch } = useUiStore();
  const [keyword, setKeyword] = useState("");
  const [debouncedKeyword, setDebouncedKeyword] = useState("");
  // Lazy-initialized once from localStorage; saveRecentSearch() below keeps
  // it in sync from then on, so no effect is needed to "load" it.
  const [recentSearches, setRecentSearches] = useState(readRecentSearches);
  const inputRef = useRef(null);
  const panelRef = useRef(null);
  useDialogBehavior(isSearchOpen, closeSearch, panelRef, inputRef);

  useEffect(() => {
    const timeout = setTimeout(() => setDebouncedKeyword(keyword), 300);
    return () => clearTimeout(timeout);
  }, [keyword]);

  const { data, isFetching } = useSearch(debouncedKeyword);

  function saveRecentSearch(term) {
    const updated = [term, ...recentSearches.filter((s) => s !== term)].slice(0, 6);
    setRecentSearches(updated);
    localStorage.setItem(RECENT_SEARCHES_KEY, JSON.stringify(updated));
  }

  function handleSubmit(event) {
    event.preventDefault();
    if (keyword.trim()) saveRecentSearch(keyword.trim());
  }

  if (!isSearchOpen) return null;

  const hasResults = data && (data.products.length > 0 || data.categories.length > 0 || data.brands.length > 0);

  return createPortal(
    <div ref={panelRef} role="dialog" aria-modal="true" aria-label="Search" tabIndex={-1} className="focus-ring fixed inset-0 z-50 bg-background">
      <div className="mx-auto flex h-full max-w-3xl flex-col px-6 py-8">
        <div className="flex items-center gap-4 border-b border-border pb-4">
          <Search className="h-5 w-5 text-muted" />
          <form onSubmit={handleSubmit} className="flex-1">
            <input
              ref={inputRef}
              value={keyword}
              onChange={(event) => setKeyword(event.target.value)}
              type="search"
              placeholder="Search products, brands and categories"
              aria-label="Search"
              className="focus-ring w-full bg-transparent text-lg text-foreground placeholder:text-muted"
            />
          </form>
          <button onClick={closeSearch} aria-label="Close search" className="focus-ring text-foreground">
            <X className="h-6 w-6" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto py-6">
          {!debouncedKeyword && recentSearches.length > 0 && (
            <div>
              <p className="mb-3 text-xs uppercase tracking-wide text-muted">Recent Searches</p>
              <div className="flex flex-wrap gap-2">
                {recentSearches.map((term) => (
                  <button
                    key={term}
                    onClick={() => setKeyword(term)}
                    className="focus-ring border border-border px-3 py-1.5 text-sm text-foreground hover:border-foreground"
                  >
                    {term}
                  </button>
                ))}
              </div>
            </div>
          )}

          {debouncedKeyword && isFetching && <p className="text-sm text-muted">Searching…</p>}

          {debouncedKeyword && !isFetching && !hasResults && (
            <p className="text-sm text-muted">No results for &ldquo;{debouncedKeyword}&rdquo;. Try another term.</p>
          )}

          {debouncedKeyword && data?.products.length > 0 && (
            <div className="mb-8">
              <p className="mb-3 text-xs uppercase tracking-wide text-muted">Products</p>
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
                {data.products.map((product) => (
                  <Link
                    key={product.id}
                    href={`/product/${product.slug}`}
                    onClick={() => {
                      saveRecentSearch(debouncedKeyword);
                      closeSearch();
                    }}
                    className="focus-ring group"
                  >
                    <div className="relative aspect-[4/5] bg-surface-alt">
                      <AppImage src={product.primary_image} alt={product.name} />
                    </div>
                    <p className="mt-2 text-sm text-foreground">{product.name}</p>
                    <p className="text-xs text-muted">{formatCurrency(product.price)}</p>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {debouncedKeyword && data?.categories.length > 0 && (
            <div className="mb-6">
              <p className="mb-3 text-xs uppercase tracking-wide text-muted">Categories</p>
              <div className="flex flex-wrap gap-2">
                {data.categories.map((category) => (
                  <Link
                    key={category.id}
                    href={`/category/${category.slug}`}
                    onClick={closeSearch}
                    className="focus-ring border border-border px-3 py-1.5 text-sm hover:border-foreground"
                  >
                    {category.name}
                  </Link>
                ))}
              </div>
            </div>
          )}

          {debouncedKeyword && data?.brands.length > 0 && (
            <div>
              <p className="mb-3 text-xs uppercase tracking-wide text-muted">Brands</p>
              <div className="flex flex-wrap gap-2">
                {data.brands.map((brand) => (
                  <Link
                    key={brand.id}
                    href={`/brand/${brand.slug}`}
                    onClick={closeSearch}
                    className="focus-ring border border-border px-3 py-1.5 text-sm hover:border-foreground"
                  >
                    {brand.name}
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>,
    document.body
  );
}
