"use client";

import React, { useEffect, useRef, useState } from "react";
import {
  X,
  Upload,
  Image as ImageIcon,
  Loader2,
  Trash2,
  Eye,
  GripVertical,
  Plus,
  Star,
  AlertCircle,
  Save,
  ArrowLeft,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import PublicHeader from "@/components/features/common/publicHeader";
import PublicFooter from "@/components/features/common/publicFooter";
import RichTextEditor from "@/components/RichTextEditor";
import { generateSlug } from "@/hooks/queries/useCategories";
import Cookies from "js-cookie";
import { ACCESS_TOKEN } from "@/shared/const/cookie";
import { useParams, useRouter } from "next/navigation";

// Types
interface PreviewItem {
  tempId: string;
  file?: File | null;
  url: string;
  uploading?: boolean;
  serverId?: string | null;
  isFeatured?: boolean;
  cloudinaryUrl?: string | null;
  localBlob?: boolean;
}

interface FormValues {
  title: string;
  content: string;
  slug: string;
}

interface ValidationErrors {
  title?: string;
  featured_image?: string;
  gallery?: string;
  content?: string;
}

// API Response Types
interface BlogResponse {
  id: string;
  title: string;
  content: string;
  slug: string;
  thumbnailUrl: string;
  gallery: Array<{
    url: string;
    isFeatured: boolean;
    order?: number;
  }>;
}

// Simple BlogService using fetch (adjust endpoints to your backend)
const BASE = process.env.NEXT_PUBLIC_API_URL || "";
const BlogService = {
  async getPostBySlug(slug?: string | undefined): Promise<BlogResponse> {
    if (!slug) throw new Error("Missing slug");
    const res = await fetch(`${BASE}/api/blog/${encodeURIComponent(slug)}`);
    if (!res.ok) throw new Error("Không tìm thấy bài viết");
    const data = await res.json();
    // assume data.result or data directly contains the post
    return data.result || data;
  },
};

// ============================================
// CLOUDINARY UPLOAD UTILITY
// ============================================
async function uploadToCloudinary(file: File): Promise<string> {
  const formData = new FormData();
  formData.append("file", file);

  const response = await fetch(
    process.env.NEXT_PUBLIC_API_URL + "/api/upload/cloudinary",
    {
      method: "POST",
      body: formData,
      headers: {
        Authorization: `Bearer ${Cookies.get(ACCESS_TOKEN)}`,
      },
    }
  );

  if (!response.ok) {
    let err = "Upload failed";
    try {
      const e = await response.json();
      err = e.details || e.error || JSON.stringify(e);
    } catch (e) {
      // ignore parse error
    }
    throw new Error(err);
  }

  const data = await response.json();
  return data.url;
}

// ImageLightbox Component
const ImageLightbox: React.FC<{
  images: string[];
  currentIndex: number | null;
  onClose: () => void;
  onNavigate: (direction: "prev" | "next") => void;
}> = ({ images, currentIndex, onClose, onNavigate }) => {
  if (currentIndex === null) return null;

  return (
    <div
      className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center animate-in fade-in duration-200"
      onClick={onClose}
    >
      <Button
        variant="ghost"
        size="icon"
        onClick={(e) => {
          e.stopPropagation();
          onClose();
        }}
        className="absolute top-4 right-4 text-white hover:bg-white/10 h-12 w-12 rounded-full"
      >
        <X className="h-6 w-6" />
      </Button>

      {images.length > 1 && (
        <>
          <Button
            variant="ghost"
            size="icon"
            onClick={(e) => {
              e.stopPropagation();
              onNavigate("prev");
            }}
            className="absolute left-4 text-white hover:bg-white/10 h-14 w-14 rounded-full text-4xl"
          >
            ‹
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={(e) => {
              e.stopPropagation();
              onNavigate("next");
            }}
            className="absolute right-4 text-white hover:bg-white/10 h-14 w-14 rounded-full text-4xl"
          >
            ›
          </Button>
        </>
      )}

      <img
        src={images[currentIndex]}
        alt="Preview"
        className="max-w-[90vw] max-h-[90vh] object-contain rounded-lg"
        onClick={(e) => e.stopPropagation()}
      />

      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2">
        <Badge variant="secondary" className="text-base px-4 py-2">
          {currentIndex + 1} / {images.length}
        </Badge>
      </div>
    </div>
  );
};

// Featured Image Selector Component
const FeaturedImageSelector: React.FC<{
  currentImage: string | null;
  onUpload: (file: File) => Promise<void>;
  onRemove: () => void;
  isUploading: boolean;
  error?: string;
}> = ({ currentImage, onUpload, onRemove, isUploading, error }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [showLightbox, setShowLightbox] = useState(false);

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      await onUpload(file);
    }
    e.target.value = "";
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          Ảnh Đại Diện <span className="text-destructive">*</span>
        </CardTitle>
        <CardDescription>Chọn ảnh đại diện chính cho bài viết</CardDescription>
      </CardHeader>
      <CardContent>
        {error && (
          <div className="mb-4 p-3 border border-destructive bg-destructive/10 rounded-md flex items-center gap-2">
            <AlertCircle className="h-4 w-4 text-destructive" />
            <span className="text-destructive">{error}</span>
          </div>
        )}

        {currentImage ? (
          <div className="relative group aspect-video flex-1 rounded-xl overflow-hidden border-2 border-border hover:shadow-lg transition-all">
            <img
              src={currentImage}
              alt="Featured"
              className="w-full h-full object-cover"
            />
            {!isUploading && (
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/50 transition-colors">
                <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Button
                    size="icon"
                    variant="secondary"
                    onClick={() => setShowLightbox(true)}
                    className="h-10 w-10 bg-white/90 hover:bg-white"
                  >
                    <Eye className="h-5 w-5" />
                  </Button>
                  <Button
                    size="icon"
                    variant="secondary"
                    onClick={() => fileInputRef.current?.click()}
                    className="h-10 w-10 bg-white/90 hover:bg-white"
                  >
                    <Upload className="h-5 w-5" />
                  </Button>
                  <Button
                    size="icon"
                    variant="destructive"
                    onClick={onRemove}
                    className="h-10 w-10"
                  >
                    <Trash2 className="h-5 w-5" />
                  </Button>
                </div>
              </div>
            )}
            {isUploading && (
              <div className="absolute inset-0 bg-black/60 flex flex-col items-center justify-center backdrop-blur-sm">
                <Loader2 className="h-12 w-12 animate-spin text-white mb-2" />
                <p className="text-sm font-medium text-white">
                  Đang tải lên Cloudinary...
                </p>
              </div>
            )}
          </div>
        ) : (
          <button
            onClick={() => fileInputRef.current?.click()}
            disabled={isUploading}
            className="w-full flex-1 aspect-video border-2 border-dashed border-border rounded-xl flex flex-col items-center justify-center gap-4 hover:border-primary hover:bg-primary/5 transition-all disabled:opacity-50 disabled:cursor-not-allowed group"
          >
            {isUploading ? (
              <>
                <Loader2 className="h-12 w-12 animate-spin text-primary" />
                <p className="text-sm font-medium text-muted-foreground">
                  Đang tải lên...
                </p>
              </>
            ) : (
              <>
                <div className="h-16 w-16 rounded-full bg-primary/10 group-hover:bg-primary/20 flex items-center justify-center transition-colors">
                  <ImageIcon className="h-8 w-8 text-primary" />
                </div>
                <div>
                  <p className="text-base font-medium text-foreground mb-1">
                    Nhấn để tải ảnh đại diện
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Khuyến nghị: 1200x630px, tối đa 5MB
                  </p>
                </div>
              </>
            )}
          </button>
        )}

        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileSelect}
          className="hidden"
        />

        {showLightbox && currentImage && (
          <ImageLightbox
            images={[currentImage]}
            currentIndex={0}
            onClose={() => setShowLightbox(false)}
            onNavigate={() => {}}
          />
        )}
      </CardContent>
    </Card>
  );
};

export default function Page() {
  const router = useRouter();
  const params = useParams();
  const slug = params?.id as string | undefined;

  // ===== STATE & HOOKS =====
  const [blogId, setBlogId] = useState<string | null>(null);
  const [isLoadingData, setIsLoadingData] = useState<boolean>(false);
  const [formValues, setFormValues] = useState<FormValues>({
    title: "",
    content: "",
    slug: "",
  });
  const [galleryPreviews, setGalleryPreviews] = useState<PreviewItem[]>([]);
  const [featured, setFeaturedImageUrl] = useState<string | null>(null);
  const [featuredImageFile, setFeaturedImageFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [validationErrors, setValidationErrors] = useState<ValidationErrors>(
    {}
  );

  const [attemptedSubmit, setAttemptedSubmit] = useState(false);
  const [showCancelConfirm, setShowCancelConfirm] = useState(false);

  // ===== EFFECT: Fetch Data if Slug exists =====
  useEffect(() => {
    const fetchPost = async () => {
      try {
        setIsLoadingData(true);
        const data = await BlogService.getPostBySlug(slug);
        // populate form
        setBlogId(data.id);
        setFormValues({
          title: data.title || "",
          content: data.content || "",
          slug: data.slug || "",
        });
        setFeaturedImageUrl(data.thumbnailUrl || null);
        const mapped = (data.gallery || []).map(
          (g, i) =>
            ({
              tempId: `server-${i}-${Date.now()}`,
              url: g.url,
              uploading: false,
              isFeatured: !!g.isFeatured,
              localBlob: false,
            }) as PreviewItem
        );
        setGalleryPreviews(mapped);
      } catch (err: any) {
        console.error("Error fetching post:", err);
        toast.error("Không thể tải bài viết");
      } finally {
        setIsLoadingData(false);
      }
    };

    if (slug) {
      fetchPost();
    }
  }, [slug]);

  // ===== EFFECT: cleanup blob urls =====
  useEffect(() => {
    return () => {
      galleryPreviews.forEach((p) => {
        if (p.localBlob && p.url.startsWith("blob:")) {
          try {
            URL.revokeObjectURL(p.url);
          } catch (e) {
            // ignore
          }
        }
      });
      if (featured && featured.startsWith("blob:")) {
        try {
          URL.revokeObjectURL(featured);
        } catch (e) {
          // ignore
        }
      }
    };
  }, []);

  // ===== HANDLERS =====
  const handleFieldChange = (field: keyof FormValues, value: any) => {
    setFormValues((prev) => ({ ...prev, [field]: value }));
    if (field === "title" && !blogId) {
      setFormValues((prev) => ({ ...prev, slug: generateSlug(value) }));
    }
    setValidationErrors((prev) => ({ ...prev, [field]: undefined }));
  };

  const handleGalleryUpload = async (files: File[]) => {
    if (files.length === 0) return;
    const newPreviews: PreviewItem[] = files.map((file, index) => ({
      tempId: `temp-${Date.now()}-${index}`,
      file,
      url: URL.createObjectURL(file),
      uploading: false,
      isFeatured: false,
      localBlob: true,
    }));
    setGalleryPreviews((prev) => [...prev, ...newPreviews]);
    setValidationErrors((prev) => ({ ...prev, gallery: undefined }));
  };

  const handleGalleryRemove = (tempId: string) => {
    setGalleryPreviews((prev) => {
      const toRemove = prev.find((p) => p.tempId === tempId);
      if (toRemove?.localBlob && toRemove.url.startsWith("blob:")) {
        try {
          URL.revokeObjectURL(toRemove.url);
        } catch (e) {
          // ignore
        }
      }
      return prev.filter((p) => p.tempId !== tempId);
    });
  };

  const handleGalleryReorder = (fromIndex: number, toIndex: number) => {
    setGalleryPreviews((prev) => {
      const newPreviews = [...prev];
      if (fromIndex < 0 || fromIndex >= newPreviews.length) return newPreviews;
      const [removed] = newPreviews.splice(fromIndex, 1);
      newPreviews.splice(
        Math.max(0, Math.min(toIndex, newPreviews.length)),
        0,
        removed
      );
      return newPreviews;
    });
  };

  const handleToggleFeatured = (tempId: string) => {
    setGalleryPreviews((prev) =>
      prev.map((preview) =>
        preview.tempId === tempId
          ? { ...preview, isFeatured: !preview.isFeatured }
          : { ...preview, isFeatured: false }
      )
    );
  };

  const handleFeaturedUpload = async (file: File) => {
    const localUrl = URL.createObjectURL(file);
    if (featured && featured.startsWith("blob:")) {
      try {
        URL.revokeObjectURL(featured);
      } catch (e) {
        // ignore
      }
    }
    setFeaturedImageUrl(localUrl);
    setFeaturedImageFile(file);
    setValidationErrors((prev) => ({ ...prev, featured_image: undefined }));
  };

  const handleFeaturedRemove = () => {
    if (featured && featured.startsWith("blob:")) {
      try {
        URL.revokeObjectURL(featured);
      } catch (e) {
        // ignore
      }
    }
    setFeaturedImageUrl(null);
    setFeaturedImageFile(null);
  };

  const validateForm = (): { valid: boolean; errors: ValidationErrors } => {
    const errors: ValidationErrors = {};
    if (!formValues.title.trim()) {
      errors.title = "Vui lòng nhập tên bài viết";
    } else if (formValues.title.trim().length < 5) {
      errors.title = "Tên bài viết phải có ít nhất 5 ký tự";
    }
    // if (!featured) {
    //   errors.featured_image = "Vui lòng chọn ảnh đại diện cho bài viết";
    // }

    if (!formValues.content || formValues.content.trim().length < 10) {
      errors.content = "Nội dung bài viết phải có ít nhất 10 ký tự";
    }
    setValidationErrors(errors);
    return { valid: Object.keys(errors).length === 0, errors };
  };

  // ===== SUBMIT =====
  const handleSubmit = async () => {
    setAttemptedSubmit(true);
    const token = Cookies.get(ACCESS_TOKEN);
    const { valid, errors } = validateForm();

    if (!valid) {
      const firstError = Object.keys(errors)[0];
      const errorElement = document.querySelector(
        `[data-error="${firstError}"]`
      );
      if (errorElement) {
        (errorElement as HTMLElement).scrollIntoView({
          behavior: "smooth",
          block: "center",
        });
      }
      toast.error("Vui lòng kiểm tra lại các trường bắt buộc");
      return;
    }

    setIsSubmitting(true);

    try {
      // 1. Upload featured image (Nếu là file mới)
      let thumbnailUrl = featured;
      if (featuredImageFile) {
        toast.info("Đang upload ảnh đại diện...");
        thumbnailUrl = await uploadToCloudinary(featuredImageFile);
      }

      // 2. Upload gallery images
      const galleryWithCloudUrls: Array<any> = [];
      for (const [index, preview] of galleryPreviews.entries()) {
        let url = preview.url;
        if (preview.file) {
          toast.info(
            `Đang upload ảnh ${index + 1}/${galleryPreviews.length}...`
          );
          url = await uploadToCloudinary(preview.file);
        }
        galleryWithCloudUrls.push({
          url,
          order: index + 1,
          isFeatured: !!preview.isFeatured,
        });
      }

      // 3. Prepare Payload
      toast.info("Đang lưu bài viết...");
      const submissionData = {
        ...formValues,
        thumbnailUrl,
        gallery: galleryWithCloudUrls,
        updated_at: new Date().toISOString(),
        ...(blogId ? {} : { created_at: new Date().toISOString() }),
      };

      // 4. Determine Endpoint & Method
      const apiUrl = blogId ? `${BASE}/api/blog/${blogId}` : `${BASE}/api/blog`;
      const method = blogId ? "PUT" : "POST";

      const response = await fetch(apiUrl, {
        method,
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify(submissionData),
      });

      const result = await response.json();

      if (response.ok) {
        toast.success(
          blogId
            ? "✨ Cập nhật bài viết thành công!"
            : "✨ Tạo bài viết thành công!"
        );

        // Cleanup blob URLs
        galleryPreviews.forEach((p) => {
          if (p.localBlob && p.url.startsWith("blob:")) {
            try {
              URL.revokeObjectURL(p.url);
            } catch (e) {}
          }
        });
        if (featured && featured.startsWith("blob:")) {
          try {
            URL.revokeObjectURL(featured);
          } catch (e) {}
        }

        router.push("/blog");
        router.refresh();
      } else {
        toast.error(result?.message || "Có lỗi xảy ra khi lưu bài viết.");
      }
    } catch (error: any) {
      console.error("Submit error:", error);
      toast.error(
        error?.message || "Có lỗi xảy ra khi lưu bài viết. Vui lòng thử lại."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  // Loading State UI
  if (isLoadingData) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-12 w-12 animate-spin text-primary" />
          <p className="text-muted-foreground">Đang tải dữ liệu bài viết...</p>
        </div>
      </div>
    );
  }

  // ===== RETURN JSX =====
  return (
    <div className="min-h-screen bg-background">
      <PublicHeader />
      <main className="pt-32 pb-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto space-y-6">
          {/* Back Button */}
          <Button
            variant="ghost"
            className="pl-0 gap-2 hover:bg-transparent hover:text-primary"
            onClick={() => router.back()}
          >
            <ArrowLeft className="h-4 w-4" /> Quay lại
          </Button>

          {/* Header */}
          <div className="space-y-2">
            <h1 className="text-4xl font-bold tracking-tight">
              {blogId ? "Chỉnh Sửa Blog" : "Thêm Blog Mới"}
            </h1>
            <p className="text-lg text-muted-foreground">
              {blogId
                ? "Cập nhật nội dung bài viết của bạn"
                : "Nhập thông tin chi tiết blog của bạn"}
            </p>
          </div>

          {/* Validation Summary */}
          {attemptedSubmit && Object.keys(validationErrors).length > 0 && (
            <div className="mb-4 p-4 border border-destructive bg-destructive/10 rounded-md flex items-start gap-3">
              <AlertCircle className="h-4 w-4 text-destructive mt-1" />
              <div>
                <div className="font-semibold mb-2 text-destructive">
                  Vui lòng kiểm tra lại các trường sau:
                </div>
                <ul className="list-disc list-inside space-y-1 text-destructive">
                  {validationErrors.title && <li>{validationErrors.title}</li>}
                  {validationErrors.featured_image && (
                    <li>{validationErrors.featured_image}</li>
                  )}
                  {validationErrors.gallery && (
                    <li>{validationErrors.gallery}</li>
                  )}
                  {validationErrors.content && (
                    <li>{validationErrors.content}</li>
                  )}
                </ul>
              </div>
            </div>
          )}

          {/* Basic Info */}
          <Card data-error="title">
            <CardHeader>
              <CardTitle>Thông Tin Cơ Bản</CardTitle>
              <CardDescription>Thông tin chính về bài viết</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="title">
                  Tên bài viết <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="title"
                  value={formValues.title}
                  onChange={(e) => {
                    handleFieldChange("title", e.target.value);
                  }}
                  placeholder="VD: Top 10 smartphone đáng mua nhất năm 2025"
                  className={`h-11 ${validationErrors.title ? "border-destructive" : ""}`}
                />
                {validationErrors.title && (
                  <p className="text-sm text-destructive">
                    {validationErrors.title}
                  </p>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Featured Image */}
          <div data-error="featured_image">
            <FeaturedImageSelector
              currentImage={featured}
              onUpload={handleFeaturedUpload}
              onRemove={handleFeaturedRemove}
              isUploading={isUploading}
              error={validationErrors.featured_image}
            />
          </div>

          <Card data-error="content">
            <CardHeader>
              <CardTitle>Nội dung</CardTitle>
              <CardDescription>Nội dung chi tiết bài viết</CardDescription>
            </CardHeader>
            <CardContent>
              <RichTextEditor
                value={formValues.content}
                onChange={(val: string) => handleFieldChange("content", val)}
              />
              {validationErrors.content && (
                <p className="text-sm text-destructive mt-2">
                  {validationErrors.content}
                </p>
              )}
            </CardContent>
          </Card>

          {/* Actions */}
          <div className="flex flex-col items-end gap-3 sticky bottom-4 z-40">
            <div className="flex items-center gap-3 p-4 bg-background/80 backdrop-blur-md border rounded-xl shadow-lg">
              {!showCancelConfirm ? (
                <Button
                  variant="secondary"
                  disabled={isSubmitting}
                  onClick={() => setShowCancelConfirm(true)}
                >
                  Hủy
                </Button>
              ) : (
                <div className="flex items-center gap-2 bg-muted p-2 rounded-md">
                  <span>Bạn chắc chắn muốn hủy?</span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowCancelConfirm(false)}
                    disabled={isSubmitting}
                  >
                    Không
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => {
                      setFormValues({ title: "", content: "", slug: "" });
                      galleryPreviews.forEach((p) => {
                        if (p.localBlob && p.url.startsWith("blob:")) {
                          try {
                            URL.revokeObjectURL(p.url);
                          } catch (e) {}
                        }
                      });
                      setGalleryPreviews([]);
                      if (featured && featured.startsWith("blob:")) {
                        try {
                          URL.revokeObjectURL(featured);
                        } catch (e) {}
                      }
                      setFeaturedImageUrl(null);
                      setFeaturedImageFile(null);
                      setValidationErrors({});
                      setAttemptedSubmit(false);
                      setShowCancelConfirm(false);
                      toast.info("Hành động hủy đã được thực hiện.");
                    }}
                    disabled={isSubmitting}
                  >
                    Xác nhận hủy
                  </Button>
                </div>
              )}

              <Button
                onClick={handleSubmit}
                disabled={isSubmitting || isUploading}
                className="min-w-[140px]"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    Đang lưu...
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4 mr-2" />
                    {blogId ? "Cập nhật" : "Lưu bài viết"}
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      </main>
      <PublicFooter />
    </div>
  );
}
