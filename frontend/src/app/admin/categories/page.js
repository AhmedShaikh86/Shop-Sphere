"use client";

import { TaxonomyManager } from "@/components/admin/TaxonomyManager";
import { categoryAdminHooks } from "@/hooks/useAdmin";

export default function AdminCategoriesPage() {
  return (
    <TaxonomyManager
      title="Categories"
      useList={categoryAdminHooks.useList}
      useSave={categoryAdminHooks.useSave}
      useDelete={categoryAdminHooks.useDelete}
    />
  );
}
