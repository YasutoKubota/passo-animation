import type { Metadata } from "next";
import "./intake.css";

export const metadata: Metadata = {
  title: "見学・体験利用面談票 | パッソアニメーションスタジオ",
  robots: { index: false, follow: false },
};

export default function IntakeLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return <div className="intake-root">{children}</div>;
}
