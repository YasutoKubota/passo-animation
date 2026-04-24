-- 山田太郎の聞き取り内容・体験利用スケジュール・市役所面談日時 を登録
-- 鈴木花子の誓約書を発行（trial_agreements に 1 件投入）
-- ※ 開発用サンプル。本番適用しないこと。

-- 山田太郎（岡崎・A ランク）: 体験利用 3 日 + 市役所面談 + 聞き取り内容
update public.intake_forms
set
  trial_sessions = jsonb_build_array(
    jsonb_build_object('date', '2026-05-07', 'slot', 'morning'),
    jsonb_build_object('date', '2026-05-08', 'slot', 'afternoon'),
    jsonb_build_object('date', '2026-05-10', 'slot', 'morning')
  ),
  city_office_meeting_at = '2026-05-13T14:00:00+09:00',
  staff_notes = '動画編集は独学 2 年。Premiere Pro の基本操作は慣れている様子。
After Effects は未経験だが興味あり。
ポートフォリオ目的で入所希望、将来はフリーランスも視野。
集中は静かな環境なら問題なし。雑談多めだと疲れると自己申告。
チーム作業は未経験で不安あり、最初はペア作業から始めたほうがよさそう。
通院は月 1 回、投薬中（安定）。朝のスタートは 10 時以降を希望。'
where id = '11111111-1111-1111-1111-111111111111';

-- 鈴木花子（豊田・C ランク）: 誓約書を 1 件発行
-- タイピングが遅めなので、誓約書の typing_metrics もそれなりに低め設定
insert into public.trial_agreements (
  id,
  intake_id,
  studio_location,
  signed_name,
  agreement_accepted,
  agreement_accepted_at,
  typing_total_duration_ms,
  typing_total_keystrokes,
  typing_backspace_count,
  typing_paste_count,
  typing_avg_cpm,
  typing_per_field
) values (
  '33333333-3333-3333-3333-333333333333',
  '22222222-2222-2222-2222-222222222222',
  '豊田',
  '鈴木 花子',
  true,
  '2026-04-28T10:15:00+09:00',
  68000, 28, 6, 0, 7.06,
  jsonb_build_object(
    'signed_name', jsonb_build_object(
      'firstKeyAt', 2000,
      'lastKeyAt', 68000,
      'durationMs', 66000,
      'keystrokes', 28,
      'backspaces', 6,
      'pastes', 0,
      'characterCount', 5
    )
  )
)
on conflict (id) do nothing;
