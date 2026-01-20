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
   Types
======================= */

export type PaginationMeta = {
  total?: number;
  per_page?: number;
  current_page?: number;
  last_page?: number;
  from?: number;
  to?: number;
};

type TablePaginationProps = {
  pagination?: PaginationMeta;
  onPageChange: (page?: number | string) => void;
  onPerPageChange: (perPage: number) => void;
  perPageOptions?: number[];
  showInfo?: boolean;
  showPerPageSelect?: boolean;
  maxPageButtons?: number;
};

/* =======================
   Helpers (ANTI-NaN CORE)
======================= */

const safeNumber = (value: any, fallback: number) => {
  const n = Number(value);
  return Number.isFinite(n) && n >= 0 ? n : fallback;
};

const normalizePagination = (
  pagination?: PaginationMeta,
  defaultPerPage = 10
) => {
  const total = safeNumber(pagination?.total, 0);
  const per_page =
    safeNumber(pagination?.per_page, defaultPerPage) || defaultPerPage;

  const last_page = Math.max(
    1,
    safeNumber(pagination?.last_page, Math.ceil(total / per_page) || 1)
  );

  const current_page = Math.min(
    last_page,
    Math.max(1, safeNumber(pagination?.current_page, 1))
  );

  const from = total === 0 ? 0 : (current_page - 1) * per_page + 1;

  const to = Math.min(total, current_page * per_page);

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
   MAIN TABLE PAGINATION
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

  const canGoPrevious = current_page > 1;
  const canGoNext = current_page < last_page;

  const getPageNumbers = () => {
    if (last_page <= 1) return [1];

    const pages: (number | string)[] = [];

    if (last_page <= maxPageButtons) {
      for (let i = 1; i <= last_page; i++) pages.push(i);
      return pages;
    }

    pages.push(1);

    const left = Math.max(2, current_page - 1);
    const right = Math.min(last_page - 1, current_page + 1);

    if (left > 2) pages.push("...");

    for (let i = left; i <= right; i++) pages.push(i);

    if (right < last_page - 1) pages.push("...");

    pages.push(last_page);
    return pages;
  };

  const pageNumbers = getPageNumbers();

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 px-6 py-4 bg-muted/50 border-t">
      {/* Info */}
      <div className="flex flex-col sm:flex-row items-center gap-4 text-sm">
        {showInfo && (
          <p className="text-muted-foreground whitespace-nowrap">
            Hiển thị <span className="font-medium text-foreground">{from}</span>{" "}
            - <span className="font-medium text-foreground">{to}</span> trong
            tổng số <span className="font-medium text-foreground">{total}</span>{" "}
            kết quả
          </p>
        )}

        {showPerPageSelect && (
          <div className="flex items-center gap-2">
            <span className="text-muted-foreground">Hiển thị:</span>
            <Select
              value={String(per_page)}
              onValueChange={(v) => {
                const next = Number(v);
                if (Number.isFinite(next)) {
                  onPerPageChange(next);
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
          </div>
        )}
      </div>

      {/* Controls */}
      <div className="flex items-center gap-2">
        <Button
          size="sm"
          variant="outline"
          onClick={() => onPageChange(1)}
          disabled={!canGoPrevious}
          className="hidden sm:flex"
        >
          <ChevronsLeft className="h-4 w-4" />
        </Button>

        <Button
          size="sm"
          variant="outline"
          onClick={() => onPageChange(Math.max(1, current_page - 1))}
          disabled={!canGoPrevious}
        >
          <ChevronLeft className="h-4 w-4 mr-1" />
          <span className="hidden sm:inline">Trước</span>
        </Button>

        {pageNumbers.map((p, i) =>
          p === "..." ? (
            <span key={i} className="px-2 text-muted-foreground">
              ...
            </span>
          ) : (
            <Button
              key={p}
              size="sm"
              variant={p === current_page ? "default" : "outline"}
              disabled={p === current_page}
              onClick={() => onPageChange(p)}
              className="min-w-9"
            >
              {p}
            </Button>
          )
        )}

        <Button
          size="sm"
          variant="outline"
          onClick={() => onPageChange(Math.min(last_page, current_page + 1))}
          disabled={!canGoNext}
        >
          <span className="hidden sm:inline">Sau</span>
          <ChevronRight className="h-4 w-4 ml-1" />
        </Button>

        <Button
          size="sm"
          variant="outline"
          onClick={() => onPageChange(last_page)}
          disabled={!canGoNext}
          className="hidden sm:flex"
        >
          <ChevronsRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
