import {
  ProfileData,
  ProfileResponse,
  ProfileFormData,
  ProfileDetailData,
  UpdateAvatarData,
} from "@/types/profile";
import { api } from "./apiClient";
import { API_ENDPOINTS } from "@/shared/const/api";

class ProfileServices {
  // Lấy thông tin profile cơ bản
  static async get(): Promise<ProfileResponse<ProfileData>> {
    try {
      const data = await api.get<ProfileResponse<ProfileData>>(
        API_ENDPOINTS.AUTH.PROFILE
      );
      return data;
    } catch (err: any) {
      throw new Error(err?.message || "Không thể lấy thông tin profile");
    }
  }

  // Lấy thông tin profile chi tiết
  static async getDetails(): Promise<ProfileDetailData> {
    try {
      const response = await api.get<ProfileResponse<ProfileDetailData>>(
        `${API_ENDPOINTS.AUTH.PROFILE_DETAILS}`
      );
      return response.result;
    } catch (err: any) {
      throw new Error(err?.message || "Không thể lấy thông tin chi tiết");
    }
  }

  // Cập nhật profile
  static async update(
    formData: ProfileFormData
  ): Promise<ProfileResponse<ProfileDetailData>> {
    try {
      const data = await api.put<ProfileResponse<ProfileDetailData>>(
        API_ENDPOINTS.AUTH.PROFILE_UPDATE,
        formData
      );

      if (data.code && data.code !== 200) {
        throw new Error(
          typeof data.message === "string"
            ? data.message
            : "Cập nhật profile thất bại"
        );
      }

      return data;
    } catch (err: any) {
      throw new Error(err?.message || "Cập nhật profile thất bại");
    }
  }

  // Đổi mật khẩu
  static async changePassword(passwords: any): Promise<ProfileResponse<any>> {
    try {
      const data = await api.post<ProfileResponse<any>>(
        API_ENDPOINTS.AUTH.CHANGE_PASSWORD,
        passwords
      );

      if (data.code && data.code !== 200) {
        throw new Error(
          typeof data.message === "string"
            ? data.message
            : "Đổi mật khẩu thất bại"
        );
      }

      return data;
    } catch (err: any) {
      throw new Error(err?.message || "Đổi mật khẩu thất bại");
    }
  }

  // Upload avatar
  static async updateAvatar(
    file: File
  ): Promise<ProfileResponse<ProfileDetailData>> {
    try {
      const formData = new FormData();
      formData.append("avatar", file);

      const data = await api.post<ProfileResponse<ProfileDetailData>>(
        `${API_ENDPOINTS.AUTH.PROFILE}/avatar`,
        formData
      );

      if (data.code && data.code !== 200) {
        throw new Error(
          typeof data.message === "string"
            ? data.message
            : "Upload avatar thất bại"
        );
      }

      return data;
    } catch (err: any) {
      throw new Error(err?.message || "Upload avatar thất bại");
    }
  }

  // Xóa avatar
  static async deleteAvatar(): Promise<ProfileResponse<ProfileDetailData>> {
    try {
      const data = await api.delete<ProfileResponse<ProfileDetailData>>(
        `${API_ENDPOINTS.AUTH.PROFILE}/avatar`
      );
      return data;
    } catch (err: any) {
      throw new Error(err?.message || "Xóa avatar thất bại");
    }
  }
}

export const profileService = ProfileServices;
