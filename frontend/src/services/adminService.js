import { apiClient, unwrap } from "@/lib/api-client";

export const adminService = {
  dashboard: () => apiClient.get("/admin/dashboard").then(unwrap),

  users: (params) => apiClient.get("/admin/users", { params }).then(unwrap),
  user: (id) => apiClient.get(`/admin/users/${id}`).then(unwrap),

  sellers: (params) => apiClient.get("/admin/sellers", { params }).then(unwrap),
  approveSeller: (storeId) => apiClient.post(`/admin/sellers/${storeId}/approve`).then(unwrap),
  suspendSeller: (storeId) => apiClient.post(`/admin/sellers/${storeId}/suspend`).then(unwrap),

  products: (params) => apiClient.get("/admin/products", { params }).then(unwrap),
  approveProduct: (id) => apiClient.post(`/admin/products/${id}/approve`).then(unwrap),
  rejectProduct: (id) => apiClient.post(`/admin/products/${id}/reject`).then(unwrap),

  categories: () => apiClient.get("/admin/categories").then(unwrap),
  createCategory: (payload) => apiClient.post("/admin/categories", payload).then(unwrap),
  updateCategory: (id, payload) => apiClient.put(`/admin/categories/${id}`, payload).then(unwrap),
  deleteCategory: (id) => apiClient.delete(`/admin/categories/${id}`).then(unwrap),

  brands: () => apiClient.get("/admin/brands").then(unwrap),
  createBrand: (payload) => apiClient.post("/admin/brands", payload).then(unwrap),
  updateBrand: (id, payload) => apiClient.put(`/admin/brands/${id}`, payload).then(unwrap),
  deleteBrand: (id) => apiClient.delete(`/admin/brands/${id}`).then(unwrap),

  collections: () => apiClient.get("/admin/collections").then(unwrap),
  createCollection: (payload) => apiClient.post("/admin/collections", payload).then(unwrap),
  updateCollection: (id, payload) => apiClient.put(`/admin/collections/${id}`, payload).then(unwrap),
  deleteCollection: (id) => apiClient.delete(`/admin/collections/${id}`).then(unwrap),

  orders: (params) => apiClient.get("/admin/orders", { params }).then(unwrap),
  order: (id) => apiClient.get(`/admin/orders/${id}`).then(unwrap),
  updateOrderStatus: (id, status) => apiClient.put(`/admin/orders/${id}/status`, { status }).then(unwrap),

  coupons: () => apiClient.get("/admin/coupons").then(unwrap),
  createCoupon: (payload) => apiClient.post("/admin/coupons", payload).then(unwrap),
  updateCoupon: (id, payload) => apiClient.put(`/admin/coupons/${id}`, payload).then(unwrap),
  deleteCoupon: (id) => apiClient.delete(`/admin/coupons/${id}`).then(unwrap),

  reviews: (params) => apiClient.get("/admin/reviews", { params }).then(unwrap),
  deleteReview: (id) => apiClient.delete(`/admin/reviews/${id}`).then(unwrap),

  activityLogs: (params) => apiClient.get("/admin/activity-logs", { params }).then(unwrap),
};
