import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import Cookies from "js-cookie";
const ACCESS_TOKEN = "access_token";
const REFRESH_TOKEN = "refresh_token";
const REQUIRE_VERIFY_EMAIL = "require_verify_email";

const PROTECTED_ROUTES = ["/admin", "/user"];
const AUTH_ROUTES = ["/login", "/register", "/forgot-password"];
const TOKEN_REQUIRED_ROUTES = ["/login/verify", "/change-password"];

interface JWTPayload {
  userId: string;
  email: string;
  role: string;
  exp: number;
  iat: number;
  status?: string;
}

export function decodeToken(token: string): JWTPayload | null {
  try {
    const parts = token.split(".");
    if (parts.length !== 3) return null;

    const payload = JSON.parse(
      Buffer.from(parts[1], "base64").toString("utf-8")
    );

    return {
      userId: payload.userId || payload.sub,
      email: payload.email || payload.sub,
      role: payload.role || payload.scope || "user",
      exp: payload.exp,
      iat: payload.iat,
      status: payload.status,
    };
  } catch (error) {
    console.error("Token decode error:", error);
    return null;
  }
}

export function isTokenExpired(exp: number): boolean {
  return Date.now() >= exp * 1000;
}

function getDashboardByRole(role: string): string {
  const roleMap: Record<string, string> = {
    ROLE_ADMIN: "/admin",
    ROLE_USER: "/website",
    admin: "/admin",
    user: "/website",
  };
  return roleMap[role] || "/website";
}

async function refreshAccessToken(
  refreshToken: string,
  accessToken: string,
): Promise<{ accessToken: string; refreshToken: string } | null> {
  try {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL;
    
    const response = await fetch(`${apiUrl}/api/auth/refresh`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${accessToken}`
      },
      body: JSON.stringify({ token: refreshToken }),
    });

    if (!response.ok) {
      return null;
    }

    const data = await response.json();
    return {
      accessToken: data.accessToken || data.access_token,
      refreshToken: data.refreshToken || data.refresh_token || refreshToken,
    };
  } catch (error) {
    return null;
  }
}

function clearAuthCookies(response: NextResponse): void {
  response.cookies.delete(ACCESS_TOKEN);
  response.cookies.delete(REFRESH_TOKEN);
  response.cookies.delete(REQUIRE_VERIFY_EMAIL);
}

function setAuthCookies(
  accessToken: string,
  refreshToken: string
): void {
  const isProduction = process.env.NODE_ENV === "production";
  
  Cookies.set(ACCESS_TOKEN, accessToken, {
    httpOnly: true,
    secure: isProduction,
    sameSite: "lax",
    maxAge: 60 * 15, // 15 minutes
    path: "/",
  });

  // Refresh token - longer lived (7 days typical)
  Cookies.set(REFRESH_TOKEN, refreshToken, {
    httpOnly: true,
    secure: isProduction,
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 7, // 7 days
    path: "/",
  });
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  const accessToken = request.cookies.get(ACCESS_TOKEN)?.value;
  const refreshToken = request.cookies.get(REFRESH_TOKEN)?.value;
  const emailValidate = request.cookies.get(REQUIRE_VERIFY_EMAIL)?.value;

  let decodedToken: JWTPayload | null = null;
  let userRole = "user";
  let isAuthenticated = false;

  if (accessToken) {
    decodedToken = decodeToken(accessToken);
    
    if (decodedToken) {
      if (isTokenExpired(decodedToken.exp)) {
        if (refreshToken) {
          const newTokens = await refreshAccessToken(refreshToken, accessToken);
          
          if (newTokens) {
            decodedToken = decodeToken(newTokens.accessToken);
            isAuthenticated = true;
            userRole = decodedToken?.role || "user";
            
            const response = NextResponse.next();
            setAuthCookies(newTokens.accessToken, newTokens.refreshToken);
            return response;
          } else {
            const response = NextResponse.redirect(new URL("/login", request.url));
            clearAuthCookies(response);
            return response;
          }
        }
      } else {
        isAuthenticated = true;
        userRole = decodedToken.role;
      }
    }
  }

  if (PROTECTED_ROUTES.some((route) => pathname.startsWith(route))) {
    if (!isAuthenticated) {
      const url = request.nextUrl.clone();
      url.pathname = "/login";
      url.searchParams.set("redirect", pathname);
      return NextResponse.redirect(url);
    }

    if (emailValidate && decodedToken?.status !== "VERIFIED") {
      const url = new URL("/login/verify", request.url);
      url.searchParams.set("email", btoa(emailValidate));
      return NextResponse.redirect(url);
    }

    if (pathname.startsWith("/admin") && userRole !== "ROLE_ADMIN") {
      return NextResponse.json(
        { error: "Forbidden: Admin access required" },
        { status: 403 }
      );
    }

    if (
      pathname.startsWith("/seller") &&
      !["ROLE_SELLER", "ROLE_ADMIN"].includes(userRole)
    ) {
      return NextResponse.json(
        { error: "Forbidden: Seller access required" },
        { status: 403 }
      );
    }

    return NextResponse.next();
  }

  if (AUTH_ROUTES.includes(pathname)) {
    if (isAuthenticated) {
      const dashboardUrl = getDashboardByRole(userRole);
      return NextResponse.redirect(new URL(dashboardUrl, request.url));
    }
    return NextResponse.next();
  }

  if (TOKEN_REQUIRED_ROUTES.some((route) => pathname.startsWith(route))) {
    if (!isAuthenticated) {
      const url = request.nextUrl.clone();
      url.pathname = "/login";
      url.searchParams.set("redirect", pathname);
      return NextResponse.redirect(url);
    }
    return NextResponse.next();
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico)$).*)",
  ],
};