import { apiClient, unwrap } from "@/lib/api-client";

export const cartService = {
  get: () => apiClient.get("/cart").then(unwrap),
  add: (productVariantId, quantity = 1) =>
    apiClient.post("/cart", { product_variant_id: productVariantId, quantity }).then(unwrap),
  updateQuantity: (cartItemId, quantity) =>
    apiClient.put(`/cart/${cartItemId}`, { quantity }).then(unwrap),
  remove: (cartItemId) => apiClient.delete(`/cart/${cartItemId}`).then(unwrap),
};
