"use client";

import {
  LayoutDashboard,
  Users,
  Store,
  Package,
  FolderTree,
  Tag,
  ShoppingCart,
  Ticket,
  Star,
  ScrollText,
} from "lucide-react";
import { DashboardShell } from "@/components/dashboard/DashboardShell";

const NAV_ITEMS = [
  { href: "/admin/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/users", label: "Customers", icon: Users },
  { href: "/admin/sellers", label: "Sellers", icon: Store },
  { href: "/admin/products", label: "Products", icon: Package },
  { href: "/admin/categories", label: "Categories", icon: FolderTree },
  { href: "/admin/brands", label: "Brands", icon: Tag },
  { href: "/admin/collections", label: "Collections", icon: FolderTree },
  { href: "/admin/orders", label: "Orders", icon: ShoppingCart },
  { href: "/admin/coupons", label: "Coupons", icon: Ticket },
  { href: "/admin/reviews", label: "Reviews", icon: Star },
  { href: "/admin/activity-logs", label: "Activity Logs", icon: ScrollText },
];

export default function AdminLayout({ children }) {
  return (
    <DashboardShell role="admin" brandLabel="Admin Dashboard" navItems={NAV_ITEMS}>
      {children}
    </DashboardShell>
  );
}
