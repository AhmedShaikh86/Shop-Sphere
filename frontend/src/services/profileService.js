import { apiClient, unwrap } from "@/lib/api-client";

export const profileService = {
  get: () => apiClient.get("/profile").then(unwrap),
  update: (payload) => apiClient.put("/profile", payload).then(unwrap),
};

export const addressService = {
  list: () => apiClient.get("/addresses").then(unwrap),
  create: (payload) => apiClient.post("/addresses", payload).then(unwrap),
  update: (id, payload) => apiClient.put(`/addresses/${id}`, payload).then(unwrap),
  remove: (id) => apiClient.delete(`/addresses/${id}`).then(unwrap),
};

export const notificationService = {
  list: (page = 1) => apiClient.get("/notifications", { params: { page } }).then(unwrap),
  markAsRead: (id) => apiClient.post(`/notifications/${id}/read`).then(unwrap),
  markAllAsRead: () => apiClient.post("/notifications/read-all").then(unwrap),
};
