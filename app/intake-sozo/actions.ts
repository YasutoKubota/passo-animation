"use server";

import { supabaseAdmin } from "@/lib/supabase";

// 創造空間の面談票項目。タイピング計測はしない。
export type SozoIntakePayload = {
  // 基本情報
  last_name_kana: string;
  first_name_kana: string;
  last_name: string;
  first_name: string;
  home_phone?: string;
  mobile_phone?: string;
  birth_date?: string;
  gender?: string;
  postal_code?: string;
  address?: string;

  // 認知経路（チェック式）と詳細
  source_choices: string[];
  source_hospital_name?: string;
  source_other?: string;

  // 利用経験
  experience_choices: string[];
  source_facility_name?: string; // 相談支援事業所名

  // 病気・医療
  illness_name?: string;
  notebook_present: boolean | null;
  notebook_grade?: string;
  hospital_name?: string;
  doctor_name?: string;
  pickup_used: boolean | null;
  pickup_location?: string;

  // 症状の詳細（8 項目）— DB には 1 つの symptom_detail にまとめて保存
  symptom_onset?: string;
  symptom_cause?: string;
  symptom_main?: string;
  symptom_freq?: string;
  symptom_season?: string;
  symptom_response?: string;
  symptom_consideration?: string;
  doctor_opinion?: string;

  // 「現状の自分をどうしたいか」（チェック + 自由記述）— staff_notes に追記
  future_goals: string[]; // 値: stable / focus / activity_place / talk / long_work / outside / change_self / other
  future_goals_other?: string;
  current_concerns?: string;
};

export type SubmitResult =
  | { success: true; id: string }
  | { success: false; error: string };

function clean(v?: string | null): string | null {
  if (v == null) return null;
  const s = v.trim();
  return s === "" ? null : s;
}

const FUTURE_GOAL_LABEL: Record<string, string> = {
  stable: "体調を安定させたい",
  focus: "集中力を身に着けたい",
  activity_place: "日中の活動の場をつくりたい",
  talk: "人と話せるようになりたい",
  long_work: "仕事を長く続けたい",
  outside: "外に出られるようになりたい",
  change_self: "自分の考え方を変えたい",
};

function buildSymptomDetail(payload: SozoIntakePayload): string | null {
  const parts: string[] = [];
  const push = (label: string, value?: string) => {
    const t = (value ?? "").trim();
    if (t) parts.push(`${label}: ${t}`);
  };
  push("発症時期", payload.symptom_onset);
  push("原因", payload.symptom_cause);
  push("主な症状", payload.symptom_main);
  push("通院頻度", payload.symptom_freq);
  push("出やすい季節", payload.symptom_season);
  push("出たときの対処", payload.symptom_response);
  push("配慮して欲しい点", payload.symptom_consideration);
  push("主治医の意見", payload.doctor_opinion);
  return parts.length > 0 ? parts.join("\n") : null;
}

function buildStaffNotes(payload: SozoIntakePayload): string | null {
  const lines: string[] = [];

  // 送迎の利用
  if (payload.pickup_used === true) {
    const place = payload.pickup_location?.trim();
    lines.push(`【送迎】有${place ? `（場所: ${place}）` : ""}`);
  } else if (payload.pickup_used === false) {
    lines.push("【送迎】無");
  }

  // 「現状の自分をどうしたいか」セクション
  const checked = (payload.future_goals ?? [])
    .map((v) => FUTURE_GOAL_LABEL[v])
    .filter(Boolean);
  if (checked.length > 0 || payload.future_goals_other?.trim()) {
    if (lines.length > 0) lines.push("");
    lines.push("【ご本人が目指す方向】");
    if (checked.length > 0) {
      lines.push(checked.map((s) => `・${s}`).join("\n"));
    }
    if (payload.future_goals_other?.trim()) {
      lines.push(`・その他: ${payload.future_goals_other.trim()}`);
    }
  }

  // 現在のお悩み
  if (payload.current_concerns?.trim()) {
    if (lines.length > 0) lines.push("");
    lines.push("【現在のお悩み】");
    lines.push(payload.current_concerns.trim());
  }

  return lines.length > 0 ? lines.join("\n") : null;
}

export async function submitSozoIntake(
  payload: SozoIntakePayload
): Promise<SubmitResult> {
  // 必須チェック
  const lastNameKana = payload.last_name_kana?.trim() ?? "";
  const firstNameKana = payload.first_name_kana?.trim() ?? "";
  const lastName = payload.last_name?.trim() ?? "";
  const firstName = payload.first_name?.trim() ?? "";
  if (!lastName || !firstName || !lastNameKana || !firstNameKana) {
    return { success: false, error: "お名前とふりがなは必須です" };
  }
  if (
    !payload.home_phone?.trim() &&
    !payload.mobile_phone?.trim()
  ) {
    return {
      success: false,
      error: "自宅電話・携帯電話のどちらか少なくとも 1 つを入力してください",
    };
  }
  if ((payload.source_choices ?? []).length === 0) {
    return {
      success: false,
      error: "認知経路（何を見て知ったか）を 1 つ以上選んでください",
    };
  }

  const symptomDetail = buildSymptomDetail(payload);
  const staffNotes = buildStaffNotes(payload);

  // 携帯を主たる連絡先 (phone) に。なければ自宅を入れる。
  const mainPhone = clean(payload.mobile_phone) ?? clean(payload.home_phone);
  const phoneOwner = "self";

  const { data, error } = await supabaseAdmin
    .from("intake_forms")
    .insert({
      studio_location: "sozo", // 創造空間 固定
      furigana: `${lastNameKana} ${firstNameKana}`,
      name: `${lastName} ${firstName}`,
      phone: mainPhone,
      phone_owner: phoneOwner,
      home_phone: clean(payload.home_phone),
      birth_date: clean(payload.birth_date),
      gender: clean(payload.gender),
      postal_code: clean(payload.postal_code),
      address: clean(payload.address),
      source_choices: payload.source_choices ?? [],
      source_hospital_name: clean(payload.source_hospital_name),
      source_facility_name: clean(payload.source_facility_name),
      source_other: clean(payload.source_other),
      experience_choices: payload.experience_choices ?? [],
      // 創造空間は「興味のある業務」を聞かない
      interested_work: [],
      illness_name: clean(payload.illness_name),
      notebook_status:
        payload.notebook_present === true
          ? "有"
          : payload.notebook_present === false
            ? "無"
            : null,
      notebook_grade: clean(payload.notebook_grade),
      hospital_name: clean(payload.hospital_name),
      doctor_name: clean(payload.doctor_name),
      support_office_used:
        clean(payload.source_facility_name) !== null
          ? true
          : null,
      support_office_name: clean(payload.source_facility_name),
      symptom_detail: symptomDetail,
      staff_notes: staffNotes,
      // experience_other は使わない（必要なら symptom_detail に書く）
      experience_other: null,
      transport: null, // 創造空間は送迎の有無で代替
      // 体験スケジュール・市役所面談は後で Staff Notes Editor で記入
      trial_sessions: [],
    })
    .select("id")
    .single();

  if (error) return { success: false, error: error.message };
  return { success: true, id: data.id };
}
