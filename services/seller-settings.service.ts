// services/seller-settings.service.ts
import { api } from "./apiClient";
import { API_ENDPOINTS } from "@/shared/const/api";

export const SellerSettingsService = {
  get() {
    return api.get(API_ENDPOINTS.SELLER.SETTINGS.GET);
  },

  update(payload: any) {
    return api.put(API_ENDPOINTS.SELLER.SETTINGS.UPDATE, payload);
  },

  paymentMethods() {
    return api.get(API_ENDPOINTS.SELLER.SETTINGS.PAYMENT_METHODS);
  },

  shipping() {
    return api.get(API_ENDPOINTS.SELLER.SETTINGS.SHIPPING);
  },

  policies() {
    return api.get(API_ENDPOINTS.SELLER.SETTINGS.POLICIES);
  },
};
