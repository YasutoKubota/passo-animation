-- サンプルデータの削除と ad_campaigns へのリンク列追加
-- 1) サンプル利用者（山田太郎 / 鈴木花子）と紐づく誓約書を削除
-- 2) ad_campaigns にクリエイティブのリンク URL 列を追加

-- 山田太郎・鈴木花子の関連誓約書を先に消す（FK on delete set null だが念のため）
delete from public.trial_agreements
 where intake_id in (
   '11111111-1111-1111-1111-111111111111',
   '22222222-2222-2222-2222-222222222222'
 );

-- サンプルの面談票本体を削除
delete from public.intake_forms
 where id in (
   '11111111-1111-1111-1111-111111111111',
   '22222222-2222-2222-2222-222222222222'
 );

-- ad_campaigns に SharePoint / OneDrive / Google Drive へのリンクを保存する列
alter table public.ad_campaigns
  add column if not exists creative_url text;

comment on column public.ad_campaigns.creative_url is
  'クリエイティブ（チラシ画像など）の外部ストレージ上のリンク。SharePoint / OneDrive を想定。';
