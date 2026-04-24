-- 不要判断により staff_city_office_meeting カラムを削除。
-- 代わりに staff_notes（自由記述）で十分。

alter table public.intake_forms
  drop column if exists staff_city_office_meeting;
