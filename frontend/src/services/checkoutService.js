import { apiClient, unwrap } from "@/lib/api-client";

export const checkoutService = {
  validateCoupon: (code, subtotal) =>
    apiClient.post("/checkout/validate-coupon", { code, subtotal }).then(unwrap),
  placeOrder: (payload) => apiClient.post("/checkout", payload).then(unwrap),
};

export const orderService = {
  list: (page = 1) => apiClient.get("/orders", { params: { page } }).then(unwrap),
  show: (id) => apiClient.get(`/orders/${id}`).then(unwrap),
  cancel: (id) => apiClient.post(`/orders/${id}/cancel`).then(unwrap),
  requestReturn: (id, reason) => apiClient.post(`/orders/${id}/return-request`, { reason }).then(unwrap),
};
