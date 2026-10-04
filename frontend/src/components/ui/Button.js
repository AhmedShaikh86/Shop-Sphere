import { cn } from "@/utils/cn";
import { Loader2 } from "lucide-react";

const VARIANTS = {
  primary: "bg-foreground text-background hover:bg-foreground/85",
  accent: "bg-accent text-accent-foreground hover:bg-accent/90",
  outline: "border border-foreground/20 text-foreground hover:border-foreground/60",
  ghost: "text-foreground hover:bg-surface-alt",
  danger: "bg-danger text-white hover:bg-danger/90",
};

const SIZES = {
  sm: "text-sm px-3 py-1.5",
  md: "text-sm px-5 py-2.5",
  lg: "text-base px-7 py-3.5",
};

export function Button({
  as: Component = "button",
  variant = "primary",
  size = "md",
  isLoading = false,
  disabled = false,
  className,
  children,
  ...props
}) {
  return (
    <Component
      disabled={disabled || isLoading}
      className={cn(
        "focus-ring inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-none tracking-wide transition-colors disabled:cursor-not-allowed disabled:opacity-50",
        VARIANTS[variant],
        SIZES[size],
        className
      )}
      {...props}
    >
      {isLoading && <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />}
      {children}
    </Component>
  );
}
