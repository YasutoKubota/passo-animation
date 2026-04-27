"use client";

import { useState, useTransition } from "react";
import { updateStaffNotes } from "./actions";
import { TRIAL_SLOT_OPTIONS, type TrialSession } from "@/lib/intake-schema";

type Props = {
  id: string;
  initial: {
    inquiry_date: string | null; // YYYY-MM-DD
    scheduled_visit_date: string | null; // YYYY-MM-DD
    service_start_date: string | null; // YYYY-MM-DD
    trial_sessions: TrialSession[];
    city_office_meeting_at: string | null; // ISO string or null
    service_plan_completed_at: string | null; // YYYY-MM-DD
    contract_signed_at: string | null; // YYYY-MM-DD
    status: string; // active / pending / dropped / started
    dropout_at_step: string | null;
    dropout_reason: string | null;
    dropout_at: string | null; // YYYY-MM-DD
    staff_notes: string;
  };
};

const DROPOUT_STEPS = [
  { value: "", label: "—" },
  { value: "visit", label: "見学（来所しなかった）" },
  { value: "trial", label: "体験（合わなかった等）" },
  { value: "city_office", label: "市役所（認定調査が進まなかった）" },
  { value: "plan", label: "計画（相談支援との調整で止まった）" },
  { value: "contract", label: "契約（直前で見送り）" },
  { value: "unknown", label: "不明（音信不通）" },
] as const;

const STATUS_OPTIONS = [
  { value: "active", label: "進行中", desc: "通常進行" },
  { value: "pending", label: "持ち越し", desc: "連絡待ち・しばらく音沙汰なし" },
  { value: "dropped", label: "脱落", desc: "明確に「来ない」と判明" },
  { value: "started", label: "利用中", desc: "すでに利用開始済" },
] as const;

// timestamptz を <input type="datetime-local"> 互換の "YYYY-MM-DDTHH:mm" へ変換。
// DB には ISO 8601 で戻す（Supabase 側で timestamptz として受ける）。
function toLocalInputValue(iso: string | null): string {
  if (!iso) return "";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "";
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

function fromLocalInputValue(v: string): string | null {
  if (!v) return null;
  const d = new Date(v);
  if (Number.isNaN(d.getTime())) return null;
  return d.toISOString();
}

export function StaffNotesEditor({ id, initial }: Props) {
  const [inquiryDate, setInquiryDate] = useState<string>(initial.inquiry_date ?? "");
  const [scheduledVisitDate, setScheduledVisitDate] = useState<string>(
    initial.scheduled_visit_date ?? ""
  );
  const [serviceStartDate, setServiceStartDate] = useState<string>(
    initial.service_start_date ?? ""
  );
  const [sessions, setSessions] = useState<TrialSession[]>(
    initial.trial_sessions.length > 0 ? initial.trial_sessions : []
  );
  const [meetingAt, setMeetingAt] = useState<string>(
    toLocalInputValue(initial.city_office_meeting_at)
  );
  const [planCompletedAt, setPlanCompletedAt] = useState<string>(
    initial.service_plan_completed_at ?? ""
  );
  const [contractSignedAt, setContractSignedAt] = useState<string>(
    initial.contract_signed_at ?? ""
  );
  const [status, setStatus] = useState<string>(initial.status || "active");
  const [dropoutAtStep, setDropoutAtStep] = useState<string>(
    initial.dropout_at_step ?? ""
  );
  const [dropoutReason, setDropoutReason] = useState<string>(
    initial.dropout_reason ?? ""
  );
  const [dropoutAt, setDropoutAt] = useState<string>(initial.dropout_at ?? "");
  const [notes, setNotes] = useState<string>(initial.staff_notes);

  const [isPending, startTransition] = useTransition();
  const [savedAt, setSavedAt] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const addSession = () => {
    setSessions((prev) => [...prev, { date: "", slot: "morning" }]);
  };
  const removeSession = (index: number) => {
    setSessions((prev) => prev.filter((_, i) => i !== index));
  };
  const updateSession = <K extends keyof TrialSession>(
    index: number,
    key: K,
    value: TrialSession[K]
  ) => {
    setSessions((prev) => prev.map((s, i) => (i === index ? { ...s, [key]: value } : s)));
  };

  const save = () => {
    setError(null);
    const cleanedSessions = sessions.filter((s) => s.date); // 日付未入力は保存時に捨てる
    startTransition(async () => {
      const result = await updateStaffNotes({
        id,
        inquiry_date: inquiryDate || null,
        scheduled_visit_date: scheduledVisitDate || null,
        service_start_date: serviceStartDate || null,
        trial_sessions: cleanedSessions,
        city_office_meeting_at: fromLocalInputValue(meetingAt),
        service_plan_completed_at: planCompletedAt || null,
        contract_signed_at: contractSignedAt || null,
        status: status || "active",
        dropout_at_step: dropoutAtStep || null,
        dropout_reason: dropoutReason.trim() || null,
        dropout_at: dropoutAt || null,
        staff_notes: notes,
      });
      if (result.success) {
        setSavedAt(new Date().toLocaleTimeString("ja-JP"));
        setSessions(cleanedSessions);
      } else {
        setError(result.error);
      }
    });
  };

  return (
    <>
      {/* ファネル日付（お問合せ → 来所予定 → 利用開始） */}
      <div className="staff-notes-field">
        <label className="staff-notes-label">利用までの日付</label>
        <div className="staff-notes-funnel-grid">
          <div>
            <div className="staff-notes-funnel-label">お問合せ日</div>
            <input
              type="date"
              className="staff-notes-input"
              value={inquiryDate}
              onChange={(e) => setInquiryDate(e.target.value)}
            />
          </div>
          <div>
            <div className="staff-notes-funnel-label">来所予定日</div>
            <input
              type="date"
              className="staff-notes-input"
              value={scheduledVisitDate}
              onChange={(e) => setScheduledVisitDate(e.target.value)}
            />
          </div>
          <div>
            <div className="staff-notes-funnel-label">利用開始日</div>
            <input
              type="date"
              className="staff-notes-input"
              value={serviceStartDate}
              onChange={(e) => setServiceStartDate(e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* 体験利用スケジュール（原則 3 日） */}
      <div className="staff-notes-field">
        <label className="staff-notes-label">
          体験利用 スケジュール（原則 3 日）
        </label>
        <div className="trial-sessions">
          {sessions.length === 0 && (
            <div className="trial-sessions-empty">
              まだ予定がありません。下の「日程を追加」から登録してください。
            </div>
          )}
          {sessions.map((s, i) => (
            <div key={i} className="trial-session-row">
              <span className="trial-session-num">{i + 1}日目</span>
              <input
                type="date"
                className="trial-session-date"
                value={s.date}
                onChange={(e) => updateSession(i, "date", e.target.value)}
              />
              <div className="trial-session-slots" role="radiogroup" aria-label="時間帯">
                {TRIAL_SLOT_OPTIONS.map((opt) => (
                  <label
                    key={opt.value}
                    className={`trial-slot-chip ${s.slot === opt.value ? "is-selected" : ""}`}
                  >
                    <input
                      type="radio"
                      name={`slot-${i}`}
                      value={opt.value}
                      checked={s.slot === opt.value}
                      onChange={() => updateSession(i, "slot", opt.value)}
                    />
                    <span>{opt.label}</span>
                  </label>
                ))}
              </div>
              <button
                type="button"
                className="trial-session-remove"
                onClick={() => removeSession(i)}
                aria-label={`${i + 1}日目を削除`}
                title="削除"
              >
                ✕
              </button>
            </div>
          ))}
        </div>
        <button type="button" className="trial-session-add" onClick={addSession}>
          + 日程を追加
        </button>
      </div>

      {/* 市役所面談（1 日・日時） */}
      <div className="staff-notes-field">
        <label htmlFor="city_office_meeting_at" className="staff-notes-label">
          市役所面談 日時（受給者証なしの方のみ）
        </label>
        <input
          id="city_office_meeting_at"
          type="datetime-local"
          className="staff-notes-input"
          value={meetingAt}
          onChange={(e) => setMeetingAt(e.target.value)}
        />
      </div>

      {/* サービス等利用計画 / 利用契約（進捗フラグ） */}
      <div className="staff-notes-field">
        <label className="staff-notes-label">利用開始までの追加ステップ</label>
        <div className="staff-notes-funnel-grid">
          <div>
            <div className="staff-notes-funnel-label">計画作成 完了日</div>
            <input
              type="date"
              className="staff-notes-input"
              value={planCompletedAt}
              onChange={(e) => setPlanCompletedAt(e.target.value)}
              title="サービス等利用計画作成（または変更）の完了日"
            />
          </div>
          <div>
            <div className="staff-notes-funnel-label">利用契約日</div>
            <input
              type="date"
              className="staff-notes-input"
              value={contractSignedAt}
              onChange={(e) => setContractSignedAt(e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* 進行状態 + 脱落 / 持ち越し管理 */}
      <div className="staff-notes-field">
        <label className="staff-notes-label">進行状態</label>
        <div className="staff-status-grid">
          {STATUS_OPTIONS.map((opt) => (
            <label
              key={opt.value}
              className={`staff-status-radio ${status === opt.value ? "is-selected" : ""}`}
            >
              <input
                type="radio"
                name="status"
                value={opt.value}
                checked={status === opt.value}
                onChange={() => setStatus(opt.value)}
              />
              <span>
                <strong>{opt.label}</strong>
                <span className="staff-status-radio-desc">{opt.desc}</span>
              </span>
            </label>
          ))}
        </div>
      </div>

      {/* 持ち越し / 脱落 のとき、ステップ・理由・日付を入れる */}
      {(status === "pending" || status === "dropped") && (
        <div className="staff-notes-field staff-notes-dropout">
          <label className="staff-notes-label">
            {status === "pending" ? "持ち越しの状況" : "脱落の状況"}
          </label>
          <div className="staff-notes-funnel-grid">
            <div>
              <div className="staff-notes-funnel-label">どのステップで</div>
              <select
                className="staff-notes-input"
                value={dropoutAtStep}
                onChange={(e) => setDropoutAtStep(e.target.value)}
              >
                {DROPOUT_STEPS.map((s) => (
                  <option key={s.value} value={s.value}>
                    {s.label}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <div className="staff-notes-funnel-label">日付</div>
              <input
                type="date"
                className="staff-notes-input"
                value={dropoutAt}
                onChange={(e) => setDropoutAt(e.target.value)}
              />
            </div>
            <div style={{ gridColumn: "1 / -1" }}>
              <div className="staff-notes-funnel-label">理由・メモ</div>
              <input
                type="text"
                className="staff-notes-input"
                placeholder="例: 「他事業所に決めた」「連絡が取れない」など"
                value={dropoutReason}
                onChange={(e) => setDropoutReason(e.target.value)}
              />
            </div>
          </div>
          <p className="staff-notes-hint">
            持ち越しは「半年後にまた連絡が来た」ような暫定状態。脱落は「もう来ない」と確定した状態。
            どちらも分析画面でルートごとの離脱傾向を可視化します。
          </p>
        </div>
      )}

      {/* 聞き取り内容 */}
      <div className="staff-notes-field">
        <label className="staff-notes-label" htmlFor="notes">
          聞き取り内容 / 備考
        </label>
        <textarea
          id="notes"
          className="staff-notes-textarea"
          placeholder="ご本人から聞き取った内容、気になった点、今後の方針など。長く書いても大丈夫です。"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
        />
      </div>

      <button
        type="button"
        className="staff-notes-save"
        onClick={save}
        disabled={isPending}
      >
        {isPending ? "保存中..." : "保存"}
      </button>
      {savedAt && <span className="staff-notes-saved">Saved {savedAt}</span>}
      {error && (
        <div style={{ color: "#a5361e", fontSize: 12, marginTop: 8 }}>{error}</div>
      )}
    </>
  );
}
