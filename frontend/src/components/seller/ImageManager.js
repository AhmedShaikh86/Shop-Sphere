"use client";

import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { DndContext, closestCenter, PointerSensor, useSensor, useSensors } from "@dnd-kit/core";
import { SortableContext, arrayMove, useSortable, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { GripVertical, Upload, X } from "lucide-react";
import { AppImage } from "@/components/ui/AppImage";
import { Input } from "@/components/ui/Input";
import { uploadService } from "@/services/uploadService";
import { useToastStore } from "@/store/toastStore";
import { apiErrorMessage } from "@/lib/api-client";

function SortableImageRow({ image, index, onRemove, onAltChange }) {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: image.url });

  return (
    <div
      ref={setNodeRef}
      style={{ transform: CSS.Transform.toString(transform), transition }}
      className="flex items-center gap-3 border border-border bg-surface p-2"
    >
      <button type="button" {...attributes} {...listeners} aria-label="Drag to reorder" className="cursor-grab text-muted">
        <GripVertical className="h-4 w-4" />
      </button>
      <div className="relative h-16 w-14 shrink-0 bg-surface-alt">
        <AppImage src={image.url} alt="" sizes="60px" />
      </div>
      <Input
        value={image.alt_text || ""}
        onChange={(e) => onAltChange(index, e.target.value)}
        placeholder="Alt text"
        className="flex-1"
      />
      <button type="button" onClick={() => onRemove(index)} aria-label="Remove image" className="focus-ring text-muted hover:text-danger">
        <X className="h-4 w-4" />
      </button>
    </div>
  );
}

/** Upload-and-reorder product/store image list, backed by the local upload endpoint. */
export function ImageManager({ images, onChange }) {
  const showToast = useToastStore((state) => state.showToast);
  const sensors = useSensors(useSensor(PointerSensor));
  const [isUploading, setIsUploading] = useState(false);

  const uploadImage = useMutation({
    mutationFn: uploadService.uploadImage,
    onError: (error) => showToast(apiErrorMessage(error, "Image upload failed."), "error"),
  });

  async function handleFileSelect(event) {
    const files = Array.from(event.target.files || []);
    event.target.value = "";
    if (files.length === 0) return;

    setIsUploading(true);
    try {
      const uploaded = await Promise.all(files.map((file) => uploadImage.mutateAsync(file)));
      onChange([...images, ...uploaded.map((result) => ({ url: result.url, alt_text: "" }))]);
    } finally {
      setIsUploading(false);
    }
  }

  function handleDragEnd(event) {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = images.findIndex((image) => image.url === active.id);
    const newIndex = images.findIndex((image) => image.url === over.id);
    onChange(arrayMove(images, oldIndex, newIndex));
  }

  function handleRemove(index) {
    onChange(images.filter((_, i) => i !== index));
  }

  function handleAltChange(index, value) {
    onChange(images.map((image, i) => (i === index ? { ...image, alt_text: value } : image)));
  }

  return (
    <div className="flex flex-col gap-3">
      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <SortableContext items={images.map((i) => i.url)} strategy={verticalListSortingStrategy}>
          <div className="flex flex-col gap-2">
            {images.map((image, index) => (
              <SortableImageRow
                key={image.url}
                image={image}
                index={index}
                onRemove={handleRemove}
                onAltChange={handleAltChange}
              />
            ))}
          </div>
        </SortableContext>
      </DndContext>

      <label className="focus-ring flex w-fit cursor-pointer items-center gap-2 border border-dashed border-border px-4 py-2 text-sm text-muted hover:border-foreground hover:text-foreground">
        <Upload className="h-4 w-4" />
        {isUploading ? "Uploading…" : "Upload Images"}
        <input type="file" accept="image/png,image/jpeg,image/webp" multiple hidden onChange={handleFileSelect} disabled={isUploading} />
      </label>
    </div>
  );
}
