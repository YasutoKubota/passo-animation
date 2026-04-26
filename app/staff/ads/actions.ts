"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { supabaseAdmin } from "@/lib/supabase";

export type AdCampaignPayload = {
  id?: string;
  studio_location: string | null;
  ad_channel: string;
  name: string;
  start_date: string; // YYYY-MM-DD
  end_date: string | null;
  budget_yen: number | null;
  target_description: string | null;
  creative_notes: string | null;
  creative_url: string | null;
  notes: string | null;
};

function clean(value: string | null | undefined): string | null {
  if (!value) return null;
  const t = value.trim();
  return t === "" ? null : t;
}

export async function upsertAdCampaign(payload: AdCampaignPayload) {
  if (!payload.name?.trim()) {
    return { success: false as const, error: "キャンペーン名を入力してください" };
  }
  if (!payload.ad_channel?.trim()) {
    return { success: false as const, error: "媒体を選択してください" };
  }
  if (!payload.start_date) {
    return { success: false as const, error: "開始日を入力してください" };
  }

  const row = {
    studio_location: clean(payload.studio_location),
    ad_channel: payload.ad_channel,
    name: payload.name.trim(),
    start_date: payload.start_date,
    end_date: clean(payload.end_date),
    budget_yen: payload.budget_yen,
    target_description: clean(payload.target_description),
    creative_notes: clean(payload.creative_notes),
    creative_url: clean(payload.creative_url),
    notes: clean(payload.notes),
  };

  if (payload.id) {
    const { error } = await supabaseAdmin
      .from("ad_campaigns")
      .update(row)
      .eq("id", payload.id);
    if (error) return { success: false as const, error: error.message };
  } else {
    const { error } = await supabaseAdmin.from("ad_campaigns").insert(row);
    if (error) return { success: false as const, error: error.message };
  }

  revalidatePath("/staff/ads");
  return { success: true as const };
}

export async function deleteAdCampaign(formData: FormData): Promise<void> {
  const id = String(formData.get("id") ?? "");
  if (!id) return;
  const { error } = await supabaseAdmin.from("ad_campaigns").delete().eq("id", id);
  if (error) throw new Error(`削除に失敗しました: ${error.message}`);
  revalidatePath("/staff/ads");
  redirect("/staff/ads");
}
