"use client";

import { useEffect } from "react";

/**
 * Sets the browser tab title for pages that can't export Next.js
 * `metadata` because they (or an ancestor layout) need "use client" —
 * mainly the auth-gated dashboards, where every page otherwise falls
 * back to the root layout's generic title. Distinct titles are also a
 * basic accessibility expectation (WCAG 2.4.2), not just a nicety.
 *
 * Public, indexable pages should use Next's `metadata`/`generateMetadata`
 * instead — this hook only affects the tab title, not search/social
 * previews.
 */
export function usePageTitle(title) {
  useEffect(() => {
    if (!title) return;

    const previousTitle = document.title;
    document.title = `${title} — ShopSphere`;

    return () => {
      document.title = previousTitle;
    };
  }, [title]);
}
