"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Plus, Trash2 } from "lucide-react";
import { Input, Textarea, Select, FormField } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { ImageManager } from "@/components/seller/ImageManager";
import { useCategories, useBrands, useCollections } from "@/hooks/useCatalog";
import { useSaveSellerProduct } from "@/hooks/useSeller";

const variantSchema = z.object({
  id: z.number().optional(),
  size: z.string().optional(),
  color: z.string().optional(),
  sku: z.string().min(1, "SKU is required."),
  price: z.coerce.number().positive("Price must be greater than 0."),
  compare_at_price: z.union([z.coerce.number().positive(), z.literal("")]).optional(),
  stock_quantity: z.coerce.number().int().min(0),
  weight: z.union([z.coerce.number().positive(), z.literal("")]).optional(),
  image_url: z.string().optional(),
});

const schema = z.object({
  category_id: z.coerce.number({ error: "Category is required." }),
  brand_id: z.union([z.coerce.number(), z.literal("")]).optional(),
  collection_id: z.union([z.coerce.number(), z.literal("")]).optional(),
  name: z.string().min(3, "Name is required."),
  description: z.string().min(10, "Description should be at least 10 characters."),
  material: z.string().optional(),
  fit: z.string().optional(),
  pattern: z.string().optional(),
  season: z.string().optional(),
  care_instructions: z.string().optional(),
  sustainability_info: z.string().optional(),
  gender: z.enum(["women", "men", "unisex"]),
  base_price: z.coerce.number().positive("Base price must be greater than 0."),
  compare_at_price: z.union([z.coerce.number().positive(), z.literal("")]).optional(),
  variants: z.array(variantSchema).min(1, "Add at least one variant."),
});

function cleanNumber(value) {
  return value === "" || value === undefined ? undefined : value;
}

export function ProductForm({ product }) {
  const router = useRouter();
  const { data: categories } = useCategories();
  const { data: brands } = useBrands();
  const { data: collections } = useCollections();
  const saveProduct = useSaveSellerProduct();
  const [images, setImages] = useState(product?.images?.map((i) => ({ url: i.url, alt_text: i.alt_text })) || []);

  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: product
      ? {
          category_id: product.category?.id,
          brand_id: product.brand?.id || "",
          collection_id: product.collection?.id || "",
          name: product.name,
          description: product.description,
          material: product.material || "",
          fit: product.fit || "",
          pattern: product.pattern || "",
          season: product.season || "",
          care_instructions: product.care_instructions || "",
          sustainability_info: product.sustainability_info || "",
          gender: product.gender,
          base_price: product.base_price,
          compare_at_price: product.compare_at_price || "",
          variants: product.variants.map((v) => ({
            id: v.id,
            size: v.size || "",
            color: v.color || "",
            sku: v.sku,
            price: v.price,
            compare_at_price: v.compare_at_price || "",
            stock_quantity: v.available_quantity,
            weight: "",
            image_url: v.image_url || "",
          })),
        }
      : {
          gender: "unisex",
          variants: [{ sku: "", price: "", stock_quantity: 0 }],
        },
  });

  const { fields, append, remove } = useFieldArray({ control, name: "variants" });

  function onSubmit(data) {
    const payload = {
      ...data,
      brand_id: cleanNumber(data.brand_id),
      collection_id: cleanNumber(data.collection_id),
      compare_at_price: cleanNumber(data.compare_at_price),
      variants: data.variants.map((variant) => ({
        ...variant,
        compare_at_price: cleanNumber(variant.compare_at_price),
        weight: cleanNumber(variant.weight),
      })),
      images,
    };

    saveProduct.mutate(
      { id: product?.id, payload },
      { onSuccess: () => router.push("/seller/products") }
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-10">
      <section className="grid gap-4 sm:grid-cols-2">
        <FormField label="Product Name" htmlFor="name" error={errors.name?.message}>
          <Input id="name" {...register("name")} />
        </FormField>
        <FormField label="Gender" htmlFor="gender" error={errors.gender?.message}>
          <Select id="gender" {...register("gender")}>
            <option value="women">Women</option>
            <option value="men">Men</option>
            <option value="unisex">Unisex</option>
          </Select>
        </FormField>
        <FormField label="Category" htmlFor="category_id" error={errors.category_id?.message}>
          <Select id="category_id" {...register("category_id")}>
            <option value="">Select a category</option>
            {categories?.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </Select>
        </FormField>
        <FormField label="Brand (optional)" htmlFor="brand_id">
          <Select id="brand_id" {...register("brand_id")}>
            <option value="">No brand</option>
            {brands?.map((b) => (
              <option key={b.id} value={b.id}>
                {b.name}
              </option>
            ))}
          </Select>
        </FormField>
        <FormField label="Collection (optional)" htmlFor="collection_id">
          <Select id="collection_id" {...register("collection_id")}>
            <option value="">No collection</option>
            {collections?.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </Select>
        </FormField>
        <FormField label="Base Price (USD)" htmlFor="base_price" error={errors.base_price?.message}>
          <Input id="base_price" type="number" step="0.01" {...register("base_price")} />
        </FormField>
        <FormField label="Compare-at Price (optional)" htmlFor="compare_at_price">
          <Input id="compare_at_price" type="number" step="0.01" {...register("compare_at_price")} />
        </FormField>
      </section>

      <section>
        <FormField label="Description" htmlFor="description" error={errors.description?.message}>
          <Textarea id="description" rows={4} {...register("description")} />
        </FormField>
      </section>

      <section className="grid gap-4 sm:grid-cols-2">
        <FormField label="Material" htmlFor="material">
          <Input id="material" {...register("material")} />
        </FormField>
        <FormField label="Fit" htmlFor="fit">
          <Input id="fit" {...register("fit")} />
        </FormField>
        <FormField label="Pattern" htmlFor="pattern">
          <Input id="pattern" {...register("pattern")} />
        </FormField>
        <FormField label="Season" htmlFor="season">
          <Input id="season" {...register("season")} />
        </FormField>
        <FormField label="Care Instructions" htmlFor="care_instructions">
          <Textarea id="care_instructions" rows={2} {...register("care_instructions")} />
        </FormField>
        <FormField label="Sustainability Info" htmlFor="sustainability_info">
          <Textarea id="sustainability_info" rows={2} {...register("sustainability_info")} />
        </FormField>
      </section>

      <section>
        <div className="mb-4 flex items-center justify-between">
          <h3 className="font-serif text-lg text-foreground">Variants</h3>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => append({ sku: "", price: "", stock_quantity: 0 })}
          >
            <Plus className="h-3.5 w-3.5" /> Add Variant
          </Button>
        </div>
        {errors.variants?.root?.message && <p className="mb-2 text-xs text-danger">{errors.variants.root.message}</p>}

        <div className="flex flex-col gap-4">
          {fields.map((field, index) => (
            <div key={field.id} className="grid grid-cols-2 gap-3 border border-border p-4 sm:grid-cols-4 lg:grid-cols-7">
              <FormField label="Size" htmlFor={`variants.${index}.size`}>
                <Input {...register(`variants.${index}.size`)} />
              </FormField>
              <FormField label="Color" htmlFor={`variants.${index}.color`}>
                <Input {...register(`variants.${index}.color`)} />
              </FormField>
              <FormField label="SKU" htmlFor={`variants.${index}.sku`} error={errors.variants?.[index]?.sku?.message}>
                <Input {...register(`variants.${index}.sku`)} />
              </FormField>
              <FormField label="Price" htmlFor={`variants.${index}.price`} error={errors.variants?.[index]?.price?.message}>
                <Input type="number" step="0.01" {...register(`variants.${index}.price`)} />
              </FormField>
              <FormField label="Compare At" htmlFor={`variants.${index}.compare_at_price`}>
                <Input type="number" step="0.01" {...register(`variants.${index}.compare_at_price`)} />
              </FormField>
              <FormField label="Stock" htmlFor={`variants.${index}.stock_quantity`} error={errors.variants?.[index]?.stock_quantity?.message}>
                <Input type="number" {...register(`variants.${index}.stock_quantity`)} />
              </FormField>
              <div className="flex items-end">
                <button
                  type="button"
                  onClick={() => remove(index)}
                  disabled={fields.length === 1}
                  aria-label="Remove variant"
                  className="focus-ring flex h-10 w-10 items-center justify-center border border-border text-muted hover:text-danger disabled:opacity-30"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section>
        <h3 className="mb-4 font-serif text-lg text-foreground">Product Images</h3>
        <ImageManager images={images} onChange={setImages} />
      </section>

      <Button type="submit" isLoading={saveProduct.isPending} className="w-fit">
        {product ? "Save Changes" : "Create Product"}
      </Button>
    </form>
  );
}
