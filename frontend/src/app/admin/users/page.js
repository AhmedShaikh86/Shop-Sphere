"use client";

import { useState } from "react";
import { useAdminUsers } from "@/hooks/useAdmin";
import { Input } from "@/components/ui/Input";
import { Pagination } from "@/components/ui/Pagination";
import { Spinner } from "@/components/ui/Spinner";
import { formatDate } from "@/utils/format";

export default function AdminUsersPage() {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const { data, isLoading } = useAdminUsers({ search: search || undefined, page });

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <h1 className="font-serif text-2xl text-foreground">Customers</h1>
        <Input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by name or email"
          className="max-w-xs"
        />
      </div>

      {isLoading && <Spinner />}

      {!isLoading && (
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-border text-muted">
              <th className="py-2">Name</th>
              <th className="py-2">Email</th>
              <th className="py-2 text-right">Orders</th>
              <th className="py-2 text-right">Joined</th>
            </tr>
          </thead>
          <tbody>
            {data?.items.map((user) => (
              <tr key={user.id} className="border-b border-border/60">
                <td className="py-3 text-foreground">{user.name}</td>
                <td className="py-3 text-muted">{user.email}</td>
                <td className="py-3 text-right text-foreground">{user.orders_count}</td>
                <td className="py-3 text-right text-muted">{formatDate(user.created_at)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {data && <Pagination currentPage={data.meta.current_page} lastPage={data.meta.last_page} onPageChange={setPage} />}
    </div>
  );
}
