-- 電話番号の所有者 (誰の電話か) と、実際に来所した日を別カラムで管理する。
-- 「09056318696（母）」のように電話セルに混ぜて書いていた情報を分離し、
-- 「来所予定日」と「実来所日」を区別する。

alter table public.intake_forms
  add column if not exists phone_owner text default 'self',
  add column if not exists visited_at date;

comment on column public.intake_forms.phone_owner is
  '電話番号の所有者: self=本人 / mother=母 / father=父 / sibling=兄弟姉妹 / spouse=配偶者 / guardian=保護者・後見人 / other=その他';
comment on column public.intake_forms.visited_at is
  '実際に来所した日。scheduled_visit_date は「予定」、こちらは「実績」。';
