import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (pathname === "/staff/login" || pathname.startsWith("/staff/login/")) {
    return NextResponse.next();
  }

  const pin = request.cookies.get("staff_pin")?.value;
  const expected = process.env.STAFF_PIN;

  if (!expected) {
    return NextResponse.next();
  }

  if (!pin || pin !== expected) {
    const loginUrl = new URL("/staff/login", request.url);
    loginUrl.searchParams.set("next", pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: "/staff/:path*",
};
