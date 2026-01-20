// types.ts
export interface PreviewItem {
  tempId: string;
  file?: File | null;
  url: string;
  uploading?: boolean;
  serverId?: string | null;
  isFeatured?: boolean;
}

export interface FormValues {
  title: string;
  slug: string;
  category_id: string;
  meta_keywords: string;
  meta_description: string;
  content: string;
}

export interface ValidationErrors {
  title?: string;
  featured_image?: string;
  gallery?: string;
  content?: string;
}
