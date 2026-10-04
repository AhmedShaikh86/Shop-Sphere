"use client";

import { useState } from "react";
import Image from "next/image";
import { cn } from "@/utils/cn";

const UNSPLASH_HOME_URL = "https://unsplash.com/?utm_source=shopsphere&utm_medium=referral";
const POSITION_UTILITY_PATTERN = /(^|\s)(absolute|fixed|sticky|static|relative)(\s|$)/;

/**
 * The large "editorial" image slots (hero, category/collection banners,
 * brand story) — same job as AppImage, but with two things AppImage
 * intentionally doesn't do: a branded gradient placeholder (rather than a
 * small broken-image icon) when there's no photo at all, and an Unsplash
 * attribution caption when the photo came from there. Attribution is
 * required by Unsplash's API terms whenever a hotlinked photo is used.
 *
 * Always fills its parent (h-full w-full) and defaults to `position:
 * relative` as the positioning context for the fill image + caption —
 * unless the caller's className already sets a position (e.g. "absolute
 * inset-0" to sit behind sibling overlay content), since an element can
 * only have one `position` value.
 *
 * The caption is rendered as buttons, not anchors: this component is often
 * used inside a card that's itself a <Link>, and a nested <a> would be
 * invalid HTML with unpredictable click behavior.
 */
export function EditorialImage({
  src,
  alt,
  photoCreditName,
  photoCreditUrl,
  className,
  fill = true,
  sizes = "100vw",
  priority = false,
  children,
}) {
  const [hasError, setHasError] = useState(false);

  const showImage = src && !hasError;
  const hasPositionOverride = POSITION_UTILITY_PATTERN.test(className || "");

  function openInNewTab(event, url) {
    event.preventDefault();
    event.stopPropagation();
    window.open(url, "_blank", "noopener,noreferrer");
  }

  return (
    <div
      className={cn(
        "h-full w-full overflow-hidden",
        !hasPositionOverride && "relative",
        !showImage && "gradient-fallback",
        className
      )}
    >
      {showImage && (
        <Image
          src={src}
          alt={alt || ""}
          fill={fill}
          sizes={sizes}
          priority={priority}
          className="object-cover"
          onError={() => setHasError(true)}
        />
      )}

      {children}

      {showImage && photoCreditName && (
        <p className="absolute bottom-2 right-2 z-10 bg-foreground/40 px-2 py-1 text-[10px] text-white/90 opacity-0 transition-opacity hover:opacity-100 focus-within:opacity-100 group-hover:opacity-100">
          Photo by{" "}
          <button type="button" onClick={(event) => openInNewTab(event, photoCreditUrl)} className="focus-ring underline">
            {photoCreditName}
          </button>{" "}
          on{" "}
          <button type="button" onClick={(event) => openInNewTab(event, UNSPLASH_HOME_URL)} className="focus-ring underline">
            Unsplash
          </button>
        </p>
      )}
    </div>
  );
}
