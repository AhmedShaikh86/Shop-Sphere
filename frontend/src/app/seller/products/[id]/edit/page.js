"use client";

import { use } from "react";
import { useSellerProduct } from "@/hooks/useSeller";
import { ProductForm } from "@/components/seller/ProductForm";
import { Spinner } from "@/components/ui/Spinner";

export default function EditProductPage({ params }) {
  const { id } = use(params);
  const { data: product, isLoading } = useSellerProduct(id);

  if (isLoading) return <Spinner />;

  return (
    <div>
      <h1 className="mb-8 font-serif text-2xl text-foreground">Edit Product</h1>
      {product && <ProductForm product={product} />}
    </div>
  );
}
