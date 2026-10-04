"use client";

import { Hero } from "@/components/home/Hero";
import { ShopByCategory } from "@/components/home/ShopByCategory";
import { FeaturedCollection } from "@/components/home/FeaturedCollection";
import { EditorialSection } from "@/components/home/EditorialSection";
import { ProductRail } from "@/components/home/ProductRail";
import { BrandStory } from "@/components/home/BrandStory";
import { CustomerReviews } from "@/components/home/CustomerReviews";
import { Newsletter } from "@/components/home/Newsletter";
import { useBestSellers, useNewArrivals } from "@/hooks/useProducts";

export default function HomePage() {
  const { data: newArrivals, isLoading: isLoadingNewArrivals } = useNewArrivals();
  const { data: bestSellers, isLoading: isLoadingBestSellers } = useBestSellers();

  return (
    <>
      <Hero />
      <ProductRail
        title="New Arrivals"
        viewAllHref="/shop?sort=newest"
        products={newArrivals}
        isLoading={isLoadingNewArrivals}
      />
      <ShopByCategory />
      <FeaturedCollection />
      <EditorialSection />
      <ProductRail title="Best Sellers" viewAllHref="/shop" products={bestSellers} isLoading={isLoadingBestSellers} />
      <BrandStory />
      <CustomerReviews />
      <Newsletter />
    </>
  );
}
