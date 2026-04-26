"use client";

import Link from "next/link";
import { useState, useTransition, useEffect } from "react";
import {
  STUDIO_OPTIONS,
  GENDER_OPTIONS,
  SOURCE_OPTIONS,
  EXPERIENCE_OPTIONS,
  TRANSPORT_OPTIONS,
  INTERESTED_WORK_OPTIONS,
  NOTEBOOK_STATUS_OPTIONS,
  PC_USAGE_OPTIONS,
  PC_TYPE_OPTIONS,
} from "@/lib/intake-schema";
import { useTypingTracker } from "@/lib/typing-tracker";
import { verifyPin } from "@/app/staff/login/actions";
import { submitIntake } from "./actions";

type FormState = {
  studio_location: string;
  last_name_kana: string;
  first_name_kana: string;
  last_name: string;
  first_name: string;
  phone: string;
  birth_date: string;
  gender: string;
  postal_code: string;
  address: string;
  source_choices: string[];
  source_sns_name: string;
  source_facility_name: string;
  source_hospital_name: string;
  source_other: string;
  experience_choices: string[];
  experience_other: string;
  transport: string;
  interested_work: string[];
  interested_work_other: string;
  illness_name: string;
  notebook_status: string;
  notebook_grade: string;
  hospital_name: string;
  doctor_name: string;
  support_office_used: boolean | null;
  support_office_name: string;
  support_office_contact: string;
  symptom_detail: string;
  usual_pc_usage: string;
  usual_pc_type: string;
};

const initialState: FormState = {
  studio_location: "",
  last_name_kana: "",
  first_name_kana: "",
  last_name: "",
  first_name: "",
  phone: "",
  birth_date: "",
  gender: "",
  postal_code: "",
  address: "",
  source_choices: [],
  source_sns_name: "",
  source_facility_name: "",
  source_hospital_name: "",
  source_other: "",
  experience_choices: [],
  experience_other: "",
  transport: "",
  interested_work: [],
  interested_work_other: "",
  illness_name: "",
  notebook_status: "",
  notebook_grade: "",
  hospital_name: "",
  doctor_name: "",
  support_office_used: null,
  support_office_name: "",
  support_office_contact: "",
  symptom_detail: "",
  usual_pc_usage: "",
  usual_pc_type: "",
};

const TOTAL_STEPS = 7;

export default function IntakePage() {
  const [step, setStep] = useState(0); // 0 = welcome/studio, 1..6 = form steps, 7 = done
  const [data, setData] = useState<FormState>(initialState);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const [done, setDone] = useState(false);
  const { trackField, finalize } = useTypingTracker();

  // フォーム入力中、ブラウザの「戻る」ボタンでスタッフ画面（前のページ）に
  // 戻れないように履歴を上書きし続ける（プライバシー保護のため）。
  // 完了画面（done）のあとは制御を解除する。
  useEffect(() => {
    if (done) return;
    window.history.pushState(null, "", window.location.href);
    const handler = () => {
      window.history.pushState(null, "", window.location.href);
    };
    window.addEventListener("popstate", handler);
    return () => window.removeEventListener("popstate", handler);
  }, [done]);

  const updateField = <K extends keyof FormState>(key: K, value: FormState[K]) => {
    setData((prev) => ({ ...prev, [key]: value }));
  };

  const toggleArrayValue = (key: "source_choices" | "experience_choices" | "interested_work", value: string) => {
    setData((prev) => {
      const current = prev[key];
      const has = current.includes(value);
      return { ...prev, [key]: has ? current.filter((v) => v !== value) : [...current, value] };
    });
  };

  const handleStudioSelect = (studio: string) => {
    updateField("studio_location", studio);
    setStep(1);
  };

  const goBack = () => {
    setError(null);
    setStep((s) => Math.max(0, s - 1));
  };

  const validateCurrentStep = (): string | null => {
    if (step === 1) {
      if (
        !data.last_name_kana.trim() ||
        !data.first_name_kana.trim() ||
        !data.last_name.trim() ||
        !data.first_name.trim()
      ) {
        return "ふりがな（姓・名）とお名前（姓・名）をすべて入力してください";
      }
      if (!data.phone.trim()) return "電話番号を入力してください";
      if (!data.birth_date) return "生年月日を入力してください";
      if (!data.gender) return "性別を選択してください";
      if (!data.postal_code.trim()) return "郵便番号を入力してください";
      if (!data.address.trim()) return "住所を入力してください";
    }
    if (step === 2) {
      if (data.source_choices.length === 0)
        return "見学を知ったきっかけを 1 つ以上選択してください";
      if (data.source_choices.includes("sns") && !data.source_sns_name.trim())
        return "SNS 名（Instagram・TikTok など）を入力してください";
      if (data.source_choices.includes("support_office") && !data.source_facility_name.trim())
        return "相談支援事業所名を入力してください";
      if (data.source_choices.includes("hospital") && !data.source_hospital_name.trim())
        return "病院名を入力してください";
      if (data.source_choices.includes("other") && !data.source_other.trim())
        return "きっかけ「その他」の詳細を入力してください";
    }
    if (step === 3) {
      if (data.experience_choices.length === 0)
        return "ご経験のあるサービスを 1 つ以上選んでください（「経験なし」も含む）";
      if (data.experience_choices.includes("other") && !data.experience_other.trim())
        return "経験「その他」の詳細を入力してください";
    }
    if (step === 4) {
      if (!data.transport) return "通う手段を選択してください";
      if (data.interested_work.length === 0)
        return "興味のある業務を 1 つ以上選んでください（「特にない」でも可）";
      if (data.interested_work.includes("other") && !data.interested_work_other.trim())
        return "興味「その他」の詳細を入力してください";
    }
    if (step === 5) {
      if (!data.illness_name.trim())
        return "病名を入力してください（無い場合は「なし」と入力してください）";
      if (!data.notebook_status) return "障害者手帳の有無を選択してください";
      if (data.notebook_status !== "無" && !data.notebook_grade.trim())
        return "手帳の等級を入力してください";
      if (!data.hospital_name.trim())
        return "通院先を入力してください（無い場合は「なし」と入力してください）";
      if (!data.doctor_name.trim())
        return "主治医を入力してください（無い場合は「なし」と入力してください）";
      if (data.support_office_used === null)
        return "相談支援事業所の利用有無を選択してください";
      if (data.support_office_used === true) {
        if (!data.support_office_name.trim())
          return "相談支援事業所名を入力してください";
        if (!data.support_office_contact.trim())
          return "担当者の方の名前を入力してください";
      }
      if (!data.symptom_detail.trim())
        return "症状・配慮事項を入力してください（特に無い場合は「特になし」と入力してください）";
    }
    if (step === 6) {
      if (!data.usual_pc_usage) return "普段のパソコン利用頻度を選択してください";
      if (data.usual_pc_usage !== "none" && !data.usual_pc_type)
        return "普段使うパソコンの種類を選択してください";
    }
    return null;
  };

  const goNext = () => {
    setError(null);
    const err = validateCurrentStep();
    if (err) {
      setError(err);
      return;
    }
    setStep((s) => s + 1);
  };

  const handleSubmit = () => {
    setError(null);
    const metrics = finalize();
    // 苗字と名前を半角スペース 1 つで連結（DB 上は従来通り name / furigana 1 列で保存）
    const composedFurigana = `${data.last_name_kana.trim()} ${data.first_name_kana.trim()}`;
    const composedName = `${data.last_name.trim()} ${data.first_name.trim()}`;
    startTransition(async () => {
      const result = await submitIntake({
        studio_location: data.studio_location,
        furigana: composedFurigana,
        name: composedName,
        phone: data.phone,
        birth_date: data.birth_date,
        gender: data.gender,
        postal_code: data.postal_code,
        address: data.address,
        source_choices: data.source_choices,
        source_sns_name: data.source_sns_name,
        source_facility_name: data.source_facility_name,
        source_hospital_name: data.source_hospital_name,
        source_other: data.source_other,
        experience_choices: data.experience_choices,
        experience_other: data.experience_other,
        transport: data.transport,
        interested_work: data.interested_work,
        interested_work_other: data.interested_work_other,
        illness_name: data.illness_name,
        notebook_status: data.notebook_status,
        notebook_grade: data.notebook_grade,
        hospital_name: data.hospital_name,
        doctor_name: data.doctor_name,
        support_office_used: data.support_office_used ?? undefined,
        support_office_name: data.support_office_name,
        support_office_contact: data.support_office_contact,
        symptom_detail: data.symptom_detail,
        usual_pc_usage: data.usual_pc_usage,
        usual_pc_type: data.usual_pc_type,
        typing_metrics: metrics,
      });
      if (result.success) {
        setDone(true);
      } else {
        setError(result.error);
      }
    });
  };

  // --- Postal code lookup via zipcloud (no API key) ---
  const lookupPostalCode = async () => {
    const raw = data.postal_code.replace(/[^0-9]/g, "");
    if (raw.length !== 7) return;
    try {
      const res = await fetch(`https://zipcloud.ibsnet.co.jp/api/search?zipcode=${raw}`);
      const json = await res.json();
      if (json.results && json.results[0]) {
        const r = json.results[0];
        const combined = `${r.address1}${r.address2}${r.address3}`;
        // Only fill if user hasn't already entered something
        if (!data.address.trim()) {
          updateField("address", combined);
        }
      }
    } catch {
      // silent fail — user can type address manually
    }
  };

  // --- Done screen（ご本人向け + スタッフ PIN ゲート） ---
  if (done) {
    return (
      <>
        <Topbar step={null} />
        <main className="intake-stage">
          <div className="intake-done">
            <div className="intake-done-mark">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 12l5 5L20 7" />
              </svg>
            </div>
            <h1>ありがとうございました</h1>
            <p>
              入力いただいた内容はスタッフに共有されました。
              <br />
              <strong>このパソコンをスタッフにお返しください。</strong>
            </p>

            <div className="intake-staff-gate">
              <div className="intake-staff-gate-label">スタッフの方へ</div>
              <form action={verifyPin} className="intake-staff-gate-form">
                <input type="hidden" name="next" value="/staff" />
                <input
                  type="password"
                  name="pin"
                  inputMode="numeric"
                  autoComplete="off"
                  required
                  placeholder="PINコード"
                  className="intake-staff-gate-input"
                  aria-label="スタッフPIN"
                />
                <button type="submit" className="intake-staff-gate-btn">
                  確認
                </button>
              </form>
              <p className="intake-staff-gate-hint">
                PIN を入力すると、スタッフダッシュボードに戻ります。
              </p>
            </div>
          </div>
        </main>
      </>
    );
  }

  // --- Step 0: 事業所選択（スタッフのみが操作する画面）---
  if (step === 0) {
    return (
      <>
        <Topbar step={null} />
        <main className="intake-stage">
          <div className="intake-welcome">
            <div className="intake-staff-note">
              <div className="intake-staff-note-label">スタッフの方へ</div>
              <p>
                ご本人が来所する事業所を選択してから、<br />
                このパソコンをご本人にお渡しください。
              </p>
              <Link href="/staff" className="intake-staff-note-link">
                ← ダッシュボードに戻る
              </Link>
            </div>

            <div className="studio-choice studio-choice--four">
              {STUDIO_OPTIONS.map((option) => {
                const disabled = option.comingSoon;
                return (
                  <button
                    key={option.value}
                    type="button"
                    className={`studio-card ${disabled ? "studio-card--disabled" : ""}`}
                    onClick={() => !disabled && handleStudioSelect(option.value)}
                    disabled={disabled}
                    aria-disabled={disabled}
                  >
                    <div className="studio-card-label">
                      Studio
                      {disabled ? (
                        <span className="studio-card-type studio-card-type--soon">
                          準備中
                        </span>
                      ) : (
                        <span className={`studio-card-type studio-card-type--${option.type === "B型" ? "btype" : "ikou"}`}>
                          {option.type}
                        </span>
                      )}
                    </div>
                    <div className="studio-card-name">{option.label}</div>
                    <div className="studio-card-desc">{option.description}</div>
                  </button>
                );
              })}
            </div>
          </div>
        </main>
      </>
    );
  }

  // --- Form steps ---
  return (
    <>
      <Topbar step={step} />
      <main className="intake-stage">
        <div className="intake-step">
          {step === 1 && (
            <>
              <div className="step-label">
                <span className="num">Step 01 / {TOTAL_STEPS}</span> · 基本情報
              </div>
              <h2 className="step-title">お名前と連絡先を教えてください</h2>
              <p className="step-help">ここは正確にご記入ください（スタッフから後日ご連絡する場合があります）。</p>
              <div className="step-fields">
                <div className="field-row">
                  <div className="field">
                    <label className="field-label" htmlFor="last_name_kana">
                      ふりがな（姓） <span className="required">必須</span>
                    </label>
                    <input
                      id="last_name_kana"
                      className="field-input"
                      type="text"
                      autoComplete="off"
                      placeholder="やまだ"
                      value={data.last_name_kana}
                      onChange={(e) => updateField("last_name_kana", e.target.value)}
                      {...trackField("last_name_kana")}
                    />
                  </div>
                  <div className="field">
                    <label className="field-label" htmlFor="first_name_kana">
                      ふりがな（名） <span className="required">必須</span>
                    </label>
                    <input
                      id="first_name_kana"
                      className="field-input"
                      type="text"
                      autoComplete="off"
                      placeholder="はなこ"
                      value={data.first_name_kana}
                      onChange={(e) => updateField("first_name_kana", e.target.value)}
                      {...trackField("first_name_kana")}
                    />
                  </div>
                </div>
                <div className="field-row">
                  <div className="field">
                    <label className="field-label" htmlFor="last_name">
                      お名前（姓） <span className="required">必須</span>
                    </label>
                    <input
                      id="last_name"
                      className="field-input"
                      type="text"
                      autoComplete="family-name"
                      placeholder="山田"
                      value={data.last_name}
                      onChange={(e) => updateField("last_name", e.target.value)}
                      {...trackField("last_name")}
                    />
                  </div>
                  <div className="field">
                    <label className="field-label" htmlFor="first_name">
                      お名前（名） <span className="required">必須</span>
                    </label>
                    <input
                      id="first_name"
                      className="field-input"
                      type="text"
                      autoComplete="given-name"
                      placeholder="花子"
                      value={data.first_name}
                      onChange={(e) => updateField("first_name", e.target.value)}
                      {...trackField("first_name")}
                    />
                  </div>
                </div>
                <div className="field">
                  <label className="field-label" htmlFor="phone">
                    電話番号 <span className="required">必須</span>
                  </label>
                  <input
                    id="phone"
                    className="field-input"
                    type="tel"
                    autoComplete="tel"
                    placeholder="090-0000-0000"
                    value={data.phone}
                    onChange={(e) => updateField("phone", e.target.value)}
                    {...trackField("phone")}
                  />
                </div>
                <div className="field-row">
                  <div className="field">
                    <label className="field-label" htmlFor="birth_date">
                      生年月日 <span className="required">必須</span>
                    </label>
                    <input
                      id="birth_date"
                      className="field-input"
                      type="date"
                      value={data.birth_date}
                      onChange={(e) => updateField("birth_date", e.target.value)}
                    />
                  </div>
                  <div className="field">
                    <label className="field-label" htmlFor="gender">
                      性別 <span className="required">必須</span>
                    </label>
                    <select
                      id="gender"
                      className="field-select"
                      value={data.gender}
                      onChange={(e) => updateField("gender", e.target.value)}
                    >
                      <option value="">選択してください</option>
                      {GENDER_OPTIONS.map((g) => (
                        <option key={g} value={g}>{g}</option>
                      ))}
                    </select>
                  </div>
                </div>
                <div className="field">
                  <label className="field-label" htmlFor="postal_code">
                    郵便番号 <span className="required">必須</span>
                  </label>
                  <p className="field-hint">7桁を入力すると住所が自動で入ります</p>
                  <input
                    id="postal_code"
                    className="field-input"
                    type="text"
                    inputMode="numeric"
                    autoComplete="postal-code"
                    placeholder="4730901"
                    value={data.postal_code}
                    onChange={(e) => updateField("postal_code", e.target.value)}
                    onBlur={lookupPostalCode}
                    {...trackField("postal_code")}
                  />
                </div>
                <div className="field">
                  <label className="field-label" htmlFor="address">
                    住所 <span className="required">必須</span>
                  </label>
                  <input
                    id="address"
                    className="field-input"
                    type="text"
                    autoComplete="street-address"
                    placeholder="愛知県豊田市御幸本町..."
                    value={data.address}
                    onChange={(e) => updateField("address", e.target.value)}
                    {...trackField("address")}
                  />
                </div>
              </div>
            </>
          )}

          {step === 2 && (
            <>
              <div className="step-label">
                <span className="num">Step 02 / {TOTAL_STEPS}</span> · きっかけ
              </div>
              <h2 className="step-title">どこで当事業所を知りましたか？</h2>
              <p className="step-help">あてはまるものをすべて選んでください。</p>
              <div className="choice-grid">
                {SOURCE_OPTIONS.map((option) => {
                  const isSelected = data.source_choices.includes(option.value);
                  return (
                    <div key={option.value}>
                      <label className={`choice-chip ${isSelected ? "is-selected" : ""}`}>
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => toggleArrayValue("source_choices", option.value)}
                        />
                        <span className="checkbox-box" />
                        <span>{option.label}</span>
                      </label>
                      {"hasDetail" in option && option.hasDetail && isSelected && (
                        <div className="choice-detail">
                          <label className="field-label">{option.detailLabel}</label>
                          <input
                            className="field-input"
                            type="text"
                            value={data[option.detailField as keyof FormState] as string}
                            onChange={(e) => updateField(option.detailField as keyof FormState, e.target.value as never)}
                            {...trackField(option.detailField)}
                          />
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </>
          )}

          {step === 3 && (
            <>
              <div className="step-label">
                <span className="num">Step 03 / {TOTAL_STEPS}</span> · これまでの利用経験
              </div>
              <h2 className="step-title">障がい者支援施設やヘルパーのご利用経験は？</h2>
              <p className="step-help">あてはまるものをすべて選んでください。なければ何も選ばずに進めてください。</p>
              <div className="choice-grid">
                {EXPERIENCE_OPTIONS.map((option) => {
                  const isSelected = data.experience_choices.includes(option.value);
                  return (
                    <div key={option.value}>
                      <label className={`choice-chip ${isSelected ? "is-selected" : ""}`}>
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => toggleArrayValue("experience_choices", option.value)}
                        />
                        <span className="checkbox-box" />
                        <span>{option.label}</span>
                      </label>
                      {"hasDetail" in option && option.hasDetail && isSelected && (
                        <div className="choice-detail">
                          <label className="field-label">{option.detailLabel}</label>
                          <input
                            className="field-input"
                            type="text"
                            value={data.experience_other}
                            onChange={(e) => updateField("experience_other", e.target.value)}
                            {...trackField("experience_other")}
                          />
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </>
          )}

          {step === 4 && (
            <>
              <div className="step-label">
                <span className="num">Step 04 / {TOTAL_STEPS}</span> · 移動手段と興味
              </div>
              <h2 className="step-title">通う手段と、興味のある業務について</h2>

              <div className="step-fields">
                <div className="field">
                  <label className="field-label">現在の主な移動手段</label>
                  <div className="choice-grid choice-grid--two">
                    {TRANSPORT_OPTIONS.map((option) => {
                      const isSelected = data.transport === option.value;
                      return (
                        <label
                          key={option.value}
                          className={`choice-chip ${isSelected ? "is-selected" : ""}`}
                        >
                          <input
                            type="radio"
                            name="transport"
                            value={option.value}
                            checked={isSelected}
                            onChange={() => updateField("transport", option.value)}
                          />
                          <span className="radio-box" />
                          <span>{option.label}</span>
                        </label>
                      );
                    })}
                  </div>
                </div>

                <div className="field">
                  <label className="field-label">やってみたい業務 / 興味のある業務</label>
                  <p className="field-hint">あてはまるものをすべて選んでください。</p>
                  <div className="choice-grid choice-grid--two">
                    {INTERESTED_WORK_OPTIONS.map((option) => {
                      const isSelected = data.interested_work.includes(option.value);
                      return (
                        <div key={option.value}>
                          <label className={`choice-chip ${isSelected ? "is-selected" : ""}`}>
                            <input
                              type="checkbox"
                              checked={isSelected}
                              onChange={() => toggleArrayValue("interested_work", option.value)}
                            />
                            <span className="checkbox-box" />
                            <span>{option.label}</span>
                          </label>
                          {"hasDetail" in option && option.hasDetail && isSelected && (
                            <div className="choice-detail">
                              <label className="field-label">{option.detailLabel}</label>
                              <input
                                className="field-input"
                                type="text"
                                value={data.interested_work_other}
                                onChange={(e) => updateField("interested_work_other", e.target.value)}
                                {...trackField("interested_work_other")}
                              />
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </>
          )}

          {step === 5 && (
            <>
              <div className="step-label">
                <span className="num">Step 05 / {TOTAL_STEPS}</span> · 健康・医療
              </div>
              <h2 className="step-title">健康面について教えてください</h2>
              <p className="step-help">無い場合は「なし」「特になし」と入力してください。</p>
              <div className="step-fields">
                <div className="field">
                  <label className="field-label" htmlFor="illness_name">
                    病名 <span className="required">必須</span>
                  </label>
                  <input
                    id="illness_name"
                    className="field-input"
                    type="text"
                    placeholder="無い場合は「なし」"
                    value={data.illness_name}
                    onChange={(e) => updateField("illness_name", e.target.value)}
                    {...trackField("illness_name")}
                  />
                </div>

                <div className="field">
                  <label className="field-label">
                    手帳の有無 <span className="required">必須</span>
                  </label>
                  <div className="choice-grid choice-grid--two">
                    {NOTEBOOK_STATUS_OPTIONS.map((option) => {
                      const isSelected = data.notebook_status === option;
                      return (
                        <label
                          key={option}
                          className={`choice-chip ${isSelected ? "is-selected" : ""}`}
                        >
                          <input
                            type="radio"
                            name="notebook_status"
                            value={option}
                            checked={isSelected}
                            onChange={() => updateField("notebook_status", option)}
                          />
                          <span className="radio-box" />
                          <span>{option === "無" ? "無し" : option}</span>
                        </label>
                      );
                    })}
                  </div>
                </div>

                {data.notebook_status && data.notebook_status !== "無" && (
                  <div className="field">
                    <label className="field-label" htmlFor="notebook_grade">
                      等級 <span className="required">必須</span>
                    </label>
                    <input
                      id="notebook_grade"
                      className="field-input"
                      type="text"
                      placeholder="例: 2級"
                      value={data.notebook_grade}
                      onChange={(e) => updateField("notebook_grade", e.target.value)}
                      {...trackField("notebook_grade")}
                    />
                  </div>
                )}

                <div className="field">
                  <label className="field-label" htmlFor="hospital_name">
                    現在通っている病院 <span className="required">必須</span>
                  </label>
                  <input
                    id="hospital_name"
                    className="field-input"
                    type="text"
                    placeholder="無い場合は「なし」"
                    value={data.hospital_name}
                    onChange={(e) => updateField("hospital_name", e.target.value)}
                    {...trackField("hospital_name")}
                  />
                </div>

                <div className="field">
                  <label className="field-label" htmlFor="doctor_name">
                    主治医 <span className="required">必須</span>
                  </label>
                  <input
                    id="doctor_name"
                    className="field-input"
                    type="text"
                    placeholder="無い場合は「なし」"
                    value={data.doctor_name}
                    onChange={(e) => updateField("doctor_name", e.target.value)}
                    {...trackField("doctor_name")}
                  />
                </div>

                <div className="field">
                  <label className="field-label">
                    相談支援事業所の利用 <span className="required">必須</span>
                  </label>
                  <div className="choice-grid choice-grid--two">
                    <label className={`choice-chip ${data.support_office_used === false ? "is-selected" : ""}`}>
                      <input
                        type="radio"
                        name="support_office_used"
                        checked={data.support_office_used === false}
                        onChange={() => updateField("support_office_used", false)}
                      />
                      <span className="radio-box" />
                      <span>無し</span>
                    </label>
                    <label className={`choice-chip ${data.support_office_used === true ? "is-selected" : ""}`}>
                      <input
                        type="radio"
                        name="support_office_used"
                        checked={data.support_office_used === true}
                        onChange={() => updateField("support_office_used", true)}
                      />
                      <span className="radio-box" />
                      <span>有り</span>
                    </label>
                  </div>
                </div>

                {data.support_office_used === true && (
                  <>
                    <div className="field">
                      <label className="field-label" htmlFor="support_office_name">
                        事業所名 <span className="required">必須</span>
                      </label>
                      <input
                        id="support_office_name"
                        className="field-input"
                        type="text"
                        value={data.support_office_name}
                        onChange={(e) => updateField("support_office_name", e.target.value)}
                        {...trackField("support_office_name")}
                      />
                    </div>
                    <div className="field">
                      <label className="field-label" htmlFor="support_office_contact">
                        担当者 <span className="required">必須</span>
                      </label>
                      <input
                        id="support_office_contact"
                        className="field-input"
                        type="text"
                        value={data.support_office_contact}
                        onChange={(e) => updateField("support_office_contact", e.target.value)}
                        {...trackField("support_office_contact")}
                      />
                    </div>
                  </>
                )}

                <div className="field">
                  <label className="field-label" htmlFor="symptom_detail">
                    症状・配慮してほしいこと <span className="required">必須</span>
                  </label>
                  <p className="field-hint">体調・困りごと・配慮事項などを教えてください。特に無い場合は「特になし」と入力してください。</p>
                  <textarea
                    id="symptom_detail"
                    className="field-textarea"
                    placeholder="特に無い場合は「特になし」"
                    value={data.symptom_detail}
                    onChange={(e) => updateField("symptom_detail", e.target.value)}
                    {...trackField("symptom_detail")}
                  />
                </div>
              </div>
            </>
          )}

          {step === 6 && (
            <>
              <div className="step-label">
                <span className="num">Step 06 / {TOTAL_STEPS}</span> · パソコンの利用状況
              </div>
              <h2 className="step-title">普段のパソコン環境を教えてください</h2>
              <p className="step-help">
                この情報は、スタッフが「普段のリズムでの入力かどうか」を判断するために使います。成績や評価には直接使いません。
              </p>
              <div className="step-fields">
                <div className="field">
                  <label className="field-label">
                    普段、パソコンをどのくらい使っていますか？ <span className="required">必須</span>
                  </label>
                  <div className="choice-grid">
                    {PC_USAGE_OPTIONS.map((opt) => (
                      <label
                        key={opt.value}
                        className={`choice-chip ${data.usual_pc_usage === opt.value ? "is-selected" : ""}`}
                      >
                        <input
                          type="radio"
                          name="usual_pc_usage"
                          value={opt.value}
                          checked={data.usual_pc_usage === opt.value}
                          onChange={() => {
                            updateField("usual_pc_usage", opt.value);
                            // 「持っていない」を選んだら PC 種別はクリア
                            if (opt.value === "none") {
                              updateField("usual_pc_type", "");
                            }
                          }}
                        />
                        <span className="radio-box" aria-hidden />
                        <span>{opt.label}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {data.usual_pc_usage && data.usual_pc_usage !== "none" && (
                  <div className="field">
                    <label className="field-label">
                      普段、どんなパソコンを使っていますか？ <span className="required">必須</span>
                    </label>
                    <div className="field-hint">
                      OS と形状（デスクトップ / ノート）をお選びください。
                    </div>
                    <div className="choice-grid choice-grid--two">
                      {PC_TYPE_OPTIONS.map((opt) => (
                        <label
                          key={opt.value}
                          className={`choice-chip ${data.usual_pc_type === opt.value ? "is-selected" : ""}`}
                        >
                          <input
                            type="radio"
                            name="usual_pc_type"
                            value={opt.value}
                            checked={data.usual_pc_type === opt.value}
                            onChange={() => updateField("usual_pc_type", opt.value)}
                          />
                          <span className="radio-box" aria-hidden />
                          <span>{opt.label}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </>
          )}

          {step === 7 && (
            <>
              <div className="step-label">
                <span className="num">Step 07 / {TOTAL_STEPS}</span> · 内容の確認
              </div>
              <h2 className="step-title">入力内容をご確認ください</h2>
              <p className="step-help">修正したい場合は「戻る」で前の画面に戻れます。</p>
              <Summary data={data} />
            </>
          )}
        </div>
      </main>

      <nav className="intake-nav">
        <div className="intake-nav-inner">
          {step >= 2 && (
            <button type="button" className="nav-btn nav-btn--ghost" onClick={goBack} disabled={isPending}>
              戻る
            </button>
          )}
          {step < TOTAL_STEPS && (
            <button type="button" className="nav-btn nav-btn--primary" onClick={goNext} disabled={isPending}>
              次へ
            </button>
          )}
          {step === TOTAL_STEPS && (
            <button type="button" className="nav-btn nav-btn--primary" onClick={handleSubmit} disabled={isPending}>
              {isPending ? "送信中..." : "送信する"}
            </button>
          )}
        </div>
        {error && <div className="nav-error">{error}</div>}
      </nav>
    </>
  );
}

function Topbar({ step }: { step: number | null }) {
  return (
    <header className="intake-topbar">
      <div className="intake-brand">
        <img
          src="/images/logo-passo.png"
          alt="Passo a Passo"
          className="intake-brand-logo"
        />
      </div>
      {step !== null && step > 0 && (
        <div className="intake-progress" aria-label={`ステップ ${step} / ${TOTAL_STEPS}`}>
          {Array.from({ length: TOTAL_STEPS }).map((_, i) => {
            const n = i + 1;
            const cls = n === step ? "is-current" : n < step ? "is-done" : "";
            return <span key={n} className={`intake-progress-dot ${cls}`} />;
          })}
        </div>
      )}
    </header>
  );
}

// --- Summary component for the confirmation screen ---
function Summary({ data }: { data: FormState }) {
  const labelFor = <T extends { value: string; label: string }>(options: readonly T[], value: string) => {
    return options.find((o) => o.value === value)?.label ?? value;
  };
  const labelsFor = <T extends { value: string; label: string }>(options: readonly T[], values: string[]) => {
    return values.map((v) => labelFor(options, v)).join("、");
  };

  const row = (label: string, value: React.ReactNode) => {
    const empty = value === undefined || value === null || value === "" || (Array.isArray(value) && value.length === 0);
    return (
      <div className="summary-row">
        <div className="summary-row-label">{label}</div>
        <div className="summary-row-value">
          {empty ? <span className="summary-row-empty">未入力</span> : value}
        </div>
      </div>
    );
  };

  return (
    <div>
      <div className="summary-block">
        <div className="summary-block-title">Basic</div>
        {row("事業所", data.studio_location)}
        {row("ふりがな", `${data.last_name_kana} ${data.first_name_kana}`.trim())}
        {row("お名前", `${data.last_name} ${data.first_name}`.trim())}
        {row("電話", data.phone)}
        {row("生年月日", data.birth_date)}
        {row("性別", data.gender)}
        {row("郵便番号", data.postal_code)}
        {row("住所", data.address)}
      </div>

      <div className="summary-block">
        <div className="summary-block-title">Source · Experience</div>
        {row("きっかけ", labelsFor(SOURCE_OPTIONS, data.source_choices) || "")}
        {data.source_sns_name && row("SNS", data.source_sns_name)}
        {data.source_facility_name && row("相談支援事業所", data.source_facility_name)}
        {data.source_hospital_name && row("病院", data.source_hospital_name)}
        {data.source_other && row("その他", data.source_other)}
        {row("利用経験", labelsFor(EXPERIENCE_OPTIONS, data.experience_choices) || "")}
        {data.experience_other && row("経験(その他)", data.experience_other)}
      </div>

      <div className="summary-block">
        <div className="summary-block-title">Transport · Interest</div>
        {row("移動手段", labelFor(TRANSPORT_OPTIONS, data.transport))}
        {row("興味のある業務", labelsFor(INTERESTED_WORK_OPTIONS, data.interested_work) || "")}
        {data.interested_work_other && row("興味(その他)", data.interested_work_other)}
      </div>

      <div className="summary-block">
        <div className="summary-block-title">Health</div>
        {row("病名", data.illness_name)}
        {row("手帳", data.notebook_status ? `${data.notebook_status}${data.notebook_grade ? `・${data.notebook_grade}` : ""}` : "")}
        {row("病院", data.hospital_name)}
        {row("主治医", data.doctor_name)}
        {row("相談支援事業所", data.support_office_used === true ? `${data.support_office_name}${data.support_office_contact ? `（${data.support_office_contact}）` : ""}` : data.support_office_used === false ? "無し" : "")}
        {row("症状", data.symptom_detail)}
      </div>

      <div className="summary-block">
        <div className="summary-block-title">PC</div>
        {row("普段の利用", labelFor(PC_USAGE_OPTIONS, data.usual_pc_usage))}
        {data.usual_pc_usage !== "none" &&
          row("普段の機種", labelFor(PC_TYPE_OPTIONS, data.usual_pc_type))}
      </div>
    </div>
  );
}
