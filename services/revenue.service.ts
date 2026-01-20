import { api } from "./apiClient";
import { API_ENDPOINTS } from "@/shared/const/api";

type OverviewResp = {
  totalRevenue: number;
  totalSales: number;
  avgOrderValue: number;
  newCustomers: number;
};

type BalanceResp = {
  available: number;
  pending: number;
  totalWithdrawn: number;
};

type Transaction = {
  date: string;
  product: string;
  customer: string;
  amount: string;
  fee: string;
  net: string;
  status: "Completed" | "Pending" | string;
};

type HistoryResp = {
  transactions: Transaction[];
};

type AnalyticsPoint = {
  date: string;
  revenue: number;
};

type AnalyticsResp = {
  points: AnalyticsPoint[];
};

export const sellerRevenueService = {
  async getOverview(): Promise<OverviewResp> {
    const { data } = await api.get(API_ENDPOINTS.SELLER.REVENUE.OVERVIEW);
    return data;
  },

  async getBalance(): Promise<BalanceResp> {
    const { data } = await api.get(API_ENDPOINTS.SELLER.REVENUE.BALANCE);
    return data;
  },

  async getHistory(params?: {
    limit?: number;
    page?: number;
  }): Promise<HistoryResp> {
    const { data } = await api.get(API_ENDPOINTS.SELLER.REVENUE.HISTORY, {
      params,
    });
    return data;
  },

  async getAnalytics(range?: { days?: number }): Promise<AnalyticsResp> {
    const { data } = await api.get(API_ENDPOINTS.SELLER.REVENUE.ANALYTICS, {
      params: range,
    });
    return data;
  },
};
