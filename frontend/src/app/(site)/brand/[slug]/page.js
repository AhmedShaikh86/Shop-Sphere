import { fetchPublicJson } from "@/lib/server-fetch";
import { BrandPageClient } from "./BrandPageClient";

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const brand = await fetchPublicJson(`/brands/${slug}`);

  return {
    title: brand?.name || "Brand",
    description: brand?.description,
  };
}

export default async function BrandPage({ params }) {
  const { slug } = await params;

  return <BrandPageClient slug={slug} />;
}
