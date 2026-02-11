"use client";

import React, { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Zap, Filter } from "lucide-react";
// import { useToolsFilter } from "@/hooks/feature/use-tool";
import { FeaturedSection } from "./_components/FeaturedSection";
import ProductCard from "./_components/ToolCard";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
// import { useCategories } from "@/hooks/queries/useCategories";
const scrollToTop = () => {
  window.scrollTo({
    top: 0,
    behavior: "smooth",
  });
};

export default function ToolsPage() {
  const { t } = useTranslation();
  // const { categories } = useCategories();

  // const {
  //   products,
  //   pagination,
  //   setSearchQuery,
  //   setPage,
  //   isLoading,
  //   setActiveCategoryId,
  // } = useToolsFilter();

  // useEffect(() => {
  //   const id = categories.find((i) => i.slug === "tools")?.id;
  //   setActiveCategoryId(id);
  // }, []);

  // const getPageNumbers = () => {
  //   if (!pagination) return [];
  //   const { current_page, last_page } = pagination;
  //   const pages: (number | string)[] = [];

  //   if (last_page <= 7) {
  //     for (let i = 1; i <= last_page; i++) {
  //       pages.push(i);
  //     }
  //   } else {
  //     pages.push(1);
  //     if (current_page > 3) pages.push("...");

  //     const start = Math.max(2, current_page - 1);
  //     const end = Math.min(last_page - 1, current_page + 1);
  //     for (let i = start; i <= end; i++) {
  //       pages.push(i);
  //     }

  //     if (current_page < last_page - 2) pages.push("...");
  //     pages.push(last_page);
  //   }

  //   return pages;
  // };

  if (true) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center px-4">
        <div className="flex flex-col items-center gap-3 sm:gap-4">
          <div className="relative">
            <div className="w-12 h-12 sm:w-16 sm:h-16 border-3 sm:border-4 border-brand-primary/30 border-t-brand-primary rounded-full animate-spin" />
            <div className="absolute inset-0 w-12 h-12 sm:w-16 sm:h-16 border-3 sm:border-4 border-transparent border-b-brand-secondary rounded-full animate-spin animation-delay-150" />
          </div>
          <div className="text-foreground text-base sm:text-lg font-semibold animate-pulse">
            {t("common.loading") || "Đang tải..."}
          </div>
        </div>
      </div>
    );
  }
  
  // return (
  //   <div className="min-h-screen bg-background text-foreground">
  //     <div className="hidden sm:block fixed inset-0 bg-gradient-to-br from-brand-primary/5 via-background to-brand-secondary/5 pointer-events-none" />

  //     <main className="relative mt-16 sm:mt-20">
  //       <FeaturedSection />

  //       <section className="container mx-auto px-4 sm:px-6">
  //         {/* Section Header */}
  //         <div className="mb-6 sm:mb-8">
  //           <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-foreground mb-1 sm:mb-2 flex items-center gap-2 sm:gap-3">
  //             <span className="line-clamp-1">{t("tools.allToolsTitle")}</span>
  //             <span className="text-brand-primary flex-shrink-0">
  //               <Zap size={24} className="sm:w-7 sm:h-7 lg:w-8 lg:h-8" />
  //             </span>
  //           </h2>
  //           <p className="text-muted-foreground text-sm sm:text-base lg:text-lg">
  //             {t("tools.allToolsSubtitle")}
  //           </p>
  //         </div>

  //         {/* Tools Grid or Empty State */}
  //         {products.length > 0 ? (
  //           <>
  //             <div className="relative mb-8 sm:mb-12">
  //               <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 lg:gap-6 transition-opacity duration-200">
  //                 {products?.map((tool) => (
  //                   <ProductCard key={tool.id} product={tool} />
  //                 ))}
  //               </div>
  //             </div>

  //             {/* Pagination - chỉ hiện khi có nhiều hơn 1 trang */}
  //             {pagination && pagination.last_page > 1 && (
  //               <div className="flex justify-center mb-8">
  //                 <Pagination>
  //                   <PaginationContent>
  //                     {/* Previous Button */}
  //                     <PaginationItem>
  //                       <PaginationPrevious
  //                         onClick={() => {
  //                           if (pagination.current_page > 1) {
  //                             // ✅ Convert: API current_page (1-based) → frontend page (0-based)
  //                             // Previous = current - 1, then convert to 0-based = (current - 1) - 1
  //                             setPage(pagination.current_page - 2);
  //                             scrollToTop();
  //                           }
  //                         }}
  //                         className={
  //                           pagination.current_page === 1
  //                             ? "pointer-events-none opacity-50"
  //                             : "cursor-pointer"
  //                         }
  //                       />
  //                     </PaginationItem>

  //                     {/* Page Numbers */}
  //                     {getPageNumbers().map((pageNum, idx) => {
  //                       if (pageNum === "...") {
  //                         return (
  //                           <PaginationItem key={`ellipsis-${idx}`}>
  //                             <span className="px-4">...</span>
  //                           </PaginationItem>
  //                         );
  //                       }

  //                       return (
  //                         <PaginationItem key={pageNum}>
  //                           <PaginationLink
  //                             onClick={() => {
  //                               // ✅ Convert: display page (1-based) → frontend page (0-based)
  //                               setPage((pageNum as number) - 1);
  //                               scrollToTop();
  //                             }}
  //                             isActive={pagination.current_page === pageNum}
  //                             className="cursor-pointer"
  //                           >
  //                             {pageNum}
  //                           </PaginationLink>
  //                         </PaginationItem>
  //                       );
  //                     })}

  //                     {/* Next Button */}
  //                     <PaginationItem>
  //                       <PaginationNext
  //                         onClick={() => {
  //                           if (
  //                             pagination.current_page < pagination.last_page
  //                           ) {
  //                             // ✅ Convert: API current_page → frontend page
  //                             // Next = current + 1, then convert to 0-based = current (already +1 offset)
  //                             setPage(pagination.current_page);
  //                             scrollToTop();
  //                           }
  //                         }}
  //                         className={
  //                           pagination.current_page === pagination.last_page
  //                             ? "pointer-events-none opacity-50"
  //                             : "cursor-pointer"
  //                         }
  //                       />
  //                     </PaginationItem>
  //                   </PaginationContent>
  //                 </Pagination>
  //               </div>
  //             )}
  //           </>
  //         ) : (
  //           <div className="w-full py-16 text-center">
  //             <div className="mx-auto max-w-md space-y-4">
  //               <Filter
  //                 className="mx-auto text-muted-foreground"
  //                 size={40}
  //                 strokeWidth={1.5}
  //               />

  //               <h3 className="text-xl font-semibold text-foreground">
  //                 {t("tools.noResults")}
  //               </h3>

  //               <p className="text-muted-foreground text-sm sm:text-base">
  //                 {t("tools.noResultsHint")}
  //               </p>

  //               <button
  //                 onClick={() => setSearchQuery("")}
  //                 className="mt-4 inline-flex items-center gap-2 px-5 py-2.5 
  //                bg-brand-primary hover:bg-brand-primary-dark
  //                text-white rounded-lg text-sm font-semibold
  //                transition-all active:scale-95"
  //               >
  //                 <Zap size={16} />
  //                 Clear Filters
  //               </button>
  //             </div>
  //           </div>
  //         )}
  //       </section>
  //     </main>

  //     {/* Background decorative elements */}
  //     <div className="hidden sm:block fixed top-0 right-0 w-[300px] sm:w-[400px] lg:w-[500px] h-[300px] sm:h-[400px] lg:h-[500px] bg-brand-primary/5 rounded-full blur-3xl pointer-events-none -z-10" />
  //     <div className="hidden sm:block fixed bottom-0 left-0 w-[300px] sm:w-[400px] lg:w-[500px] h-[300px] sm:h-[400px] lg:h-[500px] bg-brand-secondary/5 rounded-full blur-3xl pointer-events-none -z-10" />
  //   </div>
  // );
}
