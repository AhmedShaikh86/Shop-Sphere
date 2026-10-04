import { apiClient, unwrap } from "@/lib/api-client";

export const productService = {
  list: (params) => apiClient.get("/products", { params }).then(unwrap),
  show: (slug) => apiClient.get(`/products/${slug}`).then(unwrap),
  newArrivals: () => apiClient.get("/products/new-arrivals").then(unwrap),
  bestSellers: () => apiClient.get("/products/best-sellers").then(unwrap),
  onSale: () => apiClient.get("/products/on-sale").then(unwrap),
  reviews: (productId, page = 1) => apiClient.get(`/products/${productId}/reviews`, { params: { page } }).then(unwrap),
  addReview: (productId, payload) => apiClient.post(`/products/${productId}/reviews`, payload).then(unwrap),
  deleteReview: (reviewId) => apiClient.delete(`/reviews/${reviewId}`).then(unwrap),
  featuredReviews: () => apiClient.get("/reviews/featured").then(unwrap),
};

export const searchService = {
  search: (q) => apiClient.get("/search", { params: { q } }).then(unwrap),
};
