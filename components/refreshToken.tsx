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
    const scheduleRefresh = () => {
      const accessToken = Cookies.get(ACCESS_TOKEN);
      const refreshToken = Cookies.get(REFRESH_TOKEN);

      if (!accessToken || !refreshToken) return;

      const expireAt = getTokenExpireTime(accessToken);
      if (!expireAt) return;

      const delay = expireAt - Date.now() - 5000; // ⏱ còn 5s

      if (delay <= 0) {
        refreshNow();
        return;
      }

      timeoutRef.current = setTimeout(refreshNow, delay);
    };

    const refreshNow = async () => {
      if (isRefreshing.current) return;

      try {
        isRefreshing.current = true;

        const apiUrl = process.env.NEXT_PUBLIC_API_URL;
        const accessToken = Cookies.get(ACCESS_TOKEN);
        const refreshToken = Cookies.get(REFRESH_TOKEN);

        if (!refreshToken) return;

        const res = await fetch(`${apiUrl}/api/auth/refresh`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
          body: JSON.stringify({ token: refreshToken }),
        });

        const data = await res.json();

        Cookies.set(ACCESS_TOKEN, data.result.token, {
          secure: true,
          sameSite: "lax",
          expires: 1 / 96,
        });

        Cookies.set(REFRESH_TOKEN, data.result.refreshToken, {
          secure: true,
          sameSite: "lax",
          expires: 7,
        });

        console.log("[AUTO REFRESH TOKEN]", new Date().toISOString());

        // 🔁 lập lịch lại theo token mới
        scheduleRefresh();
      } catch (err) {
        console.error("[AUTO REFRESH TOKEN ERROR]", err);
      } finally {
        isRefreshing.current = false;
      }
    };

    scheduleRefresh();

    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  return null;
}
