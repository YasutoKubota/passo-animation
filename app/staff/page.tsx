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

        <div className="staff-tools">
          <Link href="/staff/intake" className="staff-tool-card">
            <div className="staff-tool-label">Intake</div>
            <div className="staff-tool-title">見学・体験 面談票</div>
            <div className="staff-tool-desc">
              見学者が入力した面談票の一覧と詳細を確認できます。
              {typeof intakeCount === "number" && `（現在 ${intakeCount} 件）`}
            </div>
          </Link>

          <Link href="/staff/agreement" className="staff-tool-card">
            <div className="staff-tool-label">Agreement</div>
            <div className="staff-tool-title">体験利用 誓約書</div>
            <div className="staff-tool-desc">
              体験日に入力された誓約書の一覧。発行は各面談票の詳細から。
              {typeof agreementCount === "number" && `（現在 ${agreementCount} 件）`}
            </div>
          </Link>

          <div className="staff-tool-card staff-tool-card--disabled">
            <div className="staff-tool-label">Coming soon</div>
            <div className="staff-tool-title">その他のツール</div>
            <div className="staff-tool-desc">今後追加される管理ツールが並びます。</div>
          </div>
        </div>
      </main>
    </div>
  );
}
