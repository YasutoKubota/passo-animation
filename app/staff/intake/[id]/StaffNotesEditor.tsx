"use client";

import { useState, useTransition } from "react";
import { updateStaffNotes } from "./actions";
import { TRIAL_SLOT_OPTIONS, type TrialSession } from "@/lib/intake-schema";

type Props = {
  id: string;
  initial: {
    trial_sessions: TrialSession[];
    city_office_meeting_at: string | null; // ISO string or null
    staff_notes: string;
  };
};

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
  const [sessions, setSessions] = useState<TrialSession[]>(
    initial.trial_sessions.length > 0 ? initial.trial_sessions : []
  );
  const [meetingAt, setMeetingAt] = useState<string>(
    toLocalInputValue(initial.city_office_meeting_at)
  );
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
        trial_sessions: cleanedSessions,
        city_office_meeting_at: fromLocalInputValue(meetingAt),
        staff_notes: notes,
      });
      if (result.success) {
        setSavedAt(new Date().toLocaleTimeString("ja-JP"));
        // 無効行を除去した状態を UI にも反映
        setSessions(cleanedSessions);
      } else {
        setError(result.error);
      }
    });
  };

  return (
    <>
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
          市役所面談 日時
        </label>
        <input
          id="city_office_meeting_at"
          type="datetime-local"
          className="staff-notes-input"
          value={meetingAt}
          onChange={(e) => setMeetingAt(e.target.value)}
        />
      </div>

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
