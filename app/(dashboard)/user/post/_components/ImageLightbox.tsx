// components/ImageLightbox.tsx
import React from "react";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface ImageLightboxProps {
  images: string[];
  currentIndex: number | null;
  onClose: () => void;
  onNavigate: (direction: "prev" | "next") => void;
}

export const ImageLightbox: React.FC<ImageLightboxProps> = ({
  images,
  currentIndex,
  onClose,
  onNavigate,
}) => {
  if (currentIndex === null) return null;

  return (
    <div
      className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center animate-in fade-in duration-200"
      onClick={onClose}
    >
      <Button
        variant="ghost"
        size="icon"
        onClick={onClose}
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
