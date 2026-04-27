import type { Metadata } from "next";
import "./intake.css";

export const metadata: Metadata = {
  title: "見学・体験利用 面談票 - パッソ",
  robots: { index: false, follow: false },
};

export default function IntakeLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return <div className="intake-root">{children}</div>;
}
