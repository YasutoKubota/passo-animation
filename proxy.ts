import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// 旧 /staff/* → 新 /inquiries/* の対応マップ。ブックマーク互換のため、
// 旧 URL でアクセスされたら 308 で恒久的にリダイレクトする。
function legacyStaffRedirect(pathname: string): string | null {
  if (!pathname.startsWith("/staff")) return null;
  // 旧構造 → 新構造（順番が大事：長いパターンから先に判定）
  const map: Array<[RegExp, string]> = [
    [/^\/staff\/login(\/.*)?$/, "/login$1"],
    [/^\/staff\/intake\/(.+)$/, "/inquiries/$1"],
    [/^\/staff\/agreement\/(.+)$/, "/inquiries/agreements/$1"],
    [/^\/staff\/inquiry-new(\/.*)?$/, "/inquiries/new$1"],
    [/^\/staff\/analytics(\/.*)?$/, "/inquiries/analytics$1"],
    [/^\/staff\/ads(\/.*)?$/, "/inquiries/ads$1"],
    [/^\/staff(\/.*)?$/, "/inquiries$1"],
  ];
  for (const [pattern, replacement] of map) {
    if (pattern.test(pathname)) {
      return pathname.replace(pattern, replacement);
    }
  }
  return null;
}

export function proxy(request: NextRequest) {
  const { pathname, search } = request.nextUrl;

  // 旧 URL の互換リダイレクト
  const legacy = legacyStaffRedirect(pathname);
  if (legacy) {
    const url = new URL(legacy + search, request.url);
    return NextResponse.redirect(url, 308);
  }

  // /login は PIN チェック対象外
  if (pathname === "/login" || pathname.startsWith("/login/")) {
    return NextResponse.next();
  }

  const pin = request.cookies.get("staff_pin")?.value;
  const expected = process.env.STAFF_PIN;

  if (!expected) {
    return NextResponse.next();
  }

  if (!pin || pin !== expected) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("next", pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

// /inquiries/* と旧 /staff/* の両方を proxy 経由にする
export const config = {
  matcher: ["/inquiries/:path*", "/staff/:path*"],
};
