import { apiClient, unwrap } from "@/lib/api-client";

export const uploadService = {
  uploadImage: (file) => {
    const formData = new FormData();
    formData.append("file", file);

    return apiClient
      .post("/uploads/image", formData, { headers: { "Content-Type": "multipart/form-data" } })
      .then(unwrap);
  },
};
