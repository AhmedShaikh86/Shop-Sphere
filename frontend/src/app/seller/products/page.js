"use client";

import { useState } from "react";
import Link from "next/link";
import { Package, Plus } from "lucide-react";
import { useArchiveProduct, useSellerProducts, useSubmitProductForReview } from "@/hooks/useSeller";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { EmptyState } from "@/components/ui/EmptyState";
import { Select } from "@/components/ui/Input";
import { Pagination } from "@/components/ui/Pagination";
import { Spinner } from "@/components/ui/Spinner";
import { AppImage } from "@/components/ui/AppImage";
import { formatCurrency, formatStatusLabel } from "@/utils/format";

const STATUS_VARIANTS = {
  draft: "neutral",
  pending_review: "outline",
  published: "success",
  archived: "danger",
};

export default function SellerProductsPage() {
  const [status, setStatus] = useState("");
  const [page, setPage] = useState(1);
  const { data, isLoading } = useSellerProducts({ status: status || undefined, page });
  const submitForReview = useSubmitProductForReview();
  const archiveProduct = useArchiveProduct();

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <h1 className="font-serif text-2xl text-foreground">Products</h1>
        <div className="flex items-center gap-3">
          <Select value={status} onChange={(e) => setStatus(e.target.value)} className="max-w-[180px]">
            <option value="">All Statuses</option>
            <option value="draft">Draft</option>
            <option value="pending_review">Pending Review</option>
            <option value="published">Published</option>
            <option value="archived">Archived</option>
          </Select>
          <Button as={Link} href="/seller/products/new">
            <Plus className="h-4 w-4" /> Add Product
          </Button>
        </div>
      </div>

      {isLoading && <Spinner />}

      {!isLoading && data?.items.length === 0 && (
        <EmptyState icon={Package} title="No products yet" description="Add your first product to start selling." actionLabel="Add Product" actionHref="/seller/products/new" />
      )}

      {!isLoading && data?.items.length > 0 && (
        <div className="flex flex-col gap-3">
          {data.items.map((product) => (
            <div key={product.id} className="flex flex-wrap items-center gap-4 border border-border p-4">
              <div className="relative h-16 w-14 shrink-0 bg-surface-alt">
                <AppImage src={product.images?.[0]?.url} alt="" sizes="60px" />
              </div>
              <div className="flex-1">
                <Link href={`/seller/products/${product.id}/edit`} className="focus-ring text-sm text-foreground hover:underline">
                  {product.name}
                </Link>
                <p className="text-xs text-muted">{formatCurrency(product.base_price)}</p>
              </div>
              <Badge variant={STATUS_VARIANTS[product.status]}>{formatStatusLabel(product.status)}</Badge>
              <div className="flex gap-2">
                {["draft", "archived"].includes(product.status) && (
                  <Button size="sm" variant="outline" onClick={() => submitForReview.mutate(product.id)}>
                    Submit for Review
                  </Button>
                )}
                {product.status === "published" && (
                  <Button size="sm" variant="outline" onClick={() => archiveProduct.mutate(product.id)}>
                    Archive
                  </Button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {data && <Pagination currentPage={data.meta.current_page} lastPage={data.meta.last_page} onPageChange={setPage} />}
    </div>
  );
}
