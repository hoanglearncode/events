"use client";

import { useEffect, useRef } from "react";
import Cookies from "js-cookie";
import { useAuthStore } from "@/store/auth.store";
import { setAuthHandlers } from "@/services/apiClient";
import type { JWTToken } from "@/types/auth";
import { ACCESS_TOKEN, REFRESH_TOKEN } from "@/shared/const/cookie";
import { computeCookieExpiry } from "@/shared/lib/utils";
import { API_ENDPOINTS, API_CONFIG } from "@/shared/const/api";
import RefreshTokenProvider from "@/components/refreshToken";
import axios from "axios";
import { useProfileDetails } from "@/hooks/queries/profileQueries";
import { useRouter, usePathname } from "next/navigation";

interface AuthProviderProps {
  children: React.ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const { setUser, clearAuth } = useAuthStore();
  const { data: user, isError } = useProfileDetails();

  const router = useRouter();
  const pathname = usePathname();

  /** ===== Remember previous token state ===== */
  const hadTokenRef = useRef<boolean>(
    Boolean(Cookies.get(ACCESS_TOKEN))
  );

  /* ================== API AUTH HANDLERS ================== */
  useEffect(() => {
    setAuthHandlers({
      getAccessToken: () => Cookies.get(ACCESS_TOKEN) ?? null,

      setAccessToken: (token: string | null) => {
        if (!token) {
          Cookies.remove(ACCESS_TOKEN);
          return;
        }

        Cookies.set(ACCESS_TOKEN, token, {
          expires: 1 / 96,
          path: "/",
          sameSite: "lax",
        });
      },

      refreshAccessToken: async () => {
        const refreshToken = Cookies.get(REFRESH_TOKEN);
        if (!refreshToken) {
          throw new Error("No refresh token");
        }

        const res = await axios.post(
          API_ENDPOINTS.AUTH.REFRESH,
          {},
          {
            baseURL: API_CONFIG.BASE_URL,
            withCredentials: true,
          }
        );

        const { accessToken, refreshToken: newRefreshToken } = res.data;

        Cookies.set(ACCESS_TOKEN, accessToken.token, {
          expires: computeCookieExpiry(accessToken.expired_at),
          path: "/",
          sameSite: "lax",
        });

        Cookies.set(REFRESH_TOKEN, newRefreshToken.token, {
          expires: computeCookieExpiry(newRefreshToken.expired_at),
          path: "/",
          sameSite: "lax",
        });

        return { accessToken: accessToken.token };
      },

      onLogout: () => {
        Cookies.remove(ACCESS_TOKEN);
        Cookies.remove(REFRESH_TOKEN);
        clearAuth();
      },
    });
  }, [clearAuth]);

  /* ================== SYNC USER ================== */
  useEffect(() => {
    if (user) {
      setUser(user);
    }
  }, [user, setUser]);

  /* ================== FORCE PASSWORD FLOW ================== */
  useEffect(() => {
    if (!user) return;

    if (user.mustChangePassword && pathname !== "/change-password") {
      router.replace("/change-password");
    }
  }, [user, pathname, router]);

  /* ================== TOKEN WATCHER ================== */
  useEffect(() => {
    const checkToken = () => {
      const hasToken = Boolean(Cookies.get(ACCESS_TOKEN));

      // token vừa biến mất
      if (hadTokenRef.current && !hasToken) {
        clearAuth();
      }

      hadTokenRef.current = hasToken;
    };

    // check ngay khi mount
    checkToken();

    // poll mỗi 2s (nhẹ, an toàn)
    const interval = setInterval(checkToken, 2000);

    return () => clearInterval(interval);
  }, [clearAuth]);

  /* ================== PROFILE 401 SAFETY ================== */
  useEffect(() => {
    if (isError) {
      clearAuth();
    }
  }, [isError, clearAuth]);

  return (
    <>
      <RefreshTokenProvider />
      {children}
    </>
  );
}