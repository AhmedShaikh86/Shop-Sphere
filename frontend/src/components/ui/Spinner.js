import { Loader2 } from "lucide-react";

export function Spinner({ className = "h-6 w-6" }) {
  return (
    <div className="flex items-center justify-center py-16" role="status" aria-label="Loading">
      <Loader2 className={`animate-spin text-muted ${className}`} />
    </div>
  );
}
