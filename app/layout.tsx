import type { Metadata } from "next";
import Script from "next/script";
import "./globals.css";

export const metadata: Metadata = {
  title: "パッソ｜あなたの「好き」が、仕事になる制作スタジオ（就労継続支援B型）",
  description:
    "パッソは、働くことに障がいのあるクリエイターのための制作スタジオ（就労継続支援B型）。10年の実績と多彩な動画の企業案件であなたの「好き」を仕事にします。",
  metadataBase: new URL("https://passo-ww.com"),
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <head>
        <meta name="theme-color" content="#F3EDE4" />
        <meta name="format-detection" content="telephone=no" />
        <link rel="icon" type="image/png" sizes="32x32" href="/images/favicon-32.png" />
        <link rel="icon" type="image/png" sizes="192x192" href="/images/favicon-192.png" />
        <link rel="apple-touch-icon" href="/images/apple-touch-icon.png" />
      </head>
      <body>
        {/* Google tag (gtag.js) */}
        <Script async src="https://www.googletagmanager.com/gtag/js?id=AW-597391026" strategy="afterInteractive" />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'AW-597391026');
          `}
        </Script>

        {/* Event snippet for LINE登録 conversion page */}
        <Script id="google-conversion" strategy="afterInteractive">
          {`
            function gtag_report_conversion(url) {
              var callback = function () {
                if (typeof(url) != 'undefined') {
                  window.location = url;
                }
              };
              gtag('event', 'conversion', {
                  'send_to': 'AW-597391026/niNbCOD6i5scELLt7ZwC',
                  'event_callback': callback
              });
              return false;
            }
          `}
        </Script>
        {children}
      </body>
    </html>
  );
}
