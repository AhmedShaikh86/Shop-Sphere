"use client";

import Link from "next/link";
import { useCollections } from "@/hooks/useCatalog";
import { EditorialImage } from "@/components/ui/EditorialImage";
import { Button } from "@/components/ui/Button";

export function FeaturedCollection() {
  const { data: collections } = useCollections();
  const featured = collections?.find((collection) => collection.is_featured);

  if (!featured) return null;

  return (
    <section className="relative mx-auto my-16 max-w-7xl overflow-hidden px-4 sm:px-6 lg:px-8">
      <div className="group relative h-105 w-full overflow-hidden">
        <EditorialImage
          src={featured.banner_url}
          alt=""
          photoCreditName={featured.photo_credit_name}
          photoCreditUrl={featured.photo_credit_url}
          className="absolute inset-0"
        />
        <div className="absolute inset-0 flex flex-col items-start justify-center gap-4 bg-foreground/30 px-8 sm:px-16">
          <p className="text-xs uppercase tracking-widest text-white/80">Featured Collection</p>
          <h2 className="font-serif text-3xl text-white sm:text-4xl">{featured.name}</h2>
          <p className="max-w-md text-sm text-white/90">{featured.description}</p>
          <Button as={Link} href={`/collection/${featured.slug}`} variant="accent">
            Shop the Edit
          </Button>
        </div>
      </div>
    </section>
  );
}
