import { Star } from "lucide-react";
import { cn } from "@/utils/cn";

export function Rating({ value = 0, count, size = "sm" }) {
  const rounded = Math.round(Number(value) || 0);
  const starSize = size === "lg" ? "h-5 w-5" : "h-3.5 w-3.5";

  return (
    <div className="flex items-center gap-1.5" aria-label={`Rated ${value} out of 5`}>
      <div className="flex" aria-hidden="true">
        {Array.from({ length: 5 }).map((_, index) => (
          <Star
            key={index}
            className={cn(starSize, index < rounded ? "fill-foreground text-foreground" : "text-border")}
          />
        ))}
      </div>
      {count !== undefined && <span className="text-xs text-muted">({count})</span>}
    </div>
  );
}
