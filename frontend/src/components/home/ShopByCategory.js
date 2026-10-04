"use client";

import Link from "next/link";
import { useCategories } from "@/hooks/useCatalog";
import { EditorialImage } from "@/components/ui/EditorialImage";
import { Skeleton } from "@/components/ui/Skeleton";

export function ShopByCategory() {
  const { data: categories, isLoading } = useCategories();

  return (
    <section className="bg-surface-alt py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <h2 className="mb-8 font-serif text-2xl text-foreground sm:text-3xl">Shop by Category</h2>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
          {isLoading &&
            Array.from({ length: 5 }).map((_, index) => <Skeleton key={index} className="aspect-[3/4] w-full" />)}
          {categories?.map((category) => (
            <Link key={category.id} href={`/category/${category.slug}`} className="focus-ring group relative block aspect-[3/4] overflow-hidden">
              <EditorialImage
                src={category.image_url}
                alt=""
                photoCreditName={category.photo_credit_name}
                photoCreditUrl={category.photo_credit_url}
                className="absolute inset-0 transition-transform duration-500 group-hover:scale-105"
                sizes="(min-width: 1024px) 20vw, (min-width: 640px) 33vw, 50vw"
              />
              <div className="absolute inset-0 bg-foreground/25 transition-colors group-hover:bg-foreground/35" />
              <span className="absolute bottom-4 left-4 font-serif text-lg text-white">{category.name}</span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
