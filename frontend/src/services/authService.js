import { apiClient, unwrap } from "@/lib/api-client";

export const authService = {
  register: (payload) => apiClient.post("/auth/register", payload).then(unwrap),
  login: (payload) => apiClient.post("/auth/login", payload).then(unwrap),
  logout: () => apiClient.post("/auth/logout"),
  me: () => apiClient.get("/auth/me").then(unwrap),
  forgotPassword: (payload) => apiClient.post("/auth/forgot-password", payload).then(unwrap),
  resetPassword: (payload) => apiClient.post("/auth/reset-password", payload).then(unwrap),
  changePassword: (payload) => apiClient.post("/auth/change-password", payload).then(unwrap),
};
