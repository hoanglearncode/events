"use client";

import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import {
  TrendingUp,
  Sparkles,
  Award,
  ChevronLeft,
  ChevronRight,
  Loader2,
} from "lucide-react";
import ProductCard from "./ToolCard";

export const FeaturedSection = () => {
  const { t } = useTranslation();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [itemsPerSlide, setItemsPerSlide] = useState(3);
  const [tools, setTools] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch popular products
  useEffect(() => {
    const fetchPopularProducts = async () => {
      try {
        setLoading(true);
        setError(null);

        // Adjust based on your API response structure
        const products ={};
      } catch (err: any) {
        console.error("Error fetching popular products:", err);
        setError(err?.message || "Không thể tải sản phẩm nổi bật");
      } finally {
        setLoading(false);
      }
    };

    fetchPopularProducts();
  }, []);

  // Responsive items per slide
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 640) {
        setItemsPerSlide(1); // Mobile: 1 item
      } else if (window.innerWidth < 1024) {
        setItemsPerSlide(2); // Tablet: 2 items
      } else {
        setItemsPerSlide(3); // Desktop: 3 items
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const totalSlides = Math.ceil(tools.length / itemsPerSlide);

  const goToNext = () => {
    setCurrentIndex((prev) => (prev + 1) % totalSlides);
  };

  const goToPrev = () => {
    setCurrentIndex((prev) => (prev - 1 + totalSlides) % totalSlides);
  };

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
  };

  // Loading state
  if (loading) {
    return (
      <section className="container mx-auto sm:px-4 lg:px-6 mb-16 sm:mb-20 lg:mb-24">
        <div className="flex flex-col items-center justify-center py-12 sm:py-16">
          <Loader2 className="w-8 h-8 sm:w-10 sm:h-10 animate-spin text-brand-primary mb-4" />
          <p className="text-muted-foreground text-sm sm:text-base">
            {t("common.loading")}
          </p>
        </div>
      </section>
    );
  }

  // Error state
  if (error) {
    return (
      <section className="container mx-auto sm:px-4 lg:px-6 mb-16 sm:mb-20 lg:mb-24">
        <div className="flex flex-col items-center justify-center py-12 sm:py-16">
          <div className="text-center space-y-3">
            <p className="text-destructive text-sm sm:text-base font-medium">
              {error}
            </p>
            <button
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-brand-primary text-white rounded-lg hover:bg-brand-primary/90 transition-colors text-sm"
            >
              {t("common.retry") || "Thử lại"}
            </button>
          </div>
        </div>
      </section>
    );
  }

  // Empty state
  if (tools.length === 0) {
    return null;
  }

  return (
    <section className="container mx-auto sm:px-4 lg:px-6 mb-16 sm:mb-20 lg:mb-24 relative">
      <div className="flex flex-col gap-4 sm:gap-6 mb-8 sm:mb-10">
        {/* Badge & Title */}
        <div className="space-y-3 sm:space-y-4">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-3 sm:px-4 py-1.5 sm:py-2 bg-card/80 backdrop-blur-sm border border-brand-primary/20 rounded-md shadow-sm">
            <Award size={14} className="text-brand-primary sm:w-4 sm:h-4" />
            <span className="text-[10px] sm:text-xs font-bold text-brand-primary uppercase tracking-wider">
              {t("Featured")}
            </span>
          </div>

          {/* Title with Icon */}
          <div className="flex items-center gap-2 sm:gap-3">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-foreground">
              {t("tools.featuredTitle")}
            </h2>
          </div>

          {/* Subtitle */}
          <p className="text-muted-foreground text-sm sm:text-base lg:text-lg max-w-2xl">
            {t("tools.featuredSubtitle") ||
              "Những công cụ được yêu thích và sử dụng nhiều nhất"}
          </p>
        </div>

        {totalSlides > 1 && (
          <div className="hidden lg:flex items-center gap-3 self-end">
            <button
              onClick={goToPrev}
              className="p-3 rounded-xl bg-card border border-border hover:bg-muted transition-all shadow-sm hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
              aria-label="Previous slide"
            >
              <ChevronLeft size={20} className="text-foreground" />
            </button>
            <button
              onClick={goToNext}
              className="p-3 rounded-xl bg-card border border-border hover:bg-muted transition-all shadow-sm hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
              aria-label="Next slide"
            >
              <ChevronRight size={20} />
            </button>
          </div>
        )}
      </div>

      <div className="relative">
        <div className="relative">
          {/* Slides Wrapper */}
          <div className="overflow-hidden rounded-md">
            <div
              className="flex transition-transform duration-500 ease-out"
              style={{
                transform: `translateX(-${currentIndex * 100}%)`,
              }}
            >
              {Array.from({ length: totalSlides }).map((_, slideIndex) => (
                <div
                  key={slideIndex}
                  className="min-w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 lg:gap-6"
                >
                  {tools
                    .slice(
                      slideIndex * itemsPerSlide,
                      slideIndex * itemsPerSlide + itemsPerSlide
                    )
                    .map((tool, index) => (
                      <div
                        key={tool.id}
                        className="animate-in fade-in slide-in-from-bottom-4"
                        style={{
                          animationDelay: `${index * 100}ms`,
                          animationFillMode: "backwards",
                        }}
                      >
                        <ProductCard product={tool}  />
                      </div>
                    ))}
                </div>
              ))}
            </div>
          </div>

          {/* Mobile & Tablet Navigation Buttons */}
          {totalSlides > 1 && (
            <div className="lg:hidden absolute top-1/2 -translate-y-1/2 left-2 right-2 sm:left-4 sm:right-4 flex justify-between pointer-events-none">
              <button
                onClick={goToPrev}
                className="pointer-events-auto w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center rounded-full bg-card/95 backdrop-blur-md border border-border shadow-lg hover:bg-muted transition-all active:scale-95"
                aria-label="Previous slide"
              >
                <ChevronLeft
                  size={18}
                  className="text-foreground sm:w-5 sm:h-5"
                />
              </button>
              <button
                onClick={goToNext}
                className="pointer-events-auto w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center rounded-full bg-gradient-to-r from-brand-primary to-brand-secondary text-white shadow-lg hover:shadow-xl transition-all active:scale-95"
                aria-label="Next slide"
              >
                <ChevronRight size={18} className="sm:w-5 sm:h-5" />
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Dots Indicator */}
      {totalSlides > 1 && (
        <div className="flex items-center justify-center gap-1.5 sm:gap-2 mt-6 sm:mt-8">
          {Array.from({ length: totalSlides }).map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`transition-all ${
                index === currentIndex
                  ? "w-6 sm:w-8 h-1.5 sm:h-2 bg-gradient-to-r from-brand-primary to-brand-secondary"
                  : "w-1.5 sm:w-2 h-1.5 sm:h-2 bg-muted hover:bg-muted-foreground/30"
              } rounded-full`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      )}

      {/* Footer */}
      <div className="mt-6 sm:mt-8 flex items-center justify-center gap-2 text-[10px] sm:text-xs text-muted-foreground">
        <div className="h-px w-8 sm:w-12 bg-gradient-to-r from-transparent via-border to-transparent" />
        <Sparkles size={10} className="text-brand-primary sm:w-3 sm:h-3" />
        <span className="font-medium">
          {t("tools.featured.updated") || "Cập nhật hàng ngày"}
        </span>
        <Sparkles size={10} className="text-brand-primary sm:w-3 sm:h-3" />
        <div className="h-px w-8 sm:w-12 bg-gradient-to-l from-transparent via-border to-transparent" />
      </div>
    </section>
  );
};
