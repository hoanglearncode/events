// components/FeaturedImageSelector.tsx
import React, { useRef, useState } from "react";
import {
  Upload,
  Trash2,
  Eye,
  ImageIcon,
  Loader2,
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
import { Alert, AlertDescription } from "@/components/ui/alert";
import { ImageLightbox } from "./ImageLightbox";

interface FeaturedImageSelectorProps {
  currentImage: string | null;
  onUpload: (file: File) => Promise<void>;
  onRemove: () => void;
  isUploading: boolean;
  error?: string;
}

export const FeaturedImageSelector: React.FC<FeaturedImageSelectorProps> = ({
  currentImage,
  onUpload,
  onRemove,
  isUploading,
  error,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [showLightbox, setShowLightbox] = useState(false);

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      await onUpload(file);
    }
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
          <Alert variant="destructive" className="mb-4">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {currentImage ? (
          <div className="relative group aspect-video flex-1 rounded-xl overflow-hidden border-2 border-border hover:shadow-lg transition-all">
            <img
              src={currentImage}
              alt="Featured"
              className="w-full h-full object-cover"
            />
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
