import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
// import { FinanceService } from "@/services/finance.service";

export const financeQueryKeys = {
  stats: ["finance", "stats"] as const,
};

export function useFinanceStats() {
  return useQuery({
    queryKey: financeQueryKeys.stats,
    // queryFn: FinanceService.getStats,
    staleTime: 60 * 1000, // 1 phút
    retry: 1,
  });
}

export const transactionQueryKeys = {
  list: (page: number, pageSize: number) =>
    ["finance", "transactions", page, pageSize] as const,
};

interface UseTransactionsParams {
  page: number;
  pageSize: number;
}

export function useTransactions({ page, pageSize }: UseTransactionsParams) {
  return useQuery({
    queryKey: transactionQueryKeys.list(page, pageSize),
    // queryFn: () => FinanceService.getTransactions(page, pageSize),
    staleTime: 30 * 1000,
  });
}

export const transactionDetailQueryKeys = {
  detail: (id: string) => ["finance", "transaction", id] as const,
};

export function useTransactionDetail(transactionId?: string) {
  return useQuery({
    queryKey: transactionId
      ? transactionDetailQueryKeys.detail(transactionId)
      : [],
    // queryFn: () => FinanceService.getTransactionDetail(transactionId!),
    enabled: Boolean(transactionId),
  });
}

export function useWithdraw() {
  const queryClient = useQueryClient();

  return useMutation({
    // mutationFn: (amount: number) => FinanceService.withdraw(amount),
    onSuccess: () => {
      // Refetch stats + transactions
      queryClient.invalidateQueries({
        queryKey: financeQueryKeys.stats,
      });
      queryClient.invalidateQueries({
        queryKey: ["finance", "transactions"],
      });
    },
  });
}
