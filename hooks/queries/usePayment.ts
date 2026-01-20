// hooks/usePayment.ts

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { paymentService } from "@/services/payment.service";
import type {
  CreatePaymentRequest,
  WithdrawRequest,
  SavePaymentInfoRequest,
  PaymentProvider,
} from "@/types/payment";
import { toast } from "sonner";

// Query Keys
export const paymentKeys = {
  all: ["payments"] as const,
  banks: () => [...paymentKeys.all, "banks"] as const,
  wallets: (userId: string) => [...paymentKeys.all, "wallets", userId] as const,
  paymentInfos: (userId: string) =>
    [...paymentKeys.all, "payment-infos", userId] as const,
  transactions: (userId: string) =>
    [...paymentKeys.all, "transactions", userId] as const,
  transaction: (id: string) => [...paymentKeys.all, "transaction", id] as const,
};

// Banks
export function useBanks() {
  return useQuery({
    queryKey: paymentKeys.banks(),
    queryFn: () => paymentService.getBanks(),
    staleTime: 1000 * 60 * 60, // 1 hour - banks don't change often
  });
}

// Wallets
export function useWallets(userId: string, enabled = true) {
  return useQuery({
    queryKey: paymentKeys.wallets(userId),
    queryFn: () => paymentService.getWallets(userId),
    enabled: enabled && !!userId,
    refetchInterval: 30000, // Refetch every 30s to keep balance updated
  });
}

// Payment Infos
export function usePaymentInfos(userId: string, enabled = true) {
  return useQuery({
    queryKey: paymentKeys.paymentInfos(userId),
    queryFn: () => paymentService.getPaymentInfos(userId),
    enabled: enabled && !!userId,
  });
}

// My Payment Infos (use token on server)
export function useMyPaymentInfos(enabled = true) {
  return useQuery({
    queryKey: [...paymentKeys.all, "payment-infos", "me"] as const,
    queryFn: () => paymentService.getMyPaymentInfos(),
    enabled,
  });
}

export function useSavePaymentInfo() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (request: SavePaymentInfoRequest) =>
      paymentService.savePaymentInfo(request),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: paymentKeys.paymentInfos(variables.userId),
      });
      // Also invalidate token-based current user key
      queryClient.invalidateQueries({
        queryKey: [...paymentKeys.all, "payment-infos", "me"] as const,
      });
      toast.success("Thông tin thanh toán đã được lưu");
    },
    onError: (error: any) => {
      toast.error(
        error.response?.data?.message || "Không thể lưu thông tin thanh toán"
      );
    },
  });
}

export function useDeletePaymentInfo() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (infoId: string) => paymentService.deletePaymentInfo(infoId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: paymentKeys.all });
      queryClient.invalidateQueries({
        queryKey: [...paymentKeys.all, "payment-infos", "me"] as const,
      });
      toast.success("Đã xóa thông tin thanh toán");
    },
    onError: (error: any) => {
      toast.error(
        error.response?.data?.message || "Không thể xóa thông tin thanh toán"
      );
    },
  });
}

// Payment for order (userId tự động lấy từ token)
export function useCreatePayment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      provider,
      request,
    }: {
      provider: PaymentProvider;
      request: {
        orderId: string;
        amount: number;
        currency: PaymentCurrency;
      };
    }) => {
      if (provider === "PAYOS") {
        return paymentService.createPayOSPayment({
          ...request,
          provider: "PAYOS",
          paymentMethod: "VIETQR",
        });
      }
      return paymentService.createPayPalPayment({
        ...request,
        provider: "PAYPAL",
        paymentMethod: "PAYPAL",
      });
    },
    onSuccess: (data) => {
      // Invalidate all wallet and transaction queries
      // userId sẽ được lấy từ token, nên invalidate tất cả
      queryClient.invalidateQueries({
        queryKey: paymentKeys.all,
      });
      toast.success("Đã tạo giao dịch thanh toán");
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Không thể tạo giao dịch");
    },
  });
}

// Withdraw
// userId sẽ được lấy từ JWT token trong cookie bởi backend
export function useWithdraw() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (request: Omit<WithdrawRequest, "userId">) =>
      paymentService.withdraw(request),
    onSuccess: () => {
      // Invalidate all wallet and transaction queries
      // userId sẽ được lấy từ token, nên invalidate tất cả
      queryClient.invalidateQueries({
        queryKey: paymentKeys.all,
      });
      toast.success("Yêu cầu rút tiền đã được xử lý");
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Không thể rút tiền");
    },
  });
}

// Transactions
export function useTransactions(userId: string, enabled = true) {
  return useQuery({
    queryKey: paymentKeys.transactions(userId),
    queryFn: () => paymentService.getTransactions(userId),
    enabled: enabled && !!userId,
  });
}

export function useTransaction(transactionId: string, enabled = true) {
  return useQuery({
    queryKey: paymentKeys.transaction(transactionId),
    queryFn: () => paymentService.getTransaction(transactionId),
    enabled: enabled && !!transactionId,
    refetchInterval: (query) => {
      // Auto-refetch if pending
      const data = query.state.data;
      return data?.status === "PENDING" ? 5000 : false;
    },
  });
}

export function useVerifyPayment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (transactionId: string) =>
      paymentService.verifyPayment(transactionId),
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: paymentKeys.transaction(data.id),
      });
      queryClient.invalidateQueries({
        queryKey: paymentKeys.wallets(data.userId),
      });
      queryClient.invalidateQueries({
        queryKey: paymentKeys.transactions(data.userId),
      });
      toast.success("Đã xác minh thanh toán");
    },
    onError: (error: any) => {
      toast.error(
        error.response?.data?.message || "Không thể xác minh thanh toán"
      );
    },
  });
}
