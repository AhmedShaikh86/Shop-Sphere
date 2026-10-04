"use client";

import { Star } from "lucide-react";
import { useSellerReviews } from "@/hooks/useSeller";
import { Rating } from "@/components/ui/Rating";
import { Badge } from "@/components/ui/Badge";
import { EmptyState } from "@/components/ui/EmptyState";
import { Spinner } from "@/components/ui/Spinner";
import { formatDate } from "@/utils/format";

export default function SellerReviewsPage() {
  const { data, isLoading } = useSellerReviews();

  if (isLoading) return <Spinner />;

  return (
    <div>
      <h1 className="mb-6 font-serif text-2xl text-foreground">Reviews</h1>

      {data?.items.length === 0 && <EmptyState icon={Star} title="No reviews yet" description="Reviews left on your products will show up here." />}

      <ul className="flex flex-col gap-4">
        {data?.items.map((review) => (
          <li key={review.id} className="border border-border p-4">
            <div className="flex items-center justify-between">
              <Rating value={review.rating} />
              {review.is_verified_purchase && <Badge variant="success">Verified Purchase</Badge>}
            </div>
            {review.body && <p className="mt-2 text-sm text-muted">{review.body}</p>}
            <p className="mt-2 text-xs text-muted">
              {review.user_name} &middot; {formatDate(review.created_at)}
            </p>
          </li>
        ))}
      </ul>
    </div>
  );
}
