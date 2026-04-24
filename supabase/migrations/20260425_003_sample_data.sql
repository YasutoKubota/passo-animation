-- テストデータの整理:
-- 既存の「ああああ」ダミー記録を削除し、サンプル 2 件（山田太郎・鈴木花子）を投入。
-- ※ このファイルは開発用。本番環境では適用しないこと。

-- 1. 既存のダミー削除（紐づく trial_agreements があれば cascade で受ける）
delete from public.intake_forms
where id = 'ca7305d2-6215-41df-8384-a773a05f0ff0';

-- 2. 山田太郎（岡崎事業所・A ランク想定）
insert into public.intake_forms (
  id,
  studio_location, furigana, name, phone,
  birth_date, gender, postal_code, address,
  source_choices, source_sns_name,
  experience_choices, transport,
  interested_work,
  illness_name, notebook_status, notebook_grade,
  hospital_name, doctor_name,
  support_office_used, support_office_name, support_office_contact,
  symptom_detail,
  usual_pc_usage, usual_pc_type,
  typing_total_duration_ms,
  typing_total_keystrokes,
  typing_backspace_count,
  typing_paste_count,
  typing_avg_cpm,
  typing_per_field
) values (
  '11111111-1111-1111-1111-111111111111',
  '岡崎', 'やまだ たろう', '山田 太郎', '090-1234-5678',
  '1998-05-12', '男', '444-0864', '愛知県岡崎市明大寺本町3-10-2',
  array['sns', 'hospital'], 'Instagram',
  array['transition'], 'car',
  array['video_editing', 'anime_scene', 'storyboard'],
  'ADHD・軽度うつ', '精神', '3級',
  '岡崎メンタルクリニック', '山本 浩司',
  true, '岡崎相談支援センター', '渡辺さん',
  '集中が続きにくい時がある。静かな環境なら作業に没頭できる。動画編集の経験あり（独学 2 年）。',
  'daily', 'windows_laptop',
  -- Typing metrics: 業務水準 A (CPM ~58)
  412000, 420, 38, 0, 58.25,
  jsonb_build_object(
    'name', jsonb_build_object('firstKeyAt', 1000, 'lastKeyAt', 3200, 'durationMs', 2200, 'keystrokes', 6, 'backspaces', 0, 'pastes', 0, 'characterCount', 5),
    'furigana', jsonb_build_object('firstKeyAt', 3300, 'lastKeyAt', 7100, 'durationMs', 3800, 'keystrokes', 9, 'backspaces', 1, 'pastes', 0, 'characterCount', 8),
    'phone', jsonb_build_object('firstKeyAt', 7200, 'lastKeyAt', 11500, 'durationMs', 4300, 'keystrokes', 13, 'backspaces', 0, 'pastes', 0, 'characterCount', 13),
    'address', jsonb_build_object('firstKeyAt', 11600, 'lastKeyAt', 38000, 'durationMs', 26400, 'keystrokes', 34, 'backspaces', 3, 'pastes', 0, 'characterCount', 20),
    'symptom_detail', jsonb_build_object('firstKeyAt', 100000, 'lastKeyAt', 310000, 'durationMs', 210000, 'keystrokes', 210, 'backspaces', 18, 'pastes', 0, 'characterCount', 62),
    'source_sns_name', jsonb_build_object('firstKeyAt', 70000, 'lastKeyAt', 80000, 'durationMs', 10000, 'keystrokes', 12, 'backspaces', 0, 'pastes', 0, 'characterCount', 9),
    'hospital_name', jsonb_build_object('firstKeyAt', 85000, 'lastKeyAt', 96000, 'durationMs', 11000, 'keystrokes', 16, 'backspaces', 2, 'pastes', 0, 'characterCount', 12),
    'doctor_name', jsonb_build_object('firstKeyAt', 96000, 'lastKeyAt', 100000, 'durationMs', 4000, 'keystrokes', 6, 'backspaces', 0, 'pastes', 0, 'characterCount', 5)
  )
);

-- 3. 鈴木花子（豊田事業所・C ランク想定）
insert into public.intake_forms (
  id,
  studio_location, furigana, name, phone,
  birth_date, gender, postal_code, address,
  source_choices, source_hospital_name,
  experience_choices, transport,
  interested_work, interested_work_other,
  illness_name, notebook_status, notebook_grade,
  hospital_name, doctor_name,
  support_office_used,
  symptom_detail,
  usual_pc_usage, usual_pc_type,
  typing_total_duration_ms,
  typing_total_keystrokes,
  typing_backspace_count,
  typing_paste_count,
  typing_avg_cpm,
  typing_per_field
) values (
  '22222222-2222-2222-2222-222222222222',
  '豊田', 'すずき はなこ', '鈴木 花子', '080-9876-5432',
  '2001-08-23', '女', '471-0817', '愛知県豊田市美里1-5-14',
  array['hospital'], '豊田こころのクリニック',
  array['type_b'], 'bus_train',
  array['illustration', 'storyboard'], null,
  'うつ病', '精神', '2級',
  '豊田こころのクリニック', '田中 美穂',
  false,
  '朝の体調が安定しない。午後からの参加だと集中できる。イラストは好きで毎日描いている。',
  'rarely', null,
  -- Typing metrics: 要練習 C (CPM ~14)
  820000, 290, 78, 0, 14.02,
  jsonb_build_object(
    'name', jsonb_build_object('firstKeyAt', 2000, 'lastKeyAt', 18000, 'durationMs', 16000, 'keystrokes', 12, 'backspaces', 3, 'pastes', 0, 'characterCount', 5),
    'furigana', jsonb_build_object('firstKeyAt', 18500, 'lastKeyAt', 48000, 'durationMs', 29500, 'keystrokes', 22, 'backspaces', 6, 'pastes', 0, 'characterCount', 8),
    'phone', jsonb_build_object('firstKeyAt', 48500, 'lastKeyAt', 78000, 'durationMs', 29500, 'keystrokes', 18, 'backspaces', 3, 'pastes', 0, 'characterCount', 13),
    'address', jsonb_build_object('firstKeyAt', 79000, 'lastKeyAt', 240000, 'durationMs', 161000, 'keystrokes', 70, 'backspaces', 18, 'pastes', 0, 'characterCount', 18),
    'source_hospital_name', jsonb_build_object('firstKeyAt', 280000, 'lastKeyAt', 360000, 'durationMs', 80000, 'keystrokes', 32, 'backspaces', 9, 'pastes', 0, 'characterCount', 13),
    'hospital_name', jsonb_build_object('firstKeyAt', 410000, 'lastKeyAt', 480000, 'durationMs', 70000, 'keystrokes', 28, 'backspaces', 6, 'pastes', 0, 'characterCount', 13),
    'doctor_name', jsonb_build_object('firstKeyAt', 482000, 'lastKeyAt', 520000, 'durationMs', 38000, 'keystrokes', 14, 'backspaces', 3, 'pastes', 0, 'characterCount', 5),
    'symptom_detail', jsonb_build_object('firstKeyAt', 540000, 'lastKeyAt', 810000, 'durationMs', 270000, 'keystrokes', 94, 'backspaces', 30, 'pastes', 0, 'characterCount', 44)
  )
);
