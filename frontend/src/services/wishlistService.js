import { apiClient, unwrap } from "@/lib/api-client";

export const wishlistService = {
  get: () => apiClient.get("/wishlist").then(unwrap),
  add: (productId) => apiClient.post("/wishlist", { product_id: productId }).then(unwrap),
  remove: (productId) => apiClient.delete(`/wishlist/${productId}`).then(unwrap),
};
