"use client";

import { useState, useTransition } from "react";
import { updateStaffNotes } from "./actions";

type Props = {
  id: string;
  initial: {
    staff_trial_use: string;
    staff_notes: string;
  };
};

export function StaffNotesEditor({ id, initial }: Props) {
  const [values, setValues] = useState(initial);
  const [isPending, startTransition] = useTransition();
  const [savedAt, setSavedAt] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const save = () => {
    setError(null);
    startTransition(async () => {
      const result = await updateStaffNotes({
        id,
        staff_trial_use: values.staff_trial_use,
        staff_notes: values.staff_notes,
      });
      if (result.success) {
        setSavedAt(new Date().toLocaleTimeString("ja-JP"));
      } else {
        setError(result.error);
      }
    });
  };

  return (
    <>
      <div className="staff-notes-field">
        <label className="staff-notes-label" htmlFor="trial_use">体験利用</label>
        <input
          id="trial_use"
          className="staff-notes-input"
          type="text"
          placeholder="日程・予定など"
          value={values.staff_trial_use}
          onChange={(e) => setValues({ ...values, staff_trial_use: e.target.value })}
        />
      </div>
      <div className="staff-notes-field">
        <label className="staff-notes-label" htmlFor="notes">聞き取り内容 / 備考</label>
        <textarea
          id="notes"
          className="staff-notes-textarea"
          placeholder="ご本人から聞き取った内容、気になった点、今後の方針など。長く書いても大丈夫です。"
          value={values.staff_notes}
          onChange={(e) => setValues({ ...values, staff_notes: e.target.value })}
        />
      </div>
      <button type="button" className="staff-notes-save" onClick={save} disabled={isPending}>
        {isPending ? "保存中..." : "保存"}
      </button>
      {savedAt && <span className="staff-notes-saved">Saved {savedAt}</span>}
      {error && <div style={{ color: "#a5361e", fontSize: 12, marginTop: 8 }}>{error}</div>}
    </>
  );
}
