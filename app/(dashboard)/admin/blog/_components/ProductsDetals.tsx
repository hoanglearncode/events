"use client";
import React, { useState, useEffect } from "react";
import {
  ArrowLeft,
  Share2,
  Star,
  ShoppingCart,
  Mail,
  Send,
  Package,
  Eye,
  ChevronRight,
  ImageIcon,
} from "lucide-react";
import SchemaViewer from "./ProductViewer";
import { useProductDetail } from "@/hooks/queries/useProductsQuery";
import { useRouter } from "next/navigation";

// Image Lightbox Component
const ImageLightbox = ({ images, currentIndex, onClose, onNavigate }: any) => {
  if (currentIndex === null) return null;

  return (
    <div
      className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center"
      onClick={onClose}
    >
      <button
        onClick={onClose}
        className="absolute top-4 right-4 text-foreground hover:text-muted-foreground text-3xl font-light w-10 h-10 flex items-center justify-center"
      >
        ×
      </button>

      {images.length > 1 && (
        <>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onNavigate("prev");
            }}
            className="absolute left-4 text-foreground hover:text-muted-foreground text-5xl font-light"
          >
            ‹
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onNavigate("next");
            }}
            className="absolute right-4 text-foreground hover:text-muted-foreground text-5xl font-light"
          >
            ›
          </button>
        </>
      )}

      <img
        src={images[currentIndex]}
        alt="Preview"
        className="max-w-[90vw] max-h-[90vh] object-contain"
        onClick={(e) => e.stopPropagation()}
      />

      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 text-foreground">
        {currentIndex + 1} / {images.length}
      </div>
    </div>
  );
};

export default function ProductDetailPage({ slug }: { slug: string }) {
  const [activeTab, setActiveTab] = useState("overview");
  const [lightboxIndex, setLightboxIndex] = useState(null);
  const router = useRouter();
  const tabs = [
    { id: "overview", label: "Tổng quan", icon: "📝" },
    { id: "details", label: "Chi tiết", icon: "📋" },
    { id: "schema", label: "Thông tin schema", icon: "🔧" },
  ];

  const formatPrice = (amount: any) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount);
  };

  const openLightbox = (index: any) => {
    setLightboxIndex(index);
  };

  const closeLightbox = () => {
    setLightboxIndex(null);
  };

  const navigateLightbox = (direction: any) => {
    const images = product.meta.galleryUrls;
    if (direction === "next") {
      setLightboxIndex((lightboxIndex + 1) % images.length);
    } else {
      setLightboxIndex((lightboxIndex - 1 + images.length) % images.length);
    }
  };

  const {
    mutate: getProductDetail,
    data,
    isError,
    error,
  } = useProductDetail({ slug });

  useEffect(() => {
    if (slug) {
      getProductDetail();
    }
  }, [slug, getProductDetail]);

  const product = data?.result;

  return (
    <div className="min-h-screen bg-background text-foreground">
      <main className="pt-28 pb-24">
        <div className="mx-auto max-w-7xl px-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-12">
            <button
              onClick={() => window.history.back()}
              className="flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-brand-primary transition-colors"
            >
              <ArrowLeft size={16} />
              Quay lại
            </button>
            <div className="flex items-center gap-3">
              <button className="p-2.5 rounded-full border border-border hover:bg-muted transition">
                <Share2 size={18} className="text-muted-foreground" />
              </button>
              <button className="p-2.5 rounded-full border border-border hover:bg-muted transition">
                <Star size={18} className="text-muted-foreground" />
              </button>
            </div>
          </div>

          <div className="flex flex-col lg:flex-row gap-8 items-start">
            {/* LEFT: CONTENT */}
            <section className="flex-1 min-w-0 space-y-8">
              {/* Product Header */}
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <span className="text-4xl">{tabs[0].icon}</span>
                  <div className="flex-1">
                    <h1 className="text-3xl font-bold text-foreground mb-2">
                      {product?.meta?.name}
                    </h1>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Package size={14} />
                        {product?.meta.categoryName}
                      </span>
                      <span className="flex items-center gap-1">
                        <Eye size={14} />
                        {product?.meta.inventoryType === "UNLIMITED"
                          ? "Không giới hạn"
                          : product?.meta.inventoryCount}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Gallery */}
                {product?.meta.galleryUrls.length > 0 && (
                  <div className="grid grid-cols-3 gap-3">
                    {product?.meta.galleryUrls.map((url, index) => (
                      <div
                        key={index}
                        className="relative aspect-video rounded-lg overflow-hidden border border-border hover:border-brand-primary transition cursor-pointer group"
                        onClick={() => openLightbox(index)}
                      >
                        <img
                          src={url}
                          alt={`Gallery ${index + 1}`}
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition flex items-center justify-center">
                          <ImageIcon className="text-foreground" size={24} />
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Tabs */}
              <div className="border-b border-border">
                <div className="flex gap-6">
                  {tabs.map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`pb-4 px-2 text-sm font-medium transition border-b-2 flex items-center gap-2 ${
                        activeTab === tab.id
                          ? "border-brand-primary text-brand-primary"
                          : "border-transparent text-muted-foreground hover:text-foreground"
                      }`}
                    >
                      <span>{tab.icon}</span>
                      {tab.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Tab Content */}
              <div className="bg-card border border-border rounded-xl p-8">
                {activeTab === "overview" && (
                  <div className="prose prose-slate dark:prose-invert max-w-none">
                    <h2 className="text-xl font-semibold text-foreground mb-4">
                      Giới thiệu
                    </h2>
                    <p className="text-muted-foreground leading-relaxed">
                      {product?.meta.seoDescription || "Không có mô tả"}
                    </p>
                    {product?.meta.detailedDescription && (
                      <div
                        className="mt-6 text-muted-foreground"
                        dangerouslySetInnerHTML={{
                          __html: product.meta.detailedDescription,
                        }}
                      />
                    )}
                  </div>
                )}

                {activeTab === "details" && (
                  <div className="space-y-6">
                    <h2 className="text-xl font-semibold text-foreground mb-4">
                      Thông tin chi tiết
                    </h2>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <div className="text-sm text-muted-foreground">
                          Trạng thái
                        </div>
                        <div className="text-foreground font-medium capitalize">
                          {product.status}
                        </div>
                      </div>
                      <div className="space-y-1">
                        <div className="text-sm text-muted-foreground">
                          Danh mục
                        </div>
                        <div className="text-foreground font-medium">
                          {product?.meta.categoryName}
                        </div>
                      </div>
                      <div className="space-y-1">
                        <div className="text-sm text-muted-foreground">
                          Người bán
                        </div>
                        <div className="text-foreground font-medium">
                          {product?.meta.sellerName}
                        </div>
                      </div>
                      <div className="space-y-1">
                        <div className="text-sm text-muted-foreground">
                          Hiển thị
                        </div>
                        <div className="text-foreground font-medium capitalize">
                          {product.meta.visibility}
                        </div>
                      </div>
                      <div className="space-y-1">
                        <div className="text-sm text-muted-foreground">
                          Ngày tạo
                        </div>
                        <div className="text-foreground font-medium">
                          {new Date(product.createdAt).toLocaleDateString(
                            "vi-VN"
                          )}
                        </div>
                      </div>
                      <div className="space-y-1">
                        <div className="text-sm text-muted-foreground">
                          Cập nhật
                        </div>
                        <div className="text-foreground font-medium">
                          {new Date(product.updatedAt).toLocaleDateString(
                            "vi-VN"
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === "schema" && (
                  <div className="space-y-6">
                    <h2 className="text-xl font-semibold text-foreground mb-4">
                      Thông tin Schema
                    </h2>
                    {product.schema ? (
                      <SchemaViewer schema={product.schema} />
                    ) : (
                      <div className="text-center text-muted-foreground py-8">
                        Không có thông tin schema
                      </div>
                    )}
                  </div>
                )}
              </div>
            </section>

            {/* RIGHT: BUY BOX */}
            <aside className="w-full lg:w-[420px] flex-shrink-0 space-y-6">
              {/* Price Card */}
              <div className="bg-gradient-to-br from-primary/10 to-accent/10 border border-primary/20 rounded-xl p-6 space-y-6">
                <div className="space-y-2">
                  <div className="flex items-baseline gap-3">
                    <span className="text-4xl font-bold text-foreground">
                      {formatPrice(product?.meta.prices[0].amount)}
                    </span>
                    {product?.meta.prices[0].originalAmount && (
                      <span className="text-lg text-muted-foreground line-through">
                        {formatPrice(product.meta.prices[0].originalAmount)}
                      </span>
                    )}
                  </div>
                  {product?.meta.prices[0].originalAmount && (
                    <div className="inline-block bg-brand-error/20 text-brand-error text-xs font-semibold px-2 py-1 rounded">
                      Giảm{" "}
                      {Math.round(
                        (1 -
                          product.meta.prices[0].amount /
                            product.meta.prices[0].originalAmount) *
                          100
                      )}
                      %
                    </div>
                  )}
                </div>

                <button
                  onClick={() => {
                    router.push(
                      `/payment?id=${encodeURIComponent(btoa(product.id))}`
                    );
                  }}
                  className="w-full bg-brand-primary hover:opacity-90 text-primary-foreground font-semibold py-4 rounded-lg transition flex items-center justify-center gap-2 shadow-lg"
                >
                  <ShoppingCart size={20} />
                  Mua ngay
                </button>

                <div className="pt-4 border-t border-border space-y-3">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Package size={16} className="text-brand-success" />
                    <span>
                      {product?.meta.inventoryType === "UNLIMITED"
                        ? "Hàng luôn có sẵn"
                        : `Còn ${product?.meta.inventoryCount} sản phẩm`}
                    </span>
                  </div>
                </div>
              </div>

              {/* Seller Card */}
              <div className="bg-card border border-border rounded-xl p-6 space-y-4">
                <h3 className="text-lg font-semibold text-foreground">
                  Người bán
                </h3>
                <div className="flex items-start gap-4">
                  <img
                    src={product?.sellerProfile.avatarUrl}
                    alt={product?.sellerProfile.fullName}
                    className="w-14 h-14 rounded-full border-2 border-brand-primary/30"
                  />
                  <div className="flex-1 space-y-1">
                    <h4 className="font-semibold text-foreground">
                      {product?.sellerProfile.shopName}
                    </h4>
                    <p className="text-sm text-muted-foreground">
                      {product?.sellerProfile.fullName}
                    </p>
                  </div>
                </div>
                {product?.sellerProfile.shopDescription && (
                  <p className="text-sm text-muted-foreground pt-3 border-t border-border">
                    {product?.sellerProfile.shopDescription}
                  </p>
                )}
              </div>
            </aside>
          </div>
        </div>
      </main>

      {/* Lightbox */}
      <ImageLightbox
        images={product?.meta.galleryUrls}
        currentIndex={lightboxIndex}
        onClose={closeLightbox}
        onNavigate={navigateLightbox}
      />
    </div>
  );
}
