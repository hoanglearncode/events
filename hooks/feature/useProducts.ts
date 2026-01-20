// src/hooks/useProducts.ts
import { useMemo } from "react";
import { useCallback, useEffect, useRef, useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { AdminProduct } from "@/hooks/queries/useProductsQuery";
import { useProductsQuery } from "@/hooks/queries/useProductsQuery";
import { Product } from "@/services/product.service";
import { toast } from "sonner";

export const useProducts = () => {
  const {
    // data
    products: serverProducts,
    pagination: serverPagination,
    total,
    totalPages,

    // state from query hook
    page,
    perPage,
    query,
    categoryId,
    mode,
    isLoading,
    error,

    // setters / actions from query hook
    setPage,
    setMode,
    setPerPage,
    setQuery,
    setCategory,
    refetch,

    // mutations
    approveMutation,
    rejectMutation,
    deleteMutation,
    updateMutation,
    featureMutation,
  } = useProductsQuery();

  // Ensure types & safe defaults for pagination
  const pagination = serverPagination ?? {
    total: total ?? 0,
    per_page: perPage,
    // UI cần 1-based, nên cộng thêm 1 vào page hiện tại
    current_page: page + 1,
    // UI cần tổng số trang (ví dụ 10 trang), không phải index (9), nên bỏ -1
    last_page: Math.ceil((total ?? 0) / perPage),
    from: page * perPage + 1, // +1 để hiển thị đúng (VD: 1-10)
    to: Math.min((page + 1) * perPage, total ?? 0),
  };

  const products: AdminProduct[] = serverProducts ?? [];

  const meta = useMemo(
    () => ({
      total: pagination.total,
      totalPages: pagination.last_page, // 👈 +1 để hiển thị tổng số trang
    }),
    [pagination.total, pagination.last_page]
  );

  return {
    // Data
    products,
    pagination,

    // Loading / meta
    isLoading,
    error,

    // Paging state
    page,
    perPage,
    mode,

    // Actions (pass-through to useProductsQuery)
    setPage,
    setPerPage,
    setQuery,
    setMode,

    // Mutations
    approveMutation,
    rejectMutation,
    deleteMutation,
    updateMutation,
    featureMutation,

    // Extras (if UI needs)
    query,
    categoryId,
    setCategory,
    refetch,

    // Derived (convenience)
    total: meta.total,
    totalPages: meta.totalPages,
  };
};

export const useProductDetail = () => {};
