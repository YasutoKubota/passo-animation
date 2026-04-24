import Link from "next/link";
import { StaffTopbar } from "./components/Topbar";
import { supabaseAdmin } from "@/lib/supabase";
import { STUDIO_OPTIONS, studioLabel } from "@/lib/intake-schema";
import { DeleteIntakeButton } from "./intake/[id]/DeleteButtons";

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
  phone: string | null;
  birth_date: string | null;
  trial_agreements: AgreementLite[];
};

function formatDate(iso: string) {
  const d = new Date(iso);
  return d.toLocaleString("ja-JP", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
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
      "id, submitted_at, studio_location, name, furigana, phone, birth_date, trial_agreements(id, created_at)"
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
                  <Link
                    href={`/staff/intake/${row.id}`}
                    className="dash-row-body"
                  >
                    <div className="dash-row-top">
                      <div>
                        <span className="staff-list-name">{row.name}</span>
                        <span className="dash-row-furigana">
                          {row.furigana}
                        </span>
                      </div>
                      <div className="dash-row-meta">
                        {row.studio_location && (
                          <span className="staff-list-studio">
                            {studioLabel(row.studio_location)}
                          </span>
                        )}
                        <span>{formatDate(row.submitted_at)}</span>
                      </div>
                    </div>
                    <div className="dash-row-sub">
                      {row.phone && <span>TEL: {row.phone}</span>}
                      {row.birth_date && <span>生年月日: {row.birth_date}</span>}
                      {hasAgreement ? (
                        <span className="dash-row-badge dash-row-badge--done">
                          ✓ 誓約書 署名済み
                          {agreements.length > 1 && ` (${agreements.length}件)`}
                        </span>
                      ) : (
                        <span className="dash-row-badge dash-row-badge--todo">
                          誓約書 未発行
                        </span>
                      )}
                    </div>
                  </Link>

                  <div className="dash-row-actions">
                    {hasAgreement ? (
                      <Link
                        href={`/staff/agreement/${latestAgreement.id}?from=intake&intake_id=${row.id}`}
                        className="dash-row-btn dash-row-btn--view"
                      >
                        誓約書を表示
                      </Link>
                    ) : (
                      <Link
                        href={`/agreement?intake_id=${row.id}`}
                        className="dash-row-btn dash-row-btn--issue"
                      >
                        誓約書を発行
                      </Link>
                    )}
                    <DeleteIntakeButton
                      id={row.id}
                      name={row.name}
                      agreementCount={agreements.length}
                    />
                  </div>
                </div>
              );
            })}
        </div>
      </main>
    </div>
  );
}
