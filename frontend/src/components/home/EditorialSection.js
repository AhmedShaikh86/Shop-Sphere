import Link from "next/link";
import { AppImage } from "@/components/ui/AppImage";

export function EditorialSection() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      <div className="grid gap-8 md:grid-cols-2">
        <Link href="/collection/evening-edit" className="focus-ring group relative block aspect-[4/5] overflow-hidden">
          <AppImage src="https://picsum.photos/seed/editorial-evening/900/1125" alt="" className="transition-transform duration-500 group-hover:scale-105" />
          <div className="absolute inset-0 bg-gradient-to-t from-foreground/70 to-transparent" />
          <div className="absolute bottom-6 left-6 right-6 text-white">
            <p className="text-xs uppercase tracking-widest text-white/80">Editorial</p>
            <h3 className="mt-2 font-serif text-2xl">After Dark</h3>
            <p className="mt-1 text-sm text-white/85">Considered dressing for the evenings that matter.</p>
          </div>
        </Link>
        <Link href="/collection/weekend" className="focus-ring group relative block aspect-[4/5] overflow-hidden">
          <AppImage src="https://picsum.photos/seed/editorial-weekend/900/1125" alt="" className="transition-transform duration-500 group-hover:scale-105" />
          <div className="absolute inset-0 bg-gradient-to-t from-foreground/70 to-transparent" />
          <div className="absolute bottom-6 left-6 right-6 text-white">
            <p className="text-xs uppercase tracking-widest text-white/80">Editorial</p>
            <h3 className="mt-2 font-serif text-2xl">Slow Weekends</h3>
            <p className="mt-1 text-sm text-white/85">Relaxed layers built for time off the clock.</p>
          </div>
        </Link>
      </div>
    </section>
  );
}
