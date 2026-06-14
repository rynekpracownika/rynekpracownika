import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";
import { authLimiter, nipLimiter, apiLimiter } from "./lib/ratelimit";

export async function proxy(request) {
  const ip = request.headers.get("x-forwarded-for") || "unknown";
  const path = request.nextUrl.pathname;

  const skipRateLimit = [
    "/api/auth/session",
    "/api/auth/_log",
    "/api/verify-captcha",
    "/api/email",
  ];

  if (path.startsWith("/api/") && !skipRateLimit.some(p => path.startsWith(p))) {
    let limiter = apiLimiter;
    if (path.startsWith("/api/auth")) limiter = authLimiter;
    if (path.startsWith("/api/nip")) limiter = nipLimiter;

    const { success } = await limiter.limit(ip);
    if (!success) {
      return new NextResponse(
        JSON.stringify({ error: "Za dużo zapytań. Spróbuj za chwilę." }),
        { status: 429, headers: { "Content-Type": "application/json" } }
      );
    }
  }

  if (path.startsWith("/admin") && !path.startsWith("/admin/login")) {
    const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET });
    if (!token) {
      return NextResponse.redirect(new URL("/admin/login", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/((?!login).*)", "/api/:path*"],
};
