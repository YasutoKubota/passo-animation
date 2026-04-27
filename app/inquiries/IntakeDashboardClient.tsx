"use client";

import Link from "next/link";
import { useMemo, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  STUDIO_OPTIONS,
  SOURCE_OPTIONS,
  studioShortLabel,
  type TrialSession,
} from "@/lib/intake-schema";
import { BasicInfoEditor } from "./[id]/BasicInfoEditor";

type AgreementLite = {
  id: string;
  created_at: string;
};

export type IntakeRow = {
  id: string;
  submitted_at: string;
  inquiry_date: string | null;
  scheduled_visit_date: string | null;
  service_start_date: string | null;
  studio_location: string | null;
  name: string;
  furigana: string;
  // 編集ポップアップで使う基本情報
  phone: string | null;
  phone_owner: string | null;
  birth_date: string | null;
  gender: string | null;
  postal_code: string | null;
  address: string | null;
  notebook_status: string | null;
  notebook_grade: string | null;
  visited_at: string | null;
  source_choices: string[] | null;
  trial_sessions: TrialSession[] | null;
  city_office_meeting_at: string | null;
  service_plan_completed_at: string | null;
  contract_signed_at: string | null;
  status: string | null; // active / pending / dropped / started
  dropout_at_step: string | null;
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

// その日付が今日より前か（= 来所済み判定）
function isPastDate(iso: string): boolean {
  const d = new Date(iso);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return d < today;
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
  const router = useRouter();
  const [studio, setStudio] = useState<string | null>(null);
  // デフォルトは現在の会計年度（令和8）
  const [selectedFy, setSelectedFy] = useState<number | null>(currentFiscalYear());
  const [selectedMonth, setSelectedMonth] = useState<number | null>(null);
  // 編集ポップアップ：選択された行を開く
  const [editingRow, setEditingRow] = useState<IntakeRow | null>(null);

  // モーダル表示中は背面のスクロールを止める
  useEffect(() => {
    if (!editingRow) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [editingRow]);

  // ESC キーでモーダル閉じる
  useEffect(() => {
    if (!editingRow) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") setEditingRow(null);
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [editingRow]);

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

        {/* ヘッダー行（カラム見出し）— 行と同じ grid で揃う */}
        {!errorMessage && filtered.length > 0 && (
          <div className="dash-row dash-row--header" aria-hidden="true">
            <span>日付</span>
            <span>事業所</span>
            <span>名前</span>
            <span>ルート</span>
            <div className="dash-row-status-group">
              <span>見学</span>
              <span>誓約</span>
              <span>体験</span>
              <span>市役</span>
              <span>計画</span>
              <span>契約</span>
              <span>利用</span>
            </div>
            <span>状態</span>
            <span>操作</span>
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
            const planDone = !!row.service_plan_completed_at;
            const contractDone = !!row.contract_signed_at;
            const serviceStarted = !!row.service_start_date;
            const isDropped = row.status === "dropped";
            const isPending = row.status === "pending";
            // 表示する日付の優先度: 見学日（確定）> お問合せ日 > フォーム提出日
            // 見学日が決まったら、進捗の節目になる「いつ来るか」が一目で分かるようにする
            const primaryDate =
              row.scheduled_visit_date ?? row.inquiry_date ?? row.submitted_at;
            const dateType: "見学" | "問合せ" | "登録" = row.scheduled_visit_date
              ? "見学"
              : row.inquiry_date
                ? "問合せ"
                : "登録";
            // ルート: 最初の選択肢を短縮表記で表示
            const primarySource = row.source_choices?.[0] ?? null;

            return (
              <div
                key={row.id}
                className={`dash-row ${isDropped ? "dash-row--dropped" : ""} ${isPending ? "dash-row--pending" : ""}`}
              >
                <span className="dash-row-date">
                  {formatDateOnly(primaryDate)}
                  <span
                    className={`dash-row-date-tag dash-row-date-tag--${dateType === "見学" ? "visit" : dateType === "問合せ" ? "inquiry" : "submitted"}`}
                  >
                    {dateType}
                  </span>
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

                {/* 業務フロー 7 段階: 統一ルール
                 *  ・「○○予定 4/28」 = 未来日（青系）
                 *  ・「○○済 4/15」または「✓ ○○」 = 過去日 or 完了（緑系）
                 *  ・「○○未」 = 未着手（グレー破線）
                 */}
                <div className="dash-row-status-group">
                  {/* 見学
                   *  ・visited_at がある             → 「✓ 見学 4/15」（実来所）
                   *  ・なくて scheduled_visit_date あり → 「見学予定 4/28」（予定）
                   *  ・両方なし                       → 「見学未」 */}
                  {row.visited_at ? (
                    <span className="dash-status dash-status--done">
                      ✓ 見学 {formatMonthDay(row.visited_at)}
                    </span>
                  ) : row.scheduled_visit_date ? (
                    <span className="dash-status dash-status--scheduled">
                      見学予定 {formatMonthDay(row.scheduled_visit_date)}
                    </span>
                  ) : (
                    <span className="dash-status dash-status--empty">見学未</span>
                  )}
                  {/* 誓約（予定の概念がないので 済/未 のみ） */}
                  {hasAgreement ? (
                    <span className="dash-status dash-status--done">
                      ✓ 誓約{agreements.length > 1 ? `(${agreements.length})` : ""}
                    </span>
                  ) : (
                    <span className="dash-status dash-status--empty">誓約未</span>
                  )}
                  {/* 体験 */}
                  {trialDays > 0 ? (
                    <span className="dash-status dash-status--scheduled">
                      体験予定 {trialDays}日
                    </span>
                  ) : (
                    <span className="dash-status dash-status--empty">体験未</span>
                  )}
                  {/* 市役所面談 */}
                  {cityMeeting ? (
                    isPastDate(cityMeeting) ? (
                      <span className="dash-status dash-status--done">
                        ✓ 市役 {formatMonthDay(cityMeeting)}
                      </span>
                    ) : (
                      <span className="dash-status dash-status--scheduled">
                        市役予定 {formatMonthDay(cityMeeting)}
                      </span>
                    )
                  ) : (
                    <span className="dash-status dash-status--empty">市役未</span>
                  )}
                  {/* サービス等利用計画 */}
                  {planDone ? (
                    <span className="dash-status dash-status--done">
                      ✓ 計画 {formatMonthDay(row.service_plan_completed_at!)}
                    </span>
                  ) : (
                    <span className="dash-status dash-status--empty">計画未</span>
                  )}
                  {/* 利用契約 */}
                  {contractDone ? (
                    <span className="dash-status dash-status--done">
                      ✓ 契約 {formatMonthDay(row.contract_signed_at!)}
                    </span>
                  ) : (
                    <span className="dash-status dash-status--empty">契約未</span>
                  )}
                  {/* 利用開始（最終ゴール → 別色で強調） */}
                  {serviceStarted ? (
                    <span className="dash-status dash-status--service">
                      ✓ 利用 {formatMonthDay(row.service_start_date!)}
                    </span>
                  ) : (
                    <span className="dash-status dash-status--empty">利用未</span>
                  )}
                </div>

                {/* 脱落 / 持ち越し のステータスバッジ（active のときは出さない） */}
                {(isDropped || isPending) && (
                  <span
                    className={`dash-row-status-pill ${isDropped ? "is-dropped" : "is-pending"}`}
                    title={
                      row.dropout_at_step
                        ? `${isDropped ? "脱落" : "持ち越し"}（${row.dropout_at_step}）`
                        : isDropped
                          ? "脱落"
                          : "持ち越し"
                    }
                  >
                    {isDropped ? "✕ 脱落" : "⏸ 持越"}
                  </span>
                )}

                <div className="dash-row-actions">
                  <Link
                    href={`/inquiries/${row.id}`}
                    className="dash-row-btn dash-row-btn--secondary"
                    title="面談票を表示"
                  >
                    面談票
                  </Link>
                  {hasAgreement ? (
                    <Link
                      href={`/inquiries/agreements/${latestAgreement.id}?from=intake&intake_id=${row.id}`}
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
                      target="_blank"
                      rel="noopener noreferrer"
                      className="dash-row-btn dash-row-btn--primary"
                      title="誓約書を発行（新しいタブで開きます）"
                    >
                      ＋誓約書
                    </Link>
                  )}
                  {/* ✎ ボタンでポップアップを開いて、基本情報をその場で編集 */}
                  <button
                    type="button"
                    onClick={() => setEditingRow(row)}
                    className="dash-row-btn-icon"
                    title="基本情報を編集（名前・電話・住所など）"
                    aria-label="基本情報を編集"
                  >
                    ✎
                  </button>
                </div>
              </div>
            );
          })}
      </div>

      {/* 基本情報の編集モーダル（✎ ボタンで開く） */}
      {editingRow && (
        <div
          className="edit-modal-backdrop"
          onClick={() => setEditingRow(null)}
          role="dialog"
          aria-modal="true"
          aria-labelledby="edit-modal-title"
        >
          <div
            className="edit-modal"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="edit-modal-head">
              <div>
                <div className="edit-modal-eyebrow">基本情報を編集</div>
                <h2 id="edit-modal-title" className="edit-modal-title">
                  {editingRow.name}
                  {editingRow.furigana && (
                    <span className="edit-modal-furigana">
                      {editingRow.furigana}
                    </span>
                  )}
                </h2>
              </div>
              <button
                type="button"
                onClick={() => setEditingRow(null)}
                className="edit-modal-close"
                aria-label="閉じる"
              >
                ×
              </button>
            </div>
            <div className="edit-modal-body">
              <BasicInfoEditor
                id={editingRow.id}
                alwaysOpen
                onSaved={() => {
                  // 保存成功 → モーダル閉じて、ダッシュボードを最新に
                  setEditingRow(null);
                  router.refresh();
                }}
                initial={{
                  name: editingRow.name,
                  furigana: editingRow.furigana,
                  phone: editingRow.phone,
                  phone_owner: editingRow.phone_owner,
                  birth_date: editingRow.birth_date,
                  gender: editingRow.gender,
                  postal_code: editingRow.postal_code,
                  address: editingRow.address,
                  notebook_status: editingRow.notebook_status,
                  notebook_grade: editingRow.notebook_grade,
                  visited_at: editingRow.visited_at,
                }}
              />
            </div>
          </div>
        </div>
      )}
    </>
  );
}
