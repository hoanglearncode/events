// components/GalleryUpload.tsx
import React, { useRef, useState } from "react";
import {
  Upload,
  ImageIcon,
  Loader2,
  Trash2,
  Eye,
  GripVertical,
  Plus,
  Star,
  AlertCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { ImageLightbox } from "./ImageLightbox";
import { PreviewItem } from "../_types/post";

interface GalleryUploadProps {
  previews: PreviewItem[];
  onUpload: (files: File[]) => Promise<void>;
  onRemove: (tempId: string) => void;
  onReorder: (fromIndex: number, toIndex: number) => void;
  onToggleFeatured: (tempId: string) => void;
  isUploading: boolean;
  error?: string;
}

export const GalleryUpload: React.FC<GalleryUploadProps> = ({
  previews,
  onUpload,
  onRemove,
  onReorder,
  onToggleFeatured,
  isUploading,
  error,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length > 0) {
      await onUpload(files);
    }
  };

  const handleDragStart = (e: React.DragEvent, index: number) => {
    setDraggedIndex(index);
    e.dataTransfer.effectAllowed = "move";
  };

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    if (draggedIndex === null || draggedIndex === index) return;

    onReorder(draggedIndex, index);
    setDraggedIndex(index);
  };

  const handleDragEnd = () => {
    setDraggedIndex(null);
  };

  const navigateLightbox = (direction: "prev" | "next") => {
    if (direction === "prev") {
      setLightboxIndex((prev) => (prev! > 0 ? prev! - 1 : previews.length - 1));
    } else {
      setLightboxIndex((prev) => (prev! < previews.length - 1 ? prev! + 1 : 0));
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <CardTitle>Gallery Hình Ảnh</CardTitle>
            <CardDescription>
              Tải lên nhiều hình ảnh. Kéo thả để sắp xếp thứ tự. Click vào ngôi
              sao để đánh dấu ảnh nổi bật.
            </CardDescription>
          </div>
          <Button
            onClick={() => fileInputRef.current?.click()}
            disabled={isUploading}
            className="gap-2"
          >
            {isUploading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Đang tải...
              </>
            ) : (
              <>
                <Upload className="h-4 w-4" />
                Tải ảnh lên
              </>
            )}
          </Button>
          <input
            ref={fileInputRef}
            type="file"
            multiple
            accept="image/*"
            onChange={handleFileSelect}
            className="hidden"
          />
        </div>
      </CardHeader>
      <CardContent>
        {error && (
          <Alert variant="destructive" className="mb-4">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {previews.length === 0 ? (
          <div
            onClick={() => fileInputRef.current?.click()}
            className="border-2 border-dashed border-border rounded-lg p-16 text-center cursor-pointer hover:border-primary transition-colors group"
          >
            <div className="flex flex-col items-center gap-4">
              <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                <ImageIcon className="h-8 w-8 text-primary" />
              </div>
              <div>
                <p className="text-base font-medium text-foreground mb-1">
                  Chưa có hình ảnh nào
                </p>
                <p className="text-sm text-muted-foreground">
                  Nhấn để tải ảnh lên hoặc kéo thả file vào đây
                </p>
              </div>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {previews.map((preview, index) => (
              <div
                key={preview.tempId}
                draggable
                onDragStart={(e) => handleDragStart(e, index)}
                onDragOver={(e) => handleDragOver(e, index)}
                onDragEnd={handleDragEnd}
                className={`relative group aspect-square rounded-xl overflow-hidden border-2 transition-all cursor-move hover:shadow-lg ${
                  draggedIndex === index
                    ? "border-primary ring-2 ring-primary/20 opacity-50 scale-95"
                    : "border-border"
                } ${preview.isFeatured ? "ring-2 ring-yellow-400" : ""}`}
              >
                <img
                  src={preview.url}
                  alt={`Preview ${index + 1}`}
                  className="w-full h-full object-cover"
                />

                {preview.isFeatured && (
                  <div className="absolute top-2 left-2">
                    <Badge className="bg-yellow-500 hover:bg-yellow-600 text-white">
                      <Star className="h-3 w-3 mr-1 fill-current" />
                      Nổi bật
                    </Badge>
                  </div>
                )}

                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/0 to-black/60 opacity-0 group-hover:opacity-100 transition-opacity">
                  <div className="absolute top-2 right-2 flex gap-1.5">
                    <Button
                      size="icon"
                      variant="secondary"
                      onClick={() => setLightboxIndex(index)}
                      className="h-8 w-8 bg-white/90 hover:bg-white"
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button
                      size="icon"
                      variant={preview.isFeatured ? "default" : "secondary"}
                      onClick={() => onToggleFeatured(preview.tempId)}
                      className={`h-8 w-8 ${preview.isFeatured ? "bg-yellow-500 hover:bg-yellow-600" : "bg-white/90 hover:bg-white"}`}
                      title={
                        preview.isFeatured
                          ? "Bỏ đánh dấu nổi bật"
                          : "Đánh dấu là ảnh nổi bật"
                      }
                    >
                      <Star
                        className={`h-4 w-4 ${preview.isFeatured ? "fill-current text-white" : ""}`}
                      />
                    </Button>
                    <Button
                      size="icon"
                      variant="destructive"
                      onClick={() => onRemove(preview.tempId)}
                      className="h-8 w-8"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>

                  <div className="absolute bottom-2 left-2">
                    <div className="h-8 w-8 rounded-md bg-black/50 flex items-center justify-center">
                      <GripVertical className="h-5 w-5 text-white" />
                    </div>
                  </div>
                </div>

                {preview.uploading && (
                  <div className="absolute inset-0 bg-black/60 flex items-center justify-center backdrop-blur-sm">
                    <Loader2 className="h-8 w-8 animate-spin text-white" />
                  </div>
                )}

                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-2">
                  <Badge variant="secondary" className="text-xs">
                    #{index + 1}
                  </Badge>
                </div>
              </div>
            ))}

            {/* Add More Button */}
            <button
              onClick={() => fileInputRef.current?.click()}
              className="aspect-square rounded-xl border-2 border-dashed border-border hover:border-primary hover:bg-primary/5 transition-all flex flex-col items-center justify-center gap-2 group"
            >
              <div className="h-10 w-10 rounded-full bg-primary/10 group-hover:bg-primary/20 flex items-center justify-center transition-colors">
                <Plus className="h-5 w-5 text-primary" />
              </div>
              <span className="text-sm font-medium text-muted-foreground group-hover:text-primary transition-colors">
                Thêm ảnh
              </span>
            </button>
          </div>
        )}

        <ImageLightbox
          images={previews.map((p) => p.url)}
          currentIndex={lightboxIndex}
          onClose={() => setLightboxIndex(null)}
          onNavigate={navigateLightbox}
        />
      </CardContent>
    </Card>
  );
};
