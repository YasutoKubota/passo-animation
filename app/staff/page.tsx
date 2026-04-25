import Link from "next/link";
import { StaffTopbar } from "./components/Topbar";
import { supabaseAdmin } from "@/lib/supabase";
import { IntakeDashboardClient, type IntakeRow } from "./IntakeDashboardClient";

export const dynamic = "force-dynamic";

export default async function StaffDashboard() {
  // 全件取得（フィルタはクライアント側で JS で行うので、ここでは絞らない）
  const { data, error } = await supabaseAdmin
    .from("intake_forms")
    .select(
      "id, submitted_at, studio_location, name, furigana, trial_agreements(id, created_at)"
    )
    .order("submitted_at", { ascending: false })
    .limit(200);

  const rows = (data ?? []) as IntakeRow[];

  return (
    <div className="staff-root">
      <StaffTopbar />
      <main className="staff-main">
        <div className="staff-page-head">
          <div className="staff-page-label">
            <span className="dot" />
            <span>Intake Dashboard</span>
          </div>
          <h1 className="staff-page-title">見学・体験利用 管理</h1>
          <p className="staff-page-sub">
            見学者の面談票の発行・閲覧と、体験利用誓約書の発行・閲覧をここから行います。
          </p>

          <div className="staff-detail-actions">
            <Link
              href="/intake"
              className="staff-action-btn staff-action-btn--primary"
            >
              + 新規 面談票を発行
            </Link>
            <span className="staff-action-note">
              見学者が来所したとき、タブレットやパソコンをお渡しするためのボタンです。
            </span>
          </div>
        </div>

        <IntakeDashboardClient
          rows={rows}
          errorMessage={error?.message ?? null}
        />
      </main>
    </div>
  );
}
