"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { supabaseAdmin } from "@/lib/supabase";

export type UpdateNotesPayload = {
  id: string;
  staff_trial_use: string;
  staff_notes: string;
};

export async function updateStaffNotes(payload: UpdateNotesPayload): Promise<
  { success: true } | { success: false; error: string }
> {
  if (!payload.id) return { success: false, error: "ID が指定されていません" };

  const { error } = await supabaseAdmin
    .from("intake_forms")
    .update({
      staff_trial_use: payload.staff_trial_use || null,
      staff_notes: payload.staff_notes || null,
    })
    .eq("id", payload.id);

  if (error) return { success: false, error: error.message };

  revalidatePath(`/staff/intake/${payload.id}`);
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

  revalidatePath("/staff/intake");
  redirect("/staff/intake");
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

  // 面談票詳細・誓約書一覧の双方を再検証
  if (intakeId) revalidatePath(`/staff/intake/${intakeId}`);
  revalidatePath("/staff/agreement");
}
