"use client";

import { useCallback } from "react";

/**
 * Tạm thời: dùng URL.createObjectURL
 * Sau này thay bằng upload S3 / Cloudinary / API
 */
export function useImageUpload() {
  const handleImageUpload = useCallback(
    async (file: File | null): Promise<string> => {
      if (!file) return "";

      // ❗ MOCK PREVIEW (client-only)
      const previewUrl = URL.createObjectURL(file);

      /**
       * 🔜 Sau này thay bằng:
       * const formData = new FormData()
       * formData.append("file", file)
       * const res = await uploadService(formData)
       * return res.url
       */

      return previewUrl;
    },
    []
  );

  return { handleImageUpload };
}
