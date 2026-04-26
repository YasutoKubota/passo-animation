import type { NextConfig } from "next";

const NOINDEX_PATHS = [
  "/staff/:path*",
  "/intake",
  "/intake/:path*",
  "/agreement",
  "/agreement/:path*",
  "/start",
];

const nextConfig: NextConfig = {
  // 個人情報を扱うパスは HTTP ヘッダーレベルでも検索エンジンに「載せないで」と伝える。
  // app/staff/layout.tsx 等の <meta name="robots"> と二重防御。
  async headers() {
    return NOINDEX_PATHS.map((source) => ({
      source,
      headers: [
        {
          key: "X-Robots-Tag",
          value: "noindex, nofollow, nosnippet, noarchive",
        },
      ],
    }));
  },
};

export default nextConfig;
