"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { checkoutService, orderService } from "@/services/checkoutService";
import { useAuth } from "@/hooks/useAuth";

export function useValidateCoupon() {
  return useMutation({
    mutationFn: ({ code, subtotal }) => checkoutService.validateCoupon(code, subtotal),
  });
}

export function usePlaceOrder() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: checkoutService.placeOrder,
    onSuccess: () => {
      queryClient.setQueryData(["cart"], []);
      queryClient.invalidateQueries({ queryKey: ["orders"] });
    },
  });
}

export function useOrders(page = 1) {
  const { isAuthenticated } = useAuth();

  return useQuery({ queryKey: ["orders", page], queryFn: () => orderService.list(page), enabled: isAuthenticated });
}

export function useOrder(id) {
  return useQuery({ queryKey: ["orders", id], queryFn: () => orderService.show(id), enabled: Boolean(id) });
}

export function useCancelOrder() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: orderService.cancel,
    onSuccess: (order) => {
      queryClient.invalidateQueries({ queryKey: ["orders"] });
      queryClient.setQueryData(["orders", String(order.id)], order);
    },
  });
}
