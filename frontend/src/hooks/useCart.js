"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { cartService } from "@/services/cartService";
import { useAuth } from "@/hooks/useAuth";
import { useToastStore } from "@/store/toastStore";
import { apiErrorMessage } from "@/lib/api-client";

export function useCart() {
  const { isAuthenticated } = useAuth();

  return useQuery({
    queryKey: ["cart"],
    queryFn: cartService.get,
    enabled: isAuthenticated,
  });
}

export function useAddToCart() {
  const queryClient = useQueryClient();
  const showToast = useToastStore((state) => state.showToast);

  return useMutation({
    mutationFn: ({ variantId, quantity }) => cartService.add(variantId, quantity),
    onSuccess: (data) => {
      queryClient.setQueryData(["cart"], data);
      showToast("Added to your bag.");
    },
    onError: (error) => showToast(apiErrorMessage(error, "Could not add this item to your bag."), "error"),
  });
}

export function useUpdateCartItem() {
  const queryClient = useQueryClient();
  const showToast = useToastStore((state) => state.showToast);

  return useMutation({
    mutationFn: ({ cartItemId, quantity }) => cartService.updateQuantity(cartItemId, quantity),
    onSuccess: (data) => queryClient.setQueryData(["cart"], data),
    onError: (error) => showToast(apiErrorMessage(error, "Could not update quantity."), "error"),
  });
}

export function useRemoveCartItem() {
  const queryClient = useQueryClient();
  const showToast = useToastStore((state) => state.showToast);

  return useMutation({
    mutationFn: (cartItemId) => cartService.remove(cartItemId),
    onSuccess: (data) => {
      queryClient.setQueryData(["cart"], data);
      showToast("Item removed from your bag.");
    },
    onError: (error) => showToast(apiErrorMessage(error), "error"),
  });
}
