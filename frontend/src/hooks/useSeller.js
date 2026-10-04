"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { sellerService } from "@/services/sellerService";
import { useAuth } from "@/hooks/useAuth";
import { useToastStore } from "@/store/toastStore";
import { apiErrorMessage } from "@/lib/api-client";

function useIsSeller() {
  const { user } = useAuth();
  return user?.role === "seller";
}

export function useSellerDashboard() {
  const enabled = useIsSeller();
  return useQuery({ queryKey: ["seller", "dashboard"], queryFn: sellerService.dashboard, enabled });
}

export function useSellerStore() {
  const enabled = useIsSeller();
  return useQuery({ queryKey: ["seller", "store"], queryFn: sellerService.getStore, enabled });
}

export function useUpdateSellerStore() {
  const queryClient = useQueryClient();
  const showToast = useToastStore((state) => state.showToast);

  return useMutation({
    mutationFn: sellerService.updateStore,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["seller", "store"] });
      showToast("Store profile updated.");
    },
    onError: (error) => showToast(apiErrorMessage(error), "error"),
  });
}

export function useSellerProducts(params) {
  const enabled = useIsSeller();
  return useQuery({ queryKey: ["seller", "products", params], queryFn: () => sellerService.products(params), enabled });
}

export function useSellerProduct(id) {
  return useQuery({ queryKey: ["seller", "products", id], queryFn: () => sellerService.product(id), enabled: Boolean(id) });
}

export function useSaveSellerProduct() {
  const queryClient = useQueryClient();
  const showToast = useToastStore((state) => state.showToast);

  return useMutation({
    mutationFn: ({ id, payload }) => (id ? sellerService.updateProduct(id, payload) : sellerService.createProduct(payload)),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["seller", "products"] });
      showToast("Product saved.");
    },
    onError: (error) => showToast(apiErrorMessage(error), "error"),
  });
}

export function useSubmitProductForReview() {
  const queryClient = useQueryClient();
  const showToast = useToastStore((state) => state.showToast);

  return useMutation({
    mutationFn: sellerService.submitProductForReview,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["seller", "products"] });
      showToast("Submitted for admin review.");
    },
    onError: (error) => showToast(apiErrorMessage(error), "error"),
  });
}

export function useArchiveProduct() {
  const queryClient = useQueryClient();
  const showToast = useToastStore((state) => state.showToast);

  return useMutation({
    mutationFn: sellerService.archiveProduct,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["seller", "products"] });
      showToast("Product archived.");
    },
    onError: (error) => showToast(apiErrorMessage(error), "error"),
  });
}

export function useSellerOrders(params) {
  const enabled = useIsSeller();
  return useQuery({ queryKey: ["seller", "orders", params], queryFn: () => sellerService.orders(params), enabled });
}

export function useSellerOrder(id) {
  return useQuery({ queryKey: ["seller", "orders", id], queryFn: () => sellerService.order(id), enabled: Boolean(id) });
}

export function useUpdateSellerOrderStatus() {
  const queryClient = useQueryClient();
  const showToast = useToastStore((state) => state.showToast);

  return useMutation({
    mutationFn: ({ id, status }) => sellerService.updateOrderStatus(id, status),
    onSuccess: (order) => {
      queryClient.invalidateQueries({ queryKey: ["seller", "orders"] });
      queryClient.setQueryData(["seller", "orders", String(order.id)], order);
      showToast("Order status updated.");
    },
    onError: (error) => showToast(apiErrorMessage(error), "error"),
  });
}

export function useSellerCustomers(params) {
  const enabled = useIsSeller();
  return useQuery({ queryKey: ["seller", "customers", params], queryFn: () => sellerService.customers(params), enabled });
}

export function useSellerReviews(params) {
  const enabled = useIsSeller();
  return useQuery({ queryKey: ["seller", "reviews", params], queryFn: () => sellerService.reviews(params), enabled });
}

export function useSellerCoupons() {
  const enabled = useIsSeller();
  return useQuery({ queryKey: ["seller", "coupons"], queryFn: sellerService.coupons, enabled });
}

export function useSaveSellerCoupon() {
  const queryClient = useQueryClient();
  const showToast = useToastStore((state) => state.showToast);

  return useMutation({
    mutationFn: ({ id, payload }) => (id ? sellerService.updateCoupon(id, payload) : sellerService.createCoupon(payload)),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["seller", "coupons"] });
      showToast("Coupon saved.");
    },
    onError: (error) => showToast(apiErrorMessage(error), "error"),
  });
}

export function useDeleteSellerCoupon() {
  const queryClient = useQueryClient();
  const showToast = useToastStore((state) => state.showToast);

  return useMutation({
    mutationFn: sellerService.deleteCoupon,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["seller", "coupons"] });
      showToast("Coupon deleted.");
    },
    onError: (error) => showToast(apiErrorMessage(error), "error"),
  });
}
