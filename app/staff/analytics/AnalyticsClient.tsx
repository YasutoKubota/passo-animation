"use client";

import { useMemo, useState } from "react";
import {
  STUDIO_OPTIONS,
  SOURCE_OPTIONS,
  studioShortLabel,
} from "@/lib/intake-schema";

export type AnalyticsRow = {
  id: string;
  submitted_at: string;
  inquiry_date: string | null;
  service_start_date: string | null;
  scheduled_visit_date: string | null;
  visited_at: string | null;
  studio_location: string | null;
  gender: string | null;
  birth_date: string | null;
  address: string | null;
  notebook_status: string | null;
  source_choices: string[] | null;
  trial_sessions: { date: string }[] | null;
  city_office_meeting_at: string | null;
  service_plan_completed_at: string | null;
  contract_signed_at: string | null;
  status: string | null;
  dropout_at_step: string | null;
  trial_agreements: { id: string }[];
};

type Props = {
  rows: AnalyticsRow[];
};

// SOURCE コードから日本語ラベル
function sourceLabel(code: string): string {
  return SOURCE_OPTIONS.find((o) => o.value === code)?.label ?? code;
}

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

function cityFromAddress(addr: string | null): string {
  if (!addr) return "不明";
  const m = addr.match(/愛知県?([^市町村]+[市町村])/);
  if (m) return m[1];
  return addr.slice(0, 6);
}

function monthKey(iso: string | null): string | null {
  if (!iso) return null;
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return null;
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
}

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

function reiwaLabel(fy: number): string {
  const reiwa = fy - 2018;
  if (reiwa <= 0) return `${fy} 年度`;
  return `令和${reiwa}年度`;
}

function currentFiscalYear(): number {
  const now = new Date();
  return now.getMonth() >= 3 ? now.getFullYear() : now.getFullYear() - 1;
}

function fiscalYearChoices(): number[] {
  const cur = currentFiscalYear();
  return [cur - 2, cur - 1, cur];
}

// ファネルの各ステップ。順序＝業務フロー通り。
// 問合せ → 見学 → 体験 → 市役所（受給者証なしのみ）→ 計画 → 契約 → 利用開始
const FUNNEL_STEPS = [
  { key: "inquiries", label: "問合せ" },
  { key: "visited", label: "見学" },
  { key: "trialScheduled", label: "体験" },
  { key: "cityMeeting", label: "市役所" },
  { key: "planDone", label: "計画" },
  { key: "contractDone", label: "契約" },
  { key: "serviceStarted", label: "利用開始" },
] as const;

type StepKey = (typeof FUNNEL_STEPS)[number]["key"];

// その行が「どこまで進んだか」を判定する
//   ・visited_at は「実際に来所した日」のみ
//   ・scheduled_visit_date（来所予定日）だけでは「見学した」と見なさない
function reachedStep(r: AnalyticsRow): StepKey {
  if (r.service_start_date) return "serviceStarted";
  if (r.contract_signed_at) return "contractDone";
  if (r.service_plan_completed_at) return "planDone";
  if (r.city_office_meeting_at) return "cityMeeting";
  if ((r.trial_sessions ?? []).length > 0) return "trialScheduled";
  if (r.visited_at) return "visited";
  return "inquiries";
}

// 「離脱」ステップ = 最後に到達したステップの「次のステップ」（serviceStarted 到達なら null）
function dropoutStep(r: AnalyticsRow): StepKey | null {
  const reached = reachedStep(r);
  if (reached === "serviceStarted") return null;
  const idx = FUNNEL_STEPS.findIndex((s) => s.key === reached);
  if (idx < 0 || idx >= FUNNEL_STEPS.length - 1) return null;
  return FUNNEL_STEPS[idx + 1].key;
}

type CountMap = Record<string, number>;
function bumpKey(map: CountMap, key: string) {
  map[key] = (map[key] ?? 0) + 1;
}

export function AnalyticsClient({ rows }: Props) {
  const [selectedStudio, setSelectedStudio] = useState<string | null>(null);
  const [selectedFy, setSelectedFy] = useState<number>(currentFiscalYear() - 1);

  // 表示用に絞り込み（事業所 + 会計年度）
  const filtered = useMemo(() => {
    const fyStart = new Date(`${selectedFy}-04-01`);
    const fyEnd = new Date(`${selectedFy + 1}-03-31T23:59:59`);
    return rows.filter((r) => {
      // 会計年度判定: お問合せ日 (or submitted_at) で判定
      const dateStr = r.inquiry_date ?? r.submitted_at;
      if (!dateStr) return false;
      const d = new Date(dateStr);
      if (Number.isNaN(d.getTime())) return false;
      if (d < fyStart || d > fyEnd) return false;
      // 事業所フィルタ
      if (selectedStudio && r.studio_location !== selectedStudio) return false;
      return true;
    });
  }, [rows, selectedStudio, selectedFy]);

  const aggregate = useMemo(() => {
    const total = filtered.length;
    const months12 = fiscalYearMonths(selectedFy);

    const bySource: CountMap = {};
    const sourceConvCounted: Record<
      string,
      { total: number; converted: number }
    > = {};
    const sourceXGender: Record<string, CountMap> = {};
    const sourceXAge: Record<string, CountMap> = {};
    const sourceXCity: Record<string, CountMap> = {};
    const sourceXNotebook: Record<string, CountMap> = {};
    const monthlyTrend: CountMap = {};
    const byStudio: CountMap = {};
    // 脱落分析: ルート別に「どこで脱落したか」をカウント
    const sourceXDropout: Record<string, CountMap> = {};
    const dropoutTotal: CountMap = {};

    for (const r of filtered) {
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

      const drop = dropoutStep(r);
      if (drop) {
        if (!sourceXDropout[srcLabel]) sourceXDropout[srcLabel] = {};
        const dropLabel =
          FUNNEL_STEPS.find((s) => s.key === drop)?.label ?? drop;
        bumpKey(sourceXDropout[srcLabel], dropLabel);
        bumpKey(dropoutTotal, dropLabel);
      }
    }

    const sourcesSorted = Object.entries(bySource).sort((a, b) => b[1] - a[1]);
    const studiosSorted = Object.entries(byStudio).sort((a, b) => b[1] - a[1]);
    const maxSourceCount = Math.max(1, ...sourcesSorted.map(([, n]) => n));
    const monthsFixed = months12.map(
      (m) => [m, monthlyTrend[m] ?? 0] as [string, number]
    );
    const maxMonth = Math.max(1, ...monthsFixed.map(([, n]) => n));

    // 後段に進むほど件数が減るように cumulative で集計
    const funnel = {
      inquiries: total,
      visited: filtered.filter(
        (r) =>
          ["visited", "trialScheduled", "cityMeeting", "planDone", "contractDone", "serviceStarted"].includes(
            reachedStep(r)
          )
      ).length,
      trialScheduled: filtered.filter(
        (r) =>
          ["trialScheduled", "cityMeeting", "planDone", "contractDone", "serviceStarted"].includes(
            reachedStep(r)
          )
      ).length,
      cityMeeting: filtered.filter(
        (r) =>
          ["cityMeeting", "planDone", "contractDone", "serviceStarted"].includes(
            reachedStep(r)
          )
      ).length,
      planDone: filtered.filter(
        (r) =>
          ["planDone", "contractDone", "serviceStarted"].includes(reachedStep(r))
      ).length,
      contractDone: filtered.filter(
        (r) => ["contractDone", "serviceStarted"].includes(reachedStep(r))
      ).length,
      serviceStarted: filtered.filter((r) => r.service_start_date).length,
    };

    return {
      total,
      sourcesSorted,
      sourceConvCounted,
      sourceXGender,
      sourceXAge,
      sourceXCity,
      sourceXNotebook,
      sourceXDropout,
      dropoutTotal,
      monthsFixed,
      maxMonth,
      maxSourceCount,
      studiosSorted,
      funnel,
    };
  }, [filtered, selectedFy]);

  const fyChoices = fiscalYearChoices();
  const studioName = selectedStudio
    ? STUDIO_OPTIONS.find((s) => s.value === selectedStudio)?.label ??
      selectedStudio
    : "全事業所";

  return (
    <>
      <div className="staff-page-head">
        <div className="staff-page-label">
          <span className="dot" />
          <span>Analytics</span>
        </div>
        <h1 className="staff-page-title">流入・コンバージョン分析</h1>
        <p className="staff-page-sub">
          {reiwaLabel(selectedFy)}（{selectedFy}/4 〜 {selectedFy + 1}/3）・
          {studioName} の問合せ {aggregate.total} 件を集計しています。
        </p>
      </div>

      {/* フィルタ */}
      <section className="staff-card">
        <div className="staff-card-label">表示条件</div>

        <div className="analytics-filter-row">
          <span className="analytics-filter-title">事業所</span>
          <div className="analytics-filter-chips">
            <button
              type="button"
              onClick={() => setSelectedStudio(null)}
              className={`staff-filter-chip ${!selectedStudio ? "staff-filter-chip--active" : ""}`}
            >
              すべて
            </button>
            {STUDIO_OPTIONS.map((opt) => (
              <button
                key={opt.value}
                type="button"
                onClick={() => setSelectedStudio(opt.value)}
                className={`staff-filter-chip ${selectedStudio === opt.value ? "staff-filter-chip--active" : ""}`}
              >
                {opt.shortLabel}
              </button>
            ))}
          </div>
        </div>

        <div className="analytics-filter-row">
          <span className="analytics-filter-title">会計年度</span>
          <div className="analytics-filter-chips">
            {fyChoices.map((fy) => (
              <button
                key={fy}
                type="button"
                onClick={() => setSelectedFy(fy)}
                className={`staff-filter-chip ${selectedFy === fy ? "staff-filter-chip--active" : ""}`}
              >
                {reiwaLabel(fy)}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* ファネル */}
      <section className="staff-card">
        <div className="staff-card-label">ファネル</div>
        <div className="analytics-funnel">
          {FUNNEL_STEPS.map((step, i) => {
            const n = aggregate.funnel[step.key as keyof typeof aggregate.funnel];
            const total = aggregate.funnel.inquiries;
            const ratio = total > 0 ? Math.round((n / total) * 100) : 0;
            const prev =
              i === 0
                ? n
                : aggregate.funnel[
                    FUNNEL_STEPS[i - 1].key as keyof typeof aggregate.funnel
                  ];
            const dropoutAtThis = i === 0 ? 0 : prev - n;
            return (
              <div key={step.key} className="analytics-funnel-step">
                <div className="analytics-funnel-step-num">{n}</div>
                <div className="analytics-funnel-step-label">{step.label}</div>
                <div className="analytics-funnel-step-ratio">{ratio}%</div>
                {i > 0 && dropoutAtThis > 0 && (
                  <div className="analytics-funnel-dropout">
                    −{dropoutAtThis} 離脱
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* 脱落分析（離脱したステップ別の合計） */}
      <section className="staff-card">
        <div className="staff-card-label">どこで離脱したか（{aggregate.total} 件中）</div>
        {Object.keys(aggregate.dropoutTotal).length === 0 ? (
          <div className="staff-list-empty">データなし</div>
        ) : (
          <div className="analytics-dropout-grid">
            {FUNNEL_STEPS.slice(1).map((step) => {
              const n = aggregate.dropoutTotal[step.label] ?? 0;
              const ratio = aggregate.total > 0
                ? Math.round((n / aggregate.total) * 100)
                : 0;
              return (
                <div key={step.key} className="analytics-dropout-cell">
                  <div className="analytics-dropout-num">{n}</div>
                  <div className="analytics-dropout-label">
                    {step.label}<span className="analytics-dropout-arrow"> 直前</span>
                  </div>
                  <div className="analytics-dropout-ratio">{ratio}%</div>
                </div>
              );
            })}
          </div>
        )}
        <p className="analytics-note">
          ※「市役所面談 直前」 = 体験までは来たが市役所面談に進まなかった、の意味
        </p>
      </section>

      {/* ルート別件数 */}
      <section className="staff-card">
        <div className="staff-card-label">ルート別件数</div>
        {aggregate.sourcesSorted.length === 0 ? (
          <div className="staff-list-empty">データなし</div>
        ) : (
          <div className="analytics-bar-list">
            {aggregate.sourcesSorted.map(([src, n]) => (
              <div key={src} className="analytics-bar-row">
                <div className="analytics-bar-label">{src}</div>
                <div className="analytics-bar-track">
                  <div
                    className="analytics-bar-fill"
                    style={{
                      width: `${(n / aggregate.maxSourceCount) * 100}%`,
                    }}
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
              {aggregate.sourcesSorted.map(([src]) => {
                const c = aggregate.sourceConvCounted[src];
                const cv =
                  c.total > 0
                    ? ((c.converted / c.total) * 100).toFixed(1)
                    : "—";
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

      {/* ルート × 離脱ステップ */}
      <section className="staff-card">
        <div className="staff-card-label">ルート × 離脱ステップ</div>
        <CrossTab
          matrix={aggregate.sourceXDropout}
          sources={aggregate.sourcesSorted.map(([s]) => s)}
          keyOrder={FUNNEL_STEPS.slice(1).map((s) => s.label)}
        />
      </section>

      {/* 月別推移（会計年度 12 ヶ月固定） */}
      <section className="staff-card">
        <div className="staff-card-label">
          月別 問合せ推移（{reiwaLabel(selectedFy)}）
        </div>
        <div className="analytics-month-grid">
          {aggregate.monthsFixed.map(([m, n]) => (
            <div key={m} className="analytics-month-cell">
              <div className="analytics-month-bar-wrap">
                <div
                  className="analytics-month-bar"
                  style={{ height: `${(n / aggregate.maxMonth) * 100}%` }}
                />
              </div>
              <div className="analytics-month-label">{m.slice(5)}月</div>
              <div className="analytics-month-num">{n}</div>
            </div>
          ))}
        </div>
      </section>

      <section className="staff-card">
        <div className="staff-card-label">ルート × 性別</div>
        <CrossTab
          matrix={aggregate.sourceXGender}
          sources={aggregate.sourcesSorted.map(([s]) => s)}
        />
      </section>
      <section className="staff-card">
        <div className="staff-card-label">ルート × 年齢層</div>
        <CrossTab
          matrix={aggregate.sourceXAge}
          sources={aggregate.sourcesSorted.map(([s]) => s)}
          keyOrder={["10代", "20代", "30代", "40代", "50代", "60代以上", "不明"]}
        />
      </section>
      <section className="staff-card">
        <div className="staff-card-label">ルート × 市町村</div>
        <CrossTab
          matrix={aggregate.sourceXCity}
          sources={aggregate.sourcesSorted.map(([s]) => s)}
        />
      </section>
      <section className="staff-card">
        <div className="staff-card-label">ルート × 障害者手帳</div>
        <CrossTab
          matrix={aggregate.sourceXNotebook}
          sources={aggregate.sourcesSorted.map(([s]) => s)}
          keyOrder={["無", "精神", "療育", "身体", "不明"]}
        />
      </section>

      {!selectedStudio && (
        <section className="staff-card">
          <div className="staff-card-label">事業所別 問合せ件数</div>
          {aggregate.studiosSorted.length === 0 ? (
            <div className="staff-list-empty">データなし</div>
          ) : (
            <div className="analytics-bar-list">
              {aggregate.studiosSorted.map(([s, n]) => (
                <div key={s} className="analytics-bar-row">
                  <div className="analytics-bar-label">{s}</div>
                  <div className="analytics-bar-track">
                    <div
                      className="analytics-bar-fill"
                      style={{
                        width: `${(n / Math.max(...aggregate.studiosSorted.map(([, x]) => x))) * 100}%`,
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
    </>
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
                <td className="analytics-table-num analytics-table-sum">
                  {sum}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
