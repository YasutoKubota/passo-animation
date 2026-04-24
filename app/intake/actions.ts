"use server";

import { supabaseAdmin } from "@/lib/supabase";
import type { TypingMetrics } from "@/lib/intake-schema";

export type IntakePayload = {
  studio_location: string;
  furigana: string;
  name: string;
  phone?: string;
  birth_date?: string;
  gender?: string;
  postal_code?: string;
  address?: string;
  source_choices: string[];
  source_sns_name?: string;
  source_facility_name?: string;
  source_hospital_name?: string;
  source_other?: string;
  experience_choices: string[];
  experience_other?: string;
  transport?: string;
  interested_work: string[];
  interested_work_other?: string;
  illness_name?: string;
  notebook_status?: string;
  notebook_grade?: string;
  hospital_name?: string;
  doctor_name?: string;
  support_office_used?: boolean;
  support_office_name?: string;
  support_office_contact?: string;
  symptom_detail?: string;
  typing_metrics: TypingMetrics;
};

export type SubmitResult =
  | { success: true; id: string }
  | { success: false; error: string };

function clean(value: string | undefined | null): string | null {
  if (value === undefined || value === null) return null;
  const trimmed = value.trim();
  return trimmed === "" ? null : trimmed;
}

export async function submitIntake(payload: IntakePayload): Promise<SubmitResult> {
  if (!payload.name?.trim() || !payload.furigana?.trim()) {
    return { success: false, error: "お名前とふりがなは必須です" };
  }
  if (!payload.studio_location || !["岡崎", "豊田"].includes(payload.studio_location)) {
    return { success: false, error: "事業所が選択されていません" };
  }

  const metrics = payload.typing_metrics;

  const { data, error } = await supabaseAdmin
    .from("intake_forms")
    .insert({
      studio_location: payload.studio_location,
      furigana: payload.furigana.trim(),
      name: payload.name.trim(),
      phone: clean(payload.phone),
      birth_date: clean(payload.birth_date),
      gender: clean(payload.gender),
      postal_code: clean(payload.postal_code),
      address: clean(payload.address),
      source_choices: payload.source_choices ?? [],
      source_sns_name: clean(payload.source_sns_name),
      source_facility_name: clean(payload.source_facility_name),
      source_hospital_name: clean(payload.source_hospital_name),
      source_other: clean(payload.source_other),
      experience_choices: payload.experience_choices ?? [],
      experience_other: clean(payload.experience_other),
      transport: clean(payload.transport),
      interested_work: payload.interested_work ?? [],
      interested_work_other: clean(payload.interested_work_other),
      illness_name: clean(payload.illness_name),
      notebook_status: clean(payload.notebook_status),
      notebook_grade: clean(payload.notebook_grade),
      hospital_name: clean(payload.hospital_name),
      doctor_name: clean(payload.doctor_name),
      support_office_used: payload.support_office_used ?? null,
      support_office_name: clean(payload.support_office_name),
      support_office_contact: clean(payload.support_office_contact),
      symptom_detail: clean(payload.symptom_detail),
      typing_total_duration_ms: metrics.totalDurationMs,
      typing_total_keystrokes: metrics.totalKeystrokes,
      typing_backspace_count: metrics.totalBackspaces,
      typing_paste_count: metrics.totalPastes,
      typing_avg_cpm: metrics.avgCpm,
      typing_per_field: metrics.perField,
    })
    .select("id")
    .single();

  if (error) {
    return { success: false, error: error.message };
  }

  return { success: true, id: data.id };
}
