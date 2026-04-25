import Link from "next/link";
import { StaffTopbar } from "./components/Topbar";
import { supabaseAdmin } from "@/lib/supabase";
import { STUDIO_OPTIONS, studioLabel } from "@/lib/intake-schema";

export const dynamic = "force-dynamic";

type AgreementLite = {
  id: string;
  created_at: string;
};

type IntakeRow = {
  id: string;
  submitted_at: string;
  studio_location: string | null;
  name: string;
  furigana: string;
  trial_agreements: AgreementLite[];
};

// 一覧ではいつ来たかが分かれば十分。時刻は詳細ページで見る。
function formatDateOnly(iso: string) {
  const d = new Date(iso);
  return d.toLocaleDateString("ja-JP", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });
}

export default async function StaffDashboard({
  searchParams,
}: {
  searchParams: Promise<{ studio?: string }>;
}) {
  const { studio } = await searchParams;

  const validCodes = STUDIO_OPTIONS.map((o) => o.value) as string[];
  let query = supabaseAdmin
    .from("intake_forms")
    .select(
      "id, submitted_at, studio_location, name, furigana, trial_agreements(id, created_at)"
    )
    .order("submitted_at", { ascending: false })
    .limit(200);

  if (studio && validCodes.includes(studio)) {
    query = query.eq("studio_location", studio);
  }

  const { data, error } = await query;
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

        <div className="staff-list-controls">
          <Link
            href="/staff"
            className={`staff-filter-chip ${!studio ? "staff-filter-chip--active" : ""}`}
          >
            すべて
          </Link>
          {STUDIO_OPTIONS.map((opt) => (
            <Link
              key={opt.value}
              href={`/staff?studio=${opt.value}`}
              className={`staff-filter-chip ${studio === opt.value ? "staff-filter-chip--active" : ""}`}
            >
              {opt.label}
            </Link>
          ))}
          <span className="staff-count">{rows.length} 件</span>
        </div>

        <div className="staff-list">
          {error && (
            <div className="staff-list-empty">
              読み込みに失敗しました: {error.message}
            </div>
          )}
          {!error && rows.length === 0 && (
            <div className="staff-list-empty">
              まだ面談票はありません。上の「新規 面談票を発行」から追加できます。
            </div>
          )}
          {!error &&
            rows.map((row) => {
              const agreements = (row.trial_agreements ?? []).slice().sort(
                (a, b) =>
                  new Date(b.created_at).getTime() -
                  new Date(a.created_at).getTime()
              );
              const latestAgreement = agreements[0];
              const hasAgreement = !!latestAgreement;

              return (
                <div key={row.id} className="dash-row">
                  <span className="dash-row-date">
                    {formatDateOnly(row.submitted_at)}
                  </span>
                  <span className="dash-row-studio">
                    {row.studio_location ? studioLabel(row.studio_location) : "—"}
                  </span>
                  <span className="dash-row-name">
                    {row.name}
                    <span className="dash-row-furigana">{row.furigana}</span>
                  </span>

                  <div className="dash-row-actions">
                    <Link
                      href={`/staff/intake/${row.id}`}
                      className="dash-row-btn dash-row-btn--secondary"
                    >
                      面談票を表示
                    </Link>
                    {hasAgreement ? (
                      <Link
                        href={`/staff/agreement/${latestAgreement.id}?from=intake&intake_id=${row.id}`}
                        className="dash-row-btn dash-row-btn--secondary"
                      >
                        誓約書を表示
                        {agreements.length > 1 && (
                          <span className="dash-row-btn-count">
                            ({agreements.length})
                          </span>
                        )}
                      </Link>
                    ) : (
                      <Link
                        href={`/agreement?intake_id=${row.id}`}
                        className="dash-row-btn dash-row-btn--primary"
                      >
                        誓約書を発行
                      </Link>
                    )}
                  </div>
                </div>
              );
            })}
        </div>
      </main>
    </div>
  );
}
