"use client";
import { useMemo } from "react";
import {
  useRevenueOverview,
  useRevenueBalance,
  useRevenueHistory,
  useRevenueAnalytics,
} from "@/hooks/queries/useRevenueQueries";

/**
 * Tập trung các query cho page, chuẩn hoá dữ liệu để component nhận vào
 */
export function useRevenuePageLogic() {
  const overviewQuery = useRevenueOverview();
  const balanceQuery = useRevenueBalance();
  const historyQuery = useRevenueHistory({ limit: 50 });
  const analyticsQuery = useRevenueAnalytics({ days: 14 });

  const overview = overviewQuery.data ?? {
    totalRevenue: 0,
    totalSales: 0,
    avgOrderValue: 0,
    newCustomers: 0,
  };

  const balance = balanceQuery.data ?? {
    available: 0,
    pending: 0,
    totalWithdrawn: 0,
  };

  const transactions = historyQuery.data?.transactions ?? [];

  // analytics points fallback: if API returns { points: [...] } else provide small mock
  const analyticsPoints = analyticsQuery.data?.points ?? [];
  return useMemo(
    () => ({
      overview,
      balance,
      transactions,
      analyticsPoints,
      isLoading:
        overviewQuery.isLoading ||
        balanceQuery.isLoading ||
        historyQuery.isLoading ||
        analyticsQuery.isLoading,
      isError:
        overviewQuery.isError ||
        balanceQuery.isError ||
        historyQuery.isError ||
        analyticsQuery.isError,
      // expose queries for refresh
      refetchAll: async () => {
        await Promise.all([
          overviewQuery.refetch(),
          balanceQuery.refetch(),
          historyQuery.refetch(),
          analyticsQuery.refetch(),
        ]);
      },
    }),
    [overviewQuery, balanceQuery, historyQuery, analyticsQuery]
  );
}
