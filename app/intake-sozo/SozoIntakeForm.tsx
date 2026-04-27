"use client";

import { useEffect, useState, useTransition } from "react";
import { GENDER_OPTIONS } from "@/lib/intake-schema";
import { submitSozoIntake, type SozoIntakePayload } from "./actions";
import { verifyPin } from "@/app/staff/login/actions";

// 創造空間の認知経路（Word 書類どおり）
const SOURCE_OPTIONS = [
  { value: "newspaper", label: "新聞折込チラシ" },
  { value: "city_office", label: "保健所" },
  { value: "homepage", label: "ホームページ" },
  { value: "passerby", label: "通りすがり" },
  { value: "hospital", label: "病院", hasDetail: true },
  { value: "other", label: "その他", hasDetail: true },
] as const;

// 利用経験の選択肢（Word 書類どおり）
const EXPERIENCE_OPTIONS = [
  { value: "type_a", label: "A型事業所" },
  { value: "type_b", label: "B型事業所" },
  { value: "transition", label: "移行支援事業所" },
  { value: "support_office", label: "相談支援事業所", hasDetail: true },
] as const;

// 「現状の自分をどうしたいか」の選択肢
// ※「居場所を見つけたい」→「日中の活動の場をつくりたい」に言い換え
const FUTURE_GOAL_OPTIONS = [
  { value: "stable", label: "体調を安定させたい" },
  { value: "focus", label: "集中力を身に着けたい" },
  { value: "activity_place", label: "日中の活動の場をつくりたい" },
  { value: "talk", label: "人と話せるようになりたい" },
  { value: "long_work", label: "仕事を長く続けたい" },
  { value: "outside", label: "外に出られるようになりたい" },
  { value: "change_self", label: "自分の考え方を変えたい" },
] as const;

const TOTAL_STEPS = 5;

type FormState = SozoIntakePayload;

const initialState: FormState = {
  last_name_kana: "",
  first_name_kana: "",
  last_name: "",
  first_name: "",
  home_phone: "",
  mobile_phone: "",
  birth_date: "",
  gender: "",
  postal_code: "",
  address: "",
  source_choices: [],
  source_hospital_name: "",
  source_other: "",
  experience_choices: [],
  source_facility_name: "",
  illness_name: "",
  notebook_present: null,
  notebook_grade: "",
  hospital_name: "",
  doctor_name: "",
  pickup_used: null,
  pickup_location: "",
  symptom_onset: "",
  symptom_cause: "",
  symptom_main: "",
  symptom_freq: "",
  symptom_season: "",
  symptom_response: "",
  symptom_consideration: "",
  doctor_opinion: "",
  future_goals: [],
  future_goals_other: "",
  current_concerns: "",
};

export function SozoIntakeForm() {
  const [step, setStep] = useState(1);
  const [data, setData] = useState<FormState>(initialState);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const [done, setDone] = useState(false);

  // 戻るボタンでスタッフ画面に戻れないように履歴を上書き（プライバシー保護）
  useEffect(() => {
    if (done) return;
    window.history.pushState(null, "", window.location.href);
    const handler = () => {
      window.history.pushState(null, "", window.location.href);
    };
    window.addEventListener("popstate", handler);
    return () => window.removeEventListener("popstate", handler);
  }, [done]);

  const update = <K extends keyof FormState>(key: K, value: FormState[K]) => {
    setData((prev) => ({ ...prev, [key]: value }));
  };

  const toggleArray = (
    key: "source_choices" | "experience_choices" | "future_goals",
    value: string
  ) => {
    setData((prev) => {
      const current = prev[key];
      const has = current.includes(value);
      return { ...prev, [key]: has ? current.filter((v) => v !== value) : [...current, value] };
    });
  };

  const validate = (): string | null => {
    if (step === 1) {
      if (!data.last_name.trim() || !data.first_name.trim()) return "お名前（姓・名）を入力してください";
      if (!data.last_name_kana.trim() || !data.first_name_kana.trim()) return "ふりがな（姓・名）を入力してください";
      if (!data.home_phone?.trim() && !data.mobile_phone?.trim())
        return "自宅電話・携帯電話のどちらかを入力してください";
    }
    if (step === 2) {
      if (data.source_choices.length === 0) return "認知経路を 1 つ以上選んでください";
    }
    return null;
  };

  const next = () => {
    const err = validate();
    if (err) {
      setError(err);
      return;
    }
    setError(null);
    setStep((s) => Math.min(TOTAL_STEPS, s + 1));
  };
  const back = () => {
    setError(null);
    setStep((s) => Math.max(1, s - 1));
  };

  const submit = () => {
    setError(null);
    startTransition(async () => {
      const result = await submitSozoIntake(data);
      if (result.success) {
        setDone(true);
        window.scrollTo({ top: 0, behavior: "smooth" });
      } else {
        setError(result.error);
      }
    });
  };

  if (done) {
    return <DoneScreen />;
  }

  return (
    <div className="intake-form-wrap">
      <div className="intake-stepper">
        Step {step} / {TOTAL_STEPS}
      </div>

      {step === 1 && (
        <Step1Basic data={data} update={update} />
      )}
      {step === 2 && (
        <Step2Source
          data={data}
          update={update}
          toggleArray={toggleArray}
        />
      )}
      {step === 3 && (
        <Step3Medical data={data} update={update} toggleArray={toggleArray} />
      )}
      {step === 4 && <Step4Symptom data={data} update={update} />}
      {step === 5 && (
        <Step5Future data={data} update={update} toggleArray={toggleArray} />
      )}

      {error && <div className="intake-error">{error}</div>}

      <div className="intake-nav">
        {step > 1 && (
          <button type="button" className="intake-btn-back" onClick={back}>
            ← 戻る
          </button>
        )}
        {step < TOTAL_STEPS && (
          <button type="button" className="intake-btn-next" onClick={next}>
            次へ →
          </button>
        )}
        {step === TOTAL_STEPS && (
          <button
            type="button"
            className="intake-btn-submit"
            onClick={submit}
            disabled={isPending}
          >
            {isPending ? "送信中..." : "登録する"}
          </button>
        )}
      </div>
    </div>
  );
}

function FieldRow({
  label,
  required,
  children,
  hint,
}: {
  label: string;
  required?: boolean;
  children: React.ReactNode;
  hint?: string;
}) {
  return (
    <div className="intake-field">
      <label className="intake-label">
        {label}
        {required && <span className="intake-required">必須</span>}
      </label>
      {children}
      {hint && <p className="intake-hint">{hint}</p>}
    </div>
  );
}

function Step1Basic({
  data,
  update,
}: {
  data: FormState;
  update: <K extends keyof FormState>(k: K, v: FormState[K]) => void;
}) {
  return (
    <div className="intake-step">
      <h2 className="intake-step-title">基本情報</h2>

      <div className="intake-field-row">
        <FieldRow label="ふりがな（姓）" required>
          <input
            type="text"
            className="intake-input"
            placeholder="やまだ"
            value={data.last_name_kana}
            onChange={(e) => update("last_name_kana", e.target.value)}
          />
        </FieldRow>
        <FieldRow label="ふりがな（名）" required>
          <input
            type="text"
            className="intake-input"
            placeholder="はなこ"
            value={data.first_name_kana}
            onChange={(e) => update("first_name_kana", e.target.value)}
          />
        </FieldRow>
      </div>

      <div className="intake-field-row">
        <FieldRow label="お名前（姓）" required>
          <input
            type="text"
            className="intake-input"
            placeholder="山田"
            value={data.last_name}
            onChange={(e) => update("last_name", e.target.value)}
          />
        </FieldRow>
        <FieldRow label="お名前（名）" required>
          <input
            type="text"
            className="intake-input"
            placeholder="花子"
            value={data.first_name}
            onChange={(e) => update("first_name", e.target.value)}
          />
        </FieldRow>
      </div>

      <div className="intake-field-row">
        <FieldRow label="電話番号（自宅）" hint="どちらか 1 つで OK">
          <input
            type="tel"
            className="intake-input"
            placeholder="0564-12-3456"
            value={data.home_phone ?? ""}
            onChange={(e) => update("home_phone", e.target.value)}
          />
        </FieldRow>
        <FieldRow label="携帯電話">
          <input
            type="tel"
            className="intake-input"
            placeholder="090-1234-5678"
            value={data.mobile_phone ?? ""}
            onChange={(e) => update("mobile_phone", e.target.value)}
          />
        </FieldRow>
      </div>

      <div className="intake-field-row">
        <FieldRow label="生年月日">
          <input
            type="date"
            className="intake-input"
            value={data.birth_date ?? ""}
            onChange={(e) => update("birth_date", e.target.value)}
          />
        </FieldRow>
        <FieldRow label="性別">
          <div className="intake-radio-inline">
            {GENDER_OPTIONS.map((g) => (
              <label key={g} className="intake-radio">
                <input
                  type="radio"
                  name="gender"
                  value={g}
                  checked={data.gender === g}
                  onChange={() => update("gender", g)}
                />
                <span>{g}</span>
              </label>
            ))}
          </div>
        </FieldRow>
      </div>

      <div className="intake-field-row">
        <FieldRow label="郵便番号">
          <input
            type="text"
            className="intake-input"
            placeholder="444-0000"
            value={data.postal_code ?? ""}
            onChange={(e) => update("postal_code", e.target.value)}
          />
        </FieldRow>
        <FieldRow label="住所">
          <input
            type="text"
            className="intake-input"
            placeholder="愛知県岡崎市..."
            value={data.address ?? ""}
            onChange={(e) => update("address", e.target.value)}
          />
        </FieldRow>
      </div>
    </div>
  );
}

function Step2Source({
  data,
  update,
  toggleArray,
}: {
  data: FormState;
  update: <K extends keyof FormState>(k: K, v: FormState[K]) => void;
  toggleArray: (
    k: "source_choices" | "experience_choices" | "future_goals",
    v: string
  ) => void;
}) {
  return (
    <div className="intake-step">
      <h2 className="intake-step-title">何を見て創造空間を知ったか / 利用経験</h2>

      <FieldRow label="何を見て創造空間をお知りになりましたか？" required hint="複数選択できます">
        <div className="intake-checkbox-grid">
          {SOURCE_OPTIONS.map((opt) => (
            <label key={opt.value} className="intake-checkbox">
              <input
                type="checkbox"
                checked={data.source_choices.includes(opt.value)}
                onChange={() => toggleArray("source_choices", opt.value)}
              />
              <span>{opt.label}</span>
            </label>
          ))}
        </div>
      </FieldRow>

      {data.source_choices.includes("hospital") && (
        <FieldRow label="病院名">
          <input
            type="text"
            className="intake-input"
            value={data.source_hospital_name ?? ""}
            onChange={(e) => update("source_hospital_name", e.target.value)}
          />
        </FieldRow>
      )}
      {data.source_choices.includes("other") && (
        <FieldRow label="その他（詳細）">
          <input
            type="text"
            className="intake-input"
            value={data.source_other ?? ""}
            onChange={(e) => update("source_other", e.target.value)}
          />
        </FieldRow>
      )}

      <FieldRow
        label="障がい者施設、サービス等のご利用経験はありますか？"
        hint="あてはまるものを選んでください"
      >
        <div className="intake-checkbox-grid">
          {EXPERIENCE_OPTIONS.map((opt) => (
            <label key={opt.value} className="intake-checkbox">
              <input
                type="checkbox"
                checked={data.experience_choices.includes(opt.value)}
                onChange={() => toggleArray("experience_choices", opt.value)}
              />
              <span>{opt.label}</span>
            </label>
          ))}
        </div>
      </FieldRow>

      {data.experience_choices.includes("support_office") && (
        <FieldRow label="相談支援事業所名">
          <input
            type="text"
            className="intake-input"
            value={data.source_facility_name ?? ""}
            onChange={(e) => update("source_facility_name", e.target.value)}
          />
        </FieldRow>
      )}
    </div>
  );
}

function Step3Medical({
  data,
  update,
}: {
  data: FormState;
  update: <K extends keyof FormState>(k: K, v: FormState[K]) => void;
  toggleArray: (
    k: "source_choices" | "experience_choices" | "future_goals",
    v: string
  ) => void;
}) {
  return (
    <div className="intake-step">
      <h2 className="intake-step-title">ご病気・症状・医療機関について</h2>

      <FieldRow label="病名">
        <input
          type="text"
          className="intake-input"
          value={data.illness_name ?? ""}
          onChange={(e) => update("illness_name", e.target.value)}
        />
      </FieldRow>

      <div className="intake-field-row">
        <FieldRow label="手帳の有無">
          <div className="intake-radio-inline">
            <label className="intake-radio">
              <input
                type="radio"
                name="notebook_present"
                checked={data.notebook_present === false}
                onChange={() => update("notebook_present", false)}
              />
              <span>無</span>
            </label>
            <label className="intake-radio">
              <input
                type="radio"
                name="notebook_present"
                checked={data.notebook_present === true}
                onChange={() => update("notebook_present", true)}
              />
              <span>有</span>
            </label>
          </div>
        </FieldRow>
        {data.notebook_present === true && (
          <FieldRow label="等級">
            <input
              type="text"
              className="intake-input"
              placeholder="例: 2級"
              value={data.notebook_grade ?? ""}
              onChange={(e) => update("notebook_grade", e.target.value)}
            />
          </FieldRow>
        )}
      </div>

      <div className="intake-field-row">
        <FieldRow label="現在通っている病院名">
          <input
            type="text"
            className="intake-input"
            value={data.hospital_name ?? ""}
            onChange={(e) => update("hospital_name", e.target.value)}
          />
        </FieldRow>
        <FieldRow label="主治医">
          <input
            type="text"
            className="intake-input"
            value={data.doctor_name ?? ""}
            onChange={(e) => update("doctor_name", e.target.value)}
          />
        </FieldRow>
      </div>

      <div className="intake-field-row">
        <FieldRow label="送迎の利用">
          <div className="intake-radio-inline">
            <label className="intake-radio">
              <input
                type="radio"
                name="pickup_used"
                checked={data.pickup_used === false}
                onChange={() => update("pickup_used", false)}
              />
              <span>無</span>
            </label>
            <label className="intake-radio">
              <input
                type="radio"
                name="pickup_used"
                checked={data.pickup_used === true}
                onChange={() => update("pickup_used", true)}
              />
              <span>有</span>
            </label>
          </div>
        </FieldRow>
        {data.pickup_used === true && (
          <FieldRow label="お迎えの場所">
            <input
              type="text"
              className="intake-input"
              placeholder="例: 自宅 / 最寄駅 など"
              value={data.pickup_location ?? ""}
              onChange={(e) => update("pickup_location", e.target.value)}
            />
          </FieldRow>
        )}
      </div>
    </div>
  );
}

function Step4Symptom({
  data,
  update,
}: {
  data: FormState;
  update: <K extends keyof FormState>(k: K, v: FormState[K]) => void;
}) {
  return (
    <div className="intake-step">
      <h2 className="intake-step-title">症状などについて、詳しく教えてください</h2>
      <p className="intake-step-sub">
        書ける範囲で OK です。空欄でも大丈夫です。
      </p>

      <FieldRow label="発症時期">
        <input
          type="text"
          className="intake-input"
          placeholder="例: 高校 1 年生のとき"
          value={data.symptom_onset ?? ""}
          onChange={(e) => update("symptom_onset", e.target.value)}
        />
      </FieldRow>
      <FieldRow label="原因">
        <input
          type="text"
          className="intake-input"
          value={data.symptom_cause ?? ""}
          onChange={(e) => update("symptom_cause", e.target.value)}
        />
      </FieldRow>
      <FieldRow label="主な症状">
        <input
          type="text"
          className="intake-input"
          value={data.symptom_main ?? ""}
          onChange={(e) => update("symptom_main", e.target.value)}
        />
      </FieldRow>
      <FieldRow label="通院頻度">
        <input
          type="text"
          className="intake-input"
          placeholder="例: 月 1 回"
          value={data.symptom_freq ?? ""}
          onChange={(e) => update("symptom_freq", e.target.value)}
        />
      </FieldRow>
      <FieldRow label="出やすい季節">
        <input
          type="text"
          className="intake-input"
          placeholder="例: 春先 / 秋冬"
          value={data.symptom_season ?? ""}
          onChange={(e) => update("symptom_season", e.target.value)}
        />
      </FieldRow>
      <FieldRow label="出たときの対処">
        <input
          type="text"
          className="intake-input"
          value={data.symptom_response ?? ""}
          onChange={(e) => update("symptom_response", e.target.value)}
        />
      </FieldRow>
      <FieldRow
        label="配慮して欲しい点"
        hint="例: 外出を伴う作業（食品工場への出向・外清掃）の可否、苦手な作業 など"
      >
        <textarea
          className="intake-textarea"
          rows={3}
          value={data.symptom_consideration ?? ""}
          onChange={(e) => update("symptom_consideration", e.target.value)}
        />
      </FieldRow>
      <FieldRow label="主治医の意見">
        <input
          type="text"
          className="intake-input"
          value={data.doctor_opinion ?? ""}
          onChange={(e) => update("doctor_opinion", e.target.value)}
        />
      </FieldRow>
    </div>
  );
}

function Step5Future({
  data,
  update,
  toggleArray,
}: {
  data: FormState;
  update: <K extends keyof FormState>(k: K, v: FormState[K]) => void;
  toggleArray: (
    k: "source_choices" | "experience_choices" | "future_goals",
    v: string
  ) => void;
}) {
  return (
    <div className="intake-step">
      <h2 className="intake-step-title">現状の自分を、どのようにしていきたいですか？</h2>
      <p className="intake-step-sub">気になるものを選んでください（複数可）</p>

      <FieldRow label="目指したい方向">
        <div className="intake-checkbox-grid">
          {FUTURE_GOAL_OPTIONS.map((opt) => (
            <label key={opt.value} className="intake-checkbox">
              <input
                type="checkbox"
                checked={data.future_goals.includes(opt.value)}
                onChange={() => toggleArray("future_goals", opt.value)}
              />
              <span>{opt.label}</span>
            </label>
          ))}
        </div>
      </FieldRow>

      <FieldRow label="その他（自由記述）">
        <input
          type="text"
          className="intake-input"
          value={data.future_goals_other ?? ""}
          onChange={(e) => update("future_goals_other", e.target.value)}
        />
      </FieldRow>

      <FieldRow label="現在のお悩みについて">
        <textarea
          className="intake-textarea"
          rows={5}
          placeholder="今、いちばん困っていること・気になっていること"
          value={data.current_concerns ?? ""}
          onChange={(e) => update("current_concerns", e.target.value)}
        />
      </FieldRow>
    </div>
  );
}

function DoneScreen() {
  return (
    <div className="intake-done">
      <div className="intake-done-icon">✓</div>
      <h2 className="intake-done-title">送信ありがとうございました</h2>
      <p className="intake-done-message">
        スタッフが内容を確認して、後日ご連絡します。
        <br />
        この画面はそのままにしておいて、スタッフにお声がけください。
      </p>

      <form action={verifyPin} className="intake-pin-gate">
        <p className="intake-pin-gate-hint">スタッフ: PIN を入力してください</p>
        <input
          type="password"
          inputMode="numeric"
          name="pin"
          className="intake-input"
          placeholder="••••"
          required
        />
        <input type="hidden" name="next" value="/staff" />
        <button type="submit" className="intake-btn-next">
          スタッフ画面へ進む
        </button>
      </form>
    </div>
  );
}
