import { api } from "./apiClient";
import { API_ENDPOINTS } from "@/shared/const/api";
import { getUserIdFromToken } from "@/shared/lib/utils";

interface CreatePaymentRequest {
  orderId: string;
  amount: number;
  currency: "VND" | "USD";
  provider: "PAYPAL" | "PAYOS";
  paymentMethod: "PAYPAL" | "VIETQR";
}
export const PayService = {
  async createPayos(payload: Partial<CreatePaymentRequest>) {
    // Lấy userId từ JWT token và thêm vào payload
    const userId = getUserIdFromToken();
    console.log("[PayService.createPayos] userId from token:", userId);
    console.log("[PayService.createPayos] payload before:", payload);

    if (!userId) {
      console.error("[PayService.createPayos] No userId found in token");
      throw new Error(
        "Không tìm thấy userId trong token. Vui lòng đăng nhập lại."
      );
    }

    const finalPayload = {
      ...payload,
      userId: userId,
    };
    console.log("[PayService.createPayos] final payload:", finalPayload);

    const res = await api.post(API_ENDPOINTS.PAY.PAYOS_CREATE, finalPayload);
    return res.result;
  },

  async createPaypal(payload: Partial<CreatePaymentRequest>) {
    // Lấy userId từ JWT token và thêm vào payload
    const userId = getUserIdFromToken();
    console.log("[PayService.createPaypal] userId from token:", userId);
    console.log("[PayService.createPaypal] payload before:", payload);

    if (!userId) {
      console.error("[PayService.createPaypal] No userId found in token");
      throw new Error(
        "Không tìm thấy userId trong token. Vui lòng đăng nhập lại."
      );
    }

    const finalPayload = {
      ...payload,
      userId: userId,
    };
    console.log("[PayService.createPaypal] final payload:", finalPayload);

    const res = await api.post(API_ENDPOINTS.PAY.PAYPAL_CREATE, finalPayload);
    return res.result;
  },

  async createWithdrawal(payload: Partial<CreatePaymentRequest>) {
    const res = await api.post(API_ENDPOINTS.WITHDRAWAL, payload);
    return res.result;
  },
};
