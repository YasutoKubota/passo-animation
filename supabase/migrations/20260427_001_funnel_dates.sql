-- 集客→利用開始までのファネル計測用に 3 つの日付を追加。
-- これまで Excel 「お問合せ管理表」で管理していた以下のカラムを移植:
--   - お問合せ日（初回コンタクト日）
--   - 来所予定日（最初に決めた来所予定日）
--   - 利用日（実際に契約・利用開始した日）

alter table public.intake_forms
  add column if not exists inquiry_date date,
  add column if not exists scheduled_visit_date date,
  add column if not exists service_start_date date;

comment on column public.intake_forms.inquiry_date is
  'お問合せ日。初回コンタクト（電話・SNS DM・メール等）の日付';
comment on column public.intake_forms.scheduled_visit_date is
  '来所予定日。問合せ時点で決めた最初の来所予定日（実際の見学日とは別）';
comment on column public.intake_forms.service_start_date is
  '利用開始日。契約後に実際にサービス利用を始めた日';
