// types/payment.types.ts

export type PaymentProvider = "PAYOS" | "PAYPAL";
export type PaymentCurrency = "VND" | "USD";
export type PaymentStatus = "PENDING" | "COMPLETED" | "FAILED" | "CANCELLED";
export type TransactionType = "DEPOSIT" | "WITHDRAW";

export interface Bank {
  code: string;
  fullName: string;
  shortName?: string;
  logo?: string;
}

export interface Wallet {
  id: string;
  userId: string;
  currency: PaymentCurrency;
  balance: number;
  createdAt: string;
  updatedAt: string;
}

export interface PaymentInfo {
  id: string;
  userId: string;
  provider: PaymentProvider;
  bankCode?: string;
  receiverAccount: string;
  receiverName: string;
  isDefault: boolean;
  createdAt: string;
}

export interface CreatePaymentRequest {
  userId: string;
  amount: number;
  currency: PaymentCurrency;
  description?: string;
}

export interface CreatePaymentResponse {
  transactionId: string;
  qrCode?: string;
  checkoutUrl: string;
  amount: number;
  currency: PaymentCurrency;
  status: PaymentStatus;
}

export interface WithdrawRequest {
  userId: string;
  amount: number;
  provider: PaymentProvider;
  paymentInfoId?: string;
}

export interface WithdrawResponse {
  transactionId: string;
  amount: number;
  provider: PaymentProvider;
  status: PaymentStatus;
  message: string;
}

export interface Transaction {
  id: string;
  userId: string;
  type: TransactionType;
  provider: PaymentProvider;
  amount: number;
  currency: PaymentCurrency;
  status: PaymentStatus;
  description?: string;
  checkoutUrl?: string;
  qrCode?: string;
  createdAt: string;
  completedAt?: string;
}

export interface SavePaymentInfoRequest {
  userId: string;
  provider: PaymentProvider;
  bankCode?: string;
  receiverAccount: string;
  receiverName: string;
  isDefault: boolean;
}

export interface ApiResponse<T> {
  success: boolean;
  result: T;
  message?: string;
  error?: string;
}

// Invoice/Product Info for Payment Modal
export interface InvoiceItem {
  id: string;
  name: string;
  quantity: number;
  price: number;
  currency: PaymentCurrency;
}

export interface Invoice {
  id: string;
  items: InvoiceItem[];
  subtotal: number;
  tax?: number;
  discount?: number;
  total: number;
  currency: PaymentCurrency;
  description?: string;
}

export interface PaymentModalProps {
  invoice: Invoice;
  userId: string;
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: (transaction: Transaction) => void;
  onError?: (error: Error) => void;
}
