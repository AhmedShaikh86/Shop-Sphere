"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { wishlistService } from "@/services/wishlistService";
import { useAuth } from "@/hooks/useAuth";
import { useToastStore } from "@/store/toastStore";
import { apiErrorMessage } from "@/lib/api-client";

export function useWishlist() {
  const { isAuthenticated } = useAuth();

  return useQuery({
    queryKey: ["wishlist"],
    queryFn: wishlistService.get,
    enabled: isAuthenticated,
  });
}

export function useIsWishlisted(productId) {
  const { data: wishlist } = useWishlist();

  return Boolean(wishlist?.some((item) => item.product.id === productId));
}

export function useToggleWishlist() {
  const queryClient = useQueryClient();
  const showToast = useToastStore((state) => state.showToast);
  const { data: wishlist } = useWishlist();

  return useMutation({
    mutationFn: async (product) => {
      const isWishlisted = wishlist?.some((item) => item.product.id === product.id);

      return isWishlisted ? wishlistService.remove(product.id) : wishlistService.add(product.id);
    },
    onSuccess: (_data, product) => {
      queryClient.invalidateQueries({ queryKey: ["wishlist"] });
      const isWishlisted = wishlist?.some((item) => item.product.id === product.id);
      showToast(isWishlisted ? "Removed from wishlist." : "Added to wishlist.");
    },
    onError: (error) => showToast(apiErrorMessage(error), "error"),
  });
}
