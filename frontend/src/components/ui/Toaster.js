"use client";

import { CheckCircle2, XCircle } from "lucide-react";
import { useToastStore } from "@/store/toastStore";
import { cn } from "@/utils/cn";

export function Toaster() {
  const toasts = useToastStore((state) => state.toasts);
  const dismissToast = useToastStore((state) => state.dismissToast);

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-4 right-4 z-[60] flex w-full max-w-sm flex-col gap-2" role="status" aria-live="polite">
      {toasts.map((toast) => (
        <button
          key={toast.id}
          onClick={() => dismissToast(toast.id)}
          className={cn(
            "flex items-start gap-2 border bg-surface px-4 py-3 text-left text-sm shadow-lg",
            toast.variant === "error" ? "border-danger/30" : "border-success/30"
          )}
        >
          {toast.variant === "error" ? (
            <XCircle className="mt-0.5 h-4 w-4 shrink-0 text-danger" />
          ) : (
            <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-success" />
          )}
          <span className="text-foreground">{toast.message}</span>
        </button>
      ))}
    </div>
  );
}
