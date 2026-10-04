"use client";

import { useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAuth, useLogout } from "@/hooks/useAuth";
import { usePageTitle } from "@/hooks/usePageTitle";
import { Spinner } from "@/components/ui/Spinner";
import { cn } from "@/utils/cn";
import { findActiveNavItem } from "@/utils/nav";

/**
 * Shared chrome for /seller and /admin: a sidebar of nav links plus a
 * role guard, since both dashboards follow the same shape and only the
 * link list and required role differ.
 */
export function DashboardShell({ role, brandLabel, navItems, banner, children }) {
  const { isAuthenticated, user } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const logout = useLogout();
  const activeNavItem = findActiveNavItem(navItems, pathname);
  usePageTitle(activeNavItem ? `${activeNavItem.label} — ${brandLabel}` : brandLabel);

  useEffect(() => {
    if (isAuthenticated && user?.role !== role) {
      router.push("/");
      return;
    }
    if (!isAuthenticated) {
      router.push("/login");
    }
  }, [isAuthenticated, user, role, router]);

  if (!isAuthenticated || user?.role !== role) return <Spinner />;

  return (
    <div className="flex min-h-screen">
      <aside className="hidden w-60 shrink-0 flex-col border-r border-border bg-surface md:flex">
        <Link href="/" className="border-b border-border px-6 py-5 font-serif text-lg text-foreground">
          SHOPSPHERE
        </Link>
        <p className="px-6 pt-4 text-xs uppercase tracking-wide text-muted">{brandLabel}</p>
        <nav className="mt-2 flex flex-1 flex-col gap-1 px-3">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "focus-ring flex items-center gap-2 px-3 py-2 text-sm",
                item.href === activeNavItem?.href ? "bg-foreground text-background" : "text-foreground hover:bg-surface-alt"
              )}
            >
              <item.icon className="h-4 w-4" />
              {item.label}
            </Link>
          ))}
        </nav>
        <button
          onClick={() => logout.mutate()}
          className="focus-ring border-t border-border px-6 py-4 text-left text-sm text-danger"
        >
          Log Out
        </button>
      </aside>

      <div className="flex-1">
        <div className="flex items-center justify-between border-b border-border bg-surface px-4 py-3 md:hidden">
          <span className="font-serif text-foreground">{brandLabel}</span>
          <select
            value={activeNavItem?.href || ""}
            onChange={(event) => router.push(event.target.value)}
            aria-label="Dashboard navigation"
            className="focus-ring border border-border bg-surface px-2 py-1.5 text-sm"
          >
            {navItems.map((item) => (
              <option key={item.href} value={item.href}>
                {item.label}
              </option>
            ))}
          </select>
        </div>
        {banner}
        <main className="px-4 py-8 sm:px-6 lg:px-10">{children}</main>
      </div>
    </div>
  );
}
