// services/admin/adminSeller.service.ts
import { api } from "@/services/apiClient";
import { API_ENDPOINTS } from "@/shared/const/api";
import { ApiDataResponse } from "@/types/api";
import {
  SellerRequest,
  SellerListParams,
  SellerListResponse,
  ApproveSellerPayload,
  RejectSellerPayload,
  BanSellerPayload,
  SellerStats,
  SellerShop,
} from "@/types/seller";

export function normalizeErrorMessage(message: unknown): string {
  if (typeof message === "string") return message;

  if (Array.isArray(message)) {
    return message.filter(Boolean).join(", ");
  }

  if (message && typeof message === "object") {
    if ("message" in message && typeof (message as any).message === "string") {
      return (message as any).message;
    }
    return JSON.stringify(message);
  }

  return "Đã xảy ra lỗi không xác định";
}

class AdminSellerService {
  static async getSellersList(
    params?: SellerListParams
  ): Promise<ApiDataResponse<any>> {
    try {
      const res = await api.get(API_ENDPOINTS.ADMIN.SELLERS.LIST, { params });

      if (res.status) {
        throw new Error(
          normalizeErrorMessage(res.statusText) || "Không thể tải thống kê"
        );
      }

      return res;
    } catch (err: any) {
      throw new Error(
        normalizeErrorMessage(err?.response?.data?.messages ?? err?.message) ||
          "Lỗi khi tải danh sách sellers"
      );
    }
  }

  static async getSellerDetail(
    userId: string
  ): Promise<ApiDataResponse<SellerRequest>> {
    try {
      const res = await api.get(API_ENDPOINTS.ADMIN.SELLERS.DETAIL(userId));
      const data = res?.data as ApiDataResponse<SellerRequest>;

      if (!data?.success) {
        throw new Error(
          normalizeErrorMessage(data?.messages) ||
            "Không thể tải thông tin seller"
        );
      }

      return data;
    } catch (err: any) {
      throw new Error(
        normalizeErrorMessage(err?.response?.data?.messages ?? err?.message) ||
          "Lỗi khi tải thông tin seller"
      );
    }
  }

  static async getSellerStats(): Promise<ApiDataResponse<SellerStats>> {
    try {
      const res = await api.get(API_ENDPOINTS.ADMIN.SELLERS.STATS);

      if (res.status) {
        throw new Error(
          normalizeErrorMessage(res.statusText) || "Không thể tải thống kê"
        );
      }

      return res?.result;
    } catch (err: any) {
      throw new Error(
        normalizeErrorMessage(err?.response?.data?.messages ?? err?.message) ||
          "Lỗi khi tải thống kê"
      );
    }
  }

  static async approveSeller(
    payload: ApproveSellerPayload
  ): Promise<ApiDataResponse<SellerRequest>> {
    try {
      const res = await api.post(
        API_ENDPOINTS.ADMIN.SELLERS.APPROVE(payload.userId),
        { note: payload.note }
      );

      return res.result;
    } catch (err: any) {
      throw new Error(
        normalizeErrorMessage(err?.response?.data?.messages ?? err?.message) ||
          "Lỗi khi duyệt seller"
      );
    }
  }

  static async rejectSeller(
    payload: string
  ): Promise<ApiDataResponse<SellerRequest>> {
    try {
      const res = await api.patch(API_ENDPOINTS.ADMIN.SELLERS.REJECT(payload));

      return res.result;
    } catch (err: any) {
      throw new Error(
        normalizeErrorMessage(err?.response?.data?.messages ?? err?.message) ||
          "Lỗi khi từ chối seller"
      );
    }
  }

  static async banSeller(
    payload: string
  ): Promise<ApiDataResponse<SellerRequest>> {
    try {
      const res = await api.patch(API_ENDPOINTS.ADMIN.SELLERS.BAN(payload));

      return res.result;
    } catch (err: any) {
      throw new Error(
        normalizeErrorMessage(err?.response?.data?.messages ?? err?.message) ||
          "Lỗi khi chặn seller"
      );
    }
  }

  static async unbanSeller(
    userId: string
  ): Promise<ApiDataResponse<SellerRequest>> {
    try {
      const res = await api.patch(API_ENDPOINTS.ADMIN.SELLERS.UNBAN(userId));
      return res.result;
    } catch (err: any) {
      throw new Error(
        normalizeErrorMessage(err?.response?.data?.messages ?? err?.message) ||
          "Lỗi khi mở chặn seller"
      );
    }
  }

  static async deleteSeller(userId: string): Promise<ApiDataResponse<void>> {
    try {
      const res = await api.put(API_ENDPOINTS.ADMIN.SELLERS.DELETE(userId));
      return res.result;
    } catch (err: any) {
      throw new Error(
        normalizeErrorMessage(err?.response?.data?.messages ?? err?.message) ||
          "Lỗi khi xóa seller"
      );
    }
  }
  static async registerSeller({
    formData,
    userId,
  }: {
    formData: SellerShop;
    userId: string;
  }): Promise<any> {
    try {
      const res = await api.post(API_ENDPOINTS.SELLER.REGISTER, formData);

      const data = res?.data ?? res;

      if (data?.code !== 200) {
        throw new Error(data?.message || "Yêu cầu thất bại");
      }

      return data;
    } catch (err: any) {
      throw new Error(
        err?.response?.data?.message ?? err?.message ?? "Yêu cầu thất bại"
      );
    }
  }

  static async unRegisterSeller({
    formData,
    userId,
  }: {
    formData?: SellerShop;
    userId: string;
  }): Promise<ApiDataResponse<any>> {
    try {
      const res = await api.delete(API_ENDPOINTS.SELLER.UN_REGISTER);
      const data = res?.data ?? res;

      if (data?.code !== 200) {
        throw new Error(data?.message || "Yêu cầu thất bại");
      }

      return data;
    } catch (err: any) {
      throw new Error(
        err?.response?.data?.messages ?? err?.message ?? "Yêu cầu thất bại"
      );
    }
  }

  /**
   * Lấy chi tiết shop của user hiện tại
   */
  static async getDetailsShop(): Promise<ApiDataResponse<any>> {
    try {
      const res = await api.get(API_ENDPOINTS.SELLER.DETAIL);
      const data = res?.data ?? res;

      if (data?.code && data?.code !== 200) {
        throw new Error(data?.message || "Yêu cầu thất bại");
      }

      if (typeof data?.success !== "undefined" && !data.success) {
        throw new Error(
          normalizeErrorMessage(data?.messages) || "Yêu cầu thất bại"
        );
      }

      return data.result;
    } catch (err: any) {
      throw new Error(
        err?.response?.data?.message ??
          err?.response?.data?.messages ??
          err?.message ??
          "Yêu cầu thất bại"
      );
    }
  }

  /**
   * Cập nhật thông tin shop (PUT)
   */
  static async updateDetailsShop({
    formData,
  }: {
    formData: SellerShop;
  }): Promise<ApiDataResponse<any>> {
    try {
      // dùng PUT cho update; nếu backend dùng POST đổi lại cho phù hợp
      const res = await api.put(API_ENDPOINTS.SELLER.UPDATE, formData);
      const data = res?.data ?? res;

      if (data?.code && data?.code !== 200) {
        throw new Error(data?.message || "Yêu cầu thất bại");
      }

      if (typeof data?.success !== "undefined" && !data.success) {
        throw new Error(
          normalizeErrorMessage(data?.messages) || "Yêu cầu thất bại"
        );
      }

      return data;
    } catch (err: any) {
      throw new Error(
        err?.response?.data?.message ??
          err?.response?.data?.messages ??
          err?.message ??
          "Yêu cầu thất bại"
      );
    }
  }
}

export const AdminSeller = AdminSellerService;
