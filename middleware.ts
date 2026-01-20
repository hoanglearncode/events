// middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { ACCESS_TOKEN, REQUIRE_VERIFY_EMAIL } from "./shared/const/cookie";
import { HOURS } from "./shared/const/unit";

export interface JWTPayload {
  userId: string;
  email: string;
  role: string;
  exp: number;
  iat: number;
  status: string;
}
const PROTECTED_ROUTES = [
  "/admin",
  "/seller",
  "/profile",
  "/my-data",
  "/post",
  "/noti",
  "/orders",
  "/payment",
];
const AUTH_ROUTES = ["/login", "/register", "/forgot-password"];
const TOKEN_REQUIRED_ROUTES = [
  "/reset-password",
  "/login/verify",
  "/change-password",
];
const PUBLIC_ROUTES = ["/", "/blog", "/courses", "/marketplace", "/tools", "/website"];
export function decodeToken(token: string): JWTPayload | null {
  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    return {
      role: payload.scope || "user",
      email: payload.sub || "user@gmail.com",
      exp: payload.exp || HOURS,
      userId: payload.userId || payload.sub,
      iat: payload.iat || 0,
      status: payload.status,
    };
  } catch (error) {
    return null;
  }
}

function getDashboardByRole(role: string): string {
  const dashboardMap: Record<string, string> = {
    admin: "/admin",
    seller: "/seller",
    user: "/website",
  };
  return dashboardMap[role.toLowerCase()] || "/website";
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get(ACCESS_TOKEN)?.value;
  const emailValidate = request.cookies.get(REQUIRE_VERIFY_EMAIL)?.value;
  const hasToken = !!token;
  const isEmailValidate = !!emailValidate;

  // let userRole = "user";
  // if (hasToken && token) {
  //   const decoded = decodeToken(token);
  //   if (decoded) {
  //     userRole = decoded.role;
  //   }
  // }

  // if (PROTECTED_ROUTES.some((route) => pathname.startsWith(route))) {
  //   if (!hasToken) {
  //     const url = request.nextUrl.clone();
  //     url.pathname = "/login";
  //     url.searchParams.set("redirect", pathname);
  //     return NextResponse.redirect(url);
  //   }

  //   if (pathname.startsWith("/admin") && userRole !== "ROLE_ADMIN") {
  //     return new NextResponse(null, { status: 403 });
  //   }

  //   if (pathname.startsWith("/seller") && !["ROLE_SELLER"].includes(userRole)) {
  //     return new NextResponse(null, { status: 403 });
  //   }
  //   if (isEmailValidate && emailValidate) {
  //     return NextResponse.redirect(
  //       new URL(
  //         `/login/verify?email=${encodeURIComponent(btoa(emailValidate))}`,
  //         request.url
  //       )
  //     );
  //   }
  //   return NextResponse.next();
  // }

  // if (AUTH_ROUTES.includes(pathname)) {
  //   if (hasToken) {
  //     const dashboardUrl = getDashboardByRole(userRole);
  //     const url = request.nextUrl.clone();
  //     url.pathname = dashboardUrl;
  //     return NextResponse.redirect(url);
  //   }
  //   return NextResponse.next();
  // }
  // if (TOKEN_REQUIRED_ROUTES.some((route) => pathname.startsWith(route))) {
  //   if (!hasToken) {
  //     const url = request.nextUrl.clone();
  //     url.pathname = "/login";
  //     return NextResponse.redirect(url);
  //   }
  //   return NextResponse.next();
  // }

  // if (
  //   PUBLIC_ROUTES.some(
  //     (route) => pathname === route || pathname.startsWith(route)
  //   )
  // ) {
  //   return NextResponse.next();
  // }

  return NextResponse.next();
}

// Cấu hình matcher để middleware chỉ chạy với các routes cần thiết
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public files (images, etc)
     */
    "/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
