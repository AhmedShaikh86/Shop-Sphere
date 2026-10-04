import Link from "next/link";
import { ProductCard } from "@/components/product/ProductCard";
import { ProductGridSkeleton } from "@/components/ui/Skeleton";

export function ProductRail({ title, viewAllHref, products, isLoading }) {
  if (!isLoading && (!products || products.length === 0)) return null;

  return (
    <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      <div className="mb-8 flex items-end justify-between">
        <h2 className="font-serif text-2xl text-foreground sm:text-3xl">{title}</h2>
        {viewAllHref && (
          <Link href={viewAllHref} className="focus-ring text-sm uppercase tracking-wide text-muted hover:text-foreground">
            View All
          </Link>
        )}
      </div>

      {isLoading ? (
        <ProductGridSkeleton count={4} />
      ) : (
        <div className="grid grid-cols-2 gap-x-4 gap-y-10 sm:grid-cols-3 lg:grid-cols-4">
          {products.slice(0, 8).map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </section>
  );
}
