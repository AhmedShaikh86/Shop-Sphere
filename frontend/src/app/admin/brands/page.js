"use client";

import { TaxonomyManager } from "@/components/admin/TaxonomyManager";
import { brandAdminHooks } from "@/hooks/useAdmin";

export default function AdminBrandsPage() {
  return (
    <TaxonomyManager
      title="Brands"
      useList={brandAdminHooks.useList}
      useSave={brandAdminHooks.useSave}
      useDelete={brandAdminHooks.useDelete}
      imageField="logo_url"
    />
  );
}
