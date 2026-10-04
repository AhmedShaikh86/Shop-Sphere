import Link from "next/link";
import { Button } from "@/components/ui/Button";

export function EmptyState({ icon: Icon, title, description, actionLabel, actionHref, onAction }) {
  return (
    <div className="flex flex-col items-center gap-4 px-6 py-20 text-center">
      {Icon && <Icon className="h-10 w-10 text-muted" strokeWidth={1.25} aria-hidden="true" />}
      <div className="space-y-1.5">
        <h3 className="font-serif text-xl text-foreground">{title}</h3>
        {description && <p className="max-w-sm text-sm text-muted">{description}</p>}
      </div>
      {actionLabel && actionHref && (
        <Button as={Link} href={actionHref} variant="primary">
          {actionLabel}
        </Button>
      )}
      {actionLabel && onAction && (
        <Button onClick={onAction} variant="primary">
          {actionLabel}
        </Button>
      )}
    </div>
  );
}
