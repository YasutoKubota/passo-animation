import Link from "next/link";
import { StaffTopbar } from "./components/Topbar";
import { supabaseAdmin } from "@/lib/supabase";
import { IntakeDashboardClient, type IntakeRow } from "./IntakeDashboardClient";

export const dynamic = "force-dynamic";

export default async function StaffDashboard() {
  // 過去 3 会計年度分をまとめて取得（年度・月フィルタはクライアント側で）
  const since = new Date();
  since.setFullYear(since.getFullYear() - 3);
  const sinceISO = since.toISOString().split("T")[0];

  const { data, error } = await supabaseAdmin
    .from("intake_forms")
    .select(
      "id, submitted_at, inquiry_date, scheduled_visit_date, service_start_date, studio_location, name, furigana, source_choices, trial_sessions, city_office_meeting_at, trial_agreements(id, created_at)"
    )
    .gte("submitted_at", sinceISO)
    .order("submitted_at", { ascending: false })
    .limit(5000);

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
              href="/staff/inquiry-new"
              className="staff-action-btn staff-action-btn--primary"
            >
              + 新規お問合せ
            </Link>
            <Link
              href="/intake"
              className="staff-action-btn staff-action-btn--secondary"
            >
              + 新規 面談票を発行
            </Link>
            <Link href="/staff/analytics" className="staff-action-btn staff-action-btn--secondary">
              📊 分析
            </Link>
            <Link href="/staff/ads" className="staff-action-btn staff-action-btn--secondary">
              📣 広告管理
            </Link>
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
