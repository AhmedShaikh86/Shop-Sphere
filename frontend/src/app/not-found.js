import Link from "next/link";
import { Compass } from "lucide-react";
import { Button } from "@/components/ui/Button";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-1 flex-col items-center justify-center gap-4 px-4 text-center">
      <Compass className="h-10 w-10 text-muted" strokeWidth={1.25} />
      <h1 className="font-serif text-3xl text-foreground">Page not found</h1>
      <p className="max-w-sm text-sm text-muted">The page you&apos;re looking for doesn&apos;t exist or may have moved.</p>
      <Button as={Link} href="/">
        Back to Home
      </Button>
    </div>
  );
}
