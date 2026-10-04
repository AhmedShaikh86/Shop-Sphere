import { AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/Button";

export function ErrorState({
  title = "Something went wrong",
  description = "Please try again in a moment.",
  onRetry,
}) {
  return (
    <div className="flex flex-col items-center gap-4 px-6 py-20 text-center">
      <AlertTriangle className="h-10 w-10 text-danger" strokeWidth={1.25} aria-hidden="true" />
      <div className="space-y-1.5">
        <h3 className="font-serif text-xl text-foreground">{title}</h3>
        <p className="max-w-sm text-sm text-muted">{description}</p>
      </div>
      {onRetry && (
        <Button onClick={onRetry} variant="outline">
          Try again
        </Button>
      )}
    </div>
  );
}
