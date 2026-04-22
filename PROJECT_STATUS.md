# PROJECT_STATUS.md
# パッソアニメーションスタジオ — プロジェクト現状まとめ
# 最終更新: 2026-04-23

このファイルは新しいチャットセッションでコンテキストを引き継ぐために維持する。
コンテキストが圧縮される前に更新すること。

---

## 重要URL・ID

| 項目 | 値 |
|---|---|
| 本番サイト | https://www.passo-ww.com |
| LINEリンク | https://lin.ee/Xq4oYCH |
| GA4 測定ID | G-DSRKQN8CRK |
| Google広告タグ | AW-597391026（コンバージョン: AW-597391026/niNbCOD6i5scELLt7ZwC） |
| GitHubリポジトリ | YasutoKubota/passo-animation（**現在Public。Private化を要検討**） |
| Meta広告マネージャー | adsmanager.facebook.com（¥2,000/日、/movie向けキャンペーン稼働中） |

---

## 事業所情報（確定済み）

| 項目 | 内容 |
|---|---|
| 岡崎事業所 | 愛知県岡崎市（詳細住所は別途確認） |
| 豊田事業所 | 〒473-0901 愛知県豊田市御幸本町5-311-8 |
| 営業時間 | 9:00〜16:30 |
| 祝日 | 基本営業（長期連休除く） |
| 自社メディア | TikTok「ココロカルテ」フォロワー約1万人（本部経由の社内発注扱い） |
| 年間制作件数 | 200件以上 |

---

## 使用ツール（スタッフ確定済み）

| ツール | 備考 |
|---|---|
| Clip Studio | イラスト・作画メイン（IllustratorやPhotoshopは**使用していない**） |
| Adobe Premiere Pro | 動画編集メイン |
| After Effects | モーショングラフィックス |
| Microsoft Teams | 社内連絡・ファイル共有 |

---

## 実装済みページ・機能

### `/movie`（`app/movie/MovieLP.tsx`）
- 動画制作チームのランディングページ
- 全イラストを実写真に置き換え済み（`public/images/photo-*.jpg`、12枚）
- 画像ファイル命名規則: `photo-hero-collab.jpg`, `photo-card-*.jpg`, `photo-wf-*.jpg`, `photo-env-*.jpg`
- **未解決**: `photo-env-teams.jpg`（Teams画面が写っていない写真。画面キャプチャ差し替えかコピー変更が必要）

### `/lp`（`public/lp/index.html`）
- ハブLP（静的HTML、Next.jsを通さず直接配信）
- ブランド検索流入・広告ランディング用
- セクション: HERO（studio-wide.jpg）→ INTRO（200件/10,000フォロワーの2カラム）→ PORTALS（①動画 ②イラストComing Soon）→ CONTACT → FOOTER
- 画像は `public/lp/images/` に格納（7枚）
- **インスタ広告用写真**: `movie-team-collab.jpg`（縦型4:5、Adobe Express用素材として使用中）

### `/illust`
- **未着手**。`/movie` をテンプレートにして作成予定。

### ファビコン
- `app/icon.png` → Next.jsが自動でlinkタグ生成（App Router）
- `public/lp/index.html` には手動で `<link rel="icon">` タグ記述済み
- Google Search Console: `https://www.passo-ww.com`（www canonical）で登録済み
- 認証ファイル: `public/google33ee7c694cdbf89b.html`

### GA4
- 測定ID: `G-DSRKQN8CRK`
- `app/layout.tsx` と `public/lp/index.html` の両方に設置済み
- 既存のGoogle広告タグ（AW-597391026）と同一のgtag.jsインスタンスで動作
- 2026-04-23 本番デプロイ完了・リアルタイム計測確認済み

---

## 重要な用語ルール（厳守）

| 使う | 使わない | 理由 |
|---|---|---|
| 制作物・納品物 | **作品**（日常業務・LP・広告文脈） | 作品はアート/趣味感。年1回の展覧会のみ「作品」可 |
| 関わる | 携わる | 画数多・難解 |
| 企業案件に関わる | 好きを仕事に | でじるみ・にじげん差別化 |
| フォロワー1万人規模の自社メディア | 居場所・自分のペースで | 福祉色排除 |

詳細な禁止ワードリストは `.impeccable.md` を参照。

---

## 内部ドキュメント

| ファイル | 内容 | 公開状況 |
|---|---|---|
| `docs/photo-shoot-guide.html` | 撮影指示書（スタッフ向け） | GitHubで見える（要注意） |
| `docs/photo-shoot-guide.pdf` | 同上PDF版 | GitHubで見える（要注意） |
| `.impeccable.md` | ブランド・デザイン・UXライティング全ルール | GitHubで見える |

---

## 未完了タスク

- [ ] `/illust` ページ制作（`/movie` テンプレートベース）
- [ ] `photo-env-teams.jpg` の差し替え（Teams画面キャプチャ or コピー変更）
- [ ] GitHubリポジトリをPrivateに変更（PDF・内部資料が公開状態）
- [ ] Adobe Express でインスタ広告クリエイティブ制作（ブリーフ作成済み）
- [ ] Google Display広告クリエイティブ制作

---

## 広告クリエイティブ進捗

### インスタグラム広告
- **デザイン**: Adobe Expressで「NO.02 STUDIO FIELD NOTE」スタイルで制作済み（ユーザー側）
- **キャプション**: 作成済み（乗り換え歓迎文言含む3パターン）
- **サイズ**: 1080×1350px（縦型4:5）推奨

### Google Display広告
- **未着手**
- 推奨サイズ: 1200×628px（メイン）, 300×250px（ミディアムレクタングル）, 250×250px

---

## ブランドカラー（クイックリファレンス）

```
背景メイン:  #F5F0E8
背景サブ:    #EDE7DC
アクセント:  #B87868（テラコッタ）
テキスト濃:  #3A3330
テキスト薄:  #706560
CTA(LINE):  #06C755
オフホワイト: #F7F7F5
```

フォント: `Noto Sans JP`（日本語）/ `Outfit`（英語アクセント）
