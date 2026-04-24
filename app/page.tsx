import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "株式会社Passo a Passo",
  description:
    "愛知県岡崎市・豊田市を拠点に4つの事業所を運営。映像・イラスト制作、軽作業、就労移行支援など多彩な福祉サービスを提供しています。",
};

export default function Home() {
  return (
    <main className="top-page">
      {/* ── HEADER ── */}
      <header className="top-header">
        <img src="/images/logo-passo.png" alt="Passo a Passo" className="top-header-logo" />
      </header>

      {/* ── HERO ── */}
      <section className="top-hero">
        <h1 className="top-hero-title">株式会社Passo a Passo</h1>
        <p className="top-hero-sub">
          愛知県岡崎市・豊田市を拠点に<br />
          4つの事業所を運営しています。
        </p>
      </section>

      {/* ── 事業所カード ── */}
      <section className="top-offices">
        <div className="top-offices-container">

          {/* 事業所① パッソアニメーションスタジオ */}
          <div className="top-office-card top-office-card--featured">
            <div className="top-office-card-body">
              <h2 className="top-office-card-title">パッソアニメーションスタジオ</h2>
              <p className="top-office-card-sub">岡崎・豊田／就労継続支援B型</p>
              <p className="top-office-card-desc">
                企業から映像・イラスト制作を受託する<br />クリエイターチームです。
              </p>
              <div className="top-office-card-actions">
                <Link href="/movie" className="top-btn top-btn--primary">
                  動画編集クリエイターとして加わりたい方
                </Link>
                <Link href="/illust" className="top-btn top-btn--primary">
                  イラストクリエイターとして加わりたい方
                </Link>
                <span className="top-btn top-btn--disabled" aria-disabled="true">
                  制作を依頼したい企業様
                  <span className="top-btn-badge">Coming Soon</span>
                </span>
              </div>
            </div>
          </div>

          {/* 事業所② 創造空間 */}
          <div className="top-office-card">
            <div className="top-office-card-body">
              <h2 className="top-office-card-title">創造空間Passo a Passo</h2>
              <p className="top-office-card-sub">岡崎市／就労継続支援B型</p>
              <p className="top-office-card-desc">軽作業・清掃・食品工場出向等</p>
              <div className="top-office-card-actions">
                <span className="top-btn top-btn--disabled" aria-disabled="true">
                  詳しくはこちら
                  <span className="top-btn-badge">Coming Soon</span>
                </span>
              </div>
            </div>
          </div>

          {/* 事業所③ 就職ゼミナール */}
          <div className="top-office-card">
            <div className="top-office-card-body">
              <h2 className="top-office-card-title">就職ゼミナールPasso a Passo</h2>
              <p className="top-office-card-sub">岡崎市／就労移行支援</p>
              <p className="top-office-card-desc">
                自己理解・コミュニケーションスキル向上を<br />軸としたジョブマッチングサービス
              </p>
              <div className="top-office-card-actions">
                <Link href="/start" className="top-btn top-btn--primary">
                  詳しくはこちら
                </Link>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="top-footer">
        <p className="top-footer-name">株式会社Passo a Passo</p>
        <p className="top-footer-copy">© 2026 Passo a Passo. All rights reserved.</p>
      </footer>
    </main>
  );
}
