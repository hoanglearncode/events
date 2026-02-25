import { useMutation } from "@tanstack/react-query";

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
     
    },
  });
};
