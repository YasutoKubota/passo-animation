import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// 旧 /staff/* → 新 /inquiries/* の対応マップ。ブックマーク互換のため、
// 旧 URL でアクセスされたら 308 で恒久的にリダイレクトする。
function legacyStaffRedirect(pathname: string): string | null {
  if (!pathname.startsWith("/staff")) return null;
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

// 社内ポータル (app.passo-ww.com) でだけ提供する path
const APP_PATHS = [
  "/inquiries",
  "/login",
  "/intake",
  "/intake-sozo",
  "/agreement",
];
// 公開 LP (www.passo-ww.com) でだけ提供する path
const WWW_PATHS = ["/movie", "/illust", "/lp"];

function matchPath(prefixes: string[], pathname: string): boolean {
  return prefixes.some(
    (p) => pathname === p || pathname.startsWith(p + "/")
  );
}
function isAppPath(pathname: string): boolean {
  return matchPath(APP_PATHS, pathname);
}
function isWwwPath(pathname: string): boolean {
  return matchPath(WWW_PATHS, pathname);
}
function needsPin(pathname: string): boolean {
  return pathname.startsWith("/inquiries");
}

export function proxy(request: NextRequest) {
  const { pathname, search } = request.nextUrl;
  const host = request.headers.get("host") ?? "";

  // 1. 旧 /staff/* リダイレクト（後方互換）
  const legacy = legacyStaffRedirect(pathname);
  if (legacy) {
    return NextResponse.redirect(new URL(legacy + search, request.url), 308);
  }

  // 2. ドメイン分離
  //    本番環境のみ適用 (localhost や Vercel preview には影響させない)
  const isAppHost = /^app\.passo-ww\.com(:|$)/.test(host);
  const isWwwHost = /^(www\.)?passo-ww\.com(:|$)/.test(host);

  if (isWwwHost && isAppPath(pathname)) {
    // 公開ドメインで社内ツールにアクセスされたら社内ドメインへ
    return NextResponse.redirect(
      `https://app.passo-ww.com${pathname}${search}`,
      308
    );
  }
  if (isAppHost && isWwwPath(pathname)) {
    // 社内ドメインで公開 LP にアクセスされたら公開ドメインへ
    return NextResponse.redirect(
      `https://www.passo-ww.com${pathname}${search}`,
      308
    );
  }
  // 社内ドメインの / は将来のポータルTOP。今はお問合せ管理に飛ばす。
  if (isAppHost && pathname === "/") {
    return NextResponse.redirect(new URL("/inquiries", request.url), 307);
  }

  // 3. PIN 認証 (/inquiries/* のみ。/login と /intake 系は除外)
  if (needsPin(pathname)) {
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
  }

  return NextResponse.next();
}

export const config = {
  // 静的アセットと拡張子付きファイル以外、全 path で proxy を実行
  matcher: [
    "/((?!_next/static|_next/image|favicon\\.ico|images/|google.*\\.html|.*\\.[a-zA-Z0-9]+$).*)",
  ],
};
