"use client";

import { useState } from "react";
import { Trash2 } from "lucide-react";
import { useAdminReviews, useDeleteAdminReview } from "@/hooks/useAdmin";
import { Rating } from "@/components/ui/Rating";
import { Badge } from "@/components/ui/Badge";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { Pagination } from "@/components/ui/Pagination";
import { Spinner } from "@/components/ui/Spinner";
import { formatDate } from "@/utils/format";

export default function AdminReviewsPage() {
  const [page, setPage] = useState(1);
  const { data, isLoading } = useAdminReviews({ page });
  const deleteReview = useDeleteAdminReview();
  const [deletingId, setDeletingId] = useState(null);

  if (isLoading) return <Spinner />;

  return (
    <div>
      <h1 className="mb-6 font-serif text-2xl text-foreground">Reviews</h1>

      <ul className="flex flex-col gap-4">
        {data?.items.map((review) => (
          <li key={review.id} className="flex items-start justify-between gap-4 border border-border p-4">
            <div>
              <div className="flex items-center gap-3">
                <Rating value={review.rating} />
                {review.is_verified_purchase && <Badge variant="success">Verified Purchase</Badge>}
              </div>
              <p className="mt-2 text-sm text-foreground">{review.product_name}</p>
              {review.body && <p className="mt-1 text-sm text-muted">{review.body}</p>}
              <p className="mt-2 text-xs text-muted">
                {review.user_name} &middot; {formatDate(review.created_at)}
              </p>
            </div>
            <button onClick={() => setDeletingId(review.id)} className="focus-ring text-muted hover:text-danger">
              <Trash2 className="h-4 w-4" />
            </button>
          </li>
        ))}
      </ul>

      {data && <Pagination currentPage={data.meta.current_page} lastPage={data.meta.last_page} onPageChange={setPage} />}

      <ConfirmDialog
        isOpen={Boolean(deletingId)}
        onClose={() => setDeletingId(null)}
        onConfirm={() => deleteReview.mutate(deletingId, { onSuccess: () => setDeletingId(null) })}
        title="Remove this review?"
        confirmLabel="Remove"
        isLoading={deleteReview.isPending}
      />
    </div>
  );
}
