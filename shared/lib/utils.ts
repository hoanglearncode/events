import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import Cookies from "js-cookie";
import { ACCESS_TOKEN } from "../const/cookie";
import { decodeToken } from "@/middleware";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getAccessToken() {
  return Cookies.get(ACCESS_TOKEN);
}

/**
 * Lấy userId từ JWT token trong cookie
 * @returns userId hoặc null nếu không tìm thấy
 */
export function getUserIdFromToken(): string | null {
  const token = getAccessToken();
  console.log("[getUserIdFromToken] token exists:", !!token);
  if (!token) {
    console.warn("[getUserIdFromToken] No access token found in cookie");
    return null;
  }

  const decoded = decodeToken(token);
  console.log("[getUserIdFromToken] decoded token:", decoded);
  const userId = decoded?.userId || null;
  console.log("[getUserIdFromToken] extracted userId:", userId);
  return userId;
}

export function computeCookieExpiry(
  expiredAt?: string | number
): Date | undefined {
  const now = Date.now();
  if (
    typeof expiredAt === "number" ||
    (typeof expiredAt === "string" && /^\d+$/.test(expiredAt))
  ) {
    const minutes =
      typeof expiredAt === "number" ? expiredAt : parseInt(expiredAt, 10);
    const ms = minutes * 60 * 1000;
    return new Date(now + ms);
  }

  if (typeof expiredAt === "string") {
    const parsed = new Date(expiredAt);
    if (!Number.isNaN(parsed.getTime())) {
      return parsed;
    }
  }

  // Fallback 30 days
  const thirtyDaysMs = 30 * 24 * 60 * 60 * 1000;
  return new Date(now + thirtyDaysMs);
}
