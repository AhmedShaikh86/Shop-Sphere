import Link from "next/link";

export default function AuthLayout({ children }) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-surface-alt px-4 py-16">
      <Link href="/" className="mb-10 font-serif text-2xl tracking-wide text-foreground">
        SHOPSPHERE
      </Link>
      <div className="w-full max-w-md border border-border bg-surface p-8">{children}</div>
    </div>
  );
}
