"use client";

import { useQuery } from "@tanstack/react-query";
import { productService, searchService } from "@/services/productService";

export function useProducts(filters) {
  return useQuery({
    queryKey: ["products", filters],
    queryFn: () => productService.list(filters),
    placeholderData: (previousData) => previousData,
  });
}

export function useProduct(slug) {
  return useQuery({
    queryKey: ["products", slug],
    queryFn: () => productService.show(slug),
    enabled: Boolean(slug),
  });
}

export function useNewArrivals() {
  return useQuery({ queryKey: ["products", "new-arrivals"], queryFn: productService.newArrivals });
}

export function useBestSellers() {
  return useQuery({ queryKey: ["products", "best-sellers"], queryFn: productService.bestSellers });
}

export function useOnSale() {
  return useQuery({ queryKey: ["products", "on-sale"], queryFn: productService.onSale });
}

export function useProductReviews(productId, page = 1) {
  return useQuery({
    queryKey: ["products", productId, "reviews", page],
    queryFn: () => productService.reviews(productId, page),
    enabled: Boolean(productId),
  });
}

export function useFeaturedReviews() {
  return useQuery({ queryKey: ["reviews", "featured"], queryFn: productService.featuredReviews });
}

export function useSearch(keyword) {
  return useQuery({
    queryKey: ["search", keyword],
    queryFn: () => searchService.search(keyword),
    enabled: keyword.trim().length > 1,
  });
}
