import type { Metadata } from "next";
import "./inquiries.css";

// 各ページで title を上書きすると "%s | スタッフ管理 - パッソ" になる
// 例: /inquiries/analytics → "分析 | スタッフ管理 - パッソ"
export const metadata: Metadata = {
  title: {
    template: "%s | スタッフ管理 - パッソ",
    default: "スタッフ管理 - パッソ",
  },
  robots: { index: false, follow: false },
};

export default function StaffLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return <>{children}</>;
}
