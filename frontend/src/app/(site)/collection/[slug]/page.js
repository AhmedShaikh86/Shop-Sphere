import { fetchPublicJson } from "@/lib/server-fetch";
import { CollectionPageClient } from "./CollectionPageClient";

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const collection = await fetchPublicJson(`/collections/${slug}`);

  return {
    title: collection?.name || "Collection",
    description: collection?.description,
  };
}

export default async function CollectionPage({ params }) {
  const { slug } = await params;

  return <CollectionPageClient slug={slug} />;
}
