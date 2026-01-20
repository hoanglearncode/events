import { useMutation } from "@tanstack/react-query";
import { PayService } from "@/services/pay.service";

interface CreatePaymentPayload {
  orderId: string;
  amount: number;
  currency: "VND" | "USD";
  provider: "PAYPAL" | "PAYOS";
  paymentMethod: "PAYPAL" | "VIETQR";
}

export const useCreatePayment = () => {
  return useMutation({
    mutationFn: async (payload: CreatePaymentPayload) => {
      if (payload.provider === "PAYOS") {
        return PayService.createPayos(payload);
      } else {
        return PayService.createPaypal(payload);
      }
    },
  });
};
