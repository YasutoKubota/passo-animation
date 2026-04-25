"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { STUDIO_OPTIONS, studioLabel } from "@/lib/intake-schema";

type AgreementLite = {
  id: string;
  created_at: string;
};

export type IntakeRow = {
  id: string;
  submitted_at: string;
  studio_location: string | null;
  name: string;
  furigana: string;
  trial_agreements: AgreementLite[];
};

function formatDateOnly(iso: string) {
  const d = new Date(iso);
  return d.toLocaleDateString("ja-JP", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });
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
    </>
  );
}
