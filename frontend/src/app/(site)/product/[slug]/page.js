import { fetchPublicJson } from "@/lib/server-fetch";
import { ProductPageClient } from "./ProductPageClient";

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const data = await fetchPublicJson(`/products/${slug}`);
  const product = data?.product;

  if (!product) {
    return { title: "Product Not Found" };
  }

  const description = product.description?.slice(0, 155);
  const image = product.images?.[0]?.url;

  return {
    title: product.name,
    description,
    openGraph: {
      title: product.name,
      description,
      images: image ? [{ url: image }] : undefined,
    },
  };
}

export default async function ProductPage({ params }) {
  const { slug } = await params;

  return <ProductPageClient slug={slug} />;
}
