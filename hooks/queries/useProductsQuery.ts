// hooks/queries/useProductsQuery.ts
import { useCallback } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import ProductService, { type Product } from "@/services/product.service";
import { toast } from "sonner";
import {
  ProductFormData,
  productSchema,
  priceSchema,
} from "@/shared/validation/product.schemas";
export type ProductStatus =
  | "Submitted"
  | "Active"
  | "Rejected"
  | "Banned"
  | "Removed";

export type AdminProduct = Product & {
  status: ProductStatus;
  seller?: string;
  submittedDate?: string;
  img?: string;
  violation?: string | null;
};

type PaginationMeta = {
  total: number;
  per_page: number;
  current_page: number;
  last_page: number;
  from: number;
  to: number;
};

export type ProductStats = {
  pending: number;
  approved: number;
  violations: number;
  total: number;
};

export function useProductStatsQuery() {
  return useQuery<ProductStats, Error>({
    queryKey: ["admin-products", "stats"],
    queryFn: async () => {
      const res = await ProductService.stats();
      const payload = (res && (res?.result ?? res)) ?? {};
      return {
        pending: Number(payload.pending ?? 0),
        approved: Number(payload.approved ?? 0),
        violations: Number(payload.violations ?? 0),
        total: Number(payload.total ?? 0),
      };
    },
    staleTime: 30_000,
    retry: 1,
  });
}

export function useProductsQuery() {
  // ✅ Giữ 0-based để tương thích với UI hiện tại
  const [page, setPage] = useState(0);
  const [perPage, setPerPage] = useState(10);
  const [query, setQuery] = useState("");
  const [categoryId, setCategory] = useState<string>("");
  const [mode, setMode] = useState<"all" | "pending" | "my">("all");

  const queryClient = useQueryClient();

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ["admin-products", page, perPage, query, categoryId, mode],
    queryFn: async () => {
      // ✅ Convert: frontend 0-based → API 1-based
      const apiPage = page;

      const response =
        mode === "my"
          ? await ProductService.myProducts({
              page: apiPage,
              perPage,
              q: query,
              categoryId,
            })
          : mode === "pending"
            ? await ProductService.listPending({
                page: apiPage,
                perPage,
                q: query,
                categoryId,
              })
            : await ProductService.list({
                page: apiPage,
                perPage,
                q: query,
                categoryId,
              });

      return {
        result: response?.result || [],
        pagination: response.pagination,
      };
    },
    staleTime: 30000,
  });

  // ✅ FIX: Dùng useCallback để tránh re-create functions
  const setQueryAndReset = useCallback((q: string) => {
    setQuery(q);
    setPage(0); // Reset về page 0 (frontend)
  }, []);

  const setCategoryAndReset = useCallback((cat: string) => {
    setCategory(cat);
    setPage(0);
  }, []);

  // Mutations
  const approveMutation = useMutation({
    mutationFn: (productId: string) => ProductService.approve(productId),
    onSuccess: () => {
      toast.success("Đã phê duyệt sản phẩm");
      queryClient.invalidateQueries({ queryKey: ["admin-products"] });
    },
    onError: (error: any) => {
      toast.error(error.message || "Phê duyệt thất bại");
    },
  });

  const rejectMutation = useMutation({
    mutationFn: ({ id, reason }: { id: string; reason: string }) =>
      ProductService.reject(id, reason),
    onSuccess: () => {
      toast.success("Đã từ chối sản phẩm");
      queryClient.invalidateQueries({ queryKey: ["admin-products"] });
    },
    onError: (error: any) => {
      toast.error(error.message || "Từ chối thất bại");
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: Partial<Product> }) =>
      ProductService.update(id, payload),
    onSuccess: () => {
      toast.success("Đã cập nhật sản phẩm thành công");
      queryClient.invalidateQueries({ queryKey: ["admin-products"] });
    },
    onError: (error: any) => {
      toast.error(error.message || "Cập nhật thất bại");
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (productId: string) => ProductService.delete(productId),
    onSuccess: () => {
      toast.success("Đã xóa sản phẩm");
      queryClient.invalidateQueries({ queryKey: ["admin-products"] });
    },
    onError: (error: any) => {
      toast.error(error.message || "Xóa thất bại");
    },
  });

  const featureMutation = useMutation({
    mutationFn: ({ id, featured }: { id: string; featured: boolean }) =>
      ProductService.setFeatured(id, featured),
    onSuccess: (_, variables) => {
      toast.success(
        variables.featured
          ? "Đã đánh dấu sản phẩm nổi bật"
          : "Đã bỏ đánh dấu sản phẩm nổi bật"
      );
      queryClient.invalidateQueries({ queryKey: ["admin-products"] });
    },
    onError: (error: any) => {
      toast.error(error.message || "Cập nhật thất bại");
    },
  });

  return {
    // Data
    products: (data?.result || []) as AdminProduct[],
    pagination: data?.pagination,
    total: data?.pagination?.total || 0,
    totalPages: data?.pagination?.last_page ?? 0,

    // State (0-based)
    page,
    perPage,
    query,
    categoryId,
    mode,
    isLoading,
    error,

    // Actions (stable với useCallback)
    setPage,
    setPerPage,
    setQuery: setQueryAndReset,
    setCategory: setCategoryAndReset,
    setMode,
    refetch,

    // Mutations
    approveMutation,
    rejectMutation,
    deleteMutation,
    updateMutation,
    featureMutation,
  };
}

export const useCreateProductMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: ProductFormData) => {
      return await ProductService.create(data);
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
      console.log("Success:", data);
    },
    onError: (error: Error) => {
      console.error("Error:", error.message);
    },
  });
};

interface UseProductDetailOptions {
  slug: string;
  enabled?: boolean;
}

export const useProductDetail = ({
  slug,
  enabled = true,
}: UseProductDetailOptions) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      return await ProductService.detail(slug);
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["products", slug] });
    },
    onError: (error: Error) => {
      console.error("Error:", error.message);
    },
  });
};

export const useProductDetailSeller = ({
  slug,
  enabled = true,
}: UseProductDetailOptions) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      return await ProductService.detailSeller(slug);
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["products", slug] });
    },
    onError: (error: Error) => {
      console.error("Error:", error.message);
    },
  });
};

export const useUpdateProductMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      productId,
      data,
    }: {
      productId: string;
      data: Partial<ProductFormData>;
    }) => {
      return ProductService.update(productId, data);
    },
    onSuccess: (data) => {
      // Invalidate và refetch
      queryClient.invalidateQueries({ queryKey: ["products"] });
      queryClient.invalidateQueries({
        queryKey: ["product-detail", data.slug],
      });
    },
  });
};
