// hooks/queries/admin/adminSellerQueries.ts
import {
  useQuery,
  useMutation,
  useQueryClient,
  UseQueryOptions,
} from "@tanstack/react-query";
import { AdminSeller } from "@/services/seller.service";
import {
  SellerListParams,
  ApproveSellerPayload,
  RejectSellerPayload,
  BanSellerPayload,
} from "@/types/seller";
import { toast } from "sonner";

// Query Keys
export const adminSellerKeys = {
  all: ["admin", "sellers"] as const,
  lists: () => [...adminSellerKeys.all, "list"] as const,
  list: (params?: SellerListParams) =>
    [...adminSellerKeys.lists(), params] as const,
  details: () => [...adminSellerKeys.all, "detail"] as const,
  detail: (userId: string) => [...adminSellerKeys.details(), userId] as const,
  stats: () => [...adminSellerKeys.all, "stats"] as const,
  up: () => [...adminSellerKeys.all, "up"] as const,
  exit: () => [...adminSellerKeys.all, "exit"] as const,
  shop: () => [...adminSellerKeys.all, "shop"] as const,
};

/**
 * payload có thể là:
 * - sellerData trực tiếp (object form fields)
 * - hoặc { formData: sellerData, userId: "..." }
 */
const normalizePayload = (payload: any) => {
  if (!payload) return { formData: {}, userId: "" };
  if (payload.formData || payload.userId) {
    return { formData: payload.formData ?? {}, userId: payload.userId ?? "" };
  }
  // fallback: treat entire payload as formData
  return { formData: payload, userId: payload?.userId ?? "" };
};

export function registerSellQueries() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: any) => {
      const { formData, userId } = normalizePayload(payload);
      return AdminSeller.registerSeller({ formData, userId });
    },
    onSuccess: (res: any) => {
      toast.success(res.message);
      try {
        queryClient.invalidateQueries({ queryKey: adminSellerKeys.up() });
      } catch (e) {
        // ignore if profileKeys not available
      }
    },
    onError: (error: any) => {
      console.error("registerSeller error:", error);
      const msg = error?.message ?? "Yêu cầu thất bại!";
      toast.error(msg);
      throw error; // rethrow so caller can catch if using mutateAsync
    },
  });
}

export function unRegisterSellQueries() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: any) => {
      const { formData, userId } = normalizePayload(payload);
      return AdminSeller.unRegisterSeller({ formData, userId });
    },
    onSuccess: (res: any) => {
      toast.success("Yêu cầu hủy Seller đã được gửi thành công!");
      try {
        queryClient.invalidateQueries({ queryKey: adminSellerKeys.exit() });
      } catch (e) {}
    },
    onError: (error: any) => {
      console.error("unRegisterSeller error:", error);
      toast.error(error?.message ?? "Yêu cầu thất bại!");
      throw error;
    },
  });
}

/**
 * Hook lấy danh sách sellers
 */
export function useSellersList(
  params?: SellerListParams,
  options?: Omit<UseQueryOptions<any>, "queryKey" | "queryFn">
) {
  return useQuery({
    queryKey: adminSellerKeys.list(params),
    queryFn: () => AdminSeller.getSellersList(params),
    ...options,
  });
}

/**
 * Hook lấy chi tiết seller
 */
export function useSellerDetail(
  userId: string,
  options?: Omit<UseQueryOptions<any>, "queryKey" | "queryFn">
) {
  return useQuery({
    queryKey: adminSellerKeys.detail(userId),
    queryFn: () => AdminSeller.getSellerDetail(userId),
    enabled: !!userId,
    ...options,
  });
}

/**
 * Hook lấy thống kê sellers
 */
export function useSellersStats(
  options?: Omit<UseQueryOptions<any>, "queryKey" | "queryFn">
) {
  return useQuery({
    queryKey: adminSellerKeys.stats(),
    queryFn: () => AdminSeller.getSellerStats(),
    ...options,
  });
}

/**
 * Hook duyệt seller
 */
export function useApproveSeller() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: ApproveSellerPayload) =>
      AdminSeller.approveSeller(payload),
    onSuccess: (data, variables) => {
      toast.success("Đã duyệt seller thành công!");

      // Invalidate các queries liên quan
      queryClient.invalidateQueries({ queryKey: adminSellerKeys.lists() });
      queryClient.invalidateQueries({
        queryKey: adminSellerKeys.detail(variables.userId),
      });
      queryClient.invalidateQueries({ queryKey: adminSellerKeys.stats() });
    },
    onError: (error: any) => {
      console.error("Approve seller error:", error);
      toast.error(error?.message ?? "Không thể duyệt seller");
    },
  });
}

/**
 * Hook từ chối seller
 */
export function useRejectSeller() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: string) => AdminSeller.rejectSeller(payload),
    onSuccess: (data, variables) => {
      toast.success("Đã từ chối seller");

      queryClient.invalidateQueries({ queryKey: adminSellerKeys.lists() });
      queryClient.invalidateQueries({
        queryKey: adminSellerKeys.detail(variables),
      });
      queryClient.invalidateQueries({ queryKey: adminSellerKeys.stats() });
    },
    onError: (error: any) => {
      console.error("Reject seller error:", error);
      toast.error(error?.message ?? "Không thể từ chối seller");
    },
  });
}

/**
 * Hook chặn seller
 */
export function useBanSeller() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: BanSellerPayload) => AdminSeller.banSeller(payload),
    onSuccess: (data, variables) => {
      toast.success("Đã chặn seller");

      queryClient.invalidateQueries({ queryKey: adminSellerKeys.lists() });
      queryClient.invalidateQueries({
        queryKey: adminSellerKeys.detail(variables.userId),
      });
      queryClient.invalidateQueries({ queryKey: adminSellerKeys.stats() });
    },
    onError: (error: any) => {
      console.error("Ban seller error:", error);
      toast.error(error?.message ?? "Không thể chặn seller");
    },
  });
}

/**
 * Hook mở chặn seller
 */
export function useUnbanSeller() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (userId: string) => AdminSeller.unbanSeller(userId),
    onSuccess: (data, variables) => {
      toast.success("Đã mở chặn seller");

      queryClient.invalidateQueries({ queryKey: adminSellerKeys.lists() });
      queryClient.invalidateQueries({
        queryKey: adminSellerKeys.detail(variables),
      });
      queryClient.invalidateQueries({ queryKey: adminSellerKeys.stats() });
    },
    onError: (error: any) => {
      console.error("Unban seller error:", error);
      toast.error(error?.message ?? "Không thể mở chặn seller");
    },
  });
}

/**
 * Hook xóa seller
 */
export function useDeleteSeller() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (userId: string) => AdminSeller.deleteSeller(userId),
    onSuccess: (data, variables) => {
      toast.success("Đã xóa seller");

      queryClient.invalidateQueries({ queryKey: adminSellerKeys.lists() });
      queryClient.invalidateQueries({ queryKey: adminSellerKeys.stats() });
      // Remove detail from cache
      queryClient.removeQueries({
        queryKey: adminSellerKeys.detail(variables),
      });
    },
    onError: (error: any) => {
      console.error("Delete seller error:", error);
      toast.error(error?.message ?? "Không thể xóa seller");
    },
  });
}

export function useGetDetailsShop(
  options?: Omit<UseQueryOptions<any>, "queryKey" | "queryFn">
) {
  return useQuery({
    queryKey: adminSellerKeys.shop(),
    queryFn: async () => {
      const res = await AdminSeller.getDetailsShop();
      return res?.data ?? res;
    },
    staleTime: 1000 * 60 * 2,
    retry: 1,
    ...options,
  });
}
export function useUpdateDetailsShop() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ formData }: { formData: any }) =>
      AdminSeller.updateDetailsShop({ formData }),

    onSuccess: (res: any) => {
      toast.success("Cập nhật thông tin shop thành công");

      // 🔁 reload shop data
      queryClient.invalidateQueries({
        queryKey: adminSellerKeys.shop(),
      });
    },

    onError: (error: any) => {
      console.error("updateDetailsShop error:", error);
      toast.error(error?.message ?? "Không thể cập nhật shop");
      throw error;
    },
  });
}
