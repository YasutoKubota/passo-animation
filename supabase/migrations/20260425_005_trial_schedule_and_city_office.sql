-- Staff Notes のスキーマ変更:
-- 1. 旧 staff_trial_use（自由記述）を廃止
-- 2. 体験利用スケジュール: 複数日 × 午前/午後 → trial_sessions (jsonb array)
-- 3. 市役所面談: 単日 + 時刻 → city_office_meeting_at (timestamptz)

alter table public.intake_forms
  drop column if exists staff_trial_use;

alter table public.intake_forms
  add column if not exists trial_sessions jsonb not null default '[]'::jsonb,
  add column if not exists city_office_meeting_at timestamptz;

-- trial_sessions の形:
--   [{ "date": "2026-05-10", "slot": "morning" | "afternoon" }, ...]
-- 原則 3 件だが柔軟に（1〜5 件程度を想定）

-- city_office_meeting_at はそのまま timestamptz。日付＋時刻を一発で保存。
