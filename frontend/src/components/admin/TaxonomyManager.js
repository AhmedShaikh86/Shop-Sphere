"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { Pencil, Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { EmptyState } from "@/components/ui/EmptyState";
import { Input, Textarea, FormField } from "@/components/ui/Input";
import { Modal } from "@/components/ui/Modal";
import { Spinner } from "@/components/ui/Spinner";
import { AppImage } from "@/components/ui/AppImage";
import { FolderTree } from "lucide-react";

/**
 * Shared CRUD UI for /admin/categories, /admin/brands and /admin/collections —
 * they differ only in title, hooks, and the image field's label/key.
 */
export function TaxonomyManager({ title, useList, useSave, useDelete, imageField = "image_url", extraFields }) {
  const { data: items, isLoading } = useList();
  const saveItem = useSave();
  const deleteItem = useDelete();

  const [editingItem, setEditingItem] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [deletingId, setDeletingId] = useState(null);

  const { register, handleSubmit, reset } = useForm();

  function openNew() {
    setEditingItem(null);
    reset({ name: "", description: "" });
    setIsModalOpen(true);
  }

  function openEdit(item) {
    setEditingItem(item);
    reset(item);
    setIsModalOpen(true);
  }

  function onSubmit(data) {
    saveItem.mutate({ id: editingItem?.id, payload: data }, { onSuccess: () => setIsModalOpen(false) });
  }

  if (isLoading) return <Spinner />;

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="font-serif text-2xl text-foreground">{title}</h1>
        <Button onClick={openNew}>
          <Plus className="h-4 w-4" /> New
        </Button>
      </div>

      {items?.length === 0 && <EmptyState icon={FolderTree} title={`No ${title.toLowerCase()} yet`} description="Create your first entry." />}

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {items?.map((item) => (
          <div key={item.id} className="border border-border p-4">
            {item[imageField] && (
              <div className="relative mb-3 aspect-video w-full bg-surface-alt">
                <AppImage src={item[imageField]} alt="" sizes="300px" />
              </div>
            )}
            <p className="text-sm font-medium text-foreground">{item.name}</p>
            {item.description && <p className="mt-1 line-clamp-2 text-xs text-muted">{item.description}</p>}
            <div className="mt-3 flex gap-3">
              <button onClick={() => openEdit(item)} className="focus-ring flex items-center gap-1 text-xs text-foreground underline">
                <Pencil className="h-3 w-3" /> Edit
              </button>
              <button onClick={() => setDeletingId(item.id)} className="focus-ring flex items-center gap-1 text-xs text-danger underline">
                <Trash2 className="h-3 w-3" /> Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={editingItem ? "Edit" : "New"}>
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
          <FormField label="Name" htmlFor="name">
            <Input id="name" {...register("name")} />
          </FormField>
          <FormField label="Description" htmlFor="description">
            <Textarea id="description" rows={3} {...register("description")} />
          </FormField>
          <FormField label="Image URL" htmlFor={imageField}>
            <Input id={imageField} {...register(imageField)} />
          </FormField>
          {extraFields?.(register)}
          <Button type="submit" isLoading={saveItem.isPending} className="w-full">
            Save
          </Button>
        </form>
      </Modal>

      <ConfirmDialog
        isOpen={Boolean(deletingId)}
        onClose={() => setDeletingId(null)}
        onConfirm={() => deleteItem.mutate(deletingId, { onSuccess: () => setDeletingId(null) })}
        title="Delete this item?"
        description="This cannot be undone."
        confirmLabel="Delete"
        isLoading={deleteItem.isPending}
      />
    </div>
  );
}
