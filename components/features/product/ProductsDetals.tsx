// "use client";

// import React, { useState, useEffect, useMemo } from "react";
// import {
//   ArrowLeft,
//   Share2,
//   Star,
//   ShoppingCart,
//   Package,
//   PlayCircle,
//   Facebook,
//   Twitter,
//   Linkedin,
//   Copy,
//   Check,
//   Minus,
//   Plus,
// } from "lucide-react";
// // import { useProductDetail } from "@/hooks/queries/useProductsQuery";
// import { useRouter } from "next/navigation";
// import Cookies from "js-cookie";
// import { ACCESS_TOKEN } from "@/shared/const/cookie";
// import { decodeToken } from "@/middleware";
// import { toast } from "sonner";
// import { useTranslation } from "react-i18next";
// import { Textarea } from "@/components/ui/textarea";
// import { Label } from "@/components/ui/label";

// const ShareDialog = ({
//   open,
//   onOpenChange,
// }: {
//   open: boolean;
//   onOpenChange: (open: boolean) => void;
// }) => {
//   const [copied, setCopied] = useState(false);
//   const { t } = useTranslation();

//   const copyToClipboard = () => {
//     navigator.clipboard.writeText(window.location.href);
//     setCopied(true);
//     toast.success("Đã sao chép link!");
//     setTimeout(() => setCopied(false), 2000);
//   };

//   if (!open) return null;

//   return (
//     <div
//       className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm px-4"
//       onClick={() => onOpenChange(false)}
//     >
//       <div
//         className="bg-card border border-border text-foreground max-w-md w-full rounded-xl sm:rounded-2xl p-5 sm:p-6"
//         onClick={(e) => e.stopPropagation()}
//       >
//         <div className="mb-5 sm:mb-6">
//           <h2 className="text-xl sm:text-2xl font-bold text-center">
//             {t("share")}
//           </h2>
//         </div>

//         <div className="grid grid-cols-3 gap-3 sm:gap-4 py-4 sm:py-6">
//           <button className="flex flex-col items-center gap-1.5 sm:gap-2 h-auto py-3 sm:py-4 rounded-lg border border-border hover:bg-muted transition active:scale-95">
//             <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl bg-[#1877f2] flex items-center justify-center">
//               <Facebook size={20} className="sm:w-6 sm:h-6" fill="white" />
//             </div>
//             <span className="text-[10px] sm:text-xs text-muted-foreground">
//               Facebook
//             </span>
//           </button>

//           <button className="flex flex-col items-center gap-1.5 sm:gap-2 h-auto py-3 sm:py-4 rounded-lg border border-border hover:bg-muted transition active:scale-95">
//             <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl bg-[#1da1f2] flex items-center justify-center">
//               <Twitter size={20} className="sm:w-6 sm:h-6" fill="white" />
//             </div>
//             <span className="text-[10px] sm:text-xs text-muted-foreground">
//               Twitter
//             </span>
//           </button>

//           <button className="flex flex-col items-center gap-1.5 sm:gap-2 h-auto py-3 sm:py-4 rounded-lg border border-border hover:bg-muted transition active:scale-95">
//             <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl bg-[#0a66c2] flex items-center justify-center">
//               <Linkedin size={20} className="sm:w-6 sm:h-6" fill="white" />
//             </div>
//             <span className="text-[10px] sm:text-xs text-muted-foreground">
//               Linkedin
//             </span>
//           </button>
//         </div>

//         <div className="relative">
//           <input
//             type="text"
//             readOnly
//             value={typeof window !== "undefined" ? window.location.href : ""}
//             className="w-full bg-background border border-border rounded-lg sm:rounded-xl py-2.5 sm:py-3 px-3 sm:px-4 pr-10 sm:pr-12 text-xs sm:text-sm text-muted-foreground"
//           />
//           <button
//             onClick={copyToClipboard}
//             className="absolute right-1 sm:right-1.5 top-1 sm:top-1.5 bg-brand-accent hover:opacity-90 text-white px-2.5 sm:px-3 py-1.5 sm:py-2 rounded-md sm:rounded-lg text-xs sm:text-sm transition active:scale-95"
//           >
//             {copied ? (
//               <Check size={14} className="sm:w-4 sm:h-4" />
//             ) : (
//               <Copy size={14} className="sm:w-4 sm:h-4" />
//             )}
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };
// /* ================= Helper: detect media (image/video) ================= */
// const getMediaInfo = (url: string) => {
//   if (!url) return null;
//   const autoplayParam = 1;

//   const youtubeRegex =
//     /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/;
//   const youtubeMatch = url.match(youtubeRegex);
//   if (youtubeMatch) {
//     return {
//       type: "video",
//       videoType: "youtube",
//       thumbnail: `https://img.youtube.com/vi/${youtubeMatch[1]}/hqdefault.jpg`,
//       embedUrl: `https://www.youtube.com/embed/${youtubeMatch[1]}?autoplay=${autoplayParam}`,
//       originalUrl: url,
//     };
//   }

//   const vimeoRegex = /vimeo\.com\/(?:video\/)?(\d+)/;
//   const vimeoMatch = url.match(vimeoRegex);
//   if (vimeoMatch) {
//     return {
//       type: "video",
//       videoType: "vimeo",
//       thumbnail: null,
//       embedUrl: `https://player.vimeo.com/video/${vimeoMatch[1]}?autoplay=${autoplayParam}`,
//       originalUrl: url,
//     };
//   }

//   const dailymotionRegex = /dailymotion\.com\/video\/([^_]+)/;
//   const dailymotionMatch = url.match(dailymotionRegex);
//   if (dailymotionMatch) {
//     return {
//       type: "video",
//       videoType: "dailymotion",
//       thumbnail: null,
//       embedUrl: `https://www.dailymotion.com/embed/video/${dailymotionMatch[1]}?autoplay=${autoplayParam}`,
//       originalUrl: url,
//     };
//   }

//   const twitchRegex = /twitch\.tv\/videos\/(\d+)/;
//   const twitchMatch = url.match(twitchRegex);
//   if (twitchMatch) {
//     return {
//       type: "video",
//       videoType: "twitch",
//       thumbnail: null,
//       embedUrl: `https://player.twitch.tv/?video=${twitchMatch[1]}&parent=${typeof window !== "undefined" ? window.location.hostname : ""}&autoplay=${autoplayParam === 1}`,
//       originalUrl: url,
//     };
//   }

//   // default -> image
//   return {
//     type: "image",
//     originalUrl: url,
//     thumbnail: url,
//     embedUrl: null,
//   };
// };

// /* ================= Lightbox (image + video) ================= */
// const ImageLightbox = ({
//   mediaItems,
//   currentIndex,
//   onClose,
//   onNavigate,
// }: any) => {
//   if (currentIndex === null || !mediaItems || mediaItems.length === 0)
//     return null;

//   const currentMedia = mediaItems[currentIndex];

//   return (
//     <div
//       className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center p-4"
//       onClick={onClose}
//     >
//       <button
//         onClick={onClose}
//         aria-label="Close"
//         className="absolute top-3 right-3 text-white text-3xl sm:text-4xl font-light w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center z-50"
//       >
//         ×
//       </button>

//       {mediaItems.length > 1 && (
//         <>
//           <button
//             onClick={(e) => {
//               e.stopPropagation();
//               onNavigate("prev");
//             }}
//             className="absolute left-3 sm:left-6 text-white text-4xl sm:text-5xl font-light z-50 bg-black/20 hover:bg-black/40 rounded-full p-2"
//           >
//             ‹
//           </button>
//           <button
//             onClick={(e) => {
//               e.stopPropagation();
//               onNavigate("next");
//             }}
//             className="absolute right-3 sm:right-6 text-white text-4xl sm:text-5xl font-light z-50 bg-black/20 hover:bg-black/40 rounded-full p-2"
//           >
//             ›
//           </button>
//         </>
//       )}

//       <div
//         className="w-full h-full flex items-center justify-center p-2 sm:p-10"
//         onClick={(e) => e.stopPropagation()}
//       >
//         {currentMedia.type === "video" ? (
//           <div className="w-full max-w-5xl aspect-video bg-black rounded-lg overflow-hidden shadow-2xl">
//             <iframe
//               src={currentMedia.embedUrl}
//               className="w-full h-full"
//               frameBorder="0"
//               allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
//               allowFullScreen
//               title="Video Preview"
//             />
//           </div>
//         ) : (
//           <img
//             src={currentMedia.originalUrl}
//             alt="Preview"
//             className="max-w-full max-h-[85vh] sm:max-w-[90vw] sm:max-h-[90vh] object-contain rounded-md"
//           />
//         )}
//       </div>

//       <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 text-white text-sm sm:text-base bg-black/60 px-4 py-2 rounded-full backdrop-blur-sm border border-white/10">
//         {currentIndex + 1} / {mediaItems.length}
//       </div>
//     </div>
//   );
// };

// /* ================= Price helpers & component ================= */
// const formatPriceByCurrency = (amount: number, currency: string) => {
//   return new Intl.NumberFormat(currency === "VND" ? "vi-VN" : "en-US", {
//     style: "currency",
//     currency,
//     maximumFractionDigits: currency === "VND" ? 0 : 2,
//   }).format(amount);
// };

// const PriceList = ({ prices }: { prices: any[] }) => {
//   if (!Array.isArray(prices) || prices.length === 0) {
//     return <span className="text-muted-foreground text-sm">Liên hệ</span>;
//   }

//   return (
//     <div className="space-y-3">
//       {prices.map((price, index) => {
//         // Chỉ hiện giá gốc nếu nó lớn hơn 0 và lớn hơn giá bán
//         const showOriginal =
//           price.originalAmount &&
//           price.originalAmount > 0 &&
//           price.originalAmount > price.amount;

//         const discount =
//           price.originalAmount && price.amount
//             ? Math.round((1 - price.amount / price.originalAmount) * 100)
//             : null;

//         return (
//           <div
//             key={index}
//             className="flex items-center justify-between gap-3 rounded-lg border border-border bg-background/60 p-3 w-full"
//           >
//             <div className="flex items-center gap-6">
//               <span className="text-lg sm:text-xl font-bold text-foreground whitespace-nowrap">
//                 {formatPriceByCurrency(price.amount, price.currency)}
//               </span>
//               {showOriginal && (
//                 <div className="flex items-center justify-end gap-2 mt-0.5">
//                   <span className="text-sm text-muted-foreground line-through decoration-muted-foreground/60">
//                     {formatPriceByCurrency(
//                       price.originalAmount,
//                       price.currency
//                     )}
//                   </span>
//                   {discount && discount > 0 && (
//                     <span className="text-[10px] font-bold text-red-600 bg-red-100 px-1.5 py-0.5 rounded">
//                       -{discount}%
//                     </span>
//                   )}
//                 </div>
//               )}
//             </div>
//           </div>
//         );
//       })}
//     </div>
//   );
// };

// /* ================= Main component ================= */
// export default function ProductDetailPage({ slug }: { slug: string }) {
//   const [activeTab, setActiveTab] = useState("overview");
//   const [quantity, setQuantity] = useState(1); // STATE SỐ LƯỢNG
//   const [buyerContent, setBuyerContent] = useState("");
//   const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
//   const token = Cookies.get(ACCESS_TOKEN);
//   const router = useRouter();
//   const hasToken = !!token;
//   const { t } = useTranslation();
//   let userRole = "user";
//   if (hasToken && token) {
//     const decoded = decodeToken(token);
//     if (decoded && (decoded as any).role) {
//       userRole = (decoded as any).role;
//     }
//   }

//   // const { mutate: getProductDetail, data } = useProductDetail({ slug });
//   const [showShareDialog, setShowShareDialog] = useState(false);
//   // useEffect(() => {
//   //   if (slug) {
//   //     getProductDetail();
//   //   }
//   // }, [slug, getProductDetail]);

//   const product = {}

//   const displayProduct = useMemo(() => {
//     if (!product) return null;
//     const meta = product.meta || {};

//     return {
//       ...product,
//       name: product.name || meta.name,
//       thumbnailUrl: product.thumbnailUrl || meta.thumbnailUrl,
//       galleryUrls: product.galleryUrls || meta.galleryUrls || [],
//       prices: product.prices || meta.prices || [],
//       categoryName: product.categoryName || meta.categoryName,
//       categorySlug: product.categorySlug || meta.categorySlug,
//       description: product.description || meta.seoDescription || "",
//       detailedDescription:
//         product.detailedDescription || meta.detailedDescription || "",
//       sellerName: product.sellerName || meta.sellerName,
//       visibility: product.visibility || meta.visibility,
//       inventoryType: product.inventoryType || meta.inventoryType,
//       inventoryCount: product.inventoryCount || meta.inventoryCount,
//       sellerProfile: product.sellerProfile || meta.sellerProfile || {},
//       createdAt: product.createdAt || meta.createdAt,
//       updatedAt: product.updatedAt || meta.updatedAt,
//       originalMeta: meta,
//     };
//   }, [product]);

//   // combine thumbnail + gallery
//   const allMedia = useMemo(() => {
//     if (!displayProduct) return [];

//     const rawUrls: string[] = [];
//     if (displayProduct.thumbnailUrl) rawUrls.push(displayProduct.thumbnailUrl);
//     if (
//       Array.isArray(displayProduct.galleryUrls) &&
//       displayProduct.galleryUrls.length > 0
//     )
//       rawUrls.push(...displayProduct.galleryUrls);

//     return rawUrls.map((u) => getMediaInfo(u)).filter(Boolean);
//   }, [displayProduct]);

//   const openLightbox = (index: number) => setLightboxIndex(index);
//   const closeLightbox = () => setLightboxIndex(null);
//   const navigateLightbox = (direction: string) => {
//     if (!allMedia.length) return;
//     if (direction === "next") {
//       setLightboxIndex((prev) =>
//         prev === null ? 0 : (prev + 1) % allMedia.length
//       );
//     } else {
//       setLightboxIndex((prev) =>
//         prev === null ? 0 : (prev - 1 + allMedia.length) % allMedia.length
//       );
//     }
//   };

//   const tabs =
//     userRole === "ROLE_ADMIN"
//       ? [
//           { id: "overview", label: "Tổng quan", icon: "📝" },
//           { id: "details", label: "Chi tiết", icon: "📋" },
//         ]
//       : [{ id: "overview", label: "Tổng quan", icon: "📝" }];

//   const handleIncrease = () => {
//     if (displayProduct.inventoryType === "LIMITED") {
//       if (quantity < displayProduct.inventoryCount) {
//         setQuantity((prev) => prev + 1);
//       } else {
//         toast.warning("Đã đạt giới hạn số lượng tồn kho");
//       }
//     } else {
//       setQuantity((prev) => prev + 1);
//     }
//   };

//   const handleDecrease = () => {
//     if (quantity > 1) {
//       setQuantity((prev) => prev - 1);
//     }
//   };

//   // const handleBuyNow = () => {
//   //   if(!displayProduct) return;

//   //   if (displayProduct.categorySlug !== 'resources' && !buyerContent.trim()) {
//   //     toast.error("Vui lòng nhập thông tin tài khoản/email cần xử lý");
//   //     document.getElementById("buyer-email-input")?.focus();
//   //     return;
//   //   }

//   //   const encodedId = encodeURIComponent(btoa(String(displayProduct.id)));
//   //   // TRUYỀN THÊM QUANTITY VÀO URL
//   //   router.push(`/payment?id=${encodedId}&quantity=${quantity}`);
//   // };

//   const handleBuyNow = () => {
//     if (!displayProduct) return;

//     // 2. VALIDATION: Bắt buộc nhập nếu không phải resource
//     if (!isResourceProduct && !buyerContent.trim()) {
//       toast.error("Vui lòng nhập thông tin tài khoản/email cần xử lý");
//       document.getElementById("buyer-content-input")?.focus();
//       return;
//     }

//     const encodedId = encodeURIComponent(btoa(String(displayProduct.id)));
//     let url = `/payment?id=${encodedId}&quantity=${quantity}`;

//     // 3. TRUYỀN DỮ LIỆU: Gửi kèm nội dung qua URL
//     if (!isResourceProduct && buyerContent.trim()) {
//       // Encode kỹ để tránh lỗi URL
//       url += `&note=${encodeURIComponent(buyerContent)}`;
//     }

//     router.push(url);
//   };

//   if (!displayProduct) {
//     // ... Loading state cũ
//     return (
//       <div className="min-h-screen flex items-center justify-center">
//         <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-primary"></div>
//       </div>
//     );
//   }

//   if (!displayProduct) {
//     return (
//       <div className="min-h-screen bg-background text-foreground flex items-center justify-center">
//         <div className="text-center">
//           <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-primary mx-auto mb-4"></div>
//           <p className="text-muted-foreground">Đang tải...</p>
//         </div>
//       </div>
//     );
//   }

//   const isResourceProduct = displayProduct.categorySlug === "resources";

//   return (
//     <div className="min-h-screen bg-background text-foreground">
//       <main className="pt-20 sm:pt-20 md:pt-28 pb-20 sm:pb-24">
//         <div className="mx-auto max-w-7xl px-4 sm:px-6">
//           {/* Header */}
//           <div className="flex items-center justify-between mb-6 sm:mb-8 md:mb-12">
//             <button
//               onClick={() => window.history.back()}
//               className="flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm font-medium text-muted-foreground hover:text-brand-primary transition-colors"
//             >
//               <ArrowLeft size={16} />
//               <span className="hidden xs:inline">Quay lại</span>
//             </button>

//             <div className="flex items-center gap-1.5 sm:gap-2">
//               <button
//                 onClick={() => setShowShareDialog(true)}
//                 className="p-2 sm:p-2.5 rounded-full border border-border hover:text-brand-accent hover:bg-brand-accent/5 transition active:scale-95"
//               >
//                 <Share2 size={16} className="sm:w-[18px] sm:h-[18px]" />
//               </button>
//             </div>
//           </div>

//           <div className="flex flex-col lg:flex-row gap-6 lg:gap-8 items-start">
//             {/* Left / Main */}
//             <section className="flex-1 w-full min-w-0 space-y-6 sm:space-y-8">
//               <div className="space-y-4 sm:space-y-6">
//                 <div className="flex items-start gap-3 sm:gap-4">
//                   <span className="text-2xl sm:text-3xl md:text-4xl">🛒</span>
//                   <div className="flex-1 min-w-0">
//                     <h1 className="text-xl sm:text-2xl md:text-3xl font-bold mb-1 sm:mb-2 leading-tight">
//                       {displayProduct.name}
//                     </h1>
//                     <div className="flex flex-wrap items-center gap-2 sm:gap-4 text-xs sm:text-sm text-muted-foreground">
//                       <span className="flex items-center gap-1">
//                         <Package size={12} />
//                         <span className="truncate">
//                           {displayProduct.categoryName}
//                         </span>
//                       </span>
//                     </div>
//                   </div>
//                 </div>

//                 {/* Media Grid */}
//                 {allMedia.length > 0 && (
//                   <div className="space-y-3">
//                     <div className="flex items-center justify-between">
//                       <h3 className="text-sm font-medium">Hình ảnh & Video</h3>
//                       <span className="text-xs text-muted-foreground">
//                         {allMedia.length} items
//                       </span>
//                     </div>

//                     <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 sm:gap-3">
//                       {allMedia.map((media: any, index: number) => (
//                         <div
//                           key={index}
//                           onClick={() => openLightbox(index)}
//                           className="relative aspect-video rounded-lg overflow-hidden border border-border hover:border-brand-primary transition cursor-pointer group bg-gray-100 dark:bg-gray-800"
//                         >
//                           <img
//                             src={
//                               media.type === "video" && media.thumbnail
//                                 ? media.thumbnail
//                                 : media.originalUrl
//                             }
//                             onError={(e: any) => {
//                               e.target.src =
//                                 "https://placehold.co/600x400?text=No+Preview";
//                             }}
//                             alt={`Media ${index + 1}`}
//                             className={`w-full h-full object-cover transition-transform duration-300 group-hover:scale-105 ${media.type === "video" && !media.thumbnail ? "opacity-60" : ""}`}
//                           />

//                           {media.type === "video" ? (
//                             <div className="absolute inset-0 flex items-center justify-center bg-black/20 group-hover:bg-black/10 transition">
//                               <PlayCircle className="w-10 h-10 sm:w-12 sm:h-12 text-white opacity-90 drop-shadow-md" />
//                             </div>
//                           ) : (
//                             <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition flex items-center justify-center">
//                               <div className="text-white text-xs font-medium px-2 py-1 bg-black/50 rounded-full">
//                                 Xem
//                               </div>
//                             </div>
//                           )}
//                         </div>
//                       ))}
//                     </div>
//                   </div>
//                 )}
//               </div>

//               {/* Tabs */}
//               <div className="border-b border-border overflow-x-auto -mx-4 px-4 sm:mx-0 sm:px-0">
//                 <div className="flex gap-4 sm:gap-6 min-w-max sm:min-w-0">
//                   {tabs.map((tab) => (
//                     <button
//                       key={tab.id}
//                       onClick={() => setActiveTab(tab.id)}
//                       className={`pb-3 sm:pb-4 px-1 sm:px-2 text-xs sm:text-sm font-medium transition border-b-2 flex items-center gap-1.5 sm:gap-2 whitespace-nowrap ${
//                         activeTab === tab.id
//                           ? "border-brand-primary text-brand-primary"
//                           : "border-transparent text-muted-foreground hover:text-foreground"
//                       }`}
//                     >
//                       <span className="text-base sm:text-lg">{tab.icon}</span>
//                       <span>{tab.label}</span>
//                     </button>
//                   ))}
//                 </div>
//               </div>

//               {/* Tab Panel */}
//               <div className="bg-card border border-border rounded-xl p-4 sm:p-6 md:p-8">
//                 {activeTab === "overview" && (
//                   <div className="max-w-none">
//                     {displayProduct.description ? (
//                       <div
//                         className="mt-4 sm:mt-6 text-sm sm:text-base text-muted-foreground prose prose-slate dark:prose-invert max-w-none
//                           overflow-hidden
//                           [&_img]:max-w-full [&_img]:h-auto [&_img]:rounded-md
//                           [&_pre]:overflow-x-auto [&_pre]:rounded-md
//                           [&_code]:break-words [&_table]:block [&_table]:overflow-x-auto
//                         "
//                         dangerouslySetInnerHTML={{
//                           __html: displayProduct.description,
//                         }}
//                       />
//                     ) : (
//                       <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
//                         Không có thông tin
//                       </p>
//                     )}
//                   </div>
//                 )}

//                 {activeTab === "details" && userRole === "ROLE_ADMIN" && (
//                   <div className="space-y-4 sm:space-y-6">
//                     <h2 className="text-lg sm:text-xl font-semibold">
//                       Thông tin chi tiết
//                     </h2>
//                     <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
//                       {[
//                         {
//                           label: "Trạng thái",
//                           value: displayProduct.status,
//                           className: "capitalize",
//                         },
//                         {
//                           label: "Danh mục",
//                           value: displayProduct.categoryName,
//                         },
//                         {
//                           label: "Người bán",
//                           value: displayProduct.sellerName,
//                         },
//                         {
//                           label: "Hiển thị",
//                           value: displayProduct.visibility,
//                           className: "capitalize",
//                         },
//                         {
//                           label: "Ngày tạo",
//                           value: displayProduct.createdAt
//                             ? new Date(
//                                 displayProduct.createdAt
//                               ).toLocaleDateString("vi-VN")
//                             : "---",
//                         },
//                         {
//                           label: "Cập nhật",
//                           value: displayProduct.updatedAt
//                             ? new Date(
//                                 displayProduct.updatedAt
//                               ).toLocaleDateString("vi-VN")
//                             : "---",
//                         },
//                       ].map((item, idx) => (
//                         <div key={idx} className="space-y-1">
//                           <div className="text-xs sm:text-sm text-muted-foreground">
//                             {item.label}
//                           </div>
//                           <div
//                             className={`text-sm sm:text-base text-foreground font-medium ${item.className || ""}`}
//                           >
//                             {item.value || "---"}
//                           </div>
//                         </div>
//                       ))}
//                     </div>
//                   </div>
//                 )}
//               </div>
//             </section>

//             {/* Sidebar */}
//             <aside className="w-full lg:w-[420px] flex-shrink-0 space-y-4 sm:space-y-6 lg:sticky lg:top-24">
//               <div className="bg-gradient-to-br from-primary/10 to-accent/10 border border-primary/20 rounded-xl p-4 sm:p-6 space-y-4 sm:space-y-6">
//                 <div className="space-y-2">
//                   <div className="flex items-baseline gap-2 sm:gap-3 flex-wrap justify-between">
//                     <div>
//                       <h3 className="text-sm font-semibold text-foreground">
//                         {t("gb")}
//                       </h3>
//                       <div className="mt-2">
//                         <PriceList prices={displayProduct.prices} />
//                       </div>
//                     </div>
//                   </div>
//                 </div>

//                 {/* Quantity Selector */}
//                 <div>
//                   <h3 className="text-sm font-semibold text-foreground mb-3 uppercase tracking-wider text-muted-foreground">
//                     Số lượng
//                   </h3>
//                   <div className="flex items-center justify-between bg-background border border-border rounded-lg p-1.5 w-full max-w-[200px]">
//                     <button
//                       onClick={handleDecrease}
//                       disabled={quantity <= 1}
//                       className="w-10 h-10 flex items-center justify-center rounded-md hover:bg-muted disabled:opacity-50 transition-colors"
//                     >
//                       <Minus size={18} />
//                     </button>

//                     <input
//                       type="number"
//                       value={quantity}
//                       onChange={(e) => {
//                         const val = parseInt(e.target.value);
//                         if (!isNaN(val) && val >= 1) {
//                           if (
//                             displayProduct.inventoryType === "LIMITED" &&
//                             val > displayProduct.inventoryCount
//                           ) {
//                             setQuantity(displayProduct.inventoryCount);
//                           } else {
//                             setQuantity(val);
//                           }
//                         }
//                       }}
//                       className="w-14 text-center bg-transparent font-bold text-lg focus:outline-none"
//                     />

//                     <button
//                       onClick={handleIncrease}
//                       disabled={
//                         displayProduct.inventoryType === "LIMITED" &&
//                         quantity >= displayProduct.inventoryCount
//                       }
//                       className="w-10 h-10 flex items-center justify-center rounded-md hover:bg-muted disabled:opacity-50 transition-colors"
//                     >
//                       <Plus size={18} />
//                     </button>
//                   </div>
//                   {displayProduct.inventoryType === "LIMITED" && (
//                     <p className="text-xs text-muted-foreground mt-2">
//                       Kho còn: {displayProduct.inventoryCount} sản phẩm
//                     </p>
//                   )}
//                 </div>

//                 {!isResourceProduct && (
//                   <div className="space-y-2">
//                     <Label
//                       htmlFor="buyer-content-input"
//                       className="text-sm font-semibold text-foreground"
//                     >
//                       Ghi chú đơn hàng / Email cần nâng cấp{" "}
//                       <span className="text-red-500">*</span>
//                     </Label>
//                     <Textarea
//                       id="buyer-content-input"
//                       placeholder="Ví dụ: abc@gmail.com | pass123 (Mỗi dòng 1 tài khoản)..."
//                       className="bg-background min-h-[100px] text-sm resize-none"
//                       value={buyerContent}
//                       onChange={(e) => setBuyerContent(e.target.value)}
//                     />
//                     <p className="text-[11px] text-muted-foreground">
//                       * Thông tin này sẽ được gửi bảo mật tới người bán để xử lý
//                       đơn hàng.
//                     </p>
//                   </div>
//                 )}

//                 {/* Buy Button */}
//                 <button
//                   onClick={handleBuyNow}
//                   disabled={
//                     displayProduct.inventoryType === "LIMITED" &&
//                     displayProduct.inventoryCount <= 0
//                   }
//                   className="w-full bg-brand-primary hover:opacity-90 text-primary-foreground font-semibold py-3 sm:py-4 rounded-lg transition flex items-center justify-center gap-2 shadow-lg text-sm sm:text-base disabled:opacity-50 disabled:cursor-not-allowed"
//                 >
//                   <ShoppingCart size={18} />
//                   {displayProduct.inventoryType === "LIMITED" &&
//                   displayProduct.inventoryCount <= 0
//                     ? "Hết hàng"
//                     : "Mua ngay"}
//                 </button>

//                 <div className="pt-3 sm:pt-4 border-t border-border/50">
//                   <div className="flex items-center gap-2 text-xs sm:text-sm font-medium">
//                     <Package
//                       size={14}
//                       className={
//                         displayProduct.inventoryCount > 0 ||
//                         displayProduct.inventoryType === "UNLIMITED"
//                           ? "text-green-500"
//                           : "text-red-500"
//                       }
//                     />
//                     <span
//                       className={
//                         displayProduct.inventoryCount > 0 ||
//                         displayProduct.inventoryType === "UNLIMITED"
//                           ? "text-green-600"
//                           : "text-red-600"
//                       }
//                     >
//                       {displayProduct.inventoryType === "UNLIMITED"
//                         ? "Hàng luôn có sẵn (Unlimited)"
//                         : displayProduct.inventoryCount > 0
//                           ? "Sản phẩm có sẵn"
//                           : "Tạm hết hàng"}
//                     </span>
//                   </div>
//                 </div>
//               </div>

//               {/* Seller Info */}
//               <div className="bg-card border border-border rounded-xl p-4 sm:p-6 space-y-3 sm:space-y-4">
//                 <h3 className="text-base sm:text-lg font-semibold">
//                   Người bán
//                 </h3>
//                 <div className="flex items-start gap-3 sm:gap-4">
//                   <img
//                     src={
//                       displayProduct.sellerProfile?.avatarUrl ||
//                       "https://placehold.co/100"
//                     }
//                     alt={displayProduct.sellerProfile?.fullName || "Seller"}
//                     className="w-12 h-12 sm:w-14 sm:h-14 rounded-full border-2 border-brand-primary/30 flex-shrink-0 object-cover"
//                   />
//                   <div className="flex-1 space-y-1 min-w-0">
//                     <h4 className="font-semibold text-sm sm:text-base text-foreground truncate">
//                       {displayProduct.sellerProfile?.shopName ||
//                         "Đang cập nhật"}
//                     </h4>
//                     <p className="text-xs sm:text-sm text-muted-foreground truncate">
//                       {displayProduct.sellerProfile?.fullName || ""}
//                     </p>
//                   </div>
//                 </div>

//                 {displayProduct.sellerProfile?.shopDescription && (
//                   <p className="text-xs sm:text-sm text-muted-foreground pt-3 border-t border-border line-clamp-3">
//                     {displayProduct.sellerProfile.shopDescription}
//                   </p>
//                 )}
//               </div>
//             </aside>
//           </div>
//         </div>
//       </main>

//       <ImageLightbox
//         mediaItems={allMedia}
//         currentIndex={lightboxIndex}
//         onClose={closeLightbox}
//         onNavigate={navigateLightbox}
//       />
//       <ShareDialog open={showShareDialog} onOpenChange={setShowShareDialog} />
//     </div>
//   );
// }
