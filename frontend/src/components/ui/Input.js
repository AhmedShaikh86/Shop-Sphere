import { forwardRef } from "react";
import { cn } from "@/utils/cn";

export const Input = forwardRef(function Input({ className, error, ...props }, ref) {
  return (
    <input
      ref={ref}
      className={cn(
        "focus-ring w-full border bg-surface px-3.5 py-2.5 text-sm text-foreground placeholder:text-muted",
        error ? "border-danger" : "border-border",
        className
      )}
      {...props}
    />
  );
});

export const Textarea = forwardRef(function Textarea({ className, error, ...props }, ref) {
  return (
    <textarea
      ref={ref}
      className={cn(
        "focus-ring w-full border bg-surface px-3.5 py-2.5 text-sm text-foreground placeholder:text-muted",
        error ? "border-danger" : "border-border",
        className
      )}
      {...props}
    />
  );
});

export const Select = forwardRef(function Select({ className, error, children, ...props }, ref) {
  return (
    <select
      ref={ref}
      className={cn(
        "focus-ring w-full border bg-surface px-3.5 py-2.5 text-sm text-foreground",
        error ? "border-danger" : "border-border",
        className
      )}
      {...props}
    >
      {children}
    </select>
  );
});

export function FormField({ label, htmlFor, error, children, hint }) {
  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label htmlFor={htmlFor} className="text-sm font-medium text-foreground">
          {label}
        </label>
      )}
      {children}
      {hint && !error && <p className="text-xs text-muted">{hint}</p>}
      {error && <p className="text-xs text-danger">{error}</p>}
    </div>
  );
}
