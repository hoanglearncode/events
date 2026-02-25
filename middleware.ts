// middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { verifyToken } from "@/lib/auth";
import { ALLOWED_REGISTER } from "./shared/const/cookie";

// ─── Config tập trung ────────────────────────────────────────────────────────

const ACCESS_TOKEN = "access_token";
const REQUIRE_VERIFY_EMAIL = "require_verify_email";

/**
 * protected: yêu cầu đăng nhập + đúng role
 * authOnly:  chỉ truy cập khi CHƯA đăng nhập (login, register...)
 * tokenRequired: cần đăng nhập, không cần role cụ thể
 */
const ROUTE_CONFIG = {
  protected: {
    "/admin": ["ROLE_ADMIN"],
  },
  authOnly: ["/login", "/register", "/forgot-password"],
  tokenRequired: ["/change-password", "/profile", "/my-data", "/notification"],
} as const;

const ROLE_DASHBOARD: Record<string, string> = {
  ROLE_ADMIN: "/admin",
  ROLE_USER: "/website",
};

// ─── Helpers ─────────────────────────────────────────────────────────────────

function redirectTo(url: string, request: NextRequest) {
  return NextResponse.redirect(new URL(url, request.url));
}

/** Chỉ cho phép redirect nội bộ, chặn open redirect */
function getSafeRedirect(redirect: string | null): string {
  if (!redirect || !redirect.startsWith("/")) return "/website";
  // Chặn protocol-relative URL: //evil.com
  if (redirect.startsWith("//")) return "/website";
  return redirect;
}

function getDashboard(role: string): string {
  return ROLE_DASHBOARD[role] ?? "/website";
}

function clearAuthCookies(response: NextResponse): NextResponse {
  response.cookies.delete(ACCESS_TOKEN);
  response.cookies.delete(REQUIRE_VERIFY_EMAIL);
  return response;
}

// ─── Middleware ───────────────────────────────────────────────────────────────

export async function middleware(request: NextRequest) {
  const { pathname, searchParams } = request.nextUrl;

  const token = request.cookies.get(ACCESS_TOKEN)?.value;
  const requireVerifyEmail = request.cookies.get(REQUIRE_VERIFY_EMAIL)?.value;
  const allowedRegister = request.cookies.get(ALLOWED_REGISTER)?.value;

  // Verify token — jose tự reject expired/invalid
  const decoded = token ? await verifyToken(token) : null;
  const isAuthenticated = !!decoded;
  const userRole = decoded?.scope ?? "";

  if (!!allowedRegister && pathname.startsWith("/register")) {
    return NextResponse.redirect(new URL("/login", request.url));
  }
  // ── 1. Protected routes (yêu cầu login + role) ──────────────────────────
  const protectedEntry = Object.entries(ROUTE_CONFIG.protected).find(
    ([route]) => pathname.startsWith(route)
  );

  if (protectedEntry) {
    const [, allowedRoles] = protectedEntry;

    if (!isAuthenticated) {
      const url = new URL("/login", request.url);
      url.searchParams.set("redirect", getSafeRedirect(pathname));
      return clearAuthCookies(NextResponse.redirect(url));
    }

    // Chặn user chưa verify email
    if (requireVerifyEmail && decoded?.status !== "VERIFIED") {
      const url = new URL("/login/verify", request.url);
      url.searchParams.set("email", btoa(requireVerifyEmail));
      return redirectTo(url.toString(), request);
    }

    // Kiểm tra role
    if (!(allowedRoles as readonly string[]).includes(userRole)) {
      // Redirect về dashboard của role hiện tại thay vì trả JSON 403
      return redirectTo(getDashboard(userRole), request);
    }

    return NextResponse.next();
  }

  // ── 2. Auth-only routes (chỉ cho user chưa đăng nhập) ───────────────────
  if (ROUTE_CONFIG.authOnly.some((r) => pathname.startsWith(r))) {
    if (isAuthenticated) {
      const redirect = getSafeRedirect(searchParams.get("redirect"));
      return redirectTo(
        redirect !== "/website" ? redirect : getDashboard(userRole),
        request
      );
    }
    return NextResponse.next();
  }

  // ── 3. Token required (cần login, không cần role cụ thể) ─────────────────
  if (ROUTE_CONFIG.tokenRequired.some((r) => pathname.startsWith(r))) {
    if (!isAuthenticated) {
      const url = new URL("/login", request.url);
      url.searchParams.set("redirect", getSafeRedirect(pathname));
      return clearAuthCookies(NextResponse.redirect(url));
    }
    return NextResponse.next();
  }

  // ── 4. Public routes ──────────────────────────────────────────────────────
  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico)$).*)",
  ],
};
