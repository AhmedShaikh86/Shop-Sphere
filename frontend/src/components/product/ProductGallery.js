"use client";

import { useState } from "react";
import { AppImage } from "@/components/ui/AppImage";
import { cn } from "@/utils/cn";

export function ProductGallery({ images, productName }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isZoomed, setIsZoomed] = useState(false);

  if (!images || images.length === 0) {
    return <div className="aspect-[4/5] w-full bg-surface-alt" />;
  }

  return (
    <div className="flex flex-col-reverse gap-4 sm:flex-row">
      <div className="flex shrink-0 gap-3 overflow-x-auto sm:flex-col">
        {images.map((image, index) => (
          <button
            key={image.id}
            onClick={() => setActiveIndex(index)}
            aria-label={`View image ${index + 1}`}
            aria-pressed={index === activeIndex}
            className={cn(
              "relative h-20 w-16 shrink-0 border",
              index === activeIndex ? "border-foreground" : "border-transparent"
            )}
          >
            <AppImage src={image.url} alt="" sizes="80px" />
          </button>
        ))}
      </div>

      <div
        className="relative flex-1 cursor-zoom-in overflow-hidden bg-surface-alt"
        onMouseEnter={() => setIsZoomed(true)}
        onMouseLeave={() => setIsZoomed(false)}
      >
        <div className="relative aspect-[4/5] w-full">
          <AppImage
            src={images[activeIndex].url}
            alt={images[activeIndex].alt_text || productName}
            sizes="(min-width: 1024px) 600px, 100vw"
            className={cn("transition-transform duration-300", isZoomed && "scale-125")}
            priority
          />
        </div>
      </div>
    </div>
  );
}
