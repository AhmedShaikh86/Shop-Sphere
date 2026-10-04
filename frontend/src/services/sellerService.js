import { apiClient, unwrap } from "@/lib/api-client";

export const sellerService = {
  dashboard: () => apiClient.get("/seller/dashboard").then(unwrap),

  getStore: () => apiClient.get("/seller/store").then(unwrap),
  updateStore: (payload) => apiClient.put("/seller/store", payload).then(unwrap),

  products: (params) => apiClient.get("/seller/products", { params }).then(unwrap),
  product: (id) => apiClient.get(`/seller/products/${id}`).then(unwrap),
  createProduct: (payload) => apiClient.post("/seller/products", payload).then(unwrap),
  updateProduct: (id, payload) => apiClient.put(`/seller/products/${id}`, payload).then(unwrap),
  submitProductForReview: (id) => apiClient.post(`/seller/products/${id}/submit-for-review`).then(unwrap),
  archiveProduct: (id) => apiClient.post(`/seller/products/${id}/archive`).then(unwrap),

  orders: (params) => apiClient.get("/seller/orders", { params }).then(unwrap),
  order: (id) => apiClient.get(`/seller/orders/${id}`).then(unwrap),
  updateOrderStatus: (id, status) => apiClient.put(`/seller/orders/${id}/status`, { status }).then(unwrap),

  customers: (params) => apiClient.get("/seller/customers", { params }).then(unwrap),
  reviews: (params) => apiClient.get("/seller/reviews", { params }).then(unwrap),

  coupons: () => apiClient.get("/seller/coupons").then(unwrap),
  createCoupon: (payload) => apiClient.post("/seller/coupons", payload).then(unwrap),
  updateCoupon: (id, payload) => apiClient.put(`/seller/coupons/${id}`, payload).then(unwrap),
  deleteCoupon: (id) => apiClient.delete(`/seller/coupons/${id}`).then(unwrap),
};
