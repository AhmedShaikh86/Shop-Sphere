"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { addressService, notificationService, profileService } from "@/services/profileService";
import { useAuth } from "@/hooks/useAuth";
import { useAuthStore } from "@/store/authStore";
import { useToastStore } from "@/store/toastStore";
import { apiErrorMessage } from "@/lib/api-client";

export function useProfile() {
  const { isAuthenticated } = useAuth();

  return useQuery({ queryKey: ["profile"], queryFn: profileService.get, enabled: isAuthenticated });
}

export function useUpdateProfile() {
  const updateUser = useAuthStore((state) => state.updateUser);
  const showToast = useToastStore((state) => state.showToast);

  return useMutation({
    mutationFn: profileService.update,
    onSuccess: (user) => {
      updateUser(user);
      showToast("Profile updated.");
    },
    onError: (error) => showToast(apiErrorMessage(error), "error"),
  });
}

export function useAddresses() {
  const { isAuthenticated } = useAuth();

  return useQuery({ queryKey: ["addresses"], queryFn: addressService.list, enabled: isAuthenticated });
}

export function useSaveAddress() {
  const queryClient = useQueryClient();
  const showToast = useToastStore((state) => state.showToast);

  return useMutation({
    mutationFn: ({ id, payload }) => (id ? addressService.update(id, payload) : addressService.create(payload)),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["addresses"] });
      showToast("Address saved.");
    },
    onError: (error) => showToast(apiErrorMessage(error), "error"),
  });
}

export function useDeleteAddress() {
  const queryClient = useQueryClient();
  const showToast = useToastStore((state) => state.showToast);

  return useMutation({
    mutationFn: addressService.remove,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["addresses"] });
      showToast("Address removed.");
    },
    onError: (error) => showToast(apiErrorMessage(error), "error"),
  });
}

export function useNotifications(page = 1) {
  const { isAuthenticated } = useAuth();

  return useQuery({
    queryKey: ["notifications", page],
    queryFn: () => notificationService.list(page),
    enabled: isAuthenticated,
  });
}

export function useMarkAllNotificationsRead() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: notificationService.markAllAsRead,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["notifications"] }),
  });
}
