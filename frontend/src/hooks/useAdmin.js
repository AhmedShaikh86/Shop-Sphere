"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { adminService } from "@/services/adminService";
import { useAuth } from "@/hooks/useAuth";
import { useToastStore } from "@/store/toastStore";
import { apiErrorMessage } from "@/lib/api-client";

function useIsAdmin() {
  const { user } = useAuth();
  return user?.role === "admin";
}

export function useAdminDashboard() {
  const enabled = useIsAdmin();
  return useQuery({ queryKey: ["admin", "dashboard"], queryFn: adminService.dashboard, enabled });
}

export function useAdminUsers(params) {
  const enabled = useIsAdmin();
  return useQuery({ queryKey: ["admin", "users", params], queryFn: () => adminService.users(params), enabled });
}

export function useAdminSellers(params) {
  const enabled = useIsAdmin();
  return useQuery({ queryKey: ["admin", "sellers", params], queryFn: () => adminService.sellers(params), enabled });
}

export function useApproveSeller() {
  const queryClient = useQueryClient();
  const showToast = useToastStore((state) => state.showToast);

  return useMutation({
    mutationFn: adminService.approveSeller,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "sellers"] });
      queryClient.invalidateQueries({ queryKey: ["admin", "dashboard"] });
      showToast("Store approved.");
    },
    onError: (error) => showToast(apiErrorMessage(error), "error"),
  });
}

export function useSuspendSeller() {
  const queryClient = useQueryClient();
  const showToast = useToastStore((state) => state.showToast);

  return useMutation({
    mutationFn: adminService.suspendSeller,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "sellers"] });
      showToast("Store suspended.");
    },
    onError: (error) => showToast(apiErrorMessage(error), "error"),
  });
}

export function useAdminProducts(params) {
  const enabled = useIsAdmin();
  return useQuery({ queryKey: ["admin", "products", params], queryFn: () => adminService.products(params), enabled });
}

export function useApproveProduct() {
  const queryClient = useQueryClient();
  const showToast = useToastStore((state) => state.showToast);

  return useMutation({
    mutationFn: adminService.approveProduct,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "products"] });
      queryClient.invalidateQueries({ queryKey: ["admin", "dashboard"] });
      showToast("Product approved.");
    },
    onError: (error) => showToast(apiErrorMessage(error), "error"),
  });
}

export function useRejectProduct() {
  const queryClient = useQueryClient();
  const showToast = useToastStore((state) => state.showToast);

  return useMutation({
    mutationFn: adminService.rejectProduct,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "products"] });
      showToast("Product rejected.");
    },
    onError: (error) => showToast(apiErrorMessage(error), "error"),
  });
}

function makeTaxonomyHooks(key, service) {
  return {
    useList: () => {
      const enabled = useIsAdmin();
      return useQuery({ queryKey: ["admin", key], queryFn: service.list, enabled });
    },
    useSave: () => {
      const queryClient = useQueryClient();
      const showToast = useToastStore((state) => state.showToast);

      return useMutation({
        mutationFn: ({ id, payload }) => (id ? service.update(id, payload) : service.create(payload)),
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: ["admin", key] });
          showToast("Saved.");
        },
        onError: (error) => showToast(apiErrorMessage(error), "error"),
      });
    },
    useDelete: () => {
      const queryClient = useQueryClient();
      const showToast = useToastStore((state) => state.showToast);

      return useMutation({
        mutationFn: service.delete,
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: ["admin", key] });
          showToast("Deleted.");
        },
        onError: (error) => showToast(apiErrorMessage(error), "error"),
      });
    },
  };
}

export const categoryAdminHooks = makeTaxonomyHooks("categories", {
  list: adminService.categories,
  create: adminService.createCategory,
  update: adminService.updateCategory,
  delete: adminService.deleteCategory,
});

export const brandAdminHooks = makeTaxonomyHooks("brands", {
  list: adminService.brands,
  create: adminService.createBrand,
  update: adminService.updateBrand,
  delete: adminService.deleteBrand,
});

export const collectionAdminHooks = makeTaxonomyHooks("collections", {
  list: adminService.collections,
  create: adminService.createCollection,
  update: adminService.updateCollection,
  delete: adminService.deleteCollection,
});

export function useAdminCoupons() {
  const enabled = useIsAdmin();
  return useQuery({ queryKey: ["admin", "coupons"], queryFn: adminService.coupons, enabled });
}

export function useSaveAdminCoupon() {
  const queryClient = useQueryClient();
  const showToast = useToastStore((state) => state.showToast);

  return useMutation({
    mutationFn: ({ id, payload }) => (id ? adminService.updateCoupon(id, payload) : adminService.createCoupon(payload)),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "coupons"] });
      showToast("Coupon saved.");
    },
    onError: (error) => showToast(apiErrorMessage(error), "error"),
  });
}

export function useDeleteAdminCoupon() {
  const queryClient = useQueryClient();
  const showToast = useToastStore((state) => state.showToast);

  return useMutation({
    mutationFn: adminService.deleteCoupon,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "coupons"] });
      showToast("Coupon deleted.");
    },
    onError: (error) => showToast(apiErrorMessage(error), "error"),
  });
}

export function useAdminOrders(params) {
  const enabled = useIsAdmin();
  return useQuery({ queryKey: ["admin", "orders", params], queryFn: () => adminService.orders(params), enabled });
}

export function useAdminOrder(id) {
  return useQuery({ queryKey: ["admin", "orders", id], queryFn: () => adminService.order(id), enabled: Boolean(id) });
}

export function useUpdateAdminOrderStatus() {
  const queryClient = useQueryClient();
  const showToast = useToastStore((state) => state.showToast);

  return useMutation({
    mutationFn: ({ id, status }) => adminService.updateOrderStatus(id, status),
    onSuccess: (order) => {
      queryClient.invalidateQueries({ queryKey: ["admin", "orders"] });
      queryClient.setQueryData(["admin", "orders", String(order.id)], order);
      showToast("Order status updated.");
    },
    onError: (error) => showToast(apiErrorMessage(error), "error"),
  });
}

export function useAdminReviews(params) {
  const enabled = useIsAdmin();
  return useQuery({ queryKey: ["admin", "reviews", params], queryFn: () => adminService.reviews(params), enabled });
}

export function useDeleteAdminReview() {
  const queryClient = useQueryClient();
  const showToast = useToastStore((state) => state.showToast);

  return useMutation({
    mutationFn: adminService.deleteReview,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "reviews"] });
      showToast("Review removed.");
    },
    onError: (error) => showToast(apiErrorMessage(error), "error"),
  });
}

export function useActivityLogs(params) {
  const enabled = useIsAdmin();
  return useQuery({ queryKey: ["admin", "activity-logs", params], queryFn: () => adminService.activityLogs(params), enabled });
}
