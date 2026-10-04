"use client";

import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Star } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Textarea } from "@/components/ui/Input";
import { productService } from "@/services/productService";
import { useToastStore } from "@/store/toastStore";
import { apiErrorMessage } from "@/lib/api-client";
import { cn } from "@/utils/cn";

export function ReviewForm({ productId }) {
  const [rating, setRating] = useState(5);
  const [body, setBody] = useState("");
  const queryClient = useQueryClient();
  const showToast = useToastStore((state) => state.showToast);

  const submitReview = useMutation({
    mutationFn: () => productService.addReview(productId, { rating, body }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products", productId, "reviews"] });
      showToast("Thanks — your review has been posted.");
      setBody("");
    },
    onError: (error) => showToast(apiErrorMessage(error), "error"),
  });

  return (
    <form
      onSubmit={(event) => {
        event.preventDefault();
        submitReview.mutate();
      }}
      className="flex flex-col gap-3 border border-border p-5"
    >
      <p className="text-sm font-medium text-foreground">Write a Review</p>
      <div className="flex gap-1" role="radiogroup" aria-label="Rating">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            role="radio"
            aria-checked={rating === star}
            aria-label={`${star} stars`}
            onClick={() => setRating(star)}
            className="focus-ring"
          >
            <Star className={cn("h-6 w-6", star <= rating ? "fill-foreground text-foreground" : "text-border")} />
          </button>
        ))}
      </div>
      <Textarea
        value={body}
        onChange={(event) => setBody(event.target.value)}
        rows={3}
        placeholder="Share your thoughts on the fit, fabric and quality…"
      />
      <Button type="submit" isLoading={submitReview.isPending} className="self-start">
        Submit Review
      </Button>
    </form>
  );
}
