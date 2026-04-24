"use server";

import { supabaseAdmin } from "@/lib/supabase";
import type { TypingMetrics } from "@/lib/intake-schema";

export type AgreementPayload = {
  intake_id: string | null;
  studio_location: string | null;
  signed_name: string;
  expected_name: string; // intake から取ってきた名前。一致チェックに使う。
  typing_metrics: TypingMetrics;
};

export type AgreementResult =
  | { success: true; id: string }
  | { success: false; error: string };

function normalize(name: string): string {
  // 空白類（半角・全角・タブ）をすべて除去して比較
  return name.replace(/[\s\u3000]/g, "");
}

export async function submitAgreement(
  payload: AgreementPayload
): Promise<AgreementResult> {
  const signed = payload.signed_name?.trim() ?? "";
  if (!signed) {
    return { success: false, error: "署名が入力されていません" };
  }

  const expected = payload.expected_name?.trim() ?? "";
  if (expected && normalize(signed) !== normalize(expected)) {
    return {
      success: false,
      error: "署名が面談票のお名前と一致しません。漢字・ふりがなを確認してください。",
    };
  }

  if (
    payload.studio_location &&
    !["pas_okazaki", "pas_toyota", "sozo", "shushoku"].includes(payload.studio_location)
  ) {
    return { success: false, error: "事業所の値が不正です" };
  }

  const metrics = payload.typing_metrics;

  const { data, error } = await supabaseAdmin
    .from("trial_agreements")
    .insert({
      intake_id: payload.intake_id,
      studio_location: payload.studio_location,
      signed_name: signed,
      agreement_accepted: true,
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
