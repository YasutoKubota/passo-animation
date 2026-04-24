import Link from "next/link";
import { StaffTopbar } from "./components/Topbar";
import { supabaseAdmin } from "@/lib/supabase";

export const dynamic = "force-dynamic";

export default async function StaffDashboard() {
  const [intakeResult, agreementResult] = await Promise.all([
    supabaseAdmin.from("intake_forms").select("*", { count: "exact", head: true }),
    supabaseAdmin.from("trial_agreements").select("*", { count: "exact", head: true }),
  ]);

  const intakeCount = intakeResult.count;
  const agreementCount = agreementResult.count;

  return (
    <div className="staff-root">
      <StaffTopbar />
      <main className="staff-main">
        <div className="staff-page-head">
          <div className="staff-page-label">
            <span className="dot" />
            <span>Dashboard</span>
          </div>
          <h1 className="staff-page-title">スタッフ管理</h1>
          <p className="staff-page-sub">
            見学・体験の記録を確認したり、今後追加されるツールをここから開きます。
          </p>
        </div>

        {/* 当日の受付アクション */}
        <section className="staff-quick-actions">
          <div className="staff-quick-actions-head">TODAY · 受付アクション</div>
          <div className="staff-quick-grid">
            <Link href="/intake" className="staff-quick-card staff-quick-card--primary">
              <div className="staff-quick-label">新規 見学者が来訪</div>
              <div className="staff-quick-title">面談票を発行</div>
              <div className="staff-quick-desc">
                事業所のパソコンで、ご本人に入力していただきます。
                <br />
                入力の様子はタイピング評価の参考にもなります。
              </div>
              <div className="staff-quick-arrow">面談票を開く →</div>
            </Link>

            <Link
              href="/staff/intake"
              className="staff-quick-card staff-quick-card--secondary"
            >
              <div className="staff-quick-label">体験開始する人がいる</div>
              <div className="staff-quick-title">誓約書を発行</div>
              <div className="staff-quick-desc">
                面談票一覧から該当の方を開き、「体験利用開始」ボタンを押してください。
              </div>
              <div className="staff-quick-arrow">面談票一覧へ →</div>
            </Link>
          </div>
        </section>

        <section className="staff-records-section">
          <div className="staff-records-head">RECORDS · 記録を見る</div>
          <div className="staff-tools">
            <Link href="/staff/intake" className="staff-tool-card">
              <div className="staff-tool-label">Intake</div>
              <div className="staff-tool-title">見学・体験 面談票</div>
              <div className="staff-tool-desc">
                これまでに提出された面談票の一覧と詳細。
                {typeof intakeCount === "number" && `（現在 ${intakeCount} 件）`}
              </div>
            </Link>

            <Link href="/staff/agreement" className="staff-tool-card">
              <div className="staff-tool-label">Agreement</div>
              <div className="staff-tool-title">体験利用 誓約書</div>
              <div className="staff-tool-desc">
                これまでに受領した誓約書の一覧。
                {typeof agreementCount === "number" && `（現在 ${agreementCount} 件）`}
              </div>
            </Link>

            <div className="staff-tool-card staff-tool-card--disabled">
              <div className="staff-tool-label">Coming soon</div>
              <div className="staff-tool-title">その他のツール</div>
              <div className="staff-tool-desc">今後追加される管理ツールが並びます。</div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
