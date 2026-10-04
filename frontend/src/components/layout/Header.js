"use client";

import Link from "next/link";
import { Heart, Menu, Search, ShoppingBag, User } from "lucide-react";
import { useCategories } from "@/hooks/useCatalog";
import { useCart } from "@/hooks/useCart";
import { useAuth } from "@/hooks/useAuth";
import { useUiStore } from "@/store/uiStore";
import { CartDrawer } from "@/components/layout/CartDrawer";
import { SearchOverlay } from "@/components/layout/SearchOverlay";
import { MobileNav } from "@/components/layout/MobileNav";

export function Header() {
  const { data: categories } = useCategories();
  const { data: cartItems } = useCart();
  const { isAuthenticated, user } = useAuth();
  const { openCart, openSearch, toggleMobileNav } = useUiStore();

  const cartCount = cartItems?.reduce((sum, item) => sum + item.quantity, 0) || 0;
  const accountHref = user?.role === "admin" ? "/admin/dashboard" : user?.role === "seller" ? "/seller/dashboard" : "/account";

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background/95 backdrop-blur print:hidden">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8">
        <button
          type="button"
          onClick={toggleMobileNav}
          className="focus-ring text-foreground lg:hidden"
          aria-label="Open menu"
        >
          <Menu className="h-6 w-6" />
        </button>

        <Link href="/" className="focus-ring font-serif text-2xl tracking-wide text-foreground">
          SHOPSPHERE
        </Link>

        <nav className="hidden items-center gap-8 lg:flex" aria-label="Primary">
          {(categories || []).map((category) => (
            <Link
              key={category.id}
              href={`/category/${category.slug}`}
              className="focus-ring text-sm uppercase tracking-wide text-foreground hover:text-muted"
            >
              {category.name}
            </Link>
          ))}
          <Link href="/shop?on_sale=true" className="focus-ring text-sm uppercase tracking-wide text-accent">
            Sale
          </Link>
        </nav>

        <div className="flex items-center gap-4">
          <button type="button" onClick={openSearch} aria-label="Search" className="focus-ring text-foreground">
            <Search className="h-5 w-5" />
          </button>
          <Link
            href={isAuthenticated ? "/account/wishlist" : "/login"}
            aria-label="Wishlist"
            className="focus-ring hidden text-foreground sm:block"
          >
            <Heart className="h-5 w-5" />
          </Link>
          <Link href={isAuthenticated ? accountHref : "/login"} aria-label="Account" className="focus-ring text-foreground">
            <User className="h-5 w-5" />
          </Link>
          <button
            type="button"
            onClick={openCart}
            aria-label={`Cart, ${cartCount} items`}
            className="focus-ring relative text-foreground"
          >
            <ShoppingBag className="h-5 w-5" />
            {cartCount > 0 && (
              <span className="absolute -right-2 -top-2 flex h-4 w-4 items-center justify-center rounded-full bg-accent text-[10px] text-accent-foreground">
                {cartCount}
              </span>
            )}
          </button>
        </div>
      </div>

      <CartDrawer />
      <SearchOverlay />
      <MobileNav categories={categories || []} />
    </header>
  );
}
