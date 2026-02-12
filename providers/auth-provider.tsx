"use client";

import { useEffect } from "react";
import Cookies from "js-cookie";
import { useAuthStore } from "@/store/auth.store";
import { setAuthHandlers } from "@/services/apiClient";
import type { JWTToken, User } from "@/types/auth";
import { ACCESS_TOKEN, REFRESH_TOKEN } from "@/shared/const/cookie";
import { computeCookieExpiry } from "@/shared/lib/utils";
import { API_ENDPOINTS, API_CONFIG } from "@/shared/const/api";
import RefreshTokenProvider from "@/components/refreshToken";
import axios from "axios";

interface AuthProviderProps {
  children: React.ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const { user, setUser, clearAuth } = useAuthStore();
  const { data: profile } = { data: null };

  useEffect(() => {
    // const refreshToken = async () => {
    //   try {
    //     const token =  Cookies.get(REFRESH_TOKEN)
    //     if(!!token) {
    //       const newToken = await AuthService.refreshToken(token);
    //       Cookies.set(ACCESS_TOKEN, newToken);
    //     }
    //   } catch (error) {
    //   }
    // };
    // // Refresh ngay lập tức
    // refreshToken();
    // // Sau đó refresh mỗi 30 phút
    // const intervalId = setInterval(refreshToken, 1 * 1000); // 30 phút
    // // Cleanup khi component unmount
    // return () => {
    //   clearInterval(intervalId);
    // };
  }, []);

  useEffect(() => {
    setAuthHandlers({
      /** ===== Attach token to request ===== */
      getAccessToken: () => {
        return Cookies.get(ACCESS_TOKEN) ?? null;
      },

      /** ===== Persist new access token ===== */
      setAccessToken: (token: string | null) => {
        if (!token) {
          Cookies.remove(ACCESS_TOKEN);
          return;
        }

        // Nếu backend không trả expired_at cho access token
        // ta có thể set tạm (ví dụ 15 phút)
        Cookies.set(ACCESS_TOKEN, token, {
          expires: 1 / 96, // ~15 phút
          path: "/",
          sameSite: "lax",
        });
      },

      /** ===== Refresh token flow ===== */
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

        /**
         * Giả định backend trả:
         * {
         *   accessToken: { token, expired_at },
         *   refreshToken: { token, expired_at }
         * }
         */
        const {
          accessToken,
          refreshToken: newRefreshToken,
        }: {
          accessToken: JWTToken;
          refreshToken: JWTToken;
        } = res.data;

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

      /** ===== Logout handler ===== */
      onLogout: () => {
        Cookies.remove(ACCESS_TOKEN);
        Cookies.remove(REFRESH_TOKEN);
        clearAuth();
      },
    });
  }, [clearAuth]);

  /**
   * Hydrate user from profile query
   */
  useEffect(() => {
    if (profile && !user) {
      setUser(profile as User);
    }
  }, [profile, user, setUser]);

  return (
    <>
      <RefreshTokenProvider />
      {children}
    </>
  );
}
