"use client";

import { useEffect, useRef } from "react";
import Cookies from "js-cookie";
import { ACCESS_TOKEN, REFRESH_TOKEN } from "@/shared/const/cookie";

function getTokenExpireTime(token?: string): number | null {
  if (!token) return null;
  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    return payload.exp * 1000; // ms
  } catch {
    return null;
  }
}

export default function RefreshTokenProvider() {
  const isRefreshing = useRef(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL;

    const clearSchedule = () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
    };

    const clearAuth = () => {
      clearSchedule();
      Cookies.remove(ACCESS_TOKEN);
      Cookies.remove(REFRESH_TOKEN);
    };

    const refreshNow = async () => {
      if (isRefreshing.current) return;

      const refreshToken = Cookies.get(REFRESH_TOKEN);
      if (!refreshToken) return;

      try {
        isRefreshing.current = true;

        const res = await fetch(`${apiUrl}/api/auth/refresh`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ token: refreshToken }),
        });

        if (!res.ok) {
          clearAuth();
          return;
        }

        const data = await res.json();

        if (!data?.result?.token || !data?.result?.refreshToken) {
          clearAuth();
          return;
        }

        Cookies.set(ACCESS_TOKEN, data.result.token, {
          secure: true,
          sameSite: "lax",
          expires: 1 / 96, // ~15 phút
          path: "/",
        });

        Cookies.set(REFRESH_TOKEN, data.result.refreshToken, {
          secure: true,
          sameSite: "lax",
          expires: 7,
          path: "/",
        });

        scheduleRefresh();
      } catch (err) {
        console.error("[AUTO REFRESH TOKEN ERROR]", err);
        clearAuth();
      } finally {
        isRefreshing.current = false;
      }
    };

    const scheduleRefresh = () => {
      clearSchedule();

      const accessToken = Cookies.get(ACCESS_TOKEN);
      const refreshToken = Cookies.get(REFRESH_TOKEN);

      if (!accessToken || !refreshToken) return;

      const expireAt = getTokenExpireTime(accessToken);
      if (!expireAt) return;

      const delay = expireAt - Date.now() - 5000;

      if (delay <= 0) {
        refreshNow();
        return;
      }

      timeoutRef.current = setTimeout(refreshNow, delay);
    };

    const onAuthChanged = () => {
      scheduleRefresh();
    };

    window.addEventListener("auth-changed", onAuthChanged);

    scheduleRefresh();

    return () => {
      window.removeEventListener("auth-changed", onAuthChanged);
      clearSchedule();
    };
  }, []);

  return null;
}
