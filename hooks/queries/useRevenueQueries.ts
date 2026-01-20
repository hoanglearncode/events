"use client";

import { useQuery } from "@tanstack/react-query";
import { sellerRevenueService } from "@/services/revenue.service";

export function useRevenueOverview() {
  return useQuery({
    queryKey: ["seller", "revenue", "overview"],
    queryFn: () => sellerRevenueService.getOverview(),
    staleTime: 1000 * 60, // 1 phút
    retry: 1,
  });
}

export function useRevenueBalance() {
  return useQuery({
    queryKey: ["seller", "revenue", "balance"],
    queryFn: () => sellerRevenueService.getBalance(),
    staleTime: 1000 * 60, // 1 phút
    retry: 1,
  });
}

export function useRevenueHistory(params?: { limit?: number; page?: number }) {
  return useQuery({
    queryKey: ["seller", "revenue", "history", params],
    queryFn: () => sellerRevenueService.getHistory(),
    staleTime: 1000 * 60, // 1 phút
    retry: 1,
  });
}

export function useRevenueAnalytics(range?: { days?: number }) {
  return useQuery({
    queryKey: ["seller", "revenue", "analytics", range],
    queryFn: () => sellerRevenueService.getHistory(),
    staleTime: 1000 * 60, // 1 phút
    retry: 1,
  });
}
