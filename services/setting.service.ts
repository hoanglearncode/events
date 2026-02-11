import { SystemSetting } from "@/app/(dashboard)/admin/settings/_types/setting";
import { api } from "@/services/apiClient";
import { API_ENDPOINTS } from "@/shared/const/api";
import { ApiResponse } from "@/types/api";

export const getSettingDetail = async (): Promise<SystemSetting> => {
  try {
    const response = await api.get<ApiResponse<SystemSetting>>(
      API_ENDPOINTS.setting.admin.detail
    );

    const { code, message, result } = response;

    if (code !== 200) {
      throw new Error(message || "Get setting failed");
    }

    return result;
  } catch (err: any) {
    throw new Error(
      err?.message || "Không thể lấy cấu hình hệ thống"
    );
  }
};


export const getSettingGeneral= async ()=> {
  try {
    const response = await api.get<ApiResponse<SystemSetting>>(
      API_ENDPOINTS.setting.public.general
    );

    const { code, message, result } = response;

    if (code !== 200) {
      throw new Error(message || "Get setting failed");
    }

    return result;
  } catch (err: any) {
    throw new Error(
      err?.message || "Không thể lấy cấu hình hệ thống"
    );
  }
}

export const getSettingRequirement= async ()=> {
  try {
    const response = await api.get<ApiResponse<SystemSetting>>(
      API_ENDPOINTS.setting.public.recruitment
    );

    const { code, message, result } = response;

    if (code !== 200) {
      throw new Error(message || "Get setting failed");
    }

    return result;
  } catch (err: any) {
    throw new Error(
      err?.message || "Không thể lấy cấu hình hệ thống"
    );
  }
}

export const getSettingContent = async ()=> {
  try {
    const response = await api.get<ApiResponse<SystemSetting>>(
      API_ENDPOINTS.setting.public.content
    );

    const { code, message, result } = response;

    if (code !== 200) {
      throw new Error(message || "Get setting failed");
    }

    return result;
  } catch (err: any) {
    throw new Error(
      err?.message || "Không thể lấy cấu hình hệ thống"
    );
  }
}

export const getSettingPayment = async ()=> {
  try {
    const response = await api.get<ApiResponse<SystemSetting>>(
      API_ENDPOINTS.setting.public.finance
    );

    const { code, message, result } = response;

    if (code !== 200) {
      throw new Error(message || "Get setting failed");
    }

    return result;
  } catch (err: any) {
    throw new Error(
      err?.message || "Không thể lấy cấu hình hệ thống"
    );
  }
}

export const getSettingSecurity = async ()=> {
  try {
    const response = await api.get<ApiResponse<SystemSetting>>(
      API_ENDPOINTS.setting.public.security
    );

    const { code, message, result } = response;

    if (code !== 200) {
      throw new Error(message || "Get setting failed");
    }

    return result;
  } catch (err: any) {
    throw new Error(
      err?.message || "Không thể lấy cấu hình hệ thống"
    );
  }
}

export const getSettingIntegration = async ()=> {
  try {
    const response = await api.get<ApiResponse<SystemSetting>>(
      API_ENDPOINTS.setting.public.integration
    );

    const { code, message, result } = response;

    if (code !== 200) {
      throw new Error(message || "Get setting failed");
    }

    return result;
  } catch (err: any) {
    throw new Error(
      err?.message || "Không thể lấy cấu hình hệ thống"
    );
  }
}

export const updateSetting = async ()=> {
  try {
    const response = await api.get<ApiResponse<SystemSetting>>(
      API_ENDPOINTS.setting.admin.update
    );

    const { code, message, result } = response;

    if (code !== 200) {
      throw new Error(message || "Get setting failed");
    }

    return result;
  } catch (err: any) {
    throw new Error(
      err?.message || "Không thể lấy cấu hình hệ thống"
    );
  }
}