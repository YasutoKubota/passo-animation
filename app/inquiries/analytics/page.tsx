import type { Metadata } from "next";
import Link from "next/link";
import { StaffTopbar } from "../components/Topbar";
import { supabaseAdmin } from "@/lib/supabase";
import { AnalyticsClient, type AnalyticsRow } from "./AnalyticsClient";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "流入・コンバージョン分析",
};

export default async function AnalyticsPage() {
  // 過去 3 会計年度分を全件取得し、画面側でフィルタする（事業所切替を即時に）
  const since = new Date();
  since.setFullYear(since.getFullYear() - 3);
  const sinceISO = since.toISOString().split("T")[0];

  const { data, error } = await supabaseAdmin
    .from("intake_forms")
    .select(
      "id, submitted_at, inquiry_date, scheduled_visit_date, visited_at, service_start_date, studio_location, gender, birth_date, address, notebook_status, source_choices, trial_sessions, city_office_meeting_at, service_plan_completed_at, contract_signed_at, status, dropout_at_step, trial_agreements(id)"
    )
    .gte("submitted_at", sinceISO)
    .limit(5000);

  const rows = (data ?? []) as AnalyticsRow[];

  return (
    <div className="staff-root">
      <StaffTopbar section="分析" />
      <main className="staff-main">
        <Link href="/inquiries" className="staff-back-link">← ダッシュボードに戻る</Link>

        {error ? (
          <div className="staff-list-empty">読み込みに失敗しました: {error.message}</div>
        ) : (
          <AnalyticsClient rows={rows} />
        )}
      </main>
    </div>
  );
}
