#!/usr/bin/env node
// Supabase REST API 経由で intake_forms を再投入する。
// pg 直接接続が IPv6 タイムアウトで使えない環境用のフォールバック。
//
// 使い方:
//   node scripts/excel-import/load-fy7.mjs
//
// 事前に python3 scripts/excel-import/import-fy7.py で JSON を生成しておくこと。

import { readFileSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { createClient } from "@supabase/supabase-js";

const __dirname = dirname(fileURLToPath(import.meta.url));

const loadEnv = () => {
  try {
    const raw = readFileSync(resolve(".env.local"), "utf8");
    for (const line of raw.split(/\r?\n/)) {
      const m = line.match(/^([A-Z0-9_]+)=(.*)$/);
      if (!m) continue;
      if (!process.env[m[1]]) process.env[m[1]] = m[2];
    }
  } catch {
    // OK
  }
};

loadEnv();

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.SUPABASE_SECRET_KEY;
if (!url || !key) {
  console.error(
    "NEXT_PUBLIC_SUPABASE_URL と SUPABASE_SECRET_KEY を .env.local に設定してください"
  );
  process.exit(1);
}

const sb = createClient(url, key, {
  auth: { persistSession: false, autoRefreshToken: false },
});

// JSON 読み込み
const jsonPath = resolve(__dirname, "import-fy7-preview.json");
const records = JSON.parse(readFileSync(jsonPath, "utf8"));

// 内部フィールドを除外して挿入用ペイロードに整形
const cleaned = records.map((r) => {
  // _ で始まる内部用キー（_source_file 等）を除外
  const out = {};
  for (const [k, v] of Object.entries(r)) {
    if (!k.startsWith("_")) out[k] = v;
  }
  // phone_owner デフォルト
  if (!out.phone_owner) out.phone_owner = "self";
  return out;
});

console.log(`合計 ${cleaned.length} 件を投入します`);

// 1. 既存の取込分を削除
//    (令和7+8 範囲。サンプルや窪田テストレコードは既に DB から削除済み)
console.log("DELETE 実行中: submitted_at が 2025-04-01 ～ 2027-04-01 の範囲");
const { error: delErr, count: delCount } = await sb
  .from("intake_forms")
  .delete({ count: "exact" })
  .gte("submitted_at", "2025-04-01")
  .lt("submitted_at", "2027-04-01");
if (delErr) {
  console.error("DELETE エラー:", delErr.message);
  process.exit(1);
}
console.log(`削除完了: ${delCount ?? "?"} 件`);

// 2. INSERT バッチ
const BATCH = 50;
let inserted = 0;
for (let i = 0; i < cleaned.length; i += BATCH) {
  const batch = cleaned.slice(i, i + BATCH);
  const { error: insErr } = await sb.from("intake_forms").insert(batch);
  if (insErr) {
    console.error(
      `INSERT エラー (batch ${i}〜${i + batch.length}):`,
      insErr.message
    );
    process.exit(1);
  }
  inserted += batch.length;
  console.log(`  ${inserted} / ${cleaned.length} 件投入...`);
}

console.log(`\n✅ 完了: ${inserted} 件を投入しました`);
