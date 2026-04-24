-- intake_forms に普段使っている PC の情報を追加。
-- タイピング評価（ABC）の解釈材料としてスタッフ画面に併記。
-- 自動補正はしない（校正データがないため）。

alter table public.intake_forms
  add column if not exists usual_pc_usage text
    check (usual_pc_usage in ('daily', 'sometimes', 'rarely', 'none')),
  add column if not exists usual_pc_type text
    check (usual_pc_type in ('windows_desktop', 'windows_laptop', 'mac_desktop', 'mac_laptop', 'other'));

-- 値の意味:
-- usual_pc_usage:
--   daily     = 毎日使っている（仕事・学校・趣味）
--   sometimes = 時々使う
--   rarely    = ほとんど使わない（スマホ中心）
--   none      = 持っていない
-- usual_pc_type:
--   windows_desktop / windows_laptop / mac_desktop / mac_laptop / other
--   （usual_pc_usage が 'none' のときは null）
