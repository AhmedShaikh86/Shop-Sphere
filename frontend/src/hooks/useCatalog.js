"use client";

import { useQuery } from "@tanstack/react-query";
import { catalogService } from "@/services/catalogService";

export function useCategories() {
  return useQuery({ queryKey: ["categories"], queryFn: catalogService.categories, staleTime: 5 * 60 * 1000 });
}

export function useCategory(slug) {
  return useQuery({
    queryKey: ["categories", slug],
    queryFn: () => catalogService.category(slug),
    enabled: Boolean(slug),
  });
}

export function useBrands() {
  return useQuery({ queryKey: ["brands"], queryFn: catalogService.brands, staleTime: 5 * 60 * 1000 });
}

export function useBrand(slug) {
  return useQuery({ queryKey: ["brands", slug], queryFn: () => catalogService.brand(slug), enabled: Boolean(slug) });
}

export function useCollections() {
  return useQuery({ queryKey: ["collections"], queryFn: catalogService.collections, staleTime: 5 * 60 * 1000 });
}

export function useCollection(slug) {
  return useQuery({
    queryKey: ["collections", slug],
    queryFn: () => catalogService.collection(slug),
    enabled: Boolean(slug),
  });
}

/**
 * Homepage-only image slots (hero, editorial section) resolved server-side
 * from Unsplash and cached — see backend `images:sync-placements`. Missing
 * keys just mean no photo has been synced yet; callers fall back to the
 * branded gradient placeholder.
 */
export function useSiteImages() {
  return useQuery({ queryKey: ["site-images"], queryFn: catalogService.siteImages, staleTime: 30 * 60 * 1000 });
}

export function useSiteImage(key) {
  const { data, ...rest } = useSiteImages();

  return { ...rest, data: data?.[key] };
}
