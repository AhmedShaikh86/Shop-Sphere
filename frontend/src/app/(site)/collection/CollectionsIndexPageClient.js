"use client";

import Link from "next/link";
import { useCollections } from "@/hooks/useCatalog";
import { EditorialImage } from "@/components/ui/EditorialImage";
import { Skeleton } from "@/components/ui/Skeleton";

export function CollectionsIndexPageClient() {
  const { data: collections, isLoading } = useCollections();

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <h1 className="mb-8 border-b border-border pb-8 font-serif text-3xl text-foreground">Collections</h1>

      <div className="grid gap-6 sm:grid-cols-2">
        {isLoading && Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="aspect-video w-full" />)}
        {collections?.map((collection) => (
          <Link key={collection.id} href={`/collection/${collection.slug}`} className="focus-ring group relative block aspect-video overflow-hidden">
            <EditorialImage
              src={collection.banner_url}
              alt=""
              photoCreditName={collection.photo_credit_name}
              photoCreditUrl={collection.photo_credit_url}
              className="absolute inset-0 transition-transform duration-500 group-hover:scale-105"
              sizes="(min-width: 640px) 50vw, 100vw"
            />
            <div className="absolute inset-0 bg-foreground/30" />
            <div className="absolute bottom-4 left-4 right-4 text-white">
              <h2 className="font-serif text-xl">{collection.name}</h2>
              <p className="mt-1 text-sm text-white/85 line-clamp-2">{collection.description}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
