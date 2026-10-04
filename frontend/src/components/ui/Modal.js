"use client";

import { useRef } from "react";
import { createPortal } from "react-dom";
import { X } from "lucide-react";
import { useDialogBehavior } from "@/hooks/useDialogBehavior";
import { cn } from "@/utils/cn";

export function Modal({ isOpen, onClose, title, children, className }) {
  const panelRef = useRef(null);
  useDialogBehavior(isOpen, onClose, panelRef);

  if (!isOpen || typeof document === "undefined") return null;

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <button
        type="button"
        aria-label="Close dialog"
        className="absolute inset-0 bg-foreground/40"
        onClick={onClose}
      />
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-label={title}
        tabIndex={-1}
        className={cn(
          "focus-ring relative z-10 w-full max-w-md border border-border bg-surface p-6 shadow-xl",
          className
        )}
      >
        <div className="mb-4 flex items-start justify-between gap-4">
          {title && <h2 className="font-serif text-xl text-foreground">{title}</h2>}
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="focus-ring ml-auto text-muted hover:text-foreground"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        {children}
      </div>
    </div>,
    document.body
  );
}
