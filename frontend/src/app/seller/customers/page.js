"use client";

import { Users } from "lucide-react";
import { useSellerCustomers } from "@/hooks/useSeller";
import { EmptyState } from "@/components/ui/EmptyState";
import { Spinner } from "@/components/ui/Spinner";

export default function SellerCustomersPage() {
  const { data, isLoading } = useSellerCustomers();

  if (isLoading) return <Spinner />;

  return (
    <div>
      <h1 className="mb-6 font-serif text-2xl text-foreground">Customers</h1>

      {data?.items.length === 0 && <EmptyState icon={Users} title="No customers yet" description="Customers who purchase from your store will appear here." />}

      {data?.items.length > 0 && (
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-border text-muted">
              <th className="py-2">Name</th>
              <th className="py-2">Email</th>
              <th className="py-2 text-right">Orders From You</th>
            </tr>
          </thead>
          <tbody>
            {data.items.map((customer) => (
              <tr key={customer.id} className="border-b border-border/60">
                <td className="py-3 text-foreground">{customer.name}</td>
                <td className="py-3 text-muted">{customer.email}</td>
                <td className="py-3 text-right text-foreground">{customer.orders_from_store_count}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
