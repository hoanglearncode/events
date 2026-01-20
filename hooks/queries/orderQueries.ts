import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ordersService } from "@/services/order.service";
import { createOrder } from "@/services/order.service";
import { toast } from "sonner";

// Query keys
export const orderKeys = {
  all: ["orders"] as const,
  purchaseHistory: (page: number, size: number) =>
    [...orderKeys.all, "purchase-history", page, size] as const,
  salesHistory: (
    page: number,
    size: number,
    keyword?: string,
    status?: string
  ) =>
    [
      ...orderKeys.all,
      "sales-history",
      page,
      size,
      keyword || "",
      status || "",
    ] as const,
  byProduct: (
    productId: string | number,
    status?: string,
    page?: number,
    size?: number
  ) => [...orderKeys.all, "by-product", productId, status, page, size] as const,
};

export const useCreateOrder = () => {
  return useMutation({
    mutationFn: (payload: createOrder) => ordersService.create(payload),
  });
};

// Buyer: Lịch sử mua hàng
export const usePurchaseHistory = (page = 0, size = 10) => {
  return useQuery({
    queryKey: orderKeys.purchaseHistory(page, size),
    queryFn: () => ordersService.getPurchaseHistory(page, size),
  });
};

// Seller: Lịch sử bán hàng
export const useSalesHistory = (
  page = 0,
  size = 10,
  keyword = "",
  status = ""
) => {
  return useQuery({
    queryKey: orderKeys.salesHistory(page, size, keyword, status),
    queryFn: () => ordersService.getSalesHistory(page, size, keyword, status),
  });
};

// Seller: Xác nhận giao hàng
export const useConfirmDelivery = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (
      payload: string | { orderId: string; deliveryContent?: string }
    ) => ordersService.confirmDelivery(payload),
    onSuccess: () => {
      // Invalidate related queries
      queryClient.invalidateQueries({ queryKey: orderKeys.all });
      toast.success("Xác nhận thành công. Tiền đã được cộng vào ví.");
    },
    onError: (error: any) => {
      toast.error(
        error.response?.data?.message || "Không thể xác nhận giao hàng"
      );
    },
  });
};

// Seller: Lấy đơn hàng theo sản phẩm
export const useOrdersByProduct = (
  productId: string | number,
  status?: string,
  page = 0,
  size = 10,
  enabled = true
) => {
  return useQuery({
    queryKey: orderKeys.byProduct(productId, status, page, size),
    queryFn: () =>
      ordersService.getOrdersByProduct(productId, status, page, size),
    enabled: enabled && !!productId,
  });
};

// Dashboard stats (user/seller)
export const dashboardKeys = {
  stats: () => [...orderKeys.all, "dashboard-stats"] as const,
};

export const useDashboardStats = () => {
  return useQuery({
    queryKey: dashboardKeys.stats(),
    queryFn: () => ordersService.getDashboardStats(),
  });
};
