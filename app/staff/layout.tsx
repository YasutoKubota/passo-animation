import type { Metadata } from "next";
import "./staff.css";

export const metadata: Metadata = {
  title: "スタッフ管理 | パッソ",
  robots: { index: false, follow: false },
};

export default function StaffLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return <>{children}</>;
}
