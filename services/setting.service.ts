import {
  General,
  SettingVersion,
  SystemSetting,
} from "@/app/(dashboard)/admin/settings/_types/setting";
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
    throw new Error(err?.message || "Không thể lấy cấu hình hệ thống");
  }
};

export const getVersionList = async (): Promise<SettingVersion[]> => {
  try {
    const response = await api.get<ApiResponse<SettingVersion[]>>(
      API_ENDPOINTS.setting.admin.version
    );

    const { code, message, result } = response;

    if (code !== 200) {
      throw new Error(message || "Get version setting failed");
    }

    return result;
  } catch (err: any) {
    throw new Error(
      err?.message || "Không thể lấy danh sách cấu hình hệ thống"
    );
  }
};

export const getSettingGeneral = async () => {
  try {
    const response = await api.get<ApiResponse<General>>(
      API_ENDPOINTS.setting.public.general
    );

    const { code, message, result } = response;

    if (code !== 200) {
      throw new Error(message || "Get setting failed");
    }

    return result;
  } catch (err: any) {
    throw new Error(err?.message || "Không thể lấy cấu hình hệ thống");
  }
};

export const getSettingRequirement = async () => {
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
    throw new Error(err?.message || "Không thể lấy cấu hình hệ thống");
  }
};

export const getSettingContent = async () => {
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
    throw new Error(err?.message || "Không thể lấy cấu hình hệ thống");
  }
};

export const getSettingPayment = async () => {
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
    throw new Error(err?.message || "Không thể lấy cấu hình hệ thống");
  }
};

export const getSettingSecurity = async () => {
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
    throw new Error(err?.message || "Không thể lấy cấu hình hệ thống");
  }
};

export const getSettingIntegration = async () => {
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
    throw new Error(err?.message || "Không thể lấy cấu hình hệ thống");
  }
};

export const updateSetting = async (data: any) => {
  try {
    const response = await api.put<ApiResponse<SystemSetting>>(
      API_ENDPOINTS.setting.admin.update,
      { data }
    );

    const { code, message, result } = response;

    if (code !== 200) {
      throw new Error(message || "Get setting failed");
    }

    return result;
  } catch (err: any) {
    throw new Error(err?.message || "Không thể lấy cấu hình hệ thống");
  }
};

export const rollbackVersion = async (id: number) => {
  try {
    const response = await api.put<ApiResponse<boolean>>(
      API_ENDPOINTS.setting.admin.rollback(id)
    );

    const { code, message, result } = response;

    if (code !== 200) {
      throw new Error(message || "Rollback setting failed");
    }

    return result;
  } catch (err: any) {
    throw new Error(err?.message || "Không thể rollback cấu hình hệ thống");
  }
};

export const deleteVersion = async (id: number) => {
  try {
    const response = await api.delete<ApiResponse<boolean>>(
      API_ENDPOINTS.setting.admin.delete(id)
    );

    const { code, message, result } = response;

    if (code !== 200) {
      throw new Error(message || "Delete setting failed");
    }

    return result;
  } catch (err: any) {
    throw new Error(err?.message || "Không thể xóa cấu hình hệ thống");
  }
};
