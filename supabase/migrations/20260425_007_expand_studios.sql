-- 事業所を 4 箇所に拡張:
--   pas_okazaki = パッソアニメーションスタジオ（岡崎）
--   pas_toyota  = パッソアニメーションスタジオ豊田
--   sozo        = 創造空間 Passo a Passo
--   shushoku    = 就職ゼミナール Passo a Passo
--
-- 既存の '岡崎' / '豊田' 値を pas_okazaki / pas_toyota に変換する。

-- ==== intake_forms ====
alter table public.intake_forms
  drop constraint if exists intake_forms_studio_location_check;

update public.intake_forms
  set studio_location = 'pas_okazaki'
  where studio_location = '岡崎';

update public.intake_forms
  set studio_location = 'pas_toyota'
  where studio_location = '豊田';

alter table public.intake_forms
  add constraint intake_forms_studio_location_check
  check (
    studio_location is null
    or studio_location in ('pas_okazaki', 'pas_toyota', 'sozo', 'shushoku')
  );

-- ==== trial_agreements ====
alter table public.trial_agreements
  drop constraint if exists trial_agreements_studio_location_check;

update public.trial_agreements
  set studio_location = 'pas_okazaki'
  where studio_location = '岡崎';

update public.trial_agreements
  set studio_location = 'pas_toyota'
  where studio_location = '豊田';

alter table public.trial_agreements
  add constraint trial_agreements_studio_location_check
  check (
    studio_location is null
    or studio_location in ('pas_okazaki', 'pas_toyota', 'sozo', 'shushoku')
  );
