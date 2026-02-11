// apiClient.ts
import axios, {
  AxiosInstance,
  AxiosError,
  AxiosResponse,
  InternalAxiosRequestConfig,
  AxiosRequestConfig,
  AxiosHeaders,
  AxiosProgressEvent,
} from "axios";

import {
  API_CONFIG,
  ERROR_MESSAGES,
  RETRYABLE_STATUS_CODES,
  CONTENT_TYPES,
  API_ENDPOINTS,
} from "@/shared/const/api"; // chỉnh path nếu cần

// ---------- Types for auth handlers ----------
export type AuthHandlers = {
  // Trả về access token hiện tại (có thể sync hoặc async)
  getAccessToken: () => string | null | Promise<string | null>;

  // Tuỳ chọn: lưu access token (ví dụ vào cookies / localStorage)
  setAccessToken?: (token: string | null) => void | Promise<void>;

  // Tuỳ chọn: hàm refresh token (nếu không cung cấp sẽ sử dụng endpoint mặc định)
  // Trả về object có accessToken field
  refreshAccessToken?: () => Promise<{ accessToken: string }>;

  // Tuỳ chọn: gọi khi cần logout (refresh thất bại)
  onLogout?: () => void;
};

let authHandlers: Partial<AuthHandlers> = {};

// Hàm để đăng ký handlers
export const setAuthHandlers = (handlers: AuthHandlers) => {
  authHandlers = handlers;
};

// ---------- Axios instance ----------
const apiClient: AxiosInstance = axios.create({
  baseURL: API_CONFIG.BASE_URL,
  timeout: API_CONFIG.TIMEOUT,
  withCredentials: true,
  headers: {
    "Content-Type": CONTENT_TYPES.JSON,
  },
});

// ---------- Helpers ----------
const delay = (ms: number) => new Promise((r) => setTimeout(r, ms));

let isRefreshing = false;

type FailedRequestQueueItem = {
  resolve: (token: string) => void;
  reject: (error: any) => void;
};

let failedQueue: FailedRequestQueueItem[] = [];

const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach((p) => {
    if (error) {
      p.reject(error);
    } else if (token) {
      p.resolve(token);
    }
  });
  failedQueue = [];
};

const defaultRefreshToken = async (): Promise<{ accessToken: string }> => {
  const res = await axios.post(
    API_ENDPOINTS.AUTH.REFRESH,
    {},
    {
      baseURL: API_CONFIG.BASE_URL,
      withCredentials: true,
      headers: { "Content-Type": CONTENT_TYPES.JSON },
    }
  );
  return res.data;
};

const safeGetAccessToken = async (): Promise<string | null> => {
  if (!authHandlers.getAccessToken) return null;
  try {
    const t = authHandlers.getAccessToken();
    return t instanceof Promise ? await t : t;
  } catch {
    return null;
  }
};

const safeSetAccessToken = async (token: string | null) => {
  if (!authHandlers.setAccessToken) return;
  try {
    const r = authHandlers.setAccessToken(token);
    if (r instanceof Promise) await r;
  } catch {
    // ignore
  }
};

const safeRefreshAccessToken = async (): Promise<{ accessToken: string }> => {
  if (authHandlers.refreshAccessToken) {
    return authHandlers.refreshAccessToken();
  }
  return defaultRefreshToken();
};

const safeOnLogout = () => {
  if (authHandlers.onLogout) {
    try {
      authHandlers.onLogout();
    } catch {
      // ignore
    }
  }
};

// ---------- Request interceptor: attach token ----------
apiClient.interceptors.request.use(
  async (config: InternalAxiosRequestConfig) => {
    const token = await safeGetAccessToken();
    if (token) {
      if (config.headers instanceof AxiosHeaders) {
        config.headers.set("Authorization", `Bearer ${token}`);
      } else {
        config.headers = new AxiosHeaders(config.headers ?? {});
        config.headers.set("Authorization", `Bearer ${token}`);
      }
    }
    if (config.data instanceof FormData) {
      // Xoá Content-Type để browser tự set boundary
      config.headers.delete("Content-Type");
    } else {
      // Mặc định JSON cho request thường
      if (!config.headers.has("Content-Type")) {
        config.headers.set("Content-Type", CONTENT_TYPES.JSON);
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// ---------- Response interceptor: handle refresh & retries ----------
apiClient.interceptors.response.use(
  (response: AxiosResponse) => {
    return response.data;
  },
  async (error: AxiosError) => {
    const originalRequest = (error.config ||
      {}) as InternalAxiosRequestConfig & {
      _retry?: boolean;
      retries?: number;
    };
    if (!error.response) {
      return Promise.reject({
        message: ERROR_MESSAGES.NETWORK_ERROR,
      });
    }

    const status = error.response.status;
    if (status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      // Nếu đang refresh → đưa request vào hàng đợi
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({
            resolve: (token: string) => {
              if (originalRequest.headers instanceof AxiosHeaders) {
                originalRequest.headers.set("Authorization", `Bearer ${token}`);
              } else {
                originalRequest.headers = new AxiosHeaders(
                  originalRequest.headers ?? {}
                );
                originalRequest.headers.set("Authorization", `Bearer ${token}`);
              }
              resolve(apiClient(originalRequest));
            },
            reject,
          });
        });
      }

      isRefreshing = true;

      try {
        const refreshResult = await safeRefreshAccessToken();
        const newToken = refreshResult?.accessToken;

        if (!newToken) {
          throw new Error("No access token from refresh");
        }

        await safeSetAccessToken(newToken);
        processQueue(null, newToken);

        if (originalRequest.headers instanceof AxiosHeaders) {
          originalRequest.headers.set("Authorization", `Bearer ${newToken}`);
        } else {
          originalRequest.headers = new AxiosHeaders(
            originalRequest.headers ?? {}
          );
          originalRequest.headers.set("Authorization", `Bearer ${newToken}`);
        }

        return apiClient(originalRequest);
      } catch (refreshError) {
        processQueue(refreshError, null);
        safeOnLogout();

        return Promise.reject({
          status,
          message: ERROR_MESSAGES.TOKEN_EXPIRED,
          data: error.response?.data,
        });
      } finally {
        isRefreshing = false;
      }
    }

    if (
      RETRYABLE_STATUS_CODES.includes(status as any) &&
      (originalRequest.retries ?? 0) < (API_CONFIG.RETRIES ?? 0)
    ) {
      originalRequest.retries = (originalRequest.retries ?? 0) + 1;
      await delay(API_CONFIG.RETRY_DELAY ?? 0);
      return apiClient(originalRequest);
    }

    // Mặc định: trả lỗi có cấu trúc
    const errorMessage =
      (error.response?.data && (error.response.data as any).message) ||
      error.message ||
      ERROR_MESSAGES.GENERIC_ERROR;

    console.error("API Error:", {
      status,
      message: errorMessage,
      url: originalRequest?.url,
    });

    return Promise.reject({
      status,
      message: errorMessage,
      data: error.response?.data,
    });
  }
);

// ---------- Thin wrapper API ----------
export const api = {
  get: <T = any>(url: string, config?: AxiosRequestConfig): Promise<T> =>
    apiClient.get<T, T>(url, config),

  post: <T = any>(
    url: string,
    data?: any,
    config?: InternalAxiosRequestConfig
  ) => apiClient.post<T>(url, data, config as any) as Promise<T>,

  put: <T = any>(
    url: string,
    data?: any,
    config?: InternalAxiosRequestConfig
  ) => apiClient.put<T>(url, data, config as any) as Promise<T>,

  patch: <T = any>(
    url: string,
    data?: any,
    config?: InternalAxiosRequestConfig
  ) => apiClient.patch<T>(url, data, config as any) as Promise<T>,

  delete: <T = any>(url: string, config?: InternalAxiosRequestConfig) =>
    apiClient.delete<T>(url, config as any) as Promise<T>,

  uploadFile: <T = any>(
    url: string,
    file: File,
    onUploadProgress?: (e: AxiosProgressEvent) => void
  ) => {
    const formData = new FormData();
    formData.append("file", file);

    return apiClient.post<T>(url, formData, {
      headers: new AxiosHeaders({ "Content-Type": CONTENT_TYPES.FORM_DATA }),
      onUploadProgress,
    } as InternalAxiosRequestConfig) as Promise<T>;
  },
};

export default apiClient;
