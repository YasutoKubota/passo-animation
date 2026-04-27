import type { MetadataRoute } from "next";

// 検索エンジン向けのクロールルール。
// 個人情報を扱う管理画面・面談票・誓約書フォームは検索結果に出さない。
// 公開 LP（/, /movie, /illust, /lp）は通常通りインデックスする。
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: [
          "/inquiries",
          "/inquiries/",
          "/intake",
          "/intake/",
          "/intake-sozo",
          "/intake-sozo/",
          "/agreement",
          "/agreement/",
          "/start",
        ],
      },
    ],
    sitemap: "https://www.passo-ww.com/sitemap.xml",
    host: "https://www.passo-ww.com",
  };
}
