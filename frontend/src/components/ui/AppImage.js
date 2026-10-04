"use client";

import { useState } from "react";
import Image from "next/image";
import { ImageOff } from "lucide-react";
import { cn } from "@/utils/cn";

/**
 * Wraps next/image with a graceful fallback: if a seeded/placeholder image
 * URL ever fails to load, this shows a neutral icon instead of a broken
 * image glyph, so the premium look never breaks on a flaky network.
 */
export function AppImage({ src, alt, className, fill = true, sizes = "400px", ...props }) {
  const [hasError, setHasError] = useState(false);

  if (!src || hasError) {
    return (
      <div className={cn("flex items-center justify-center bg-surface-alt", className)}>
        <ImageOff className="h-6 w-6 text-muted" aria-hidden="true" />
      </div>
    );
  }

  return (
    <Image
      src={src}
      alt={alt || ""}
      fill={fill}
      sizes={sizes}
      className={cn("object-cover", className)}
      onError={() => setHasError(true)}
      {...props}
    />
  );
}
