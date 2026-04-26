import Link from "next/link";
import { StaffTopbar } from "../components/Topbar";
import { supabaseAdmin } from "@/lib/supabase";
import {
  STUDIO_OPTIONS,
  SOURCE_OPTIONS,
  studioShortLabel,
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

// SOURCE コードから日本語短縮ラベル
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

// 月別キーを作る（YYYY-MM）
function monthKey(iso: string | null): string | null {
  if (!iso) return null;
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return null;
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
}

type CountMap = Record<string, number>;
function bumpKey(map: CountMap, key: string) {
  map[key] = (map[key] ?? 0) + 1;
}

export default async function AnalyticsPage() {
  // 過去 12 ヶ月の問合せに絞る
  const since = new Date();
  since.setFullYear(since.getFullYear() - 1);
  const sinceISO = since.toISOString().split("T")[0];

  const { data, error } = await supabaseAdmin
    .from("intake_forms")
    .select(
      "id, submitted_at, inquiry_date, service_start_date, studio_location, gender, birth_date, address, notebook_status, source_choices, trial_sessions, city_office_meeting_at, trial_agreements(id)"
    )
    .gte("submitted_at", sinceISO)
    .limit(2000);

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
  const monthsSorted = Object.entries(monthlyTrend).sort((a, b) => a[0].localeCompare(b[0]));
  const studiosSorted = Object.entries(byStudio).sort((a, b) => b[1] - a[1]);
  const maxSourceCount = Math.max(1, ...sourcesSorted.map(([, n]) => n));
  const maxMonth = Math.max(1, ...monthsSorted.map(([, n]) => n));

  // ファネルカウント（合計）
  const funnel = {
    inquiries: total,
    visited: rows.filter((r) => r.submitted_at).length, // intake 提出 = 見学
    agreementSigned: rows.filter((r) => (r.trial_agreements ?? []).length > 0).length,
    trialScheduled: rows.filter((r) => (r.trial_sessions ?? []).length > 0).length,
    cityMeeting: rows.filter((r) => r.city_office_meeting_at).length,
    serviceStarted: rows.filter((r) => r.service_start_date).length,
  };

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
            過去 12 ヶ月の問合せ {total} 件を集計しています。広告効果や属性傾向の把握に。
          </p>
        </div>

        {error && (
          <div className="staff-list-empty">読み込みに失敗しました: {error.message}</div>
        )}

        {/* ファネル */}
        <section className="staff-card">
          <div className="staff-card-label">ファネル（過去 12 ヶ月）</div>
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
          <table className="analytics-table">
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
        </section>

        {/* 月別推移 */}
        <section className="staff-card">
          <div className="staff-card-label">月別 問合せ推移</div>
          {monthsSorted.length === 0 ? (
            <div className="staff-list-empty">データなし</div>
          ) : (
            <div className="analytics-month-grid">
              {monthsSorted.map(([m, n]) => (
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
          )}
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
          <CrossTab matrix={sourceXNotebook} sources={sourcesSorted.map(([s]) => s)} />
        </section>

        {/* 事業所別件数 */}
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
  // 全カラムを集める
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
    <div style={{ overflowX: "auto" }}>
      <table className="analytics-table">
        <thead>
          <tr>
            <th>ルート</th>
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
                <td>{src}</td>
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
