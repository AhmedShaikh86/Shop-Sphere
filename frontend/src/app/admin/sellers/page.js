"use client";

import { Suspense, useState } from "react";
import { useSearchParams } from "next/navigation";
import { useAdminSellers, useApproveSeller, useSuspendSeller } from "@/hooks/useAdmin";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Select } from "@/components/ui/Input";
import { Spinner } from "@/components/ui/Spinner";
import { AppImage } from "@/components/ui/AppImage";

const STATUS_VARIANTS = { pending: "outline", approved: "success", suspended: "danger" };

function AdminSellersContent() {
  const searchParams = useSearchParams();
  const [status, setStatus] = useState(searchParams.get("status") || "");
  const { data, isLoading } = useAdminSellers({ status: status || undefined });
  const approveSeller = useApproveSeller();
  const suspendSeller = useSuspendSeller();

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <h1 className="font-serif text-2xl text-foreground">Sellers</h1>
        <Select value={status} onChange={(e) => setStatus(e.target.value)} className="max-w-[180px]">
          <option value="">All Statuses</option>
          <option value="pending">Pending</option>
          <option value="approved">Approved</option>
          <option value="suspended">Suspended</option>
        </Select>
      </div>

      {isLoading && <Spinner />}

      <div className="flex flex-col gap-3">
        {data?.items.map((store) => (
          <div key={store.id} className="flex flex-wrap items-center gap-4 border border-border p-4">
            <div className="relative h-12 w-12 shrink-0 bg-surface-alt">
              <AppImage src={store.logo_url} alt="" sizes="48px" />
            </div>
            <div className="flex-1">
              <p className="text-sm text-foreground">{store.name}</p>
              <p className="text-xs text-muted">{store.owner?.email}</p>
            </div>
            <Badge variant={STATUS_VARIANTS[store.status]}>{store.status}</Badge>
            <div className="flex gap-2">
              {store.status !== "approved" && (
                <Button size="sm" onClick={() => approveSeller.mutate(store.id)}>
                  Approve
                </Button>
              )}
              {store.status !== "suspended" && (
                <Button size="sm" variant="outline" onClick={() => suspendSeller.mutate(store.id)}>
                  Suspend
                </Button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function AdminSellersPage() {
  return (
    <Suspense fallback={<Spinner />}>
      <AdminSellersContent />
    </Suspense>
  );
}
