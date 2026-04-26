"use client";

import { useState, useTransition } from "react";
import { updateBasicInfo } from "./actions";
import { GENDER_OPTIONS, NOTEBOOK_STATUS_OPTIONS } from "@/lib/intake-schema";

type Props = {
  id: string;
  initial: {
    name: string;
    furigana: string;
    phone: string | null;
    birth_date: string | null;
    gender: string | null;
    postal_code: string | null;
    address: string | null;
    notebook_status: string | null;
    notebook_grade: string | null;
  };
};

// 仮名・最低限情報で起票したお問合せに、後から正式な情報を上書きするための編集パネル。
export function BasicInfoEditor({ id, initial }: Props) {
  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [savedAt, setSavedAt] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const [name, setName] = useState(initial.name);
  const [furigana, setFurigana] = useState(initial.furigana);
  const [phone, setPhone] = useState(initial.phone ?? "");
  const [birthDate, setBirthDate] = useState(initial.birth_date ?? "");
  const [gender, setGender] = useState(initial.gender ?? "");
  const [postalCode, setPostalCode] = useState(initial.postal_code ?? "");
  const [address, setAddress] = useState(initial.address ?? "");
  const [notebookStatus, setNotebookStatus] = useState(initial.notebook_status ?? "");
  const [notebookGrade, setNotebookGrade] = useState(initial.notebook_grade ?? "");

  const save = () => {
    setError(null);
    if (!name.trim()) {
      setError("名前は空にできません");
      return;
    }
    startTransition(async () => {
      const result = await updateBasicInfo({
        id,
        name: name.trim(),
        furigana: furigana.trim(),
        phone: phone.trim() || null,
        birth_date: birthDate || null,
        gender: gender || null,
        postal_code: postalCode.trim() || null,
        address: address.trim() || null,
        notebook_status: notebookStatus || null,
        notebook_grade: notebookGrade.trim() || null,
      });
      if (result.success) {
        setSavedAt(new Date().toLocaleTimeString("ja-JP"));
      } else {
        setError(result.error);
      }
    });
  };

  if (!open) {
    return (
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="basic-info-editor-toggle"
      >
        ✎ 基本情報を編集
      </button>
    );
  }

  return (
    <div className="basic-info-editor">
      <div className="basic-info-editor-row">
        <div className="basic-info-editor-field">
          <label>名前</label>
          <input value={name} onChange={(e) => setName(e.target.value)} />
        </div>
        <div className="basic-info-editor-field">
          <label>ふりがな</label>
          <input value={furigana} onChange={(e) => setFurigana(e.target.value)} />
        </div>
      </div>
      <div className="basic-info-editor-row">
        <div className="basic-info-editor-field">
          <label>電話番号</label>
          <input
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />
        </div>
        <div className="basic-info-editor-field">
          <label>生年月日</label>
          <input
            type="date"
            value={birthDate}
            onChange={(e) => setBirthDate(e.target.value)}
          />
        </div>
      </div>
      <div className="basic-info-editor-row">
        <div className="basic-info-editor-field">
          <label>性別</label>
          <select value={gender} onChange={(e) => setGender(e.target.value)}>
            <option value="">未記入</option>
            {GENDER_OPTIONS.map((g) => (
              <option key={g} value={g}>
                {g}
              </option>
            ))}
          </select>
        </div>
        <div className="basic-info-editor-field">
          <label>郵便番号</label>
          <input
            value={postalCode}
            onChange={(e) => setPostalCode(e.target.value)}
            placeholder="444-0000"
          />
        </div>
      </div>
      <div className="basic-info-editor-field">
        <label>住所</label>
        <input value={address} onChange={(e) => setAddress(e.target.value)} />
      </div>
      <div className="basic-info-editor-row">
        <div className="basic-info-editor-field">
          <label>障害者手帳</label>
          <select
            value={notebookStatus}
            onChange={(e) => setNotebookStatus(e.target.value)}
          >
            <option value="">未記入</option>
            {NOTEBOOK_STATUS_OPTIONS.map((n) => (
              <option key={n} value={n}>
                {n}
              </option>
            ))}
          </select>
        </div>
        <div className="basic-info-editor-field">
          <label>等級</label>
          <input
            value={notebookGrade}
            onChange={(e) => setNotebookGrade(e.target.value)}
            placeholder="2級 など"
          />
        </div>
      </div>

      <div className="basic-info-editor-actions">
        <button
          type="button"
          onClick={() => setOpen(false)}
          className="basic-info-editor-cancel"
        >
          閉じる
        </button>
        <button
          type="button"
          onClick={save}
          disabled={isPending}
          className="basic-info-editor-save"
        >
          {isPending ? "保存中..." : "保存"}
        </button>
        {savedAt && (
          <span className="basic-info-editor-saved">Saved {savedAt}</span>
        )}
      </div>
      {error && <div className="basic-info-editor-error">{error}</div>}
    </div>
  );
}
