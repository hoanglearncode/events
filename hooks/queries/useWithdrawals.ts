// hooks/queries/useWithdrawalsList.ts
"use client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { withdrawalService } from "@/services/withdrawal.service";

export function useWithdrawalsList() {
  return useQuery({
    queryKey: ["seller", "withdrawals", "list"],
    queryFn: withdrawalService.list,
    staleTime: 60_000,
  });
}

export function useWithdrawalsStats() {
  return useQuery({
    queryKey: ["seller", "withdrawals", "stats"],
    queryFn: withdrawalService.stats,
    staleTime: 60_000,
  });
}

export function useWithdrawalsHistory() {
  return useQuery({
    queryKey: ["seller", "withdrawals", "history"],
    queryFn: () => withdrawalService.history(),
    staleTime: 60_000,
    retry: 1,
  });
}

export function useCreateWithdrawal() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: withdrawalService.create,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["seller", "withdrawals"] });
    },
  });
}
