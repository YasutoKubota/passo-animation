-- 広告キャンペーン管理テーブル
-- 「いつ・どこに・いくらで・どんな広告を打ったか」を記録し、
-- intake_forms.source_choices と突き合わせることで効果測定する。

create table if not exists public.ad_campaigns (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),

  -- どの事業所への誘導用の広告か（intake_forms.studio_location と同じコード）
  studio_location text check (
    studio_location is null
    or studio_location in ('pas_okazaki', 'pas_toyota', 'sozo', 'shushoku')
  ),

  -- 媒体（intake の source_choices と揃える）
  --   instagram / google / hello_work / hospital / sns / newspaper / posting / other
  ad_channel text not null,

  -- キャンペーン名（社内識別用）。例: 「2026春・Instagram動画編集体験」
  name text not null,

  -- 配信期間
  start_date date not null,
  end_date date,

  -- 予算（円・税込）
  budget_yen integer,

  -- ターゲット設定の説明（自由記述）
  target_description text,

  -- 訴求内容・クリエイティブのメモ
  creative_notes text,

  -- 一般メモ
  notes text
);

create index if not exists idx_ad_campaigns_studio on public.ad_campaigns (studio_location);
create index if not exists idx_ad_campaigns_channel on public.ad_campaigns (ad_channel);
create index if not exists idx_ad_campaigns_start_date on public.ad_campaigns (start_date desc);

-- updated_at 自動更新トリガー関数（無ければ作る）
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger trg_ad_campaigns_updated_at
  before update on public.ad_campaigns
  for each row execute function public.set_updated_at();

-- RLS（intake_forms と同じく service_role 経由のみアクセス）
alter table public.ad_campaigns enable row level security;
