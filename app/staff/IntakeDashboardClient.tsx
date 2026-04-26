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

// SOURCE コードから短縮ラベル
function sourceShortLabel(value: string): string {
  const map: Record<string, string> = {
    newspaper: "新聞",
    posting: "ポスティング",
    passerby: "通りがかり",
    homepage: "HP",
    hello_work: "ハロワ",
    support_office: "支援所",
    city_office: "市役所",
    hospital: "病院",
    sns: "SNS",
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

export function IntakeDashboardClient({
  rows,
  errorMessage,
}: {
  rows: IntakeRow[];
  errorMessage?: string | null;
}) {
  const [studio, setStudio] = useState<string | null>(null);

  const filtered = useMemo(() => {
    if (!studio) return rows;
    return rows.filter((r) => r.studio_location === studio);
  }, [rows, studio]);

  return (
    <>
      <div className="staff-list-controls">
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
        <span className="staff-count">{filtered.length} 件</span>
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
                  <span className="dash-row-furigana">{row.furigana}</span>
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
                    <span className="dash-status dash-status--empty">誓約 未</span>
                  )}
                  {trialDays > 0 ? (
                    <span className="dash-status dash-status--trial">
                      体験 {trialDays}日
                    </span>
                  ) : (
                    <span className="dash-status dash-status--empty">体験 未</span>
                  )}
                  {cityMeeting ? (
                    <span className="dash-status dash-status--meeting">
                      市役所 {formatMonthDay(cityMeeting)}
                    </span>
                  ) : (
                    <span className="dash-status dash-status--empty">市役所 未</span>
                  )}
                  {serviceStarted ? (
                    <span className="dash-status dash-status--service">
                      ✓ 利用 {formatMonthDay(row.service_start_date!)}
                    </span>
                  ) : (
                    <span className="dash-status dash-status--empty">利用 未</span>
                  )}
                </div>

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
    </>
  );
}
