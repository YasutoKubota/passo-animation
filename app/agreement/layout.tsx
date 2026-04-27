import type { Metadata } from "next";
import "./agreement.css";

export const metadata: Metadata = {
  title: "体験利用 誓約書 - パッソ",
  robots: { index: false, follow: false },
};

export default function AgreementLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return <div className="agreement-root">{children}</div>;
}
