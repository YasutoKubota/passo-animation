"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { supabaseAdmin } from "@/lib/supabase";
import type { TrialSession } from "@/lib/intake-schema";

export type UpdateNotesPayload = {
  id: string;
  inquiry_date: string | null; // YYYY-MM-DD
  scheduled_visit_date: string | null;
  service_start_date: string | null;
  trial_sessions: TrialSession[];
  city_office_meeting_at: string | null; // ISO 8601
  staff_notes: string;
};

export async function updateStaffNotes(payload: UpdateNotesPayload): Promise<
  { success: true } | { success: false; error: string }
> {
  if (!payload.id) return { success: false, error: "ID が指定されていません" };

  // 体験利用スケジュール: 日付なしの行は捨てる & slot を検証
  const cleanSessions: TrialSession[] = (payload.trial_sessions ?? [])
    .filter((s) => s && s.date)
    .map((s) => ({
      date: s.date,
      slot: s.slot === "afternoon" ? "afternoon" : "morning",
    }));

  const { error } = await supabaseAdmin
    .from("intake_forms")
    .update({
      inquiry_date: payload.inquiry_date,
      scheduled_visit_date: payload.scheduled_visit_date,
      service_start_date: payload.service_start_date,
      trial_sessions: cleanSessions,
      city_office_meeting_at: payload.city_office_meeting_at,
      staff_notes: payload.staff_notes || null,
    })
    .eq("id", payload.id);

  if (error) return { success: false, error: error.message };

  revalidatePath(`/staff/intake/${payload.id}`);
  return { success: true };
}

export type UpdateBasicInfoPayload = {
  id: string;
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

// 仮名・最低限情報で起票したお問合せに、後から正式な情報を上書き保存。
export async function updateBasicInfo(
  payload: UpdateBasicInfoPayload
): Promise<{ success: true } | { success: false; error: string }> {
  if (!payload.id) return { success: false, error: "ID が指定されていません" };
  if (!payload.name?.trim()) {
    return { success: false, error: "名前は空にできません" };
  }

  const { error } = await supabaseAdmin
    .from("intake_forms")
    .update({
      name: payload.name.trim(),
      furigana: payload.furigana.trim(),
      phone: payload.phone,
      birth_date: payload.birth_date,
      gender: payload.gender,
      postal_code: payload.postal_code,
      address: payload.address,
      notebook_status: payload.notebook_status,
      notebook_grade: payload.notebook_grade,
    })
    .eq("id", payload.id);

  if (error) return { success: false, error: error.message };

  revalidatePath(`/staff/intake/${payload.id}`);
  revalidatePath("/staff");
  return { success: true };
}

// 面談票を削除する。
// 紐づく trial_agreements は FK on delete set null で intake_id=null のまま残る。
export async function deleteIntake(formData: FormData): Promise<void> {
  const id = String(formData.get("id") ?? "");
  if (!id) return;

  const { error } = await supabaseAdmin.from("intake_forms").delete().eq("id", id);
  if (error) {
    throw new Error(`削除に失敗しました: ${error.message}`);
  }

  revalidatePath("/staff");
  redirect("/staff");
}

// 誓約書を 1 件削除する。
export async function deleteAgreement(formData: FormData): Promise<void> {
  const id = String(formData.get("id") ?? "");
  const intakeId = String(formData.get("intake_id") ?? "");
  if (!id) return;

  const { error } = await supabaseAdmin.from("trial_agreements").delete().eq("id", id);
  if (error) {
    throw new Error(`削除に失敗しました: ${error.message}`);
  }

  // 面談票詳細とダッシュボードの双方を再検証
  if (intakeId) revalidatePath(`/staff/intake/${intakeId}`);
  revalidatePath("/staff");
}
