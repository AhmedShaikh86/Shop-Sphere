"use client";

import { useForm } from "react-hook-form";
import { useSellerStore, useUpdateSellerStore } from "@/hooks/useSeller";
import { Input, Textarea, FormField } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { SingleImageUpload } from "@/components/seller/SingleImageUpload";
import { Spinner } from "@/components/ui/Spinner";

export default function SellerSettingsPage() {
  const { data: store, isLoading } = useSellerStore();
  const updateStore = useUpdateSellerStore();

  const { register, handleSubmit, watch, setValue } = useForm({
    // The store hasn't loaded on first render, so values arrive once and
    // react-hook-form's own `values` option keeps the form in sync without
    // a manual reset()-in-effect.
    values: store
      ? {
          name: store.name,
          description: store.description || "",
          logo_url: store.logo_url || "",
          banner_url: store.banner_url || "",
        }
      : undefined,
  });

  if (isLoading) return <Spinner />;

  return (
    <div className="max-w-xl">
      <h1 className="mb-8 font-serif text-2xl text-foreground">Store Settings</h1>
      <form onSubmit={handleSubmit((data) => updateStore.mutate(data))} className="flex flex-col gap-5">
        <FormField label="Store Name" htmlFor="name">
          <Input id="name" {...register("name")} />
        </FormField>
        <FormField label="Description" htmlFor="description">
          <Textarea id="description" rows={4} {...register("description")} />
        </FormField>
        <SingleImageUpload
          label="Store Logo"
          value={watch("logo_url")}
          onChange={(url) => setValue("logo_url", url, { shouldDirty: true })}
        />
        <SingleImageUpload
          label="Store Banner"
          value={watch("banner_url")}
          onChange={(url) => setValue("banner_url", url, { shouldDirty: true })}
        />
        <Button type="submit" isLoading={updateStore.isPending} className="w-fit">
          Save Changes
        </Button>
      </form>
    </div>
  );
}
