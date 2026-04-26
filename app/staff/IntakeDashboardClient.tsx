"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import {
  STUDIO_OPTIONS,
  SOURCE_OPTIONS,
  studioShortLabel,
  type TrialSession,
} from "@/lib/intake-schema";

type AgreementLite = {
  id: string;
  created_at: string;
};

export type IntakeRow = {
  id: string;
  submitted_at: string;
  inquiry_date: string | null;
  service_start_date: string | null;
  studio_location: string | null;
  name: string;
  furigana: string;
  source_choices: string[] | null;
  trial_sessions: TrialSession[] | null;
  city_office_meeting_at: string | null;
  trial_agreements: AgreementLite[];
};

// SOURCE コードから短縮ラベル（一覧表のチップ用）
function sourceShortLabel(value: string): string {
  const map: Record<string, string> = {
    newspaper: "新聞",
    posting: "ポスティング",
    passerby: "通りがかり",
    homepage: "HP",
    hello_work: "ハロワ",
    city_office: "市役所",
    hospital_leaflet: "病院リーフ",
    hospital_referral: "病院紹介",
    hospital: "病院", // 旧データ互換
    support_office: "相談員",
    school: "学校",
    internal: "自社経由",
    sns: "SNS",
    referral: "個人紹介",
    other: "その他",
  };
  return map[value] ?? value;
}

function formatDateOnly(iso: string) {
  const d = new Date(iso);
  return d.toLocaleDateString("ja-JP", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });
}

// 月日だけの簡易表示（5/13 など）— ダッシュボードの市役所面談バッジ用
function formatMonthDay(iso: string) {
  const d = new Date(iso);
  return `${d.getMonth() + 1}/${d.getDate()}`;
}

// 今日の日付から「現在の会計年度」を返す（4月以降ならその年、3月以前なら前年）
function currentFiscalYear(): number {
  const now = new Date();
  return now.getMonth() >= 3 ? now.getFullYear() : now.getFullYear() - 1;
}

function reiwaLabel(fy: number): string {
  const reiwa = fy - 2018;
  if (reiwa <= 0) return `${fy} 年度`;
  return `令和${reiwa}年度`;
}

// 会計年度の月並び（4月→翌3月）
const FY_MONTH_ORDER: number[] = [4, 5, 6, 7, 8, 9, 10, 11, 12, 1, 2, 3];

export function IntakeDashboardClient({
  rows,
  errorMessage,
}: {
  rows: IntakeRow[];
  errorMessage?: string | null;
}) {
  const [studio, setStudio] = useState<string | null>(null);
  // デフォルトは現在の会計年度（令和8）
  const [selectedFy, setSelectedFy] = useState<number | null>(currentFiscalYear());
  const [selectedMonth, setSelectedMonth] = useState<number | null>(null);

  const fyChoices = useMemo(() => {
    const cur = currentFiscalYear();
    return [cur - 2, cur - 1, cur]; // 例: [2024, 2025, 2026]
  }, []);

  const filtered = useMemo(() => {
    return rows.filter((r) => {
      // 事業所フィルタ
      if (studio && r.studio_location !== studio) return false;

      // 年度・月フィルタ用の日付（お問合せ日 → 提出日）
      const dateStr = r.inquiry_date ?? r.submitted_at;
      if (!dateStr) return selectedFy == null && selectedMonth == null;
      const d = new Date(dateStr);
      if (Number.isNaN(d.getTime())) return selectedFy == null && selectedMonth == null;

      // 年度フィルタ
      if (selectedFy != null) {
        const fyStart = new Date(`${selectedFy}-04-01`);
        const fyEnd = new Date(`${selectedFy + 1}-03-31T23:59:59`);
        if (d < fyStart || d > fyEnd) return false;
      }

      // 月フィルタ（年度未選択でも単独で機能する）
      if (selectedMonth != null) {
        if (d.getMonth() + 1 !== selectedMonth) return false;
      }

      return true;
    });
  }, [rows, studio, selectedFy, selectedMonth]);

  return (
    <>
      <div className="dash-filter">
        <div className="dash-filter-row">
          <span className="dash-filter-title">事業所</span>
          <div className="dash-filter-chips">
            <button
              type="button"
              onClick={() => setStudio(null)}
              className={`staff-filter-chip ${!studio ? "staff-filter-chip--active" : ""}`}
            >
              すべて
            </button>
            {STUDIO_OPTIONS.map((opt) => (
              <button
                key={opt.value}
                type="button"
                onClick={() => setStudio(opt.value)}
                className={`staff-filter-chip ${studio === opt.value ? "staff-filter-chip--active" : ""}`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>

        <div className="dash-filter-row">
          <span className="dash-filter-title">年度</span>
          <div className="dash-filter-chips">
            <button
              type="button"
              onClick={() => setSelectedFy(null)}
              className={`staff-filter-chip ${selectedFy == null ? "staff-filter-chip--active" : ""}`}
            >
              全年度
            </button>
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

        <div className="dash-filter-row">
          <span className="dash-filter-title">月</span>
          <div className="dash-filter-chips">
            <button
              type="button"
              onClick={() => setSelectedMonth(null)}
              className={`staff-filter-chip staff-filter-chip--month ${selectedMonth == null ? "staff-filter-chip--active" : ""}`}
            >
              全月
            </button>
            {FY_MONTH_ORDER.map((m) => (
              <button
                key={m}
                type="button"
                onClick={() => setSelectedMonth(m)}
                className={`staff-filter-chip staff-filter-chip--month ${selectedMonth === m ? "staff-filter-chip--active" : ""}`}
              >
                {m}月
              </button>
            ))}
          </div>
          <span className="dash-filter-count">{filtered.length} 件</span>
        </div>
      </div>

      <div className="staff-list">
        {errorMessage && (
          <div className="staff-list-empty">
            読み込みに失敗しました: {errorMessage}
          </div>
        )}
        {!errorMessage && filtered.length === 0 && (
          <div className="staff-list-empty">
            {studio
              ? "この事業所の面談票はまだありません。"
              : "まだ面談票はありません。上の「新規 面談票を発行」から追加できます。"}
          </div>
        )}
        {!errorMessage &&
          filtered.map((row) => {
            const agreements = (row.trial_agreements ?? []).slice().sort(
              (a, b) =>
                new Date(b.created_at).getTime() -
                new Date(a.created_at).getTime()
            );
            const latestAgreement = agreements[0];
            const hasAgreement = !!latestAgreement;
            const trialDays = row.trial_sessions?.length ?? 0;
            const cityMeeting = row.city_office_meeting_at ?? null;
            const serviceStarted = !!row.service_start_date;
            // お問合せ日があればそれを表示、なければ見学日（submitted_at）
            const primaryDate = row.inquiry_date ?? row.submitted_at;
            // ルート: 最初の選択肢を短縮表記で表示
            const primarySource = row.source_choices?.[0] ?? null;

            return (
              <div key={row.id} className="dash-row">
                <span className="dash-row-date">
                  {formatDateOnly(primaryDate)}
                </span>
                <span className="dash-row-studio">
                  {row.studio_location ? studioShortLabel(row.studio_location) : "—"}
                </span>
                <span className="dash-row-name">
                  {row.name}
                  {row.furigana && (
                    <span className="dash-row-furigana">{row.furigana}</span>
                  )}
                </span>
                <span className="dash-row-source">
                  {primarySource ? sourceShortLabel(primarySource) : "—"}
                  {row.source_choices && row.source_choices.length > 1 && (
                    <span className="dash-row-source-more">+{row.source_choices.length - 1}</span>
                  )}
                </span>

                {/* 業務フロー: 誓約書 → 体験 → 市役所 → 利用 の順で進捗を表示 */}
                <div className="dash-row-status-group">
                  {hasAgreement ? (
                    <span className="dash-status dash-status--agreement">
                      ✓ 誓約{agreements.length > 1 ? `(${agreements.length})` : ""}
                    </span>
                  ) : (
                    <span className="dash-status dash-status--empty">誓約</span>
                  )}
                  {trialDays > 0 ? (
                    <span className="dash-status dash-status--trial">
                      体験 {trialDays}日
                    </span>
                  ) : (
                    <span className="dash-status dash-status--empty">体験</span>
                  )}
                  {cityMeeting ? (
                    <span className="dash-status dash-status--meeting">
                      市役 {formatMonthDay(cityMeeting)}
                    </span>
                  ) : (
                    <span className="dash-status dash-status--empty">市役</span>
                  )}
                  {serviceStarted ? (
                    <span className="dash-status dash-status--service">
                      ✓ 利用 {formatMonthDay(row.service_start_date!)}
                    </span>
                  ) : (
                    <span className="dash-status dash-status--empty">利用</span>
                  )}
                </div>

                <div className="dash-row-actions">
                  <Link
                    href={`/staff/intake/${row.id}`}
                    className="dash-row-btn dash-row-btn--secondary"
                    title="面談票を表示"
                  >
                    面談票
                  </Link>
                  {hasAgreement ? (
                    <Link
                      href={`/staff/agreement/${latestAgreement.id}?from=intake&intake_id=${row.id}`}
                      className="dash-row-btn dash-row-btn--secondary"
                      title="誓約書を表示"
                    >
                      誓約書
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
                      title="誓約書を発行"
                    >
                      ＋誓約書
                    </Link>
                  )}
                </div>
              </div>
            );
          })}
      </div>
    </>
  );
}
