// hooks/useWithdrawalsPageLogic.ts
"use client";
import { useState, useMemo } from "react";
import {
  useWithdrawalsStats,
  useCreateWithdrawal,
  useWithdrawalsList,
} from "@/hooks/queries/useWithdrawals";

export function useWithdrawalsPageLogic() {
  const [amount, setAmount] = useState("");
  const [method, setMethod] = useState("paypal");

  const listQuery = useWithdrawalsList();
  const statsQuery = useWithdrawalsStats();
  const createMutation = useCreateWithdrawal();

  const handleSubmit = () => {
    const value = Number(amount);
    if (value < 50) return;

    createMutation.mutate(
      { amount: value, method },
      {
        onSuccess: () => setAmount(""),
      }
    );
  };

  return useMemo(
    () => ({
      amount,
      setAmount,
      method,
      setMethod,
      handleSubmit,
      withdrawals: listQuery.data ?? [],
      stats: statsQuery.data ?? {
        availableBalance: 0,
        totalWithdrawn: 0,
        pending: 0,
      },
      isLoading: listQuery.isLoading || statsQuery.isLoading,
    }),
    [amount, method, listQuery, statsQuery]
  );
}
