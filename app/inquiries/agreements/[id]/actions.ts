"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { supabaseAdmin } from "@/lib/supabase";

// 誓約書ビューページからの削除。削除後は from に応じて遷移先を変える。
export async function deleteAgreementFromView(formData: FormData): Promise<void> {
  const id = String(formData.get("id") ?? "");
  const intakeId = String(formData.get("intake_id") ?? "");
  const from = String(formData.get("from") ?? "");
  if (!id) return;

  const { error } = await supabaseAdmin.from("trial_agreements").delete().eq("id", id);
  if (error) {
    throw new Error(`削除に失敗しました: ${error.message}`);
  }

  revalidatePath("/inquiries");
  if (intakeId) revalidatePath(`/inquiries/${intakeId}`);

  if (from === "intake" && intakeId) {
    redirect(`/inquiries/${intakeId}`);
  }
  redirect("/inquiries");
}
