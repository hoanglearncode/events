// services/withdrawalService.ts
import { api } from "./apiClient";
import { API_ENDPOINTS } from "@/shared/const/api";
import { ACCESS_TOKEN } from "@/shared/const/cookie";
import Cookies from "js-cookie";

export type WithdrawalItem = {
  id: string;
  date: string;
  amount: number;
  method: string;
  status: "Completed" | "Processing" | "Failed";
  txId: string;
};
// /history/withdrawals
export const withdrawalService = {
  async list() {
    const { data } = await api.get(API_ENDPOINTS.SELLER.WITHDRAWALS.LIST);
    return data;
  },

  async stats() {
    const { data } = await api.get(API_ENDPOINTS.SELLER.WITHDRAWALS.STATS);
    return data;
  },

  async history() {
    const res = await fetch(
      process.env.NEXT_PUBLIC_API_URL + "/api/payments/history/withdrawals",
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${Cookies.get(ACCESS_TOKEN)}`,
        },
      }
    );
    const data = await res.json();
    return data;
  },

  async create(payload: { amount: number; method: string }) {
    const { data } = await api.post(
      API_ENDPOINTS.SELLER.WITHDRAWALS.CREATE,
      payload
    );
    return data;
  },

  async cancel(withdrawalId: string) {
    const { data } = await api.post(
      API_ENDPOINTS.SELLER.WITHDRAWALS.CANCEL(withdrawalId)
    );
    return data;
  },
};
