import { AppImage } from "@/components/ui/AppImage";

export const metadata = { title: "About" };

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8">
      <p className="text-xs uppercase tracking-widest text-muted">About Us</p>
      <h1 className="mt-3 font-serif text-4xl text-foreground">Style, curated for you.</h1>
      <div className="relative mt-8 aspect-[16/9] w-full overflow-hidden">
        <AppImage src="https://picsum.photos/seed/about-page/1200/675" alt="" />
      </div>
      <div className="mt-10 flex flex-col gap-6 text-sm leading-relaxed text-muted">
        <p>
          ShopSphere is a multi-vendor fashion marketplace built around one idea: shopping for clothing
          should feel considered, not overwhelming. We bring together a small group of independent labels —
          led by our own house brand, Atelier North — who share a commitment to quality materials and
          durable construction.
        </p>
        <p>
          Every seller on ShopSphere is reviewed before they can open a store, and every product is checked
          by our team before it goes live. That means the quality bar stays consistent whether you&apos;re
          shopping a tailored blazer from Meridian or a pair of boots from Forma.
        </p>
        <p>
          We keep our marketplace small on purpose. Rather than carrying everything, we&apos;d rather carry
          pieces worth wearing for years.
        </p>
      </div>
    </div>
  );
}
