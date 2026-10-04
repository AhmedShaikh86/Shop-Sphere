"use client";

import { useBrands } from "@/hooks/useCatalog";
import { Select } from "@/components/ui/Input";

const SIZES = ["XS", "S", "M", "L", "XL", "7", "8", "9", "10", "11"];
const COLORS = [
  "Black", "White", "Ivory", "Camel", "Charcoal", "Navy", "Olive", "Rust",
  "Sand", "Blush", "Indigo", "Champagne", "Tan", "Gold", "Tortoise", "Chestnut", "Sky Blue",
];

/**
 * Every filter here maps 1:1 to a query param the backend's
 * Product::scopeFilter() understands, so the sidebar can just write
 * straight into the URL and the page re-fetches from there.
 */
export function ProductFilters({ filters, onChange, hideBrand = false }) {
  const { data: brands } = useBrands();

  function set(key, value) {
    onChange({ ...filters, [key]: value || undefined });
  }

  return (
    <div className="flex flex-col gap-6">
      {!hideBrand && (
        <div>
          <label className="mb-2 block text-xs uppercase tracking-wide text-muted">Brand</label>
          <Select value={filters.brand_slug || ""} onChange={(e) => set("brand_slug", e.target.value)}>
            <option value="">All Brands</option>
            {brands?.map((brand) => (
              <option key={brand.id} value={brand.slug}>
                {brand.name}
              </option>
            ))}
          </Select>
        </div>
      )}

      <div>
        <label className="mb-2 block text-xs uppercase tracking-wide text-muted">Gender</label>
        <Select value={filters.gender || ""} onChange={(e) => set("gender", e.target.value)}>
          <option value="">All</option>
          <option value="women">Women</option>
          <option value="men">Men</option>
          <option value="unisex">Unisex</option>
        </Select>
      </div>

      <div>
        <label className="mb-2 block text-xs uppercase tracking-wide text-muted">Price Range</label>
        <div className="flex items-center gap-2">
          <input
            type="number"
            min="0"
            placeholder="Min"
            value={filters.min_price || ""}
            onChange={(e) => set("min_price", e.target.value)}
            className="focus-ring w-full border border-border bg-surface px-3 py-2 text-sm"
          />
          <span className="text-muted">–</span>
          <input
            type="number"
            min="0"
            placeholder="Max"
            value={filters.max_price || ""}
            onChange={(e) => set("max_price", e.target.value)}
            className="focus-ring w-full border border-border bg-surface px-3 py-2 text-sm"
          />
        </div>
      </div>

      <div>
        <label className="mb-2 block text-xs uppercase tracking-wide text-muted">Size</label>
        <Select value={filters.size || ""} onChange={(e) => set("size", e.target.value)}>
          <option value="">All Sizes</option>
          {SIZES.map((size) => (
            <option key={size} value={size}>
              {size}
            </option>
          ))}
        </Select>
      </div>

      <div>
        <label className="mb-2 block text-xs uppercase tracking-wide text-muted">Color</label>
        <Select value={filters.color || ""} onChange={(e) => set("color", e.target.value)}>
          <option value="">All Colors</option>
          {COLORS.map((color) => (
            <option key={color} value={color}>
              {color}
            </option>
          ))}
        </Select>
      </div>

      <div>
        <label className="mb-2 block text-xs uppercase tracking-wide text-muted">Minimum Rating</label>
        <Select value={filters.min_rating || ""} onChange={(e) => set("min_rating", e.target.value)}>
          <option value="">Any Rating</option>
          <option value="4">4 stars & up</option>
          <option value="3">3 stars & up</option>
        </Select>
      </div>

      <label className="flex items-center gap-2 text-sm text-foreground">
        <input
          type="checkbox"
          checked={Boolean(filters.on_sale)}
          onChange={(e) => set("on_sale", e.target.checked ? "1" : "")}
        />
        On Sale
      </label>

      <label className="flex items-center gap-2 text-sm text-foreground">
        <input
          type="checkbox"
          checked={Boolean(filters.in_stock)}
          onChange={(e) => set("in_stock", e.target.checked ? "1" : "")}
        />
        In Stock Only
      </label>

      <button
        type="button"
        onClick={() => onChange({})}
        className="focus-ring text-left text-xs uppercase tracking-wide text-muted underline hover:text-foreground"
      >
        Clear Filters
      </button>
    </div>
  );
}

export function ProductSort({ value, onChange }) {
  return (
    <Select value={value || "newest"} onChange={(e) => onChange(e.target.value)} className="max-w-[200px]">
      <option value="newest">Newest</option>
      <option value="price_asc">Price: Low to High</option>
      <option value="price_desc">Price: High to Low</option>
      <option value="rating">Top Rated</option>
    </Select>
  );
}
