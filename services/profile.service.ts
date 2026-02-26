import {
  ProfileData,
  ProfileResponse,
  ProfileFormData,
  UpdateAvatarData,
} from "@/types/profile";
import { UserProfile } from "@/types/auth";
import { api } from "./apiClient";
import { API_ENDPOINTS } from "@/shared/const/api";

class ProfileServices {
  static async getDetails(): Promise<UserProfile> {
    try {
      const response = await api.get<ProfileResponse<UserProfile>>(
        `${API_ENDPOINTS.AUTH.PROFILE_DETAILS}`
      );
      return response.result;
    } catch (err: any) {
      throw new Error(err?.message || "Không thể lấy thông tin chi tiết");
    }
  }
  
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

}

export const profileService = ProfileServices;
