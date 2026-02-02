import { useCallback, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  useLogin,
  useLogout,
  useProfile,
} from "@/hooks/queries/use-auth-queries";
import { useAuthStore } from "@/store/auth.store";
import { ROUTES } from "@/shared/const/route";
import type { LoginFormData } from "@/shared/validation/auth.schemas";
import { getAccessToken } from "@/shared/lib/utils";

export function useAuth() {
  const { user: storeUser } = useAuthStore();
  const loginMutation = useLogin();
  const logoutMutation = useLogout();
  const {
    data: profileData,
    isLoading: isLoadingProfile,
    refetch: refetchProfile,
  } = useProfile();

  // Derived state
  const user = storeUser || profileData || null;

  // Check if user is authenticated based on token in cookie and user data
  const isAuthenticated = !!getAccessToken() && !!user;

  // Login function
  const login = useCallback(
    async (credentials: LoginFormData) => {
      try {
        await loginMutation.mutateAsync(credentials);

        return { success: true };
      } catch (error: any) {
        return {
          success: false,
          error: "Đăng nhập thất bại! Vui lòng kiểm tra lại thông tin.",
        };
      }
    },
    [loginMutation]
  );

  // Logout function
  const logout = useCallback(async () => {
    try {
      // Call logout API through TanStack Query
      await logoutMutation.mutateAsync();
    } catch (error) {
      // Even if API fails, clear local auth
      console.warn("Logout API failed:", error);
      // TanStack Query hook handles the cleanup
    }
  }, [logoutMutation]);

  // Keep profile fresh when token exists but user missing
  useEffect(() => {
    if (getAccessToken() && !user && !isLoadingProfile) {
      refetchProfile();
    }
  }, [user, isLoadingProfile, refetchProfile]);

  return {
    // State
    user,
    isAuthenticated,
    isLoggingIn: loginMutation.isPending,
    loginError: loginMutation.error,
    isLoggingOut: logoutMutation.isPending,
    isLoadingProfile,
    // Actions
    login,
    logout,
    refetchProfile,
  };
}
