import Link from "next/link";
import { StaffTopbar } from "../components/Topbar";
import { supabaseAdmin } from "@/lib/supabase";

export const dynamic = "force-dynamic";

type IntakeRow = {
  id: string;
  submitted_at: string;
  studio_location: string | null;
  name: string;
  furigana: string;
  phone: string | null;
  birth_date: string | null;
  transport: string | null;
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

export default async function IntakeListPage({
  searchParams,
}: {
  searchParams: Promise<{ studio?: string }>;
}) {
  const { studio } = await searchParams;

  let query = supabaseAdmin
    .from("intake_forms")
    .select("id, submitted_at, studio_location, name, furigana, phone, birth_date, transport")
    .order("submitted_at", { ascending: false })
    .limit(200);

  if (studio && (studio === "岡崎" || studio === "豊田")) {
    query = query.eq("studio_location", studio);
  }

  const { data, error } = await query;

  return (
    <div className="staff-root">
      <StaffTopbar section="見学・体験 面談票" />
      <main className="staff-main">
        <div className="staff-page-head">
          <div className="staff-page-label">
            <span className="dot" />
            <span>Intake</span>
          </div>
          <h1 className="staff-page-title">面談票 一覧</h1>
          <p className="staff-page-sub">新しい順に表示。項目をクリックすると詳細が開きます。</p>
        </div>

        <div className="staff-list-controls">
          <Link
            href="/staff/intake"
            className={`staff-filter-chip ${!studio ? "staff-filter-chip--active" : ""}`}
          >
            すべて
          </Link>
          <Link
            href="/staff/intake?studio=岡崎"
            className={`staff-filter-chip ${studio === "岡崎" ? "staff-filter-chip--active" : ""}`}
          >
            岡崎
          </Link>
          <Link
            href="/staff/intake?studio=豊田"
            className={`staff-filter-chip ${studio === "豊田" ? "staff-filter-chip--active" : ""}`}
          >
            豊田
          </Link>
          {data && <span className="staff-count">{data.length} 件</span>}
        </div>

        <div className="staff-list">
          {error && <div className="staff-list-empty">読み込みに失敗しました: {error.message}</div>}
          {!error && data && data.length === 0 && (
            <div className="staff-list-empty">まだ登録がありません。</div>
          )}
          {!error &&
            data?.map((row: IntakeRow) => (
              <Link key={row.id} href={`/staff/intake/${row.id}`} className="staff-list-item">
                <div className="staff-list-top">
                  <div>
                    <span className="staff-list-name">{row.name}</span>
                    <span style={{ marginLeft: 10, fontSize: 12, color: "var(--text-light)" }}>
                      {row.furigana}
                    </span>
                  </div>
                  <div className="staff-list-meta">
                    {row.studio_location && (
                      <span className="staff-list-studio">{row.studio_location}</span>
                    )}
                    <span>{formatDate(row.submitted_at)}</span>
                  </div>
                </div>
                <div className="staff-list-sub">
                  {row.phone && <span>TEL: {row.phone}</span>}
                  {row.birth_date && <span>生年月日: {row.birth_date}</span>}
                </div>
              </Link>
            ))}
        </div>
      </main>
    </div>
  );
}
