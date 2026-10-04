"use client";

import { useFeaturedReviews } from "@/hooks/useProducts";
import { Rating } from "@/components/ui/Rating";

export function CustomerReviews() {
  const { data: reviews, isLoading } = useFeaturedReviews();

  if (!isLoading && (!reviews || reviews.length === 0)) return null;

  return (
    <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      <h2 className="mb-8 font-serif text-2xl text-foreground sm:text-3xl">What Customers Are Saying</h2>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {(reviews || []).slice(0, 3).map((review) => (
          <div key={review.id} className="flex flex-col gap-3 border border-border bg-surface p-6">
            <Rating value={review.rating} />
            <p className="text-sm leading-relaxed text-foreground">&ldquo;{review.body}&rdquo;</p>
            <p className="text-xs text-muted">
              {review.user_name} &middot; {review.product_name}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
