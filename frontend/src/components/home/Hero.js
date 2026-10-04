"use client";

import Link from "next/link";
import { EditorialImage } from "@/components/ui/EditorialImage";
import { Button } from "@/components/ui/Button";
import { useSiteImage } from "@/hooks/useCatalog";

const FALLBACK_SRC = "https://picsum.photos/seed/hero-main/1600/1200";

export function Hero() {
  const { data: heroImage } = useSiteImage("hero");

  return (
    <section className="group relative flex h-[85vh] min-h-[520px] items-end overflow-hidden bg-surface-alt">
      <EditorialImage
        src={heroImage?.url || FALLBACK_SRC}
        alt=""
        photoCreditName={heroImage?.photo_credit_name}
        photoCreditUrl={heroImage?.photo_credit_url}
        className="absolute inset-0 brightness-95"
        priority
      />
      <div className="absolute inset-0 bg-gradient-to-t from-foreground/60 via-foreground/10 to-transparent" />
      <div className="relative mx-auto w-full max-w-7xl px-4 pb-16 sm:px-6 lg:px-8">
        <h1 className="max-w-xl font-serif text-4xl text-white sm:text-5xl lg:text-6xl">
          Style, curated for you.
        </h1>
        <p className="mt-4 max-w-md text-sm text-white/90 sm:text-base">
          Discover thoughtfully selected fashion designed to move with your everyday.
        </p>
        <div className="mt-8 flex flex-wrap gap-4">
          <Button as={Link} href="/shop?sort=newest" variant="accent" size="lg">
            Shop New Arrivals
          </Button>
          <Button as={Link} href="/collection" variant="outline" size="lg" className="border-white text-white hover:border-white/60">
            Explore Collections
          </Button>
        </div>
      </div>
    </section>
  );
}
