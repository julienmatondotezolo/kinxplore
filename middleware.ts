import createMiddleware from "next-intl/middleware";
import { NextRequest, NextResponse } from "next/server";

import { locales } from "./src/navigation";

// Create the next-intl middleware
const intlMiddleware = createMiddleware({
  // A list of all locales that are supported
  locales,

  // Used when no locale matches
  defaultLocale: "en",
});

// Protected routes that require authentication
const protectedRoutes = ["/bookings"];

export default function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Check if the route is protected
  const isProtectedRoute = protectedRoutes.some((route) => {
    // Check for both /bookings and /(locale)/bookings patterns
    return pathname === route || pathname.match(new RegExp(`^/(${locales.join("|")})${route}$`));
  });

  if (isProtectedRoute) {
    // Check for Supabase auth token in cookies
    // Supabase stores the session in cookies with names like:
    // sb-<project-ref>-auth-token or supabase-auth-token
    const cookies = request.cookies;
    
    // Check for common Supabase cookie patterns
    const hasSupabaseAuth = Array.from(cookies.getAll()).some(
      (cookie) =>
        cookie.name.includes("sb-") && cookie.name.includes("-auth-token")
    );

    // Also check for access_token cookie (if manually set)
    const hasAccessToken = cookies.get("access_token")?.value;

    if (!hasSupabaseAuth && !hasAccessToken) {
      // Extract locale from pathname if present
      const localeMatch = pathname.match(new RegExp(`^/(${locales.join("|")})`));
      const locale = localeMatch ? localeMatch[1] : "en";

      // Redirect to login page with return URL
      const loginUrl = new URL(`/${locale}/login`, request.url);
      loginUrl.searchParams.set("returnUrl", pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  // Continue with internationalization middleware
  return intlMiddleware(request);
}

export const config = {
  // Match only internationalized pathnames
  matcher: ["/", "/(fr|en|nl)/:path*"],
};
