// /services/category.service.ts
import { api } from "./apiClient";
import { API_ENDPOINTS } from "@/shared/const/api";
import type { Category } from "@/hooks/queries/useCategories";

export const CategoryService = {
  async list(): Promise<Category[]> {
    const res = await api.get(API_ENDPOINTS.CATEGORIES.LIST);
    return res.result;
  },

  async create(payload: Partial<Category>) {
    const res = await api.post(API_ENDPOINTS.CATEGORIES.CREATE, payload);
    return res.result;
  },

  async update(id: string | number, payload: Partial<Category>) {
    const res = await api.put(API_ENDPOINTS.CATEGORIES.UPDATE(id), payload);
    return res.data;
  },

  async delete(id: string) {
    return api.delete(API_ENDPOINTS.CATEGORIES.DELETE(id));
  },

  async reorder(data: { id: number; order: number }[]) {
    return api.post(API_ENDPOINTS.CATEGORIES.REORDER, { data });
  },

  // cập nhật phí danh mục
  async setFee(id: string, value: number | null) {
    return api.post(API_ENDPOINTS.ADMIN.SETTINGS(id), { feePercentage: value });
  },
  // lấy phí danh mục
  async getFee(id: string): Promise<number | null> {
    const res = await api.get(API_ENDPOINTS.CATEGORIES.FEE(id));
    return res.result;
  },
};
