import { api } from "@/services/apiClient";
import { API_ENDPOINTS } from "@/shared/const/api";

interface GetUsersParams {
  page?: number;
  search?: string;
  status?: string;
  role?: string;
  limit?: number;
}

interface CreateUserData {
  email: string;
  fullName: string;
  password: string;
  phone?: string;
  role: string;
}

export const userService = {
  getUsers: async (params: GetUsersParams = {}) => {
    const { page = 1, limit = 10, ...filters } = params;

    const response = await api.get(API_ENDPOINTS.ADMIN.USERS.LIST, {
      params: {
        page,
        limit,
        ...filters,
      },
    });

    return response;
  },

  getUsersStats: async () => {
    const response = await api.get(API_ENDPOINTS.ADMIN.USERS.STATS);
    return response.result;
  },

  getUserDetail: async (userId: string) => {
    const response = await api.get(API_ENDPOINTS.ADMIN.USERS.DETAIL(userId));
    return response.data;
  },

  createUser: async (data: CreateUserData) => {
    const response = await api.post(API_ENDPOINTS.ADMIN.USERS.CREATE, data);
    return response.result;
  },

  activateUser: async (userId: string) => {
    const response = await api.patch(
      API_ENDPOINTS.ADMIN.USERS.ACTIVATE(userId)
    );
    return response.data;
  },

  deactivateUser: async (userId: string) => {
    const response = await api.patch(
      API_ENDPOINTS.ADMIN.USERS.DEACTIVATE(userId)
    );
    return response.data;
  },

  banUser: async (userId: string) => {
    const response = await api.put(API_ENDPOINTS.ADMIN.USERS.BAN(userId));
  },

  unbanUser: async (userId: string) => {
    const response = await api.patch(API_ENDPOINTS.ADMIN.USERS.UNBAN(userId));
    return response.data;
  },

  deleteUser: async (userId: string) => {
    const response = await api.put(API_ENDPOINTS.ADMIN.USERS.DELETE(userId));
    return response.data;
  },

  resetUserPassword: async (userId: string) => {
    const response = await api.put(
      API_ENDPOINTS.ADMIN.USERS.RESET_PASSWORD(userId)
    );
    return response.data;
  },

  updateUser: async (userId: string, data: Partial<CreateUserData>) => {
    const response = await api.patch(
      API_ENDPOINTS.ADMIN.USERS.UPDATE(userId),
      data
    );
    return response.data;
  },

  exportUsers: async (params: GetUsersParams = {}) => {
    const response = await api.get(API_ENDPOINTS.ADMIN.USERS.EXPORT, {
      params,
      responseType: "blob",
    });
    return response.data;
  },

  bulkActivate: async (userIds: string[]) => {
    const response = await api.post(API_ENDPOINTS.ADMIN.USERS.BULK.ACTIVATE, {
      userIds,
    });
    return response.data;
  },

  bulkDeactivate: async (userIds: string[]) => {
    const response = await api.post(API_ENDPOINTS.ADMIN.USERS.BULK.DEACTIVATE, {
      userIds,
    });
    return response.data;
  },

  bulkDelete: async (userIds: string[]) => {
    const response = await api.post(API_ENDPOINTS.ADMIN.USERS.BULK.DELETE, {
      userIds,
    });
    return response.data;
  },
};
