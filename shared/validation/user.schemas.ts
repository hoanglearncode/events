import Cookies from "js-cookie";
import { ACCESS_TOKEN, REFRESH_TOKEN } from "@/shared/const/cookie";
import { decodeToken } from "@/middleware";
import { JWTPayload } from "@/middleware";

export const validateUser = (
  token?: string
): {
  isValid: boolean;
  payload: any | null;
} => {
  try {
    const accessToken = token || Cookies.get(ACCESS_TOKEN);

    if (!accessToken) {
      return { isValid: false, payload: null };
    }

    const decoded = decodeToken(accessToken);

    if (!decoded || !decoded.exp) {
      return { isValid: false, payload: null };
    }
    const currentTime = Math.floor(Date.now() / 1000);

    const isExpired = decoded.exp < currentTime;

    return {
      isValid: !isExpired,
      payload: {
        role: decoded.role || "user",
        email: decoded.email || "user@gmail.com",
        status: decoded.status,
      },
    };
  } catch (error) {
    console.error("Token validation error:", error);
    return { isValid: false, payload: null };
  }
};

export const getUserFromToken = (token?: string): JWTPayload | null => {
  const result = validateUser(token);
  return result.isValid ? result.payload : null;
};

export const isAuthenticated = (): boolean => {
  const token = Cookies.get(ACCESS_TOKEN);
  if (!token) return false;
  const result = validateUser(token);
  return result.isValid;
};

export const getUserRole = (): string | null => {
  const user = getUserFromToken();
  return user?.role || null;
};

export const clearAuthTokens = () => {
  Cookies.remove(ACCESS_TOKEN);
  Cookies.remove(REFRESH_TOKEN);
};

export const isAdmin = (): boolean => {
  const role = getUserRole();
  return role === "ADMIN";
};

export const isSeller = (): boolean => {
  const role = getUserRole();
  return role === "SELLER";
};

export const isUser = (): boolean => {
  const role = getUserRole();
  return role === "USER";
};
