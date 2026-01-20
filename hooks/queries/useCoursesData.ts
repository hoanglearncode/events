// src/hooks/useCoursesData.ts
import { useMemo } from "react";
import { useProductsQuery } from "./useProductsQuery";

interface UseCoursesDataOptions {
  categorySlug?: string; // 'courses', 'tools', etc.
  mode?: "all" | "my";
  initial?: any[];
}

export const useCoursesData = (options?: UseCoursesDataOptions) => {
  const { categorySlug, mode = "all", initial } = options || {};

  // Nếu có initial data thì dùng initial, không thì fetch từ API
  const shouldFetch = !initial;

  const { products, isLoading, error, categoryId, setCategory, refetch } =
    useProductsQuery();

  // Set category filter nếu có
  useMemo(() => {
    if (shouldFetch && categorySlug && categoryId !== categorySlug) {
      setCategory(categorySlug);
    }
  }, [shouldFetch, categorySlug, categoryId, setCategory]);

  // Sử dụng data từ API hoặc initial data
  const data = initial || products;

  // Featured courses/products
  const featured = useMemo(() => {
    return data.filter((item) => {
      // Kiểm tra featured flag trong meta hoặc root level
      return item.featured || item.meta?.featured;
    });
  }, [data]);

  // Newest courses/products
  const newest = useMemo(() => {
    return [...data].sort((a, b) => {
      const da = a.createdAt ? new Date(a.createdAt).getTime() : 0;
      const db = b.createdAt ? new Date(b.createdAt).getTime() : 0;
      return db - da;
    });
  }, [data]);

  // Best sellers
  const bestSellers = useMemo(() => {
    return data
      .filter((item) => {
        // Kiểm tra bestSeller flag hoặc stats
        return (
          item.bestSeller ||
          item.meta?.bestSeller ||
          (item.meta?.stats?.sales && item.meta.stats.sales > 0)
        );
      })
      .sort((a, b) => {
        // Sort by sales nếu có stats
        const salesA = a.meta?.stats?.sales || 0;
        const salesB = b.meta?.stats?.sales || 0;
        return salesB - salesA;
      })
      .slice(0, 6);
  }, [data]);

  return {
    all: data,
    featured,
    newest,
    bestSellers,
    isLoading: shouldFetch ? isLoading : false,
    error: shouldFetch ? error : null,
    refetch: shouldFetch ? refetch : () => {},
  } as {
    all: any[];
    featured: any[];
    newest: any[];
    bestSellers: any[];
    isLoading: boolean;
    error: Error | null;
    refetch: () => void;
  };
};
