-- trial_agreements: 体験利用誓約書の署名レコード
-- 1 人につき複数の誓約書レコードを許容（日付違いで何枚でも）。
-- intake_forms との紐付けは任意（on delete set null）。
-- アプリからのアクセスは service_role 経由のみ（RLS ポリシーなし = RLS で全 deny）。

create extension if not exists "pgcrypto";

create table public.trial_agreements (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),

  -- 紐付け: 見学時の面談票。削除されても誓約書は残す。
  intake_id uuid references public.intake_forms(id) on delete set null,

  -- 事業所
  studio_location text check (studio_location in ('岡崎', '豊田')),

  -- 署名
  signed_name text not null,
  agreement_accepted boolean not null default false,
  agreement_accepted_at timestamptz not null default now(),

  -- タイピング計測（/intake と同じ形式）
  typing_total_duration_ms integer,
  typing_total_keystrokes integer,
  typing_backspace_count integer,
  typing_paste_count integer,
  typing_avg_cpm numeric(6, 2),
  typing_per_field jsonb
);

create index idx_trial_agreements_intake_id on public.trial_agreements (intake_id);
create index idx_trial_agreements_created_at on public.trial_agreements (created_at desc);

alter table public.trial_agreements enable row level security;
