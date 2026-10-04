"use client";

import { TaxonomyManager } from "@/components/admin/TaxonomyManager";
import { collectionAdminHooks } from "@/hooks/useAdmin";

export default function AdminCollectionsPage() {
  return (
    <TaxonomyManager
      title="Collections"
      useList={collectionAdminHooks.useList}
      useSave={collectionAdminHooks.useSave}
      useDelete={collectionAdminHooks.useDelete}
      imageField="banner_url"
      extraFields={(register) => (
        <label className="flex items-center gap-2 text-sm text-foreground">
          <input type="checkbox" {...register("is_featured")} /> Featured on homepage
        </label>
      )}
    />
  );
}
