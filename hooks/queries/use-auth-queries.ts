// hooks/use-auth.ts
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useRouter, useSearchParams } from "next/navigation";
import { AuthService } from "@/services/auth.service";
import { useAuthStore } from "@/store/auth.store";
import {
  ApiErrorResponse,
  extractValidationErrors,
  isValidationError,
} from "@/hooks/shared/use-validation-errors";
import type { LoginResponse } from "@/types/auth";
import type {
  LoginFormData,
  RegisterFormData,
  ForgotPasswordFormData,
  ResetPasswordFormData,
  VerifyEmailFormData,
  ResendVerificationEmailFormData,
} from "@/shared/validation/auth.schemas";
import type { GoogleCallbackParams } from "@/shared/lib/google-auth";
import { HttpStatusCode } from "axios";
import Cookies from "js-cookie";
import {
  ACCESS_TOKEN,
  REFRESH_TOKEN,
  REQUIRE_VERIFY_EMAIL,
  PUSHER_SOCKET_ID,
} from "@/shared/const/cookie";
import { ROUTES } from "@/shared/const/route";
import { computeCookieExpiry, getAccessToken } from "@/shared/lib/utils";
import { HOURS } from "@/shared/const/unit";
import { toast } from "sonner";

// Query keys
export const authQueryKeys = {
  profile: ["auth", "profile"] as const,
  user: (id: number) => ["auth", "user", id] as const,
};

/**
 * Hook để login user
 */
export const useLogin = () => {
  const router = useRouter();
  const queryClient = useQueryClient();
  const searchParams = useSearchParams();

  const redirect = searchParams.get("redirect") || "/website";
  return useMutation({
    mutationFn: async (data: LoginFormData): Promise<LoginResponse> => {
      return AuthService.login(data);
    },
    onSuccess: (response) => {
      window.dispatchEvent(new Event("auth-changed"));
      if (true) {
        Cookies.set(ACCESS_TOKEN, response.result.token, {
          expires: new Date(Date.now() + HOURS),
          path: "/",
          sameSite: "lax",
        });
        Cookies.set(REFRESH_TOKEN, response.result.refreshToken, {
          expires: new Date(Date.now() + HOURS),
          path: "/",
          sameSite: "lax",
        });
      }
      queryClient.clear();
      router.push(redirect);
    },
    onError: (error: any, variables) => {
      // error from apiClient is expected to be { status, message, data }
      const isNeedVerifyEmail =
        error?.status === HttpStatusCode.BadRequest &&
        error?.data?.user_not_verified === true;

      if (isNeedVerifyEmail) {
        Cookies.set(REQUIRE_VERIFY_EMAIL, (variables as any).email);
        // push to verify page
        router.push("/login/verify");
        return;
      }

      // Validation errors (422)
      if (isValidationError(error)) {
        const validationErrors = extractValidationErrors(
          error as ApiErrorResponse
        );

        Object.entries(validationErrors).forEach(([field, errors]) => {
          console.error(`${field}: ${errors.join(", ")}`);
        });
      }

      // Other errors: log or rethrow as needed
      console.error("Login error:", error?.message || error);
    },
  });
};

/**
 * Hook để register user
 */
export const useRegister = () => {
  const router = useRouter();
  const loginMutation = useLogin();

  return useMutation({
    mutationFn: (data: RegisterFormData) => AuthService.register(data),

    onSuccess: (_, variables) => {
      Cookies.set(REQUIRE_VERIFY_EMAIL, variables.email);
      loginMutation.mutateAsync(variables);
      router.push(
        `/login/verify?email=${encodeURIComponent(btoa(variables.email))}`
      );
    },
    onError: (error) => {
      console.error("Registration error:", error);
    },
  });
};

/**
 * Hook để Google OAuth login
 */
export const useGoogleLogin = () => {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { setUser } = useAuthStore();

  return useMutation({
    mutationFn: async (params: GoogleCallbackParams) => {
      return AuthService.googleLogin(params);
    },
    onSuccess: (data: any) => {
      // Nếu backend trả token object
      if (data?.access_token && data?.refresh_token) {
        Cookies.set(ACCESS_TOKEN, data.access_token.token, {
          expires: computeCookieExpiry(data.access_token.expired_at),
          path: "/",
          sameSite: "lax",
        });
        Cookies.set(REFRESH_TOKEN, data.refresh_token.token, {
          expires: computeCookieExpiry(data.refresh_token.expired_at),
          path: "/",
          sameSite: "lax",
        });
      }

      if (data?.user) {
        setUser(data.user);
      }

      queryClient.clear();
      router.push(ROUTES.HOME);
    },
    onError: (error) => {
      console.error("Google login error:", error);
      router.push(ROUTES.LOGIN);
    },
  });
};

/**
 * Hook để logout user
 */
export const useLogout = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (): Promise<void> => {
      return AuthService.logout();
    },
    onSuccess: () => {
      queryClient.clear();
    },
    onError: (error) => {
      console.warn("Complete logout failed:", error);
      queryClient.clear();
      AuthService.clearAllAuthData();
      if (typeof window !== "undefined") {
        window.location.href = "/login";
      }
    },
  });
};

/**
 * Hook để lấy user profile
 */
export const useProfile = () => {
  const { user } = useAuthStore();

  return useQuery({
    queryKey: authQueryKeys.profile,
    queryFn: () => AuthService.getProfile(),
    enabled: !!getAccessToken() && !user,
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: (failureCount, error: any) => {
      if (error?.status === 401) return false;
      return failureCount < 3;
    },
  });
};

/**
 * Hook để forgot password
 */
export const useForgotPassword = () => {
  return useMutation({
    mutationFn: async (data: ForgotPasswordFormData): Promise<void> => {
      return AuthService.forgotPassword(data);
    },
    onError: (error) => {
      console.error("Forgot password error:", error);
    },
  });
};

/**
 * Hook để reset password
 */
export const useResetPassword = () => {
  const router = useRouter();

  return useMutation({
    mutationFn: async (data: ResetPasswordFormData): Promise<void> => {
      return AuthService.resetPassword(data);
    },
    onSuccess: () => {
      router.push(ROUTES.LOGIN);
    },
    onError: (error) => {
      console.error("Reset password error:", error);
    },
  });
};

/**
 * Hook để verify email
 */
export const useVerifyEmail = () => {
  const router = useRouter();

  return useMutation({
    mutationFn: async (
      data: VerifyEmailFormData
    ): Promise<{ message: string }> => {
      return AuthService.verifyEmail(data);
    },
    onSuccess: () => {
      router.replace(ROUTES.HOME);
      Cookies.remove(REQUIRE_VERIFY_EMAIL);
    },
    onError: (error) => {
      console.error("Email verification error:", error);
    },
  });
};

/**
 * Hook để resend verification email
 */
export const useResendVerificationEmail = () => {
  return useMutation({
    mutationFn: async (
      data: ResendVerificationEmailFormData
    ): Promise<{ message: string }> => {
      return AuthService.resendVerificationEmail(data.email);
    },
    onError: (error) => {
      console.error("Resend verification email error:", error);
    },
  });
};
