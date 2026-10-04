"use client";

import { cn } from "@/utils/cn";

export function VariantSelector({ variants, selectedSize, selectedColor, onSelectSize, onSelectColor }) {
  const sizes = [...new Set(variants.map((v) => v.size).filter(Boolean))];
  const colors = [...new Set(variants.map((v) => v.color).filter(Boolean))];

  function isSizeAvailable(size) {
    return variants.some((v) => v.size === size && (!selectedColor || v.color === selectedColor) && v.in_stock);
  }

  function isColorAvailable(color) {
    return variants.some((v) => v.color === color && (!selectedSize || v.size === selectedSize) && v.in_stock);
  }

  return (
    <div className="flex flex-col gap-5">
      {colors.length > 0 && (
        <div>
          <p className="mb-2 text-xs uppercase tracking-wide text-muted">
            Color{selectedColor ? `: ${selectedColor}` : ""}
          </p>
          <div className="flex flex-wrap gap-2">
            {colors.map((color) => (
              <button
                key={color}
                type="button"
                onClick={() => onSelectColor(color)}
                disabled={!isColorAvailable(color)}
                aria-pressed={selectedColor === color}
                className={cn(
                  "focus-ring border px-3 py-1.5 text-sm",
                  selectedColor === color ? "border-foreground bg-foreground text-background" : "border-border text-foreground",
                  !isColorAvailable(color) && "cursor-not-allowed opacity-30"
                )}
              >
                {color}
              </button>
            ))}
          </div>
        </div>
      )}

      {sizes.length > 0 && (
        <div>
          <p className="mb-2 text-xs uppercase tracking-wide text-muted">
            Size{selectedSize ? `: ${selectedSize}` : ""}
          </p>
          <div className="flex flex-wrap gap-2">
            {sizes.map((size) => (
              <button
                key={size}
                type="button"
                onClick={() => onSelectSize(size)}
                disabled={!isSizeAvailable(size)}
                aria-pressed={selectedSize === size}
                className={cn(
                  "focus-ring min-w-[2.75rem] border px-3 py-1.5 text-sm",
                  selectedSize === size ? "border-foreground bg-foreground text-background" : "border-border text-foreground",
                  !isSizeAvailable(size) && "cursor-not-allowed opacity-30 line-through"
                )}
              >
                {size}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
