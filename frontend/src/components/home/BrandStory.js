"use client";

import { EditorialImage } from "@/components/ui/EditorialImage";
import { useSiteImage } from "@/hooks/useCatalog";

const FALLBACK_SRC = "https://picsum.photos/seed/brand-story/1000/750";

export function BrandStory() {
  const { data: editorialImage } = useSiteImage("editorial");

  return (
    <section className="bg-surface-alt py-16">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 sm:px-6 md:grid-cols-2 md:items-center lg:px-8">
        <div className="group relative aspect-[4/3] overflow-hidden">
          <EditorialImage
            src={editorialImage?.url || FALLBACK_SRC}
            alt="Atelier North workshop"
            photoCreditName={editorialImage?.photo_credit_name}
            photoCreditUrl={editorialImage?.photo_credit_url}
            sizes="(min-width: 768px) 600px, 100vw"
          />
        </div>
        <div className="max-w-lg">
          <p className="text-xs uppercase tracking-widest text-muted">Our Story</p>
          <h2 className="mt-3 font-serif text-3xl text-foreground">Considered fashion, made to last</h2>
          <p className="mt-4 text-sm leading-relaxed text-muted">
            ShopSphere brings together a small group of independent labels — led by our house brand, Atelier
            North — who share one belief: clothing should be made with intention. Every piece on ShopSphere is
            produced in small batches, from natural and recycled materials, and built to outlast a single season.
          </p>
          <p className="mt-4 text-sm leading-relaxed text-muted">
            We work directly with each seller on our marketplace, reviewing every product before it goes live, so
            the quality bar stays consistent no matter which label you shop.
          </p>
        </div>
      </div>
    </section>
  );
}
