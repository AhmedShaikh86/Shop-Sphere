import { apiClient, unwrap } from "@/lib/api-client";

export const catalogService = {
  categories: () => apiClient.get("/categories").then(unwrap),
  category: (slug) => apiClient.get(`/categories/${slug}`).then(unwrap),
  brands: () => apiClient.get("/brands").then(unwrap),
  brand: (slug) => apiClient.get(`/brands/${slug}`).then(unwrap),
  collections: () => apiClient.get("/collections").then(unwrap),
  collection: (slug) => apiClient.get(`/collections/${slug}`).then(unwrap),
  siteImages: () => apiClient.get("/site-images").then(unwrap),
};
