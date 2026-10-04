"use client";

import { useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { useLogout } from "@/hooks/useAuth";
import { usePageTitle } from "@/hooks/usePageTitle";
import { Spinner } from "@/components/ui/Spinner";
import { cn } from "@/utils/cn";
import { findActiveNavItem } from "@/utils/nav";

const NAV_ITEMS = [
  { href: "/account", label: "Overview" },
  { href: "/account/orders", label: "Orders" },
  { href: "/account/wishlist", label: "Wishlist" },
  { href: "/account/addresses", label: "Addresses" },
  { href: "/account/notifications", label: "Notifications" },
  { href: "/account/settings", label: "Settings" },
];

export default function AccountLayout({ children }) {
  const { isAuthenticated, user } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const logout = useLogout();
  const activeNavItem = findActiveNavItem(NAV_ITEMS, pathname);
  usePageTitle(activeNavItem ? `${activeNavItem.label} — My Account` : "My Account");

  useEffect(() => {
    if (!isAuthenticated) router.push("/login");
  }, [isAuthenticated, router]);

  if (!isAuthenticated) return <Spinner />;

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
      <h1 className="mb-8 border-b border-border pb-8 font-serif text-3xl text-foreground print:hidden">
        Hello, {user?.name?.split(" ")[0]}
      </h1>
      <div className="grid gap-10 print:block lg:grid-cols-[220px_1fr]">
        <nav className="flex flex-row gap-4 overflow-x-auto print:hidden lg:flex-col lg:gap-1" aria-label="Account">
          {NAV_ITEMS.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "focus-ring whitespace-nowrap px-3 py-2 text-sm",
                item.href === activeNavItem?.href ? "bg-foreground text-background" : "text-foreground hover:bg-surface-alt"
              )}
            >
              {item.label}
            </Link>
          ))}
          <button
            onClick={() => logout.mutate()}
            className="focus-ring whitespace-nowrap px-3 py-2 text-left text-sm text-danger hover:bg-surface-alt"
          >
            Log Out
          </button>
        </nav>
        <div>{children}</div>
      </div>
    </div>
  );
}
