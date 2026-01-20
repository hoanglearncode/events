// src/components/Pagination.tsx
"use client";

import React from "react";
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from "lucide-react";

interface Props {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export const Pagination: React.FC<Props> = ({
  currentPage,
  totalPages,
  onPageChange,
}) => {
  if (totalPages <= 1) return null;

  // Generate smart page numbers (show current, siblings, and boundaries)
  const getPageNumbers = () => {
    const delta = 2; // Number of pages to show on each side of current
    const range: (number | string)[] = [];
    const rangeWithDots: (number | string)[] = [];

    for (
      let i = Math.max(2, currentPage - delta);
      i <= Math.min(totalPages - 1, currentPage + delta);
      i++
    ) {
      range.push(i);
    }

    if (currentPage - delta > 2) {
      rangeWithDots.push(1, "...");
    } else {
      rangeWithDots.push(1);
    }

    rangeWithDots.push(...range);

    if (currentPage + delta < totalPages - 1) {
      rangeWithDots.push("...", totalPages);
    } else if (totalPages > 1) {
      rangeWithDots.push(totalPages);
    }

    return rangeWithDots;
  };

  const pages = getPageNumbers();

  return (
    <div className="flex items-center justify-center gap-2 mt-12">
      {/* First Page Button */}
      <button
        onClick={() => onPageChange(1)}
        disabled={currentPage === 1}
        className="p-2.5 rounded-xl bg-card border border-border disabled:opacity-40 disabled:cursor-not-allowed hover:bg-muted hover:border-brand-primary/50 transition-all btn-hover-lift disabled:transform-none group"
        aria-label="First page"
      >
        <ChevronsLeft
          size={18}
          className="text-muted-foreground group-hover:text-brand-primary transition-colors"
        />
      </button>

      {/* Previous Button */}
      <button
        onClick={() => onPageChange(Math.max(1, currentPage - 1))}
        disabled={currentPage === 1}
        className="p-2.5 rounded-xl bg-card border border-border disabled:opacity-40 disabled:cursor-not-allowed hover:bg-muted hover:border-brand-primary/50 transition-all btn-hover-lift disabled:transform-none group"
        aria-label="Previous page"
      >
        <ChevronLeft
          size={18}
          className="text-muted-foreground group-hover:text-brand-primary transition-colors"
        />
      </button>

      {/* Page Numbers */}
      <div className="flex items-center gap-2">
        {pages.map((page, index) => {
          if (page === "...") {
            return (
              <span
                key={`dots-${index}`}
                className="w-10 h-10 flex items-center justify-center text-muted-foreground"
              >
                •••
              </span>
            );
          }

          const pageNumber = page as number;
          const isActive = currentPage === pageNumber;

          return (
            <button
              key={pageNumber}
              onClick={() => onPageChange(pageNumber)}
              className={`min-w-[2.5rem] h-10 px-3 rounded-xl font-bold text-sm transition-all ${
                isActive
                  ? "bg-brand-primary text-white shadow-lg shadow-brand-primary/30 scale-105"
                  : "bg-card border border-border text-muted-foreground hover:bg-muted hover:text-foreground hover:border-brand-primary/50 btn-hover-lift"
              }`}
              aria-label={`Page ${pageNumber}`}
              aria-current={isActive ? "page" : undefined}
            >
              {pageNumber}
            </button>
          );
        })}
      </div>

      {/* Next Button */}
      <button
        onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
        disabled={currentPage === totalPages}
        className="p-2.5 rounded-xl bg-card border border-border disabled:opacity-40 disabled:cursor-not-allowed hover:bg-muted hover:border-brand-primary/50 transition-all btn-hover-lift disabled:transform-none group"
        aria-label="Next page"
      >
        <ChevronRight
          size={18}
          className="text-muted-foreground group-hover:text-brand-primary transition-colors"
        />
      </button>

      {/* Last Page Button */}
      <button
        onClick={() => onPageChange(totalPages)}
        disabled={currentPage === totalPages}
        className="p-2.5 rounded-xl bg-card border border-border disabled:opacity-40 disabled:cursor-not-allowed hover:bg-muted hover:border-brand-primary/50 transition-all btn-hover-lift disabled:transform-none group"
        aria-label="Last page"
      >
        <ChevronsRight
          size={18}
          className="text-muted-foreground group-hover:text-brand-primary transition-colors"
        />
      </button>
    </div>
  );
};
