"use client";

import { useState } from "react";
import { useProductReviews } from "@/hooks/useProducts";
import { useAuth } from "@/hooks/useAuth";
import { Rating } from "@/components/ui/Rating";
import { Badge } from "@/components/ui/Badge";
import { Pagination } from "@/components/ui/Pagination";
import { Spinner } from "@/components/ui/Spinner";
import { EmptyState } from "@/components/ui/EmptyState";
import { ReviewForm } from "@/components/product/ReviewForm";
import { formatDate } from "@/utils/format";
import { MessageSquare } from "lucide-react";
import Link from "next/link";

export function ReviewList({ productId }) {
  const [page, setPage] = useState(1);
  const { data, isLoading } = useProductReviews(productId, page);
  const { isAuthenticated } = useAuth();

  return (
    <div className="grid gap-10 lg:grid-cols-[2fr_1fr]">
      <div>
        {isLoading && <Spinner />}

        {!isLoading && data?.items.length === 0 && (
          <EmptyState icon={MessageSquare} title="No reviews yet" description="Be the first to share your thoughts on this product." />
        )}

        <ul className="flex flex-col gap-6">
          {data?.items.map((review) => (
            <li key={review.id} className="border-b border-border pb-6">
              <div className="flex items-center gap-3">
                <Rating value={review.rating} />
                {review.is_verified_purchase && <Badge variant="success">Verified Purchase</Badge>}
              </div>
              {review.title && <p className="mt-2 font-medium text-foreground">{review.title}</p>}
              {review.body && <p className="mt-1 text-sm text-muted">{review.body}</p>}
              <p className="mt-2 text-xs text-muted">
                {review.user_name} &middot; {formatDate(review.created_at)}
              </p>
            </li>
          ))}
        </ul>

        {data && <Pagination currentPage={data.meta.current_page} lastPage={data.meta.last_page} onPageChange={setPage} />}
      </div>

      <div>
        {isAuthenticated ? (
          <ReviewForm productId={productId} />
        ) : (
          <p className="border border-border p-5 text-sm text-muted">
            <Link href="/login" className="underline">
              Log in
            </Link>{" "}
            to write a review.
          </p>
        )}
      </div>
    </div>
  );
}
