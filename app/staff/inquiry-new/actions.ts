"use server";

import { supabaseAdmin } from "@/lib/supabase";
import { redirect } from "next/navigation";

const STUDIO_VALUES = ["pas_okazaki", "pas_toyota", "sozo", "shushoku"] as const;

// スタッフがお問合せ段階で記入する軽量フォーム。
// 必須は「事業所・名前・お問合せルート」のみ。後で詳細を埋めていく前提。
export async function createInquiryStub(formData: FormData) {
  const studio = String(formData.get("studio_location") ?? "");
  const inquiry_date = String(formData.get("inquiry_date") ?? "").trim();
  const name = String(formData.get("name") ?? "").trim();
  const furigana = String(formData.get("furigana") ?? "").trim();
  const gender = String(formData.get("gender") ?? "").trim();
  const birth_date = String(formData.get("birth_date") ?? "").trim();
  const phone = String(formData.get("phone") ?? "").trim();
  const address = String(formData.get("address") ?? "").trim();
  const source_choices = formData
    .getAll("source_choices")
    .map((v) => String(v))
    .filter(Boolean);
  const source_facility_name = String(formData.get("source_facility_name") ?? "").trim();
  const source_hospital_name = String(formData.get("source_hospital_name") ?? "").trim();
  const source_sns_name = String(formData.get("source_sns_name") ?? "").trim();
  const source_other = String(formData.get("source_other") ?? "").trim();
  const staff_notes = String(formData.get("staff_notes") ?? "").trim();

  if (!STUDIO_VALUES.includes(studio as (typeof STUDIO_VALUES)[number])) {
    throw new Error("事業所が選択されていません");
  }
  if (!name) {
    throw new Error("名前は必須です（仮名・苗字のみ・カタカナでも可）");
  }
  if (source_choices.length === 0) {
    throw new Error("お問合せルートを少なくとも1つ選んでください");
  }

  const { data, error } = await supabaseAdmin
    .from("intake_forms")
    .insert({
      studio_location: studio,
      name,
      // 必須カラムだが空文字を許容（後で埋める前提）
      furigana: furigana || "",
      phone: phone || null,
      birth_date: birth_date || null,
      gender: gender || null,
      address: address || null,
      source_choices,
      source_facility_name: source_facility_name || null,
      source_hospital_name: source_hospital_name || null,
      source_sns_name: source_sns_name || null,
      source_other: source_other || null,
      experience_choices: [],
      interested_work: [],
      trial_sessions: [],
      inquiry_date: inquiry_date || null,
      staff_notes: staff_notes || null,
    })
    .select("id")
    .single();

  if (error) {
    throw new Error(error.message);
  }

  redirect(`/staff/intake/${data.id}`);
}
