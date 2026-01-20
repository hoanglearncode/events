// services/notification.service.ts
import { api } from "./apiClient";
import { API_ENDPOINTS } from "@/shared/const/api";
import { NotificationFormValues } from "@/hooks/queries/notiQueries";

export const NotificationService = {
  // Lấy thông báo của tôi
  async my(params?: { page?: number; size?: number }) {
    const res = await api.get(API_ENDPOINTS.USER.NOTIFICATIONS.MY, {
      params,
    });
    return res.result;
  },

  // Đọc 1 thông báo
  async read(id: number) {
    const res = await api.put(API_ENDPOINTS.USER.NOTIFICATIONS.READ(id));
    return res.message;
  },

  // Đọc tất cả
  async readAll() {
    const res = await api.put(API_ENDPOINTS.USER.NOTIFICATIONS.READ_ALL);
    return res.message;
  },

  // ADMIN broadcast
  async broadcast(payload: NotificationFormValues) {
    const res = await api.post(
      API_ENDPOINTS.ADMIN.NOTIFICATIONS.CREATE,
      payload
    );
    return res.message;
  },
};
