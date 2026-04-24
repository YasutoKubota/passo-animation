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

console.log("=== tables in public schema ===");
const { rows: tables } = await client.query(
  `select tablename from pg_tables where schemaname = 'public' order by tablename`
);
console.log(tables.map((t) => t.tablename).join("\n"));

for (const t of tables) {
  console.log(`\n=== columns for ${t.tablename} ===`);
  const { rows } = await client.query(
    `select column_name, data_type, is_nullable, column_default
     from information_schema.columns
     where table_schema = 'public' and table_name = $1
     order by ordinal_position`,
    [t.tablename]
  );
  for (const r of rows) {
    console.log(
      `${r.column_name}  ${r.data_type}  nullable=${r.is_nullable}  default=${r.column_default || "-"}`
    );
  }
}

console.log("\n=== row counts ===");
for (const t of tables) {
  const { rows } = await client.query(`select count(*)::int as n from ${t.tablename}`);
  console.log(`${t.tablename}: ${rows[0].n} rows`);
}

await client.end();
