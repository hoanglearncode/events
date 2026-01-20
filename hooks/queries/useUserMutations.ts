// hooks/mutations/useUserMutations.ts
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { userService } from "@/services/user.service";
import { USER_QUERY_KEYS } from "@/hooks/queries/userQueries";

interface CreateUserData {
  email: string;
  fullName: string;
  password: string;
  phone?: string;
  role: string;
}

// Create user
export function useCreateUser(options?: {
  onSuccess?: (data: any) => void;
  onError?: (error: any) => void;
}) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateUserData) => userService.createUser(data),
    onSuccess: (data) => {
      console.log(data);
      queryClient.invalidateQueries({ queryKey: USER_QUERY_KEYS.lists() });
      queryClient.invalidateQueries({ queryKey: USER_QUERY_KEYS.stats() });
      options?.onSuccess?.(data);
    },
    onError: options?.onError,
  });
}

// Activate user
export function useActivateUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (userId: string) => userService.activateUser(userId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: USER_QUERY_KEYS.lists() });
      queryClient.invalidateQueries({ queryKey: USER_QUERY_KEYS.stats() });
    },
  });
}

// Deactivate user
export function useDeactivateUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (userId: string) => userService.deactivateUser(userId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: USER_QUERY_KEYS.lists() });
      queryClient.invalidateQueries({ queryKey: USER_QUERY_KEYS.stats() });
    },
  });
}

// Ban user
export function useBanUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (userId: string) => userService.banUser(userId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: USER_QUERY_KEYS.lists() });
      queryClient.invalidateQueries({ queryKey: USER_QUERY_KEYS.stats() });
    },
  });
}

// Unban user
export function useUnbanUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (userId: string) => userService.unbanUser(userId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: USER_QUERY_KEYS.lists() });
      queryClient.invalidateQueries({ queryKey: USER_QUERY_KEYS.stats() });
    },
  });
}

// Delete user
export function useDeleteUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (userId: string) => userService.deleteUser(userId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: USER_QUERY_KEYS.lists() });
      queryClient.invalidateQueries({ queryKey: USER_QUERY_KEYS.stats() });
    },
  });
}

// Reset user password
export function useResetUserPassword() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (userId: string) => userService.resetUserPassword(userId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: USER_QUERY_KEYS.details() });
    },
  });
}

// Update user
export function useUpdateUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      userId,
      data,
    }: {
      userId: string;
      data: Partial<CreateUserData>;
    }) => userService.updateUser(userId, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: USER_QUERY_KEYS.lists() });
      queryClient.invalidateQueries({
        queryKey: USER_QUERY_KEYS.detail(variables.userId),
      });
    },
  });
}
