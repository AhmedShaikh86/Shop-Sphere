import axios from "axios";
import { useAuthStore } from "@/store/authStore";

export const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  headers: {
    Accept: "application/json",
  },
});

apiClient.interceptors.request.use((config) => {
  const token = useAuthStore.getState().token;

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      useAuthStore.getState().clearAuth();
    }

    return Promise.reject(error);
  }
);

/**
 * Every ShopSphere API response is wrapped as { success, data, message }.
 * Reading .data.data in every service call would get repetitive, so
 * callers just get the inner payload back.
 */
export function unwrap(response) {
  return response.data.data;
}

export function apiErrorMessage(error, fallback = "Something went wrong. Please try again.") {
  return error?.response?.data?.message || fallback;
}
