import type { Metadata } from "next";
import Link from "next/link";
import { StaffTopbar } from "../components/Topbar";
import { InquiryStubForm } from "./InquiryStubForm";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "新規お問合せを記録",
};

export default function NewInquiryPage() {
  return (
    <div className="staff-root">
      <StaffTopbar section="新規お問合せ" />
      <main className="staff-main">
        <Link href="/inquiries" className="staff-back-link">← ダッシュボードに戻る</Link>

        <div className="staff-page-head">
          <div className="staff-page-label">
            <span className="dot" />
            <span>New Inquiry</span>
          </div>
          <h1 className="staff-page-title">新規お問合せを記録</h1>
          <p className="staff-page-sub">
            電話・メール・チラシ等で受けたお問合せをここに登録します。
            <br />
            必須は <strong>事業所・名前・お問合せルート</strong> のみ。
            その他の項目は判明している分だけ入力してください（後から追記できます）。
          </p>
        </div>

        <section className="staff-card">
          <InquiryStubForm />
        </section>
      </main>
    </div>
  );
}
