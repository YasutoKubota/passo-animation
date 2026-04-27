import type { Metadata } from "next";
import "./intake-sozo.css";

export const metadata: Metadata = {
  title: "見学・体験利用 面談票（創造空間）- パッソ",
  robots: { index: false, follow: false },
};

export default function IntakeSozoLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return <>{children}</>;
}
