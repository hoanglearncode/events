// hooks/useProductForm.ts
import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { FormValues, ValidationErrors, PreviewItem } from "../_types/post";
import { BlockServices } from "@/services/blog.service";
import { generateSlug } from "@/hooks/queries/useCategories";
import {
  validateForm,
  prepareSubmissionFormData,
  scrollToFirstError,
} from "../_utils/formUtils";

export const useProductForm = () => {
  const [formValues, setFormValues] = useState<FormValues>({
    title: "",
    slug: "",
    category_id: "",
    meta_keywords: "",
    meta_description: "",
    content: "",
  });

  const [galleryPreviews, setGalleryPreviews] = useState<PreviewItem[]>([]);
  const [featuredImageUrl, setFeaturedImageUrl] = useState<string | null>(null);
  const [featuredImageFile, setFeaturedImageFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [validationErrors, setValidationErrors] = useState<ValidationErrors>(
    {}
  );

  const createBlockMutation = useMutation({
    mutationFn: async (data: FormData) => {
      return BlockServices.create(data);
    },
    onSuccess: () => {
      toast.success("Thành công 🎉");
    },
    onError: (error: any) => {
      console.error("Create error:", error);
      toast.error("Có lỗi xảy ra");
    },
  });

  const handleFieldChange = (field: keyof FormValues, value: any) => {
    setFormValues((prev) => ({ ...prev, [field]: value }));

    if ((validationErrors as any)[field]) {
      setValidationErrors((prev) => ({ ...prev, [field]: undefined }));
    }

    // Auto-generate slug from title
    if (field === "title" && !formValues.slug) {
      const slug = generateSlug(value);
      setFormValues((prev) => ({ ...prev, slug }));
    }
  };

  const handleGalleryUpload = async (files: File[]) => {
    setIsUploading(true);

    const newPreviews: PreviewItem[] = files.map((file, index) => ({
      tempId: `temp-${Date.now()}-${index}`,
      file,
      url: URL.createObjectURL(file),
      uploading: false,
      isFeatured: false,
    }));

    setGalleryPreviews((prev) => [...prev, ...newPreviews]);

    // Clear gallery validation error
    if (validationErrors.gallery) {
      setValidationErrors((prev) => ({ ...prev, gallery: undefined }));
    }

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 500));
    setIsUploading(false);
  };

  const handleGalleryRemove = (tempId: string) => {
    setGalleryPreviews((prev) => prev.filter((p) => p.tempId !== tempId));
  };

  const handleGalleryReorder = (fromIndex: number, toIndex: number) => {
    setGalleryPreviews((prev) => {
      const newPreviews = [...prev];
      const [removed] = newPreviews.splice(fromIndex, 1);
      newPreviews.splice(toIndex, 0, removed);
      return newPreviews;
    });
  };

  const handleToggleFeatured = (tempId: string) => {
    setGalleryPreviews((prev) =>
      prev.map((preview) =>
        preview.tempId === tempId
          ? { ...preview, isFeatured: !preview.isFeatured }
          : preview
      )
    );
  };

  const handleFeaturedUpload = async (file: File) => {
    setIsUploading(true);
    const url = URL.createObjectURL(file);

    setFeaturedImageFile(file);
    setFeaturedImageUrl(url);

    // Clear featured image validation error
    if (validationErrors.featured_image) {
      setValidationErrors((prev) => ({ ...prev, featured_image: undefined }));
    }

    await new Promise((resolve) => setTimeout(resolve, 300));
    setIsUploading(false);
  };

  const handleFeaturedRemove = () => {
    setFeaturedImageFile(null);
    setFeaturedImageUrl(null);
  };

  const handleSubmit = async () => {
    // Validate
    const errors = validateForm(
      formValues,
      featuredImageFile,
      featuredImageUrl,
      galleryPreviews
    );

    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors);
      scrollToFirstError(errors);
      return;
    }

    setIsSubmitting(true);

    try {
      // Prepare FormData
      const formPayload = prepareSubmissionFormData(
        formValues,
        featuredImageFile,
        featuredImageUrl,
        galleryPreviews
      );

      // Debug FormData
      console.group("FormData submission preview");
      for (const [key, value] of formPayload.entries()) {
        if (value instanceof File) {
          console.log(key, "(File) =>", value.name, `${value.size} bytes`);
        } else {
          console.log(key, "=>", value);
        }
      }
      console.groupEnd();

      // Submit
      await createBlockMutation.mutateAsync(formPayload);
    } catch (error) {
      console.error("Submit error:", error);
      toast.error("❌ Có lỗi xảy ra khi gửi dữ liệu");
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    formValues,
    galleryPreviews,
    featuredImageUrl,
    isUploading,
    isSubmitting,
    validationErrors,
    handleFieldChange,
    handleGalleryUpload,
    handleGalleryRemove,
    handleGalleryReorder,
    handleToggleFeatured,
    handleFeaturedUpload,
    handleFeaturedRemove,
    handleSubmit,
  };
};
