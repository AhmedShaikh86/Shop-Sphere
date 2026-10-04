import { cn } from "@/utils/cn";

const VARIANTS = {
  neutral: "bg-surface-alt text-foreground",
  accent: "bg-accent text-accent-foreground",
  success: "bg-success/10 text-success",
  danger: "bg-danger/10 text-danger",
  outline: "border border-border text-foreground",
};

export function Badge({ variant = "neutral", className, children }) {
  return (
    <span
      className={cn(
        "inline-flex items-center px-2.5 py-1 text-xs font-medium uppercase tracking-wide",
        VARIANTS[variant],
        className
      )}
    >
      {children}
    </span>
  );
}
