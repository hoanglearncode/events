import type { NextRequest } from "next/server";

/**
 * Helper function to check if a path matches any of the given patterns
 */
export function matchesPattern(path: string, patterns: string[]): boolean {
  return patterns.some((pattern) => {
    // Exact match
    if (pattern === path) return true;

    // Pattern with wildcard (e.g., /site/*)
    if (pattern.endsWith("/*")) {
      const basePattern = pattern.slice(0, -2);
      return path.startsWith(basePattern) && path !== basePattern;
    }

    // Pattern with dynamic segments (e.g., /site/[id])
    if (pattern.includes("[") && pattern.includes("]")) {
      const regexPattern = pattern
        .replace(/\[.*?\]/g, "[^/]+") // Replace [id] with [^/]+
        .replace(/\//g, "\\/"); // Escape forward slashes
      const regex = new RegExp(`^${regexPattern}$`);
      return regex.test(path);
    }

    return false;
  });
}

/**
 * Helper function to get token from cookies
 */
export function getTokenFromCookies(
  request: NextRequest,
  tokenName: string
): string | null {
  const token = request.cookies.get(tokenName)?.value;
  return token || null;
}

/**
 * Helper function to create redirect URL for authentication
 */
export function createAuthRedirectUrl(
  request: NextRequest,
  loginRoute: string
): string {
  const { pathname, search } = request.nextUrl;
  return `${loginRoute}?redirect=${encodeURIComponent(pathname + search)}`;
}

/**
 * Check if the current environment is production
 */
export function isProduction(): boolean {
  return process.env.NODE_ENV === "production";
}
