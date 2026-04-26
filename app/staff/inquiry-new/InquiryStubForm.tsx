"use client";

import { useState } from "react";
import {
  STUDIO_OPTIONS,
  SOURCE_OPTIONS,
  GENDER_OPTIONS,
} from "@/lib/intake-schema";
import { createInquiryStub } from "./actions";

// 今日の日付を YYYY-MM-DD で
function todayISO(): string {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

export function InquiryStubForm() {
  const [studio, setStudio] = useState<string>("");
  const [sourceChoices, setSourceChoices] = useState<string[]>([]);

  function toggleSource(value: string) {
    setSourceChoices((prev) =>
      prev.includes(value) ? prev.filter((v) => v !== value) : [...prev, value]
    );
  }

  // 詳細入力を要するルートが選ばれているか
  const needsFacility = sourceChoices.includes("support_office");
  const needsHospital = sourceChoices.includes("hospital");
  const needsSns = sourceChoices.includes("sns");
  const needsOther =
    sourceChoices.includes("other") || sourceChoices.includes("referral");

  return (
    <form action={createInquiryStub} className="inquiry-stub-form">
      {/* 事業所選択（必須） */}
      <div className="inquiry-stub-field">
        <label className="inquiry-stub-label">
          事業所<span className="inquiry-stub-required">必須</span>
        </label>
        <div className="inquiry-stub-radio-grid">
          {STUDIO_OPTIONS.map((opt) => (
            <label key={opt.value} className="inquiry-stub-radio">
              <input
                type="radio"
                name="studio_location"
                value={opt.value}
                checked={studio === opt.value}
                onChange={() => setStudio(opt.value)}
                required
              />
              <span>
                <strong>{opt.shortLabel}</strong>
                <span className="inquiry-stub-radio-sub">{opt.label}</span>
              </span>
            </label>
          ))}
        </div>
      </div>

      {/* お問合せ日 */}
      <div className="inquiry-stub-row">
        <div className="inquiry-stub-field">
          <label className="inquiry-stub-label" htmlFor="inquiry_date">
            お問合せ日<span className="inquiry-stub-required">必須</span>
          </label>
          <input
            id="inquiry_date"
            name="inquiry_date"
            type="date"
            defaultValue={todayISO()}
            required
            className="inquiry-stub-input"
          />
        </div>
      </div>

      {/* 名前・ふりがな */}
      <div className="inquiry-stub-row">
        <div className="inquiry-stub-field">
          <label className="inquiry-stub-label" htmlFor="name">
            名前<span className="inquiry-stub-required">必須</span>
          </label>
          <input
            id="name"
            name="name"
            type="text"
            placeholder="例: 山田 花子 / ヤマダ / 山田 / カナさん"
            required
            className="inquiry-stub-input"
          />
          <p className="inquiry-stub-hint">
            仮名・苗字のみ・カタカナでもOK。後で正式な名前に修正できます。
          </p>
        </div>
        <div className="inquiry-stub-field">
          <label className="inquiry-stub-label" htmlFor="furigana">
            ふりがな（任意）
          </label>
          <input
            id="furigana"
            name="furigana"
            type="text"
            placeholder="やまだ はなこ"
            className="inquiry-stub-input"
          />
        </div>
      </div>

      {/* 性別・生年月日 */}
      <div className="inquiry-stub-row">
        <div className="inquiry-stub-field">
          <label className="inquiry-stub-label">性別（任意）</label>
          <div className="inquiry-stub-radio-inline">
            {GENDER_OPTIONS.map((g) => (
              <label key={g} className="inquiry-stub-radio inquiry-stub-radio--inline">
                <input type="radio" name="gender" value={g} />
                <span>{g}</span>
              </label>
            ))}
            <label className="inquiry-stub-radio inquiry-stub-radio--inline">
              <input type="radio" name="gender" value="" defaultChecked />
              <span>未記入</span>
            </label>
          </div>
        </div>
        <div className="inquiry-stub-field">
          <label className="inquiry-stub-label" htmlFor="birth_date">
            生年月日（任意）
          </label>
          <input
            id="birth_date"
            name="birth_date"
            type="date"
            className="inquiry-stub-input"
          />
        </div>
      </div>

      {/* 電話・住所 */}
      <div className="inquiry-stub-row">
        <div className="inquiry-stub-field">
          <label className="inquiry-stub-label" htmlFor="phone">
            電話番号（任意）
          </label>
          <input
            id="phone"
            name="phone"
            type="tel"
            placeholder="090-1234-5678"
            className="inquiry-stub-input"
          />
        </div>
        <div className="inquiry-stub-field">
          <label className="inquiry-stub-label" htmlFor="address">
            住所（任意・市町村だけでも可）
          </label>
          <input
            id="address"
            name="address"
            type="text"
            placeholder="愛知県岡崎市..."
            className="inquiry-stub-input"
          />
        </div>
      </div>

      {/* お問合せルート（必須・複数可） */}
      <div className="inquiry-stub-field">
        <label className="inquiry-stub-label">
          お問合せルート<span className="inquiry-stub-required">必須・複数可</span>
        </label>
        <div className="inquiry-stub-checkbox-grid">
          {SOURCE_OPTIONS.map((opt) => (
            <label key={opt.value} className="inquiry-stub-checkbox">
              <input
                type="checkbox"
                name="source_choices"
                value={opt.value}
                checked={sourceChoices.includes(opt.value)}
                onChange={() => toggleSource(opt.value)}
              />
              <span>{opt.label}</span>
            </label>
          ))}
        </div>
      </div>

      {/* ルート別の詳細入力 */}
      {needsFacility && (
        <div className="inquiry-stub-field">
          <label className="inquiry-stub-label" htmlFor="source_facility_name">
            相談支援事業所名
          </label>
          <input
            id="source_facility_name"
            name="source_facility_name"
            type="text"
            className="inquiry-stub-input"
          />
        </div>
      )}
      {needsHospital && (
        <div className="inquiry-stub-field">
          <label className="inquiry-stub-label" htmlFor="source_hospital_name">
            病院名
          </label>
          <input
            id="source_hospital_name"
            name="source_hospital_name"
            type="text"
            className="inquiry-stub-input"
          />
        </div>
      )}
      {needsSns && (
        <div className="inquiry-stub-field">
          <label className="inquiry-stub-label" htmlFor="source_sns_name">
            どの SNS?（Instagram・TikTok など）
          </label>
          <input
            id="source_sns_name"
            name="source_sns_name"
            type="text"
            className="inquiry-stub-input"
          />
        </div>
      )}
      {needsOther && (
        <div className="inquiry-stub-field">
          <label className="inquiry-stub-label" htmlFor="source_other">
            詳細（紹介者名・経緯・その他）
          </label>
          <input
            id="source_other"
            name="source_other"
            type="text"
            placeholder="例: 天理教○○様より紹介 / 通りがかり"
            className="inquiry-stub-input"
          />
        </div>
      )}

      {/* メモ */}
      <div className="inquiry-stub-field">
        <label className="inquiry-stub-label" htmlFor="staff_notes">
          スタッフメモ（任意）
        </label>
        <textarea
          id="staff_notes"
          name="staff_notes"
          rows={5}
          placeholder="電話で聞き取った内容、印象、次のアクションなど"
          className="inquiry-stub-textarea"
        />
      </div>

      <div className="inquiry-stub-submit">
        <button type="submit" className="staff-action-btn staff-action-btn--primary">
          登録する → 詳細ページへ
        </button>
      </div>
    </form>
  );
}
