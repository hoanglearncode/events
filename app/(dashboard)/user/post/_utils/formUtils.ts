// utils/formUtils.ts
import { FormValues, ValidationErrors, PreviewItem } from "../_types/post";

export const validateForm = (
  formValues: FormValues,
  featuredImageFile: File | null,
  featuredImageUrl: string | null,
  galleryPreviews: PreviewItem[]
): ValidationErrors => {
  const errors: ValidationErrors = {};

  // Validate title
  if (!formValues.title.trim()) {
    errors.title = "Vui lòng nhập tên bài viết";
  } else if (formValues.title.trim().length < 5) {
    errors.title = "Tên bài viết phải có ít nhất 5 ký tự";
  }

  // Validate featured image
  if (!featuredImageFile && !featuredImageUrl) {
    errors.featured_image = "Vui lòng chọn ảnh đại diện cho bài viết";
  }

  // Validate gallery
  if (galleryPreviews.length === 0) {
    errors.gallery = "Vui lòng tải lên ít nhất 1 hình ảnh vào gallery";
  }

  // Validate content
  if (!formValues.content || formValues.content.trim().length < 10) {
    errors.content = "Nội dung bài viết phải có ít nhất 10 ký tự";
  }

  return errors;
};

export const prepareSubmissionFormData = (
  formValues: FormValues,
  featuredImageFile: File | null,
  featuredImageUrl: string | null,
  galleryPreviews: PreviewItem[]
): FormData => {
  const fd = new FormData();

  // Append text fields
  fd.append("title", formValues.title.trim());
  fd.append("slug", formValues.slug?.trim() || "");
  fd.append("category_id", formValues.category_id || "");
  fd.append("meta_keywords", formValues.meta_keywords || "");
  fd.append("meta_description", formValues.meta_description || "");
  fd.append("content", formValues.content || "");
  fd.append("created_at", new Date().toISOString());
  fd.append("updated_at", new Date().toISOString());

  // Featured image (file) - append only if we have a File object
  if (featuredImageFile) {
    fd.append("featured_image", featuredImageFile, featuredImageFile.name);
  } else if (featuredImageUrl) {
    // If we only have a URL (e.g., already uploaded image), include it as reference
    fd.append("featured_image_url", featuredImageUrl);
  }

  // Gallery files and metadata
  const galleryMeta: Array<Record<string, any>> = [];

  galleryPreviews.forEach((preview, index) => {
    const order = index + 1;
    const isFeatured = !!preview.isFeatured;

    if (preview.file) {
      // append actual file
      fd.append("gallery_images[]", preview.file, preview.file.name);
      galleryMeta.push({ fileName: preview.file.name, order, isFeatured });
    } else if (preview.serverId) {
      // already on server - reference by serverId
      galleryMeta.push({ serverId: preview.serverId, order, isFeatured });
    } else {
      // fallback: include URL so server can fetch it or ignore
      galleryMeta.push({ url: preview.url, order, isFeatured });
    }
  });

  // Attach metadata as JSON so the server can link files <-> ordering/featured flags
  fd.append("gallery_meta", JSON.stringify(galleryMeta));

  return fd;
};

export const scrollToFirstError = (errors: ValidationErrors): void => {
  const firstError = Object.keys(errors)[0];
  const errorElement = document.querySelector(`[data-error="${firstError}"]`);
  if (errorElement) {
    errorElement.scrollIntoView({
      behavior: "smooth",
      block: "center",
    });
  }
};
