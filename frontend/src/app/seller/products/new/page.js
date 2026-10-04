"use client";

import { ProductForm } from "@/components/seller/ProductForm";

export default function NewProductPage() {
  return (
    <div>
      <h1 className="mb-8 font-serif text-2xl text-foreground">Add Product</h1>
      <ProductForm />
    </div>
  );
}
