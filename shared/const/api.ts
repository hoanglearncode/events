import { HttpStatusCode } from "axios";

// API Configuration Constants
export const API_CONFIG = {
  BASE_URL: (process.env.NEXT_PUBLIC_API_URL || "") + "/api",
  TIMEOUT: 300000,
  RETRIES: 0,
  RETRY_DELAY: 2000,
} as const;

// Error Messages
// TODO: using key for translation
export const ERROR_MESSAGES = {
  NETWORK_ERROR: "Lỗi kết nối mạng",
  TIMEOUT_ERROR: "Yêu cầu hết thời gian chờ",
  GENERIC_ERROR: "Đã xảy ra lỗi",
  UNAUTHORIZED: "Không có quyền truy cập",
  TOKEN_EXPIRED: "Phiên làm việc đã hết hạn",
} as const;

// Retryable Status Codes
export const RETRYABLE_STATUS_CODES = [
  HttpStatusCode.RequestTimeout,
  HttpStatusCode.TooManyRequests,
  HttpStatusCode.InternalServerError,
  HttpStatusCode.BadGateway,
  HttpStatusCode.ServiceUnavailable,
  HttpStatusCode.GatewayTimeout,
] as const;

// Helper Types for Query Parameters
export interface PaginationParams {
  page?: number;
  limit?: number;
  sort?: string;
  order?: "asc" | "desc";
}

export interface SearchParams {
  search?: string;
  category?: string;
  tags?: string[];
  status?: string;
}

export interface DateRangeParams {
  from?: string;
  to?: string;
}

// API Endpoints
export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: "/auth/login",
    REFRESH: "/auth/refresh",
    PROFILE: "/auth/me",
    PROFILE_UPDATE: "/users",
    PROFILE_DETAILS: "/users/detail",
    GOOGLE_LOGIN: "/auth/google/callback",
    REGISTER: "/auth/register",
    VERIFY_EMAIL: "/auth/verify",
    RESEND_VERIFICATION_EMAIL: (email: string) =>
      `/auth/resend-verification?email=${email}`,
    FORGOT_PASSWORD: "/auth/forgot-password",
    RESET_PASSWORD: "/auth/reset-password-confirm",
    CHANGE_PASSWORD: "/auth/change-password",
  },

  setting: {
    public: {
      general: "/setting/general",
      security: "/setting/security",
      finance: "/setting/finance",
      content: "/setting/content",
      recruitment: "/setting/recruitment",
      integration: "/setting/integration",
    }, 
    admin: {
      detail: "/setting/detail",
      update: "/setting/update",
    }
  }
} as const;

// Content Types
export const CONTENT_TYPES = {
  JSON: "application/json",
  FORM_DATA: "multipart/form-data",
  URL_ENCODED: "application/x-www-form-urlencoded",
} as const;

// Helper function to build query string
export const buildQueryString = (params: Record<string, any>): string => {
  const searchParams = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "") {
      if (Array.isArray(value)) {
        value.forEach((item) => searchParams.append(key, String(item)));
      } else {
        searchParams.append(key, String(value));
      }
    }
  });

  const queryString = searchParams.toString();
  return queryString ? `?${queryString}` : "";
};
