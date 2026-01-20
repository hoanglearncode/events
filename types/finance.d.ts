export interface FinanceStats {
  balance: number;
  totalRevenue: number;
  pendingAmount: number;
}

export type TransactionType = "ORDER" | "WITHDRAW";
export type TransactionStatus = "PENDING" | "COMPLETED" | "FAILED";

export interface Transaction {
  id: string;
  orderId?: string | null;
  type: TransactionType;
  amount: number;
  status: TransactionStatus;
  createdAt: string;
}

export interface TransactionListResponse {
  data: Transaction[];
  total: number;
}
