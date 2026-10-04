"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { authService } from "@/services/authService";
import { useAuthStore } from "@/store/authStore";
import { useToastStore } from "@/store/toastStore";
import { apiErrorMessage } from "@/lib/api-client";

export function useAuth() {
  const { user, token, setAuth, clearAuth } = useAuthStore();

  return { user, token, isAuthenticated: Boolean(token), setAuth, clearAuth };
}

export function useLogin() {
  const setAuth = useAuthStore((state) => state.setAuth);
  const showToast = useToastStore((state) => state.showToast);
  const router = useRouter();

  return useMutation({
    mutationFn: authService.login,
    onSuccess: ({ user, token }) => {
      setAuth(user, token);
      showToast(`Welcome back, ${user.name.split(" ")[0]}.`);
      router.push(redirectPathForRole(user.role));
    },
    onError: (error) => showToast(apiErrorMessage(error, "Incorrect email or password."), "error"),
  });
}

export function useRegister() {
  const setAuth = useAuthStore((state) => state.setAuth);
  const showToast = useToastStore((state) => state.showToast);
  const router = useRouter();

  return useMutation({
    mutationFn: authService.register,
    onSuccess: ({ user, token }) => {
      setAuth(user, token);
      showToast("Account created. Welcome to ShopSphere.");
      router.push(redirectPathForRole(user.role));
    },
    onError: (error) => showToast(apiErrorMessage(error, "We couldn't create your account."), "error"),
  });
}

export function useLogout() {
  const clearAuth = useAuthStore((state) => state.clearAuth);
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation({
    mutationFn: authService.logout,
    onSettled: () => {
      clearAuth();
      queryClient.clear();
      router.push("/");
    },
  });
}

function redirectPathForRole(role) {
  if (role === "admin") return "/admin/dashboard";
  if (role === "seller") return "/seller/dashboard";
  return "/account";
}
