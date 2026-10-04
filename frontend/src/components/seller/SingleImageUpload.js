"use client";

import { useMutation } from "@tanstack/react-query";
import { Upload } from "lucide-react";
import { AppImage } from "@/components/ui/AppImage";
import { uploadService } from "@/services/uploadService";
import { useToastStore } from "@/store/toastStore";
import { apiErrorMessage } from "@/lib/api-client";

export function SingleImageUpload({ label, value, onChange }) {
  const showToast = useToastStore((state) => state.showToast);

  const upload = useMutation({
    mutationFn: uploadService.uploadImage,
    onSuccess: (result) => onChange(result.url),
    onError: (error) => showToast(apiErrorMessage(error, "Image upload failed."), "error"),
  });

  return (
    <div>
      <p className="mb-2 text-sm font-medium text-foreground">{label}</p>
      <div className="flex items-center gap-4">
        <div className="relative h-20 w-20 shrink-0 bg-surface-alt">
          {value && <AppImage src={value} alt="" sizes="80px" />}
        </div>
        <label className="focus-ring flex cursor-pointer items-center gap-2 border border-dashed border-border px-4 py-2 text-sm text-muted hover:border-foreground hover:text-foreground">
          <Upload className="h-4 w-4" />
          {upload.isPending ? "Uploading…" : "Upload"}
          <input
            type="file"
            accept="image/png,image/jpeg,image/webp"
            hidden
            onChange={(e) => e.target.files[0] && upload.mutate(e.target.files[0])}
          />
        </label>
      </div>
    </div>
  );
}
