"use client";

import { useRef } from "react";
import Link from "next/link";
import { X } from "lucide-react";
import { useUiStore } from "@/store/uiStore";
import { useDialogBehavior } from "@/hooks/useDialogBehavior";
import { createPortal } from "react-dom";

export function MobileNav({ categories }) {
  const { isMobileNavOpen, closeMobileNav } = useUiStore();
  const panelRef = useRef(null);
  useDialogBehavior(isMobileNavOpen, closeMobileNav, panelRef);

  if (!isMobileNavOpen) return null;

  return createPortal(
    <div className="fixed inset-0 z-50 lg:hidden">
      <button aria-label="Close menu" className="absolute inset-0 bg-foreground/40" onClick={closeMobileNav} />
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-label="Menu"
        tabIndex={-1}
        className="focus-ring relative flex h-full w-4/5 max-w-xs flex-col bg-surface p-6"
      >
        <button onClick={closeMobileNav} aria-label="Close menu" className="focus-ring self-end text-foreground">
          <X className="h-6 w-6" />
        </button>
        <nav className="mt-8 flex flex-col gap-6" aria-label="Mobile">
          {categories.map((category) => (
            <Link
              key={category.id}
              href={`/category/${category.slug}`}
              onClick={closeMobileNav}
              className="focus-ring text-lg uppercase tracking-wide text-foreground"
            >
              {category.name}
            </Link>
          ))}
          <Link href="/shop?on_sale=true" onClick={closeMobileNav} className="focus-ring text-lg uppercase tracking-wide text-accent">
            Sale
          </Link>
          <Link href="/collection/new-season" onClick={closeMobileNav} className="focus-ring text-sm text-muted">
            New Season
          </Link>
          <Link href="/about" onClick={closeMobileNav} className="focus-ring text-sm text-muted">
            About
          </Link>
          <Link href="/contact" onClick={closeMobileNav} className="focus-ring text-sm text-muted">
            Contact
          </Link>
        </nav>
      </div>
    </div>,
    document.body
  );
}
