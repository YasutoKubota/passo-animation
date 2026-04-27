-- 自宅電話（固定電話）を別カラムで管理する。
-- 創造空間の面談票には「電話番号（自宅）」と「携帯電話」が両方ある。
-- 既存の phone カラムは「携帯（主たる連絡先）」、home_phone は「自宅（固定）」。

alter table public.intake_forms
  add column if not exists home_phone text;

comment on column public.intake_forms.home_phone is
  '自宅電話（固定電話）。phone は携帯（主連絡先）。';
