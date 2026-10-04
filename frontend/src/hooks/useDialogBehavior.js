"use client";

import { useEffect, useRef } from "react";

const FOCUSABLE_SELECTOR =
  'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

/**
 * Shared keyboard/focus behavior for every full-screen overlay (Modal,
 * CartDrawer, SearchOverlay, MobileNav): closes on Escape, traps Tab/
 * Shift+Tab inside the dialog so keyboard users can't reach the page
 * behind it, locks body scroll while open, and returns focus to whatever
 * triggered the dialog once it closes.
 *
 * `containerRef` must point at the dialog's outer element (used as the
 * Tab-trap boundary). `initialFocusRef` is what receives focus when the
 * dialog opens — e.g. a search input rather than the container itself —
 * and defaults to `containerRef` when omitted.
 */
export function useDialogBehavior(isOpen, onClose, containerRef, initialFocusRef) {
  const previouslyFocusedRef = useRef(null);

  useEffect(() => {
    if (!isOpen) return;

    previouslyFocusedRef.current = document.activeElement;
    (initialFocusRef ?? containerRef).current?.focus();
    document.body.style.overflow = "hidden";

    function handleKeyDown(event) {
      if (event.key === "Escape") {
        onClose();
        return;
      }

      if (event.key !== "Tab" || !containerRef.current) return;

      const focusable = containerRef.current.querySelectorAll(FOCUSABLE_SELECTOR);
      if (focusable.length === 0) return;

      const first = focusable[0];
      const last = focusable[focusable.length - 1];

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    }

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
      previouslyFocusedRef.current?.focus?.();
    };
  }, [isOpen, onClose, containerRef, initialFocusRef]);
}
