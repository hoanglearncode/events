// types/seller.types.ts

export enum SellerStatus {
  PENDING = "PENDING",
  APPROVED = "APPROVED",
  REJECTED = "REJECTED",
  BANNED = "BANNED",
  ACTIVE = "ACTIVE",
  ALL = "ALL",
}

export interface SellerShop {
  shopName: string;
  shopDescription?: string;
  businessLicense?: string;
  taxCode?: string;
  bankAccount?: string;
  bankName?: string;
  address?: string;
  phone?: string;
}

export interface SellerRequest {
  id: string;
  userId: string;
  user?: {
    id: string;
    fullname: string;
    email: string;
    phone?: string;
    avatar?: string;
  };
  shopData: SellerShop;
  status: SellerStatus;
  requestedAt: string;
  approvedAt?: string;
  rejectedAt?: string;
  rejectionReason?: string;
  approvedBy?: string;
  rejectedBy?: string;
}

export interface SellerListParams {
  page?: number;
  size?: number;
  status?: string;
  search?: string;
  sortBy?: "requestedAt" | "approvedAt" | "shopName";
  sortOrder?: "asc" | "desc";
}

export interface SellerListResponse {
  items: SellerRequest[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface ApproveSellerPayload {
  userId: string;
  note?: string;
}

export interface RejectSellerPayload {
  userId: string;
  reason: string;
}

export interface BanSellerPayload {
  userId: string;
  reason: string;
  duration?: number; // days, null = permanent
}

export interface SellerStats {
  totalSellers: number;
  pendingSellers: number;
  approvedSellers: number;
  rejectedSellers: number;
  bannedSellers: number;
}
