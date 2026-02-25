export type SellerStatus = "none" | "pending" | "approved";
export type TransactionType = "deposit" | "withdraw";
export type TransactionStatus = "success" | "pending";

export interface ProfileData {
  userId: string;
  email: string;
  role: "USER" | "ADMIN" | "SELLER";
  fullname: string;
  avatar: string | null;
  mustChangePassword?: boolean;
}

export interface ProfileResponse<T> {
  code?: string | number | null;
  result: T;
  message?: string;
}

export interface ProfileFormData {
  fullname?: string;
  avatar?: string | File;
  phone?: string;
  bio?: string;
  address?: string;
  dateOfBirth?: string;
}

export interface UpdateAvatarData {
  avatar: File;
}

export interface WalletState {
  balance: number;
  showBalance: boolean;
}

export interface WalletTransaction {
  id: number;
  type: TransactionType;
  amount: number;
  date: string;
  status: TransactionStatus;
  method: string;
}

export interface LinkedBank {
  id: number;
  name: string;
  accountNumber: string;
  linked: boolean;
}

export interface DepositFormData {
  amount: number;
  method: string;
}

export interface WithdrawFormData {
  amount: number;
  bankId: number;
}
