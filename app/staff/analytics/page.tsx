import Link from "next/link";
import { StaffTopbar } from "../components/Topbar";
import { supabaseAdmin } from "@/lib/supabase";
import {
  STUDIO_OPTIONS,
  SOURCE_OPTIONS,
  studioShortLabel,
  studioLabel,
} from "@/lib/intake-schema";

export const dynamic = "force-dynamic";

type IntakeRow = {
  id: string;
  submitted_at: string;
  inquiry_date: string | null;
  service_start_date: string | null;
  studio_location: string | null;
  gender: string | null;
  birth_date: string | null;
  address: string | null;
  notebook_status: string | null;
  source_choices: string[] | null;
  trial_sessions: { date: string }[] | null;
  city_office_meeting_at: string | null;
  trial_agreements: { id: string }[];
};

// SOURCE コードから日本語ラベル
function sourceLabel(code: string): string {
  return SOURCE_OPTIONS.find((o) => o.value === code)?.label ?? code;
}

// 年齢計算
function ageFromBirthDate(birth: string | null): number | null {
  if (!birth) return null;
  const b = new Date(birth);
  const today = new Date();
  let age = today.getFullYear() - b.getFullYear();
  const m = today.getMonth() - b.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < b.getDate())) age--;
  return age;
}

function ageBucket(age: number | null): string {
  if (age == null) return "不明";
  if (age < 20) return "10代";
  if (age < 30) return "20代";
  if (age < 40) return "30代";
  if (age < 50) return "40代";
  if (age < 60) return "50代";
  return "60代以上";
}

// 住所から市町村を抽出（雑だが一旦これでよし）
function cityFromAddress(addr: string | null): string {
  if (!addr) return "不明";
  const m = addr.match(/愛知県?([^市町村]+[市町村])/);
  if (m) return m[1];
  return addr.slice(0, 6);
}

type CountMap = Record<string, number>;
function bumpKey(map: CountMap, key: string) {
  map[key] = (map[key] ?? 0) + 1;
}

// 会計年度 → 開始/終了日 (4月1日 〜 翌3月31日)
function fiscalYearRange(fy: number): { startISO: string; endISO: string } {
  const startISO = `${fy}-04-01`;
  const endISO = `${fy + 1}-03-31`;
  return { startISO, endISO };
}

// 会計年度 → 12 ヶ月のキー配列（4月→翌3月の順）
function fiscalYearMonths(fy: number): string[] {
  const arr: string[] = [];
  for (let i = 0; i < 12; i++) {
    const monthIndex = 3 + i; // 0-indexed: 3 = April
    const year = fy + Math.floor(monthIndex / 12);
    const month = (monthIndex % 12) + 1;
    arr.push(`${year}-${String(month).padStart(2, "0")}`);
  }
  return arr;
}

// 令和換算（令和元年 = 2019）
function reiwaLabel(fy: number): string {
  const reiwa = fy - 2018;
  if (reiwa <= 0) return `${fy} 年度`;
  return `令和${reiwa}年度`;
}

// 月別キーを作る（YYYY-MM）
function monthKey(iso: string | null): string | null {
  if (!iso) return null;
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return null;
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
}

// 今日の日付から「現在の会計年度」を返す（4月以降ならその年、3月以前なら前年）
function currentFiscalYear(): number {
  const now = new Date();
  return now.getMonth() >= 3 ? now.getFullYear() : now.getFullYear() - 1;
}

// 表示する会計年度の選択肢（過去2年〜現在）
function fiscalYearChoices(): number[] {
  const cur = currentFiscalYear();
  return [cur - 2, cur - 1, cur];
}

export default async function AnalyticsPage({
  searchParams,
}: {
  searchParams: Promise<{ studio?: string; fy?: string }>;
}) {
  const params = await searchParams;
  const selectedStudio = params.studio ?? null;
  const selectedFy = params.fy ? Number(params.fy) : currentFiscalYear() - 1;
  const fyRange = fiscalYearRange(selectedFy);
  const months12 = fiscalYearMonths(selectedFy);

  // クエリ：会計年度 (inquiry_date or submitted_at) の範囲で絞る
  // inquiry_date は null のことがあるので、submitted_at で絞った後にメモリ側で再判定
  let query = supabaseAdmin
    .from("intake_forms")
    .select(
      "id, submitted_at, inquiry_date, service_start_date, studio_location, gender, birth_date, address, notebook_status, source_choices, trial_sessions, city_office_meeting_at, trial_agreements(id)"
    )
    .gte("submitted_at", fyRange.startISO)
    .lte("submitted_at", `${fyRange.endISO}T23:59:59`)
    .limit(2000);

  if (selectedStudio) {
    query = query.eq("studio_location", selectedStudio);
  }

  const { data, error } = await query;
  const rows = (data ?? []) as IntakeRow[];
  const total = rows.length;

  // 各種集計
  const bySource: CountMap = {};
  const sourceConvCounted: Record<string, { total: number; converted: number }> = {};
  const sourceXGender: Record<string, CountMap> = {};
  const sourceXAge: Record<string, CountMap> = {};
  const sourceXCity: Record<string, CountMap> = {};
  const sourceXNotebook: Record<string, CountMap> = {};
  const monthlyTrend: CountMap = {};
  const byStudio: CountMap = {};

  for (const r of rows) {
    const src = r.source_choices?.[0] ?? "unknown";
    const srcLabel = src === "unknown" ? "不明" : sourceLabel(src);

    bumpKey(bySource, srcLabel);

    if (!sourceConvCounted[srcLabel]) {
      sourceConvCounted[srcLabel] = { total: 0, converted: 0 };
    }
    sourceConvCounted[srcLabel].total += 1;
    if (r.service_start_date) sourceConvCounted[srcLabel].converted += 1;

    if (!sourceXGender[srcLabel]) sourceXGender[srcLabel] = {};
    bumpKey(sourceXGender[srcLabel], r.gender ?? "不明");

    if (!sourceXAge[srcLabel]) sourceXAge[srcLabel] = {};
    bumpKey(sourceXAge[srcLabel], ageBucket(ageFromBirthDate(r.birth_date)));

    if (!sourceXCity[srcLabel]) sourceXCity[srcLabel] = {};
    bumpKey(sourceXCity[srcLabel], cityFromAddress(r.address));

    if (!sourceXNotebook[srcLabel]) sourceXNotebook[srcLabel] = {};
    bumpKey(sourceXNotebook[srcLabel], r.notebook_status ?? "不明");

    const mk = monthKey(r.inquiry_date ?? r.submitted_at);
    if (mk) bumpKey(monthlyTrend, mk);

    if (r.studio_location) bumpKey(byStudio, studioShortLabel(r.studio_location));
  }

  // 並び替え用
  const sourcesSorted = Object.entries(bySource).sort((a, b) => b[1] - a[1]);
  const studiosSorted = Object.entries(byStudio).sort((a, b) => b[1] - a[1]);
  const maxSourceCount = Math.max(1, ...sourcesSorted.map(([, n]) => n));
  // 月別は会計年度 12 ヶ月固定 → 各月 0 件でも表示
  const monthsFixed = months12.map((m) => [m, monthlyTrend[m] ?? 0] as [string, number]);
  const maxMonth = Math.max(1, ...monthsFixed.map(([, n]) => n));

  // ファネルカウント（合計）
  const funnel = {
    inquiries: total,
    visited: rows.filter((r) => r.submitted_at).length,
    agreementSigned: rows.filter((r) => (r.trial_agreements ?? []).length > 0).length,
    trialScheduled: rows.filter((r) => (r.trial_sessions ?? []).length > 0).length,
    cityMeeting: rows.filter((r) => r.city_office_meeting_at).length,
    serviceStarted: rows.filter((r) => r.service_start_date).length,
  };

  // フィルタ用のクエリ文字列ビルダ
  const buildHref = (next: { studio?: string | null; fy?: number | null }) => {
    const sp = new URLSearchParams();
    const studio = next.studio === undefined ? selectedStudio : next.studio;
    const fy = next.fy === undefined ? selectedFy : next.fy;
    if (studio) sp.set("studio", studio);
    if (fy != null) sp.set("fy", String(fy));
    const q = sp.toString();
    return `/staff/analytics${q ? `?${q}` : ""}`;
  };

  const fyChoices = fiscalYearChoices();
  const studioName = selectedStudio ? studioLabel(selectedStudio) : "全事業所";

  return (
    <div className="staff-root">
      <StaffTopbar section="分析" />
      <main className="staff-main">
        <Link href="/staff" className="staff-back-link">← ダッシュボードに戻る</Link>

        <div className="staff-page-head">
          <div className="staff-page-label">
            <span className="dot" />
            <span>Analytics</span>
          </div>
          <h1 className="staff-page-title">流入・コンバージョン分析</h1>
          <p className="staff-page-sub">
            {reiwaLabel(selectedFy)}（{selectedFy}/4 〜 {selectedFy + 1}/3）・{studioName}
            の問合せ {total} 件を集計しています。
          </p>
        </div>

        {/* フィルタ */}
        <section className="staff-card">
          <div className="staff-card-label">表示条件</div>

          <div className="analytics-filter-row">
            <span className="analytics-filter-title">事業所</span>
            <div className="analytics-filter-chips">
              <Link
                href={buildHref({ studio: null })}
                className={`staff-filter-chip ${!selectedStudio ? "staff-filter-chip--active" : ""}`}
              >
                すべて
              </Link>
              {STUDIO_OPTIONS.map((opt) => (
                <Link
                  key={opt.value}
                  href={buildHref({ studio: opt.value })}
                  className={`staff-filter-chip ${selectedStudio === opt.value ? "staff-filter-chip--active" : ""}`}
                >
                  {opt.shortLabel}
                </Link>
              ))}
            </div>
          </div>

          <div className="analytics-filter-row">
            <span className="analytics-filter-title">会計年度</span>
            <div className="analytics-filter-chips">
              {fyChoices.map((fy) => (
                <Link
                  key={fy}
                  href={buildHref({ fy })}
                  className={`staff-filter-chip ${selectedFy === fy ? "staff-filter-chip--active" : ""}`}
                >
                  {reiwaLabel(fy)}
                </Link>
              ))}
            </div>
          </div>
        </section>

        {error && (
          <div className="staff-list-empty">読み込みに失敗しました: {error.message}</div>
        )}

        {/* ファネル */}
        <section className="staff-card">
          <div className="staff-card-label">ファネル</div>
          <div className="analytics-funnel">
            {[
              { label: "問合せ", n: funnel.inquiries },
              { label: "見学", n: funnel.visited },
              { label: "誓約書", n: funnel.agreementSigned },
              { label: "体験予定", n: funnel.trialScheduled },
              { label: "市役所面談", n: funnel.cityMeeting },
              { label: "利用開始", n: funnel.serviceStarted },
            ].map((step, i, arr) => {
              const ratio = arr[0].n > 0 ? Math.round((step.n / arr[0].n) * 100) : 0;
              return (
                <div key={step.label} className="analytics-funnel-step">
                  <div className="analytics-funnel-step-num">{step.n}</div>
                  <div className="analytics-funnel-step-label">{step.label}</div>
                  <div className="analytics-funnel-step-ratio">{ratio}%</div>
                </div>
              );
            })}
          </div>
        </section>

        {/* ルート別件数 */}
        <section className="staff-card">
          <div className="staff-card-label">ルート別件数</div>
          {sourcesSorted.length === 0 ? (
            <div className="staff-list-empty">データなし</div>
          ) : (
            <div className="analytics-bar-list">
              {sourcesSorted.map(([src, n]) => (
                <div key={src} className="analytics-bar-row">
                  <div className="analytics-bar-label">{src}</div>
                  <div className="analytics-bar-track">
                    <div
                      className="analytics-bar-fill"
                      style={{ width: `${(n / maxSourceCount) * 100}%` }}
                    />
                  </div>
                  <div className="analytics-bar-value">{n}</div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* ルート別 CV 率 */}
        <section className="staff-card">
          <div className="staff-card-label">ルート × 利用開始（コンバージョン率）</div>
          <div className="analytics-table-wrap">
            <table className="analytics-table analytics-table--cv">
              <thead>
                <tr>
                  <th>ルート</th>
                  <th className="analytics-table-num">問合せ</th>
                  <th className="analytics-table-num">利用開始</th>
                  <th className="analytics-table-num">CV 率</th>
                </tr>
              </thead>
              <tbody>
                {sourcesSorted.map(([src]) => {
                  const c = sourceConvCounted[src];
                  const cv = c.total > 0 ? ((c.converted / c.total) * 100).toFixed(1) : "—";
                  return (
                    <tr key={src}>
                      <td>{src}</td>
                      <td className="analytics-table-num">{c.total}</td>
                      <td className="analytics-table-num">{c.converted}</td>
                      <td className="analytics-table-num">{cv}%</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </section>

        {/* 月別推移（会計年度 12 ヶ月固定） */}
        <section className="staff-card">
          <div className="staff-card-label">月別 問合せ推移（{reiwaLabel(selectedFy)}）</div>
          <div className="analytics-month-grid">
            {monthsFixed.map(([m, n]) => (
              <div key={m} className="analytics-month-cell">
                <div className="analytics-month-bar-wrap">
                  <div
                    className="analytics-month-bar"
                    style={{ height: `${(n / maxMonth) * 100}%` }}
                  />
                </div>
                <div className="analytics-month-label">{m.slice(5)}月</div>
                <div className="analytics-month-num">{n}</div>
              </div>
            ))}
          </div>
        </section>

        {/* クロス集計（属性 × ルート） */}
        <section className="staff-card">
          <div className="staff-card-label">ルート × 性別</div>
          <CrossTab matrix={sourceXGender} sources={sourcesSorted.map(([s]) => s)} />
        </section>
        <section className="staff-card">
          <div className="staff-card-label">ルート × 年齢層</div>
          <CrossTab
            matrix={sourceXAge}
            sources={sourcesSorted.map(([s]) => s)}
            keyOrder={["10代", "20代", "30代", "40代", "50代", "60代以上", "不明"]}
          />
        </section>
        <section className="staff-card">
          <div className="staff-card-label">ルート × 市町村</div>
          <CrossTab matrix={sourceXCity} sources={sourcesSorted.map(([s]) => s)} />
        </section>
        <section className="staff-card">
          <div className="staff-card-label">ルート × 障害者手帳</div>
          <CrossTab
            matrix={sourceXNotebook}
            sources={sourcesSorted.map(([s]) => s)}
            keyOrder={["無", "精神", "療育", "身体", "不明"]}
          />
        </section>

        {/* 事業所別件数（フィルタ未指定時のみ） */}
        {!selectedStudio && (
          <section className="staff-card">
            <div className="staff-card-label">事業所別 問合せ件数</div>
            {studiosSorted.length === 0 ? (
              <div className="staff-list-empty">データなし</div>
            ) : (
              <div className="analytics-bar-list">
                {studiosSorted.map(([s, n]) => (
                  <div key={s} className="analytics-bar-row">
                    <div className="analytics-bar-label">{s}</div>
                    <div className="analytics-bar-track">
                      <div
                        className="analytics-bar-fill"
                        style={{
                          width: `${(n / Math.max(...studiosSorted.map(([, x]) => x))) * 100}%`,
                        }}
                      />
                    </div>
                    <div className="analytics-bar-value">{n}</div>
                  </div>
                ))}
              </div>
            )}
          </section>
        )}
      </main>
    </div>
  );
}

function CrossTab({
  matrix,
  sources,
  keyOrder,
}: {
  matrix: Record<string, Record<string, number>>;
  sources: string[];
  keyOrder?: string[];
}) {
  const allKeys = new Set<string>();
  for (const src of sources) {
    Object.keys(matrix[src] ?? {}).forEach((k) => allKeys.add(k));
  }
  const cols = keyOrder
    ? keyOrder.filter((k) => allKeys.has(k))
    : Array.from(allKeys).sort();

  if (sources.length === 0 || cols.length === 0) {
    return <div className="staff-list-empty">データなし</div>;
  }

  return (
    <div className="analytics-table-wrap">
      <table className="analytics-table analytics-table--cross">
        <thead>
          <tr>
            <th className="analytics-table-route">ルート</th>
            {cols.map((c) => (
              <th key={c} className="analytics-table-num">
                {c}
              </th>
            ))}
            <th className="analytics-table-num">計</th>
          </tr>
        </thead>
        <tbody>
          {sources.map((src) => {
            const row = matrix[src] ?? {};
            const sum = cols.reduce((s, c) => s + (row[c] ?? 0), 0);
            return (
              <tr key={src}>
                <td className="analytics-table-route">{src}</td>
                {cols.map((c) => (
                  <td key={c} className="analytics-table-num">
                    {row[c] ?? 0}
                  </td>
                ))}
                <td className="analytics-table-num analytics-table-sum">{sum}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
