"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import { ACCESS_TOKEN, REFRESH_TOKEN } from "@/shared/const/cookie";
import { HOURS } from "@/shared/const/unit";

export default function GoogleCallbackPage() {
  const router = useRouter();

  useEffect(() => {
    // Lấy phần hash sau dấu #
    const hash = window.location.hash.substring(1);
    if (!hash) {
      router.replace("/login");
      return;
    }

    // Parse hash thành object
    const params = new URLSearchParams(hash);

    const accessToken = params.get("accessToken");
    const refreshToken = params.get("refreshToken");

    if (!accessToken || !refreshToken) {
      router.replace("/login");
      return;
    }

    Cookies.set(ACCESS_TOKEN, accessToken, {
      expires: new Date(Date.now() + HOURS),
      path: "/",
      sameSite: "lax",
    });
    Cookies.set(REFRESH_TOKEN, refreshToken, {
      expires: new Date(Date.now() + HOURS),
      path: "/",
      sameSite: "lax",
    });

    // (Tuỳ chọn) lưu thêm timestamp
    localStorage.setItem("loginAt", Date.now().toString());

    // ✅ Điều hướng về trang chủ
    router.replace("/website");
  }, [router]);

  return (
    <div className="flex min-h-screen items-center justify-center">
      <p className="text-sm text-muted-foreground">
        Đang đăng nhập bằng Google...
      </p>
    </div>
  );
}
