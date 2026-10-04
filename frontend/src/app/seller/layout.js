"use client";

import { LayoutDashboard, Package, ShoppingCart, Users, Star, Tag, Store as StoreIcon } from "lucide-react";
import { DashboardShell } from "@/components/dashboard/DashboardShell";
import { useSellerStore } from "@/hooks/useSeller";

const NAV_ITEMS = [
  { href: "/seller/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/seller/products", label: "Products", icon: Package },
  { href: "/seller/orders", label: "Orders", icon: ShoppingCart },
  { href: "/seller/customers", label: "Customers", icon: Users },
  { href: "/seller/reviews", label: "Reviews", icon: Star },
  { href: "/seller/coupons", label: "Coupons", icon: Tag },
  { href: "/seller/settings", label: "Store Settings", icon: StoreIcon },
];

export default function SellerLayout({ children }) {
  const { data: store } = useSellerStore();

  const banner = store && store.status !== "approved" && (
    <div className="border-b border-border bg-surface-alt px-6 py-3 text-sm text-foreground">
      {store.status === "pending"
        ? "Your store is pending admin approval. You can prepare products now — they'll be visible to shoppers once your store and products are approved."
        : "Your store has been suspended. Contact support for more information."}
    </div>
  );

  return (
    <DashboardShell role="seller" brandLabel="Seller Dashboard" navItems={NAV_ITEMS} banner={banner}>
      {children}
    </DashboardShell>
  );
}
