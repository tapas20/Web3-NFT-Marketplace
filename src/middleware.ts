import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import type { NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
  const token = await getToken({ req: request });
  const { pathname } = request.nextUrl;

  const isAuthPage = pathname.startsWith("/login") || pathname.startsWith("/register");
  const isDashboardPage = pathname.startsWith("/dashboard");
  const isAdminPage = pathname.startsWith("/admin");
  const isSellPage = pathname === "/sell";

  if (isAuthPage) {
    if (token) {
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }
    return NextResponse.next();
  }

  if (isDashboardPage || isSellPage) {
    if (!token) {
      let from = request.nextUrl.pathname;
      if (request.nextUrl.search) {
        from += request.nextUrl.search;
      }
      return NextResponse.redirect(
        new URL(`/login?callbackUrl=${encodeURIComponent(from)}`, request.url)
      );
    }
  }

  if (isAdminPage) {
    if (!token) {
      return NextResponse.redirect(new URL("/login", request.url));
    }
    if (token.role !== "ADMIN") {
      return NextResponse.redirect(new URL("/", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/admin/:path*",
    "/login",
    "/register",
    "/sell",
  ],
};
