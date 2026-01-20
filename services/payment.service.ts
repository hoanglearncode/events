// services/payment.service.ts
import { api } from "./apiClient";
import { API_ENDPOINTS } from "@/shared/const/api";
import type {
  Bank,
  Wallet,
  PaymentInfo,
  CreatePaymentResponse,
  WithdrawRequest,
  WithdrawResponse,
  SavePaymentInfoRequest,
  Transaction,
} from "@/types/payment";
import { getUserIdFromToken } from "@/shared/lib/utils";

// Request cho payment order
interface CreateOrderPaymentRequest {
  orderId: string;
  amount: number;
  currency: "VND" | "USD";
  provider: "PAYOS" | "PAYPAL";
  paymentMethod: "VIETQR" | "PAYPAL";
}

class PaymentService {
  // Get list of banks
  async getBanks(): Promise<Bank[]> {
    const res = await api.get<{ result: Bank[] }>(API_ENDPOINTS.PAY.BANKS);
    return res.result || [];
  }

  // Get wallets for a user
  async getWallets(userId: string): Promise<Wallet[]> {
    const res = await api.get<{ result: Wallet | Wallet[] }>(
      API_ENDPOINTS.PAY.WALLETS(userId)
    );
    const result = res.result;
    return Array.isArray(result) ? result : result ? [result] : [];
  }

  // Get my wallets (use token on server to identify user)
  async getMyWallets(): Promise<Wallet[]> {
    const res = await api.get<{ result: Wallet | Wallet[] }>(
      "/payments/my-wallet"
    );
    const result = res?.result || res?.data || res;
    return Array.isArray(result) ? result : result ? [result] : [];
  }

  // Get payment infos for a user
  async getPaymentInfos(userId: string): Promise<PaymentInfo[]> {
    const res = await api.get<{ result: PaymentInfo[] }>(
      API_ENDPOINTS.PAY.PAYMENT_INFOS(userId)
    );
    return res.result || [];
  }

  // Get my payment infos (use token on server to identify user)
  async getMyPaymentInfos(): Promise<PaymentInfo[]> {
    const res = await api.get<{ result: PaymentInfo[] }>("/payments/me");
    return res?.result || res?.data || [];
  }

  // Save payment info
  async savePaymentInfo(request: SavePaymentInfoRequest): Promise<PaymentInfo> {
    const res = await api.post<{ result: PaymentInfo }>(
      API_ENDPOINTS.PAY.PAYMENT_INFO_ADD,
      request
    );
    return res.result;
  }

  // Delete payment info
  async deletePaymentInfo(infoId: string): Promise<void> {
    await api.delete(API_ENDPOINTS.PAY.PAYMENT_INFO_DELETE(infoId));
  }

  // Create PayOS payment for order
  async createPayOSPayment(
    request: CreateOrderPaymentRequest
  ): Promise<CreatePaymentResponse> {
    // Lấy userId từ JWT token và thêm vào payload
    const userId = getUserIdFromToken();
    if (!userId) {
      throw new Error(
        "Không tìm thấy userId trong token. Vui lòng đăng nhập lại."
      );
    }
    const res = await api.post<{ result: CreatePaymentResponse }>(
      API_ENDPOINTS.PAY.PAYOS_CREATE,
      {
        userId: userId,
        orderId: request.orderId,
        amount: request.amount,
        currency: request.currency,
        provider: "PAYOS",
        paymentMethod: "VIETQR",
      }
    );
    return res.result;
  }

  // Create PayPal payment for order
  async createPayPalPayment(
    request: CreateOrderPaymentRequest
  ): Promise<CreatePaymentResponse> {
    // Lấy userId từ JWT token và thêm vào payload
    const userId = getUserIdFromToken();
    if (!userId) {
      throw new Error(
        "Không tìm thấy userId trong token. Vui lòng đăng nhập lại."
      );
    }
    const res = await api.post<{ result: CreatePaymentResponse }>(
      API_ENDPOINTS.PAY.PAYPAL_CREATE,
      {
        userId: userId,
        orderId: request.orderId,
        amount: request.amount,
        currency: request.currency,
        provider: "PAYPAL",
        paymentMethod: "PAYPAL",
      }
    );
    return res.result;
  }

  // Withdraw money
  // Frontend should send { amount, provider } and backend will identify user via Authorization token
  async withdraw(request: {
    amount: number;
    provider: any;
    paymentInfoId?: string;
  }): Promise<WithdrawResponse> {
    const payload: any = {
      amount: request.amount,
      provider: request.provider,
    };
    // paymentInfoId is optional; do not include userId from client
    if (request.paymentInfoId) payload.paymentInfoId = request.paymentInfoId;

    const res = await api.post<{ result: WithdrawResponse }>(
      API_ENDPOINTS.PAY.WITHDRAW,
      payload
    );
    return res.result;
  }

  // Get transactions for a user
  async getTransactions(userId: string): Promise<Transaction[]> {
    const res = await api.get<{ result: Transaction[] }>(
      API_ENDPOINTS.PAY.TRANSACTIONS(userId)
    );
    return res.result || [];
  }

  // Get a single transaction
  async getTransaction(transactionId: string): Promise<Transaction> {
    const res = await api.get<{ result: Transaction }>(
      API_ENDPOINTS.PAY.TRANSACTION(transactionId)
    );
    return res.result;
  }

  // Verify payment
  async verifyPayment(transactionId: string): Promise<Transaction> {
    const res = await api.post<{ result: Transaction }>(
      API_ENDPOINTS.PAY.VERIFY(transactionId)
    );
    return res.result;
  }
}

export const paymentService = new PaymentService();
