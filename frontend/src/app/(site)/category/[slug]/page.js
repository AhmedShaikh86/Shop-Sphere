import { fetchPublicJson } from "@/lib/server-fetch";
import { CategoryPageClient } from "./CategoryPageClient";

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const category = await fetchPublicJson(`/categories/${slug}`);

  return {
    title: category?.name || "Category",
    description: category?.description,
  };
}

export default async function CategoryPage({ params }) {
  const { slug } = await params;

  return <CategoryPageClient slug={slug} />;
}
