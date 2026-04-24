#!/usr/bin/env node
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
  } catch {}
};
loadEnv();

const client = new pg.Client({ connectionString: process.env.SUPABASE_DB_URL });
await client.connect();
const { rows } = await client.query(
  `select id, name, furigana, studio_location, submitted_at from intake_forms order by submitted_at desc limit 20`
);
for (const r of rows) {
  console.log(
    `${r.submitted_at.toISOString().slice(0, 16)}  ${r.studio_location ?? "-"}  ${r.name}  (${r.furigana})  id=${r.id}`
  );
}
await client.end();
