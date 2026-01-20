"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from "lucide-react";

/* =======================
   Types (ONE-BASED)
======================= */

export type PaginationMeta = {
  total?: number;
  per_page?: number;
  current_page?: number; // 1-based
  last_page?: number; // 1-based
};

type TablePaginationProps = {
  pagination?: PaginationMeta;
  onPageChange: (page: number) => void; // 1-based
  onPerPageChange: (perPage: number) => void;
  perPageOptions?: number[];
  showInfo?: boolean;
  showPerPageSelect?: boolean;
  maxPageButtons?: number;
};

/* =======================
   Helpers
======================= */

const safeNumber = (v: any, fallback: number) => {
  const n = Number(v);
  return Number.isFinite(n) && n > 0 ? n : fallback;
};

const normalizePagination = (
  pagination?: PaginationMeta,
  defaultPerPage = 10
) => {
  const total = Math.max(0, Number(pagination?.total ?? 0));
  const per_page = safeNumber(pagination?.per_page, defaultPerPage);

  const last_page =
    pagination?.last_page ?? (total === 0 ? 1 : Math.ceil(total / per_page));

  const current_page = Math.min(
    last_page,
    safeNumber(pagination?.current_page, 1)
  );

  const from = total === 0 ? 0 : (current_page - 1) * per_page + 1;
  const to = Math.min(current_page * per_page, total);

  return {
    total,
    per_page,
    current_page,
    last_page,
    from,
    to,
  };
};

/* =======================
   COMPONENT
======================= */

export function TablePagination({
  pagination,
  onPageChange,
  onPerPageChange,
  perPageOptions = [10, 20, 50, 100],
  showInfo = true,
  showPerPageSelect = true,
  maxPageButtons = 7,
}: TablePaginationProps) {
  const { current_page, last_page, from, to, total, per_page } =
    normalizePagination(pagination, perPageOptions[0]);

  const canPrev = current_page > 1;
  const canNext = current_page < last_page;

  /** ✅ SAFE NAVIGATION */
  const goToPage = (page: number) => {
    if (page === current_page) return;
    if (page < 1 || page > last_page) return;
    onPageChange(page);
  };

  const pageNumbers = (() => {
    if (last_page <= maxPageButtons) {
      return Array.from({ length: last_page }, (_, i) => i + 1);
    }

    const pages: (number | string)[] = [1];
    const left = Math.max(2, current_page - 1);
    const right = Math.min(last_page - 1, current_page + 1);

    if (left > 2) pages.push("...");
    for (let i = left; i <= right; i++) pages.push(i);
    if (right < last_page - 1) pages.push("...");
    pages.push(last_page);

    return pages;
  })();

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 px-6 py-4 bg-muted/50 border-t">
      {showInfo && (
        <p className="text-sm text-muted-foreground">
          Hiển thị <b>{from}</b> – <b>{to}</b> trong <b>{total}</b> kết quả
        </p>
      )}

      <div className="flex items-center gap-2">
        {showPerPageSelect && (
          <Select
            value={String(per_page)}
            onValueChange={(v) => {
              const n = Number(v);
              if (n > 0) {
                onPerPageChange(n);
                onPageChange(1);
              }
            }}
          >
            <SelectTrigger className="w-20 h-9">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {perPageOptions.map((opt) => (
                <SelectItem key={opt} value={String(opt)}>
                  {opt}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}

        {/* First */}
        <Button
          type="button"
          size="sm"
          variant="outline"
          disabled={!canPrev}
          onClick={() => goToPage(1)}
        >
          <ChevronsLeft className="h-4 w-4" />
        </Button>

        {/* Prev */}
        <Button
          type="button"
          size="sm"
          variant="outline"
          disabled={!canPrev}
          onClick={() => goToPage(current_page - 1)}
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>

        {/* Pages */}
        {pageNumbers.map((p, i) =>
          p === "..." ? (
            <span key={i} className="px-2 text-muted-foreground">
              …
            </span>
          ) : (
            <Button
              key={p}
              type="button"
              size="sm"
              className="min-w-9"
              variant={p === current_page ? "default" : "outline"}
              disabled={p === current_page}
              onClick={() => goToPage(p)}
            >
              {p}
            </Button>
          )
        )}

        {/* Next */}
        <Button
          type="button"
          size="sm"
          variant="outline"
          disabled={!canNext}
          onClick={() => goToPage(current_page + 1)}
        >
          <ChevronRight className="h-4 w-4" />
        </Button>

        {/* Last */}
        <Button
          type="button"
          size="sm"
          variant="outline"
          disabled={!canNext}
          onClick={() => goToPage(last_page)}
        >
          <ChevronsRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
