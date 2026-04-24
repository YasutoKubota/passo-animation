#!/usr/bin/env node
// 使い方: node scripts/run-migration.mjs supabase/migrations/xxx.sql
// DB URL は .env.local の SUPABASE_DB_URL から読む（Transaction pooler を推奨）。

import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import pg from "pg";

const loadEnv = () => {
  try {
    const raw = readFileSync(resolve(".env.local"), "utf8");
    for (const line of raw.split(/\r?\n/)) {
      const m = line.match(/^([A-Z0-9_]+)=(.*)$/);
      if (!m) continue;
      if (!process.env[m[1]]) process.env[m[1]] = m[2];
    }
  } catch {
    // .env.local なくても OK
  }
};

loadEnv();

const [, , file] = process.argv;
if (!file) {
  console.error("Usage: node scripts/run-migration.mjs <sql-file>");
  process.exit(1);
}

const connectionString = process.env.SUPABASE_DB_URL;
if (!connectionString) {
  console.error(
    "SUPABASE_DB_URL is not set. Get it from Supabase Dashboard → Project Settings → Database → Connection string (Transaction pooler)."
  );
  process.exit(1);
}

const sql = readFileSync(resolve(file), "utf8");
const client = new pg.Client({ connectionString });

try {
  await client.connect();
  console.log(`Applying ${file} ...`);
  await client.query(sql);
  console.log("OK");
} catch (err) {
  console.error("Migration failed:", err.message);
  process.exit(1);
} finally {
  await client.end();
}
