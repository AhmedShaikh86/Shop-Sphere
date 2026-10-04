"use client";

import { Suspense, useState } from "react";
import { useSearchParams } from "next/navigation";
import { useAdminProducts, useApproveProduct, useRejectProduct } from "@/hooks/useAdmin";
import { AppImage } from "@/components/ui/AppImage";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Select } from "@/components/ui/Input";
import { Pagination } from "@/components/ui/Pagination";
import { Spinner } from "@/components/ui/Spinner";
import { formatCurrency, formatStatusLabel } from "@/utils/format";

const STATUS_VARIANTS = { draft: "neutral", pending_review: "outline", published: "success", archived: "danger" };

function AdminProductsContent() {
  const searchParams = useSearchParams();
  const [status, setStatus] = useState(searchParams.get("status") || "");
  const [page, setPage] = useState(1);
  const { data, isLoading } = useAdminProducts({ status: status || undefined, page });
  const approveProduct = useApproveProduct();
  const rejectProduct = useRejectProduct();

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <h1 className="font-serif text-2xl text-foreground">Products</h1>
        <Select value={status} onChange={(e) => setStatus(e.target.value)} className="max-w-[200px]">
          <option value="">All Statuses</option>
          <option value="draft">Draft</option>
          <option value="pending_review">Pending Review</option>
          <option value="published">Published</option>
          <option value="archived">Archived</option>
        </Select>
      </div>

      {isLoading && <Spinner />}

      <div className="flex flex-col gap-3">
        {data?.items.map((product) => (
          <div key={product.id} className="flex flex-wrap items-center gap-4 border border-border p-4">
            <div className="relative h-16 w-14 shrink-0 bg-surface-alt">
              <AppImage src={product.images?.[0]?.url} alt="" sizes="60px" />
            </div>
            <div className="flex-1">
              <p className="text-sm text-foreground">{product.name}</p>
              <p className="text-xs text-muted">
                {product.store?.name} &middot; {formatCurrency(product.base_price)}
              </p>
            </div>
            <Badge variant={STATUS_VARIANTS[product.status]}>{formatStatusLabel(product.status)}</Badge>
            {product.status === "pending_review" && (
              <div className="flex gap-2">
                <Button size="sm" onClick={() => approveProduct.mutate(product.id)}>
                  Approve
                </Button>
                <Button size="sm" variant="outline" onClick={() => rejectProduct.mutate(product.id)}>
                  Reject
                </Button>
              </div>
            )}
          </div>
        ))}
      </div>

      {data && <Pagination currentPage={data.meta.current_page} lastPage={data.meta.last_page} onPageChange={setPage} />}
    </div>
  );
}

export default function AdminProductsPage() {
  return (
    <Suspense fallback={<Spinner />}>
      <AdminProductsContent />
    </Suspense>
  );
}
