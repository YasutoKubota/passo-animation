import Link from "next/link";
import { StaffTopbar } from "../components/Topbar";
import { supabaseAdmin } from "@/lib/supabase";
import { STUDIO_OPTIONS, studioLabel } from "@/lib/intake-schema";

export const dynamic = "force-dynamic";

type AgreementRow = {
  id: string;
  created_at: string;
  intake_id: string | null;
  studio_location: string | null;
  signed_name: string;
};

type IntakeRow = {
  id: string;
  name: string;
  furigana: string;
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

export default async function AgreementListPage({
  searchParams,
}: {
  searchParams: Promise<{ studio?: string }>;
}) {
  const { studio } = await searchParams;

  let query = supabaseAdmin
    .from("trial_agreements")
    .select("id, created_at, intake_id, studio_location, signed_name")
    .order("created_at", { ascending: false })
    .limit(200);

  const validStudioCodes = STUDIO_OPTIONS.map((o) => o.value) as string[];
  if (studio && validStudioCodes.includes(studio)) {
    query = query.eq("studio_location", studio);
  }

  const { data: agreements, error } = await query;

  // intake の name/furigana を join 取得（trial_agreements は FK だけなので別クエリで解決）
  const intakeIds = (agreements ?? [])
    .map((a: AgreementRow) => a.intake_id)
    .filter((v): v is string => !!v);

  let intakeMap: Record<string, IntakeRow> = {};
  if (intakeIds.length > 0) {
    const { data: intakes } = await supabaseAdmin
      .from("intake_forms")
      .select("id, name, furigana")
      .in("id", intakeIds);
    for (const row of (intakes ?? []) as IntakeRow[]) {
      intakeMap[row.id] = row;
    }
  }

  return (
    <div className="staff-root">
      <StaffTopbar section="体験利用 誓約書" />
      <main className="staff-main">
        <div className="staff-page-head">
          <div className="staff-page-label">
            <span className="dot" />
            <span>Agreement</span>
          </div>
          <h1 className="staff-page-title">誓約書 一覧</h1>
          <p className="staff-page-sub">
            体験利用時に受領した誓約書の記録。新しい順に表示。
            <br />
            新規発行は面談票詳細の「体験利用開始」ボタンから行います。
          </p>
        </div>

        <div className="staff-list-controls">
          <Link
            href="/staff/agreement"
            className={`staff-filter-chip ${!studio ? "staff-filter-chip--active" : ""}`}
          >
            すべて
          </Link>
          {STUDIO_OPTIONS.map((opt) => (
            <Link
              key={opt.value}
              href={`/staff/agreement?studio=${opt.value}`}
              className={`staff-filter-chip ${studio === opt.value ? "staff-filter-chip--active" : ""}`}
            >
              {opt.label}
            </Link>
          ))}
          {agreements && <span className="staff-count">{agreements.length} 件</span>}
        </div>

        <div className="staff-list">
          {error && (
            <div className="staff-list-empty">読み込みに失敗しました: {error.message}</div>
          )}
          {!error && agreements && agreements.length === 0 && (
            <div className="staff-list-empty">まだ誓約書はありません。</div>
          )}
          {!error &&
            agreements?.map((row: AgreementRow) => {
              const intake = row.intake_id ? intakeMap[row.intake_id] : null;
              const displayName = intake?.name ?? row.signed_name;
              return (
                <Link
                  key={row.id}
                  href={`/staff/agreement/${row.id}?from=list`}
                  className="staff-list-item"
                >
                  <div className="staff-list-top">
                    <div>
                      <span className="staff-list-name">{displayName}</span>
                      {intake?.furigana && (
                        <span
                          style={{
                            marginLeft: 10,
                            fontSize: 12,
                            color: "var(--text-light)",
                          }}
                        >
                          {intake.furigana}
                        </span>
                      )}
                    </div>
                    <div className="staff-list-meta">
                      {row.studio_location && (
                        <span className="staff-list-studio">
                          {studioLabel(row.studio_location)}
                        </span>
                      )}
                      <span>{formatDate(row.created_at)}</span>
                    </div>
                  </div>
                  <div className="staff-list-sub">
                    <span>署名: {row.signed_name}</span>
                    {!row.intake_id && <span>（面談票とのリンクなし）</span>}
                  </div>
                </Link>
              );
            })}
        </div>
      </main>
    </div>
  );
}
