"use server";

import { revalidatePath } from "next/cache";
import { supabaseAdmin } from "@/lib/supabase";

export type UpdateNotesPayload = {
  id: string;
  staff_trial_use: string;
  staff_city_office_meeting: string;
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
      staff_city_office_meeting: payload.staff_city_office_meeting || null,
      staff_notes: payload.staff_notes || null,
    })
    .eq("id", payload.id);

  if (error) return { success: false, error: error.message };

  revalidatePath(`/staff/intake/${payload.id}`);
  return { success: true };
}
