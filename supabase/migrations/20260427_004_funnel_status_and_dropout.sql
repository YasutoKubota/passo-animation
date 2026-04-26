-- ファネル管理の拡張：
--   1) サービス等利用計画の完了日（進捗フラグとして使う）
--   2) 利用契約日（進捗フラグとして使う）
--   3) 脱落（or 持ち越し）の管理：status / dropout_at_step / dropout_reason / dropout_at

alter table public.intake_forms
  add column if not exists service_plan_completed_at date,
  add column if not exists contract_signed_at date,
  -- 状態: active = 通常進行中、pending = 持ち越し（しばらく音沙汰なし）、
  --       dropped = 脱落（明示的に「来ない」と判明）、started = 利用中
  add column if not exists status text default 'active',
  -- どのステップで脱落したか
  --   visit / trial / city_office / plan / contract / unknown
  add column if not exists dropout_at_step text,
  add column if not exists dropout_reason text,
  add column if not exists dropout_at date;

comment on column public.intake_forms.service_plan_completed_at is
  'サービス等利用計画作成完了日。受給者証ありの人の計画変更も含む。';
comment on column public.intake_forms.contract_signed_at is
  'パッソとの利用契約締結日。';
comment on column public.intake_forms.status is
  '進行状態: active=進行中 / pending=持ち越し（連絡待ち）/ dropped=脱落確定 / started=利用中';
comment on column public.intake_forms.dropout_at_step is
  '脱落 / 持ち越しのステップ: visit / trial / city_office / plan / contract / unknown';
