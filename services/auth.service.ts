// services/auth.service.ts
import { api } from "@/services/apiClient";
import { API_ENDPOINTS } from "@/shared/const/api";
import type { ApiResponse } from "@/types/api";
import type { LoginResponse, User } from "@/types/auth";
import type {
  LoginFormData,
  RegisterFormData,
  ForgotPasswordFormData,
  ResetPasswordFormData,
  VerifyEmailFormData,
  ResendVerificationEmailFormData,
} from "@/shared/validation/auth.schemas";
import { useAuthStore } from "@/store/auth.store";
import Cookies from "js-cookie";
import {
  ACCESS_TOKEN,
  PUSHER_SOCKET_ID,
  REFRESH_TOKEN,
} from "@/shared/const/cookie";

/**
 * Auth Service - Direct API calls (không qua RTK Query)
 * Sử dụng api (apiClient) - api trả về `data` trực tiếp (thông qua response interceptor)
 */
export class AuthService {
  /**
   * Login user
   * - Trả về LoginResponse (shape tuỳ backend)
   * - Không tự động set cookie ở đây (nếu backend trả token, bạn có thể set ở chỗ gọi)
   */
  static async login(credentials: LoginFormData): Promise<LoginResponse> {
    try {
      const data = await api.post<LoginResponse>(
        API_ENDPOINTS.AUTH.LOGIN,
        credentials
      );

      // Nếu backend trả { code, message, data } hoặc khác shape,
      // bạn có thể điều chỉnh condition dưới đây dựa trên API thực tế.
      // Giữ logic cũ: kiểm tra code === 200 nếu có.
      if ((data as any).code && (data as any).code !== 200) {
        throw new Error(
          typeof (data as any).message === "string"
            ? (data as any).message
            : "Đăng nhập thất bại"
        );
      }

      return data;
    } catch (err: any) {
      // ném lại Error với message rõ ràng
      throw new Error(
        err?.message || "Đăng nhập thất bại — có lỗi khi gọi API"
      );
    }
  }

  static async logout(): Promise<void> {
    this.clearAllAuthData();

    if (typeof window !== "undefined") {
      window.location.href = "/login";
    }
  }

  /**
   * Clear all authentication-related data
   */
  static clearAllAuthData(): void {
    // Clear auth store
    const { clearAuth } = useAuthStore.getState();
    clearAuth();

    if (typeof window !== "undefined") {
      Cookies.remove(ACCESS_TOKEN);
      Cookies.remove(REFRESH_TOKEN);
      Cookies.remove(PUSHER_SOCKET_ID);
      localStorage.removeItem("auth-storage");
      localStorage.removeItem("website-form-storage");
      localStorage.removeItem("selectedWebsiteId");
      sessionStorage.clear();
    }
  }

  /**
   * Get user profile
   */
  static async getProfile(): Promise<User> {
    try {
      const data = await api.get<User>(API_ENDPOINTS.AUTH.PROFILE);

      // data là object User theo interceptor
      if (!data) {
        throw new Error("Không thể lấy thông tin người dùng");
      }

      return data;
    } catch (err: any) {
      throw new Error(err?.message || "Không thể lấy thông tin người dùng");
    }
  }

  /**
   * Refresh access token
   * Nếu backend endpoint trả { access_token } khi gửi refresh_token
   */
  static async refreshToken(refreshToken: string): Promise<string> {
    try {
      const data = await api.post<{ access_token: string }>(
        API_ENDPOINTS.AUTH.REFRESH,
        { token: refreshToken }
      );

      if (!data || !data.access_token) {
        throw new Error("Không thể làm mới token");
      }

      return data.access_token;
    } catch (err: any) {
      throw new Error(err?.message || "Không thể làm mới token");
    }
  }

  /**
   * Register new user
   */
  static async register(userData: RegisterFormData) {
    try {
      const data = await api.post<{ message: string }>(
        API_ENDPOINTS.AUTH.REGISTER,
        userData
      );

      return data;
    } catch (err: any) {
      throw err;
    }
  }

  /**
   * Google OAuth login (callback)
   */
  static async googleLogin(params: {
    code?: string;
    scope?: string;
    authuser?: string;
    prompt?: string;
  }) {
    try {
      const data = await api.get<LoginResponse>(
        API_ENDPOINTS.AUTH.GOOGLE_LOGIN,
        {
          params,
        } as any
      );

      return data;
    } catch (err: any) {
      throw err;
    }
  }

  /**
   * Request password reset
   */
  static async forgotPassword(data: ForgotPasswordFormData): Promise<void> {
    try {
      await api.post(API_ENDPOINTS.AUTH.FORGOT_PASSWORD, data);
    } catch (err: any) {
      throw new Error(err?.message || "Failed to send reset password email");
    }
  }

  /**
   * Reset password
   */
  static async resetPassword(data: ResetPasswordFormData): Promise<void> {
    try {
      await api.post(API_ENDPOINTS.AUTH.RESET_PASSWORD, data);
    } catch (err: any) {
      throw new Error(err?.message || "Failed to reset password");
    }
  }

  /**
   * Verify email with id and hash
   */
  static async verifyEmail(
    data: VerifyEmailFormData
  ): Promise<{ message: string }> {
    try {
      const res = await api.post<{ message: string }>(
        API_ENDPOINTS.AUTH.VERIFY_EMAIL,
        data
      );

      if (!res) {
        throw new Error("Failed to verify email");
      }

      return res;
    } catch (err: any) {
      throw new Error(err?.message || "Failed to verify email");
    }
  }

  /**
   * Resend verification email
   */
  static async resendVerificationEmail(
    data: string
  ): Promise<{ message: string }> {
    try {
      const res = await api.post<{ message: string }>(
        API_ENDPOINTS.AUTH.RESEND_VERIFICATION_EMAIL(data)
      );

      if (!res) {
        throw new Error("Failed to resend verification email");
      }

      return res;
    } catch (err: any) {
      throw new Error(err?.message || "Failed to resend verification email");
    }
  }

  /**
   * Update user profile
   * - Gửi formData (multipart/form-data)
   */
  static async updateProfile(formData: FormData): Promise<User> {
    try {
      const res = await api.put<User>(
        // sử dụng endpoint users (tương đương "/users")
        API_ENDPOINTS.USERS.LIST,
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" } as any,
        } as any
      );

      if (!res) {
        throw new Error("Failed to update profile");
      }

      return res;
    } catch (err: any) {
      throw new Error(err?.message || "Failed to update profile");
    }
  }

  /**
   * Change user password
   */
  static async changePassword(data: {
    old_password?: string | null;
    password: string;
    password_confirmation: string;
  }): Promise<void> {
    try {
      await api.put("/users/password", data);
    } catch (err: any) {
      throw new Error(err?.message || "Failed to change password");
    }
  }

  static async ref(): Promise<string> {
    try {
      const token = Cookies.get(REFRESH_TOKEN);
      const newToken = await api.put("/auth/refresh", {
        token: token,
      });
      return newToken.result;
    } catch (err: any) {
      throw new Error(err?.message || "Failed to change password");
    }
  }
}
