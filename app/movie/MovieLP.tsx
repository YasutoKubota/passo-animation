"use client";

import { useEffect, useState } from "react";

/* ── SVG icon data (shared across sections) ── */
const LINE_ICON = (
  <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M19.365 9.863c.349 0 .63.285.63.631 0 .345-.281.63-.63.63H17.61v1.125h1.755c.349 0 .63.283.63.63 0 .344-.281.629-.63.629h-2.386c-.345 0-.627-.285-.627-.629V8.108c0-.345.282-.63.63-.63h2.386c.346 0 .627.285.627.63 0 .349-.281.63-.63.63H17.61v1.125h1.755zm-3.855 3.016c0 .27-.174.51-.432.596-.064.021-.133.031-.199.031-.211 0-.391-.09-.51-.25l-2.443-3.317v2.94c0 .344-.279.629-.631.629-.346 0-.626-.285-.626-.629V8.108c0-.271.173-.508.43-.595.06-.023.136-.033.194-.033.195 0 .375.104.495.254l2.462 3.33V8.108c0-.345.282-.63.63-.63.345 0 .63.285.63.63v4.771zm-5.741 0c0 .344-.282.629-.631.629-.345 0-.627-.285-.627-.629V8.108c0-.345.282-.63.63-.63.346 0 .628.285.628.63v4.771zm-2.466.629H4.917c-.345 0-.63-.285-.63-.629V8.108c0-.345.285-.63.63-.63.348 0 .63.285.63.63v4.141h1.756c.348 0 .629.283.629.63 0 .344-.282.629-.629.629M24 10.314C24 4.943 18.615.572 12 .572S0 4.943 0 10.314c0 4.811 4.27 8.842 10.035 9.608.391.082.923.258 1.058.59.12.301.079.766.038 1.08l-.164 1.02c-.045.301-.24 1.186 1.049.645 1.291-.539 6.916-4.078 9.436-6.975C23.176 14.393 24 12.458 24 10.314" />
  </svg>
);

export default function MovieLP() {
  const [activeStory, setActiveStory] = useState(0);

  useEffect(() => {
    /* Header scroll effect */
    const header = document.getElementById("header");
    const onScroll = () => {
      header?.classList.toggle("is-scrolled", window.scrollY > 40);
    };
    window.addEventListener("scroll", onScroll, { passive: true });

    /* Floating CTA visibility */
    const floatCta = document.getElementById("float-cta");
    const heroEl = document.getElementById("hero");
    const ctaEl = document.getElementById("final-cta");
    const onScrollCta = () => {
      if (!heroEl || !ctaEl || !floatCta) return;
      const heroBot = heroEl.getBoundingClientRect().bottom;
      const ctaTop = ctaEl.getBoundingClientRect().top;
      const show = heroBot < 0 && ctaTop > window.innerHeight * 0.5;
      floatCta.classList.toggle("is-visible", show);
      floatCta.setAttribute("aria-hidden", String(!show));
    };
    window.addEventListener("scroll", onScrollCta, { passive: true });

    /* Reveal on scroll */
    const revealObs = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add("is-visible");
            revealObs.unobserve(e.target);
          }
        });
      },
      { threshold: 0.1, rootMargin: "0px 0px -40px 0px" }
    );
    document
      .querySelectorAll(".reveal, .reveal-fade, .reveal-scale, .reveal-left, .reveal-right")
      .forEach((el) => revealObs.observe(el));

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("scroll", onScrollCta);
      revealObs.disconnect();
    };
  }, []);

  const scrollTo = (id: string) => (e: React.MouseEvent) => {
    e.preventDefault();
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <>
      {/* ── HEADER ── */}
      <header className="site-header" id="header">
        <div className="header-inner">
          <a href="#hero" className="logo" onClick={scrollTo("hero")}>
            <img src="/images/logo-passo.png" alt="パッソアニメーションスタジオ" className="logo-img" />
          </a>
          <a href="https://lin.ee/Xq4oYCH" target="_blank" rel="noopener noreferrer" className="header-cta header-cta--line" id="header-cta-btn" onClick={() => { if (typeof window !== "undefined" && (window as any).gtag_report_conversion) (window as any).gtag_report_conversion(); }}>
            <svg viewBox="0 0 24 24" fill="currentColor" width="16" height="16" aria-hidden="true">
              <path d="M19.365 9.863c.349 0 .63.285.63.631 0 .345-.281.63-.63.63H17.61v1.125h1.755c.349 0 .63.283.63.63 0 .344-.281.629-.63.629h-2.386c-.345 0-.627-.285-.627-.629V8.108c0-.345.282-.63.63-.63h2.386c.346 0 .627.285.627.63 0 .349-.281.63-.63.63H17.61v1.125h1.755zm-3.855 3.016c0 .27-.174.51-.432.596-.064.021-.133.031-.199.031-.211 0-.391-.09-.51-.25l-2.443-3.317v2.94c0 .344-.279.629-.631.629-.346 0-.626-.285-.626-.629V8.108c0-.271.173-.508.43-.595.06-.023.136-.033.194-.033.195 0 .375.104.495.254l2.462 3.33V8.108c0-.345.282-.63.63-.63.345 0 .63.285.63.63v4.771zm-5.741 0c0 .344-.282.629-.631.629-.345 0-.627-.285-.627-.629V8.108c0-.345.282-.63.63-.63.346 0 .628.285.628.63v4.771zm-2.466.629H4.917c-.345 0-.63-.285-.63-.629V8.108c0-.345.285-.63.63-.63.348 0 .63.285.63.63v4.141h1.756c.348 0 .629.283.629.63 0 .344-.282.629-.629.629M24 10.314C24 4.943 18.615.572 12 .572S0 4.943 0 10.314c0 4.811 4.27 8.842 10.035 9.608.391.082.923.258 1.058.59.12.301.079.766.038 1.08l-.164 1.02c-.045.301-.24 1.186 1.049.645 1.291-.539 6.916-4.078 9.436-6.975C23.176 14.393 24 12.458 24 10.314" />
            </svg>
            <span>LINEでお問い合わせ</span>
          </a>
        </div>
      </header>

      {/* ── 1. HERO ── */}
      <section className="hero" id="hero">
        <div className="hero-bg">
          <img src="/images/hero-creator.png" alt="" width={1200} height={800} className="hero-bg-fallback" />
          <video className="hero-video" autoPlay muted loop playsInline disablePictureInPicture preload="auto">
            <source src="/images/hero-bg-video.mp4" type="video/mp4" />
          </video>
        </div>
        <div className="hero-content">
          <p className="hero-sub-copy">働くことに障がいのあるクリエイターのための制作スタジオ（就労継続支援B型）</p>
          <h1>
            あなたの「好き」が仕事になる。<br />
            多彩な企業案件が揃っています。
          </h1>
          <div className="scroll-hint">
            <span className="scroll-line"></span>
            <span>SCROLL</span>
          </div>
        </div>
      </section>

      {/* ── BRIDGE ── */}
      <section className="bridge" id="bridge">
        <div className="container">
          <div className="bridge-inner reveal">
            <h2 className="bridge-heading">
              <span style={{ display: "inline-block" }}>「好き」であること。</span><br />
              <span style={{ display: "inline-block" }}>それが</span><span style={{ display: "inline-block" }}>何よりの力になります。</span>
            </h2>
            <div className="bridge-body">
              <p>「好きなことには時間を忘れてのめり込める」</p>
              <p>
                もしそうなら、その「好き」という純粋なエネルギーは<br />
                動画制作においてどんなスキルよりも強い原動力になります。
              </p>
              <p>
                パッソでは専属の支援スタッフ（ディレクター）の丁寧なサポートのもとで企業案件にチャレンジできます。<br />
                ここで手がけた案件が、そのまま自分の実績として積み上がっていきます。
              </p>
              <p>
                在籍クリエイターが実際に取り組んでいる案件をご紹介します。
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── 2. PROJECTS ── */}
      <section className="projects" id="projects">
        <div className="container">
          <div className="projects-header reveal">
            <div className="section-label"><span className="dot"></span> PROJECTS</div>
            <h2 className="section-title">在籍クリエイターが手がけている案件</h2>
          </div>
          <div className="project-cards">
            {[
              { img: "card-short-video.png", alt: "SNSショート動画", title: "SNSショート動画（実写・編集）", desc: "TikTok・Instagramリール・YouTubeショートなど、最新トレンドを掴む案件です。" },
              { img: "card-corporate-video.png", alt: "企業PR動画", title: "企業PR・インタビュー動画", desc: "企業の公式チャンネル向けにインタビューや会社紹介の動画を制作します。" },
              { img: "card-manga-video.png", alt: "漫画動画", title: "漫画動画の編集", desc: "イラスト素材に動きや音をつけて多種多様なエンタメ・PR案件に携わります。" },
            ].map((c, i) => (
              <div className={`project-card glass reveal reveal-d${Math.min(i + 1, 3)}`} key={i}>
                <div className="project-card-thumb">
                  <img src={`/images/${c.img}`} alt={c.alt} width={400} height={300} />
                </div>
                <div className="project-card-body">
                  <h3>{c.title}</h3>
                  <p>{c.desc}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="projects-note reveal" style={{ textAlign: "center", marginTop: "48px" }}>
            <p className="section-sub" style={{ margin: "0 auto" }}>
              <span style={{ display: "inline-block" }}>現在Web上の動画編集案件の「8〜9割」が</span>
              <span style={{ display: "inline-block" }}>以上の3つのジャンルで占められています。</span>
            </p>
            <p className="section-sub" style={{ margin: "0 auto", marginTop: "12px" }}>
              <span style={{ display: "inline-block" }}>これらを経験することが将来フリーランスとして仕事を受けたり</span>
              <span style={{ display: "inline-block" }}>企業の制作チームに加わるための一番の近道です。</span>
            </p>
          </div>
        </div>
      </section>

      {/* ── 3. WORKFLOW ── */}
      <section className="workflow" id="workflow">
        <div className="container">
          <div className="workflow-header reveal">
            <div className="section-label"><span className="dot"></span> WORKFLOW</div>
            <h2 className="section-title">制作のステップ</h2>
            <p className="section-sub">煩雑な進行管理や企業とのやり取りはディレクターが担当し、クリエイターが制作に専念できる環境です。</p>
          </div>

          <div className="wf-steps-editorial">
            {[
              { img: "wf-proposal.png", num: 1, title: "案件の決定", desc: "クリエイターのスキルや目標、日々のコンディションを考慮しディレクターが最適なプロジェクトをアサインします。無理のないペースで取り組めるようスケジュールの調整も行います。", note: "", reverse: false },
              { img: "wf-briefing.png", num: 2, title: "要件の共有と制作スタート", desc: "制作する動画の目的や具体的な要件を対面やチャット（Teams）で共有します。企業との連絡はすべてディレクターが担当するため制作に集中できます。", note: "", reverse: true },
              { img: "wf-production.png", num: 3, title: "制作と進捗共有", desc: "パーソナルデスクでご自身の作業に集中していただきます。制作中に迷うことがあれば対面やチャット（Teams）でいつでもディレクターに相談できる環境です。", note: "", reverse: false },
              { img: "wf-review.png", num: 4, title: "レビューと品質向上", desc: "完成した動画はディレクターによるレビューを行います。より良い作品にするための具体的なフィードバックを通じ納品基準を満たすクオリティへ引き上げます。", note: "", reverse: true },
              { img: "wf-portfolio.png", num: 5, title: "納品、そしてご自身の実績へ", desc: "最終確認を終えた作品はディレクターが責任を持って企業へ納品。携わったプロジェクトはご自身の確かな「実績（ポートフォリオ）」として蓄積されていきます。", note: "", reverse: false },
            ].map((s) => (
              <div className={`wf-editorial-step${s.reverse ? " wf-editorial-step--reverse" : ""} reveal`} key={s.num} id={`wf-step${s.num}`}>
                <div className="wf-editorial-photo">
                  <img src={`/images/${s.img}`} alt="" width={600} height={600} />
                </div>
                <div className="wf-editorial-body">
                  <span className="wf-editorial-num">{s.num}</span>
                  <h3>{s.title}</h3>
                  <p>{s.desc}</p>
                  {s.note && <span className="wf-editorial-note">{s.note}</span>}
                </div>
              </div>
            ))}
          </div>

          <div className="workflow-closing reveal">
            <div className="workflow-closing-inner glass">
              <p>この制作サイクルを無理のないペースで繰り返していく。<br />その経験の積み重ねの中で実践的なテクニックや仕事の進め方などクリエイターとしてのスキルが自然と身についていきます。その積み上げた実績とスキルが将来の選択肢を広げていきます。</p>
            </div>
          </div>
        </div>
      </section>

      {/* ── 4. REASON ── */}
      <section className="support" id="reason">
        <div className="container">
          <div className="support-header reveal">
            <div className="section-label"><span className="dot"></span> REASON</div>
            <h2 className="section-title">安定して「企業案件」に取り組める理由</h2>
            <p className="section-sub">あなたが「つくること」だけに専念できる徹底した分業体制。それが当スタジオが数多くの企業案件を継続して手がけられる理由です。</p>
          </div>
          <div className="support-dual">
            <div className="support-pillar glass reveal reveal-d1" id="support-sales">
              <div className="support-pillar-icon">
                <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <circle cx="32" cy="32" r="32" fill="currentColor" opacity="0.08" />
                  <path d="M20 36l-4-4c-1.1-1.1-1.1-2.9 0-4l8-8c1.1-1.1 2.9-1.1 4 0l2 2M44 28l4 4c1.1 1.1 1.1 2.9 0 4l-8 8c-1.1 1.1-2.9 1.1-4 0l-2-2M22 30l10 10M28 24l10 10" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
              <h3>【案件開拓・窓口】<br />専属のディレクターが企業と連携</h3>
              <p>スタジオには専属のディレクターがおり継続的に多彩な案件を獲得しています。クライアントとの交渉や細かな調整はすべてディレクターが担当。外部との直接的な折衝を任せることはないため制作に集中できます。その分スタジオ内でのTeams等を用いた「業務の進捗報告」や「チーム間のコミュニケーション」に専念し将来に向けたビジネススキルの基盤を作れます。</p>
            </div>
            <div className="support-pillar glass reveal reveal-d2" id="support-production">
              <div className="support-pillar-icon">
                <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <circle cx="32" cy="32" r="32" fill="currentColor" opacity="0.08" />
                  <rect x="14" y="18" width="26" height="18" rx="2" stroke="currentColor" strokeWidth="2.5" />
                  <path d="M20 40h10M25 36v4" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
                  <circle cx="44" cy="38" r="7" stroke="currentColor" strokeWidth="2" />
                  <circle cx="44" cy="38" r="2.5" fill="currentColor" opacity="0.3" />
                  <path d="M44 29v2M44 45v2M37 38h2M49 38h2M39 33l1.4 1.4M47.6 41.6l1.4 1.4M39 43l1.4-1.4M47.6 34.4l1.4-1.4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                </svg>
              </div>
              <h3>【技術・品質管理】<br />現場を知るディレクターがサポート</h3>
              <p>制作中に行き詰まったときはいつでもディレクターに相談できます。最終的なクオリティの確認や納品もディレクターが責任を持って行うため一人で大きなプレッシャーを抱え込むことはありません。</p>
            </div>
          </div>
        </div>
      </section>

      {/* ── 5. ENVIRONMENT ── */}
      <section className="environment" id="environment">
        <div className="container">
          <div className="env-header reveal">
            <div className="section-label"><span className="dot"></span> ENVIRONMENT</div>
            <h2 className="section-title">自分のペースで集中できる場所</h2>
            <p className="section-sub">周囲の目を気にすることなくご自身のペースで作業に向き合えるワークスペースを整えています。</p>
          </div>
          <div className="env-items">
            {[
              { img: "env-personal-desk.png", title: "【パーソナルデスク】没頭できる自分だけの空間", desc: "周囲の視線を気にせず制作に深く集中できる半個室型のデスク。", cls: "reveal-left", reverse: false },
              { img: "env-premiere-pro.png", title: "【Premiere Pro】業界標準の制作ツール", desc: "動画制作の現場で欠かせないAdobe Premiere Proを使用。実戦的なスキルが身につきます。", cls: "reveal-right", reverse: true },
              { img: "env-teams-chat.png", title: "【チャットツール】仕事の進め方を学ぶ", desc: "案件の指示や相談はMicrosoft Teamsなどのチャットツールで行います。将来の就職やフリーランス活動でも通用する現代的な仕事の進め方を体験できます。", cls: "reveal-left", reverse: false },
            ].map((e, i) => (
              <div className={`env-item${e.reverse ? " env-item--reverse" : ""} ${e.cls}`} key={i}>
                <div className="env-item-image">
                  <img src={`/images/${e.img}`} alt="" width={600} height={400} />
                </div>
                <div className="env-item-body">
                  <h3>{e.title}</h3>
                  <p>{e.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 6. WORK STYLE ── */}
      <section className="lifestyle" id="workstyle">
        <div className="container">
          <div className="lifestyle-header reveal">
            <div className="section-label"><span className="dot"></span> WORK STYLE</div>
            <h2 className="section-title">無理なく制作を続けるために</h2>
          </div>
          <div className="lifestyle-blocks">
            <div className="lifestyle-block glass reveal reveal-d1" id="lifestyle-work">
              <div className="lifestyle-block-inner">
                <h3>スキルとコンディションに合わせた案件管理</h3>
                <p>「企業案件＝厳しい納期」という不安を感じる必要はありません。当スタジオではクリエイターの心身の負担となるような無茶な短納期の案件は事前にお断りしています。ディレクターが企業との間で無理のないスケジュールを調整・管理するため納期のプレッシャーに追われることなくご自身のペースで制作に集中していただけます。</p>
              </div>
            </div>
            <div className="lifestyle-block lifestyle-block--fitel glass reveal reveal-d2" id="lifestyle-health">
              <div className="lifestyle-block-inner">
                <h3>アプリを活用したコンディションの可視化</h3>
                <p>安定してクリエイティブな作業を続けるためには日々のコンディション把握が重要です。専用アプリ<strong>『Fitel（フィッテル）』</strong>を用いて日々の状態を記録することでご自身のバイオリズムを客観的に見つめ直し持続可能な働き方へと繋げていきます。</p>
              </div>
              <div className="lifestyle-fitel-visual">
                <img src="/images/fitel-app.png" alt="体調管理ソフトFitelのアプリ画面" width={300} height={600} />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── 7. FLOW ── */}
      <section className="flow" id="flow">
        <div className="container">
          <div className="flow-header reveal">
            <div className="section-label"><span className="dot"></span> FLOW</div>
            <h2 className="section-title">ご利用までの流れ</h2>
          </div>
          <div className="flow-steps">
            {[
              { num: 1, icon: <path d="M6 8h20v14H10l-4 4V8z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />, circles: [12, 16, 20], title: "お問い合わせ", desc: "まずはLINEより、お気軽にお問い合わせください。" },
              { num: 2, icon: <><path d="M4 16s5-8 12-8 12 8 12 8-5 8-12 8S4 16 4 16z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /><circle cx="16" cy="16" r="4" stroke="currentColor" strokeWidth="2" /></>, title: "見学", desc: "スタジオの洗練された雰囲気や、実際の制作現場をご案内します。" },
              { num: 3, icon: <><rect x="6" y="8" width="20" height="14" rx="2" stroke="currentColor" strokeWidth="2" /><path d="M2 24h28" stroke="currentColor" strokeWidth="2" strokeLinecap="round" /></>, title: "体験利用（3日間）", desc: "実際の制作環境に触れていただき、ご自身のペースに合うかをご確認いただけます。" },
              { num: 4, icon: <><path d="M10 4h8l6 6v18H10a2 2 0 01-2-2V6a2 2 0 012-2z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /><path d="M18 4v6h6M12 16h8M12 20h8M12 24h4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" /></>, title: "受給者証の申請", desc: "お住まいの自治体での必要なお手続きは、ディレクターが丁寧にサポートします。" },
              { num: 5, icon: <><path d="M16 4c0 0-8 6-8 18h16C24 10 16 4 16 4z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /><circle cx="16" cy="16" r="3" stroke="currentColor" strokeWidth="2" /><path d="M10 22l-4 4M22 22l4 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" /></>, title: "利用開始", desc: "ご自身のペースで、クリエイターとしての活動がスタートします。" },
            ].map((step, i) => (
              <div key={step.num} className="flow-step-wrapper">
                <div className={`flow-step reveal reveal-d${Math.min(i + 1, 3)}`} id={`flow-step${step.num}`}>
                  <div className="flow-step-number">{step.num}</div>
                  <div className="flow-step-icon">
                    <svg viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                      {step.icon}
                      {step.circles?.map((cx) => <circle key={cx} cx={cx} cy="15" r="1" fill="currentColor" />)}
                    </svg>
                  </div>
                  <h4>{step.title}</h4>
                  <p>{step.desc}</p>
                </div>
                {i < 4 && (
                  <div className="flow-arrow" aria-hidden="true">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M12 5v14M19 12l-7 7-7-7" />
                    </svg>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 8. FAQ ── */}
      <section className="faq" id="faq">
        <div className="container">
          <div className="faq-header reveal">
            <div className="section-label"><span className="dot"></span> Q&A</div>
            <h2 className="section-title">よくある質問</h2>
          </div>
          <div className="faq-list">
            {[
              { q: "ここは動画編集のスクールですか？", a: "いいえ、当スタジオは「学校」ではなく実際の企業案件を手がける「制作スタジオ」です。実際のプロジェクトに参加しディレクターのサポートを受けながら実践的な実績（ポートフォリオ）を積んでいく環境です。" },
              { q: "利用するための条件はありますか？", a: "精神・知的・身体障がい・難病をお持ちの方で、原則として「障がい者手帳」をお持ちの方、あるいは医師の診断や意見書がある方が対象です。" },
              { q: "動画編集が全くの未経験なのですが、利用できますか？", a: "はい、パソコンの基本操作ができれば問題ありません。最初はディレクターが基礎から丁寧にお教えしますがおおむね1ヶ月ほどで実際の企業案件に携わり始める方がほとんどです。" },
              { q: "この先どんな働き方に繋がっていきますか？", a: "通っている方が考えている将来は本当にさまざまです。「フリーランスとして自分で案件を受けたい」という方もいれば「好きなことで月に数万円の収入を得たい」という方、「企業のSNS担当として就職したい」という方もいます。ただどの道に進むにしても「ポートフォリオ（制作実績）」は必ず見られます。数も種類も多いほど有利です。パッソでは多彩な企業案件に携わるので通い続ける中で自然とポートフォリオが充実していきます。" },
              { q: "制作に対する報酬は支払われますか？", a: "はい。作業時間に応じた基本工賃に加え企業案件に携わった成果や貢献度に応じた『生産活動ボーナス』を上乗せしてお支払いしています。頑張りがしっかり評価される仕組みです。" },
              { q: "週に何日から利用できますか？", a: <>経験の有無に関わらず当スタジオでは「週3日・1日4時間以上」のご利用を推奨しています。<br />未経験の方にとっては「スキルの着実な習得と定着」のため、経験者の方にとっては「企業案件の納期を守り安定した制作リズムを作る」ためどちらの場合も継続的な時間が不可欠だと考えています。</> },
              { q: "在宅での制作（リモートワーク）は可能ですか？", a: "当スタジオでは原則として通所によるサポートを行っており在宅支援は行っておりません。スタジオという「仕事の場」に通うことで生活リズムにメリハリが生まれ体調の安定にも繋がると考えているからです。対面でのコミュニケーションや現場の空気感に触れることが社会的な自立への確かな一歩になると信じています。" },
            ].map((faq, i) => (
              <details className={`faq-item glass reveal reveal-d${Math.min(i + 1, 3)}`} key={i}>
                <summary className="faq-question">
                  <span className="faq-q-icon">Q</span>
                  <span className="faq-q-text">{faq.q}</span>
                  <span className="faq-toggle" aria-hidden="true"></span>
                </summary>
                <div className="faq-answer"><p>{faq.a}</p></div>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* ── STORY ── */}
      <section className="stories" id="stories">
        <div className="container">
          <div className="stories-header reveal">
            <div className="section-label"><span className="dot"></span> STORY</div>
            <h2 className="section-title">クリエイターの成功ストーリー</h2>
          </div>
          <div className="story-editorial-list">
            {[
              {
                label: "STORY A",
                heading: "独学と無料ソフトの壁を実感。今では本格的な環境で企業案件を担当しています",
                body: "最初はアルバイト代わりに動画編集で稼ごうと、無料のソフトを使って独学で始めました。自分では「そこそこのクオリティ」を作れているつもりだったのですが、実際の案件獲得には全く繋がらず……。業界標準である『Premiere Pro』の壁や、一人で学ぶことの限界を痛感していました。\n\nそんな時にパッソを知り、「好きなことを、ちゃんとした仕事にしたい」と一念発起。今では本格的な制作環境でスキルを磨きながら、責任を持って企業案件をしっかりと任せてもらえるようになりました。",
                credit: "Aさん（在籍クリエイター）",
              },
              {
                label: "STORY B",
                heading: "趣味だった動画制作が、「企業案件」として確かな仕事になった",
                body: "元々は趣味でYouTubeの切り抜き動画などを作っていて、パッソを知りました。最初は『体調のこともあり、自分なんかに本当にできるのかな？』と不安でしたが、実際の企業案件で信頼して仕事を任せてもらえることが、大きなモチベーションになりました。以前は家から出るのも少し億劫だったのですが、今では自分から『もっと案件はないですか？』とスタッフに聞いてしまうほど、前向きに取り組めています。",
                credit: "Bさん（在籍クリエイター）",
              },
              {
                label: "STORY C",
                heading: "パッソでの経験が、フリーランス独立への確かな土台になった",
                body: "パッソに通って一番良かったのは、生活リズムが整い、体調が安定したことです。実際の案件に携わることで、具体的な取り組み方や進め方、スタッフの方の案件管理の仕方などが非常に勉強になり、自信に繋がりました。また、ここで携わった多くの企業案件がそのまま自分の強力なポートフォリオになったことで、独立後の案件獲得がとてもやりやすくなりました。",
                credit: "Cさん（フリーランス独立）",
              },
            ].map((story, i) => (
              <div className={`story-editorial ${i % 2 !== 0 ? "story-editorial--reverse" : ""} reveal`} key={i}>
                <div className="story-editorial-accent">
                  <span className="story-editorial-label">{story.label}</span>
                </div>
                <div className="story-editorial-content">
                  <h3 className="story-editorial-heading">{story.heading}</h3>
                  <p className="story-editorial-body">{story.body}</p>
                  <span className="story-editorial-credit">{story.credit}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA（見学誘導メッセージ + LINEボタン） ── */}
      <section className="final-cta" id="final-cta">
        <div className="container">
          <div className="cta-message reveal">
            <h2 className="cta-message-heading">まずは一度、スタジオの雰囲気を見にいらっしゃいませんか？</h2>
            <div className="cta-message-body">
              <p>「実際の制作環境はどんな雰囲気だろう？」<br />そんな疑問があればぜひ一度スタジオの空気を感じにいらしてください。<br />現在の状況やこれから目指したい働き方についてお話ししましょう。</p>
              <p>見学やご相談にお越しいただいたからといってすぐに利用を決める必要はありません。<br />ここがあなたにとって「心地よく制作に向き合える場所」かどうかご自身の目でゆっくりと確かめていただければと思います。</p>
              <p>少しでもご興味があればまずはLINEよりお気軽にお声がけください。<br />スタッフ一同お会いできるのを楽しみにしております。</p>
            </div>
          </div>
          <div className="reveal">
            <a href="https://lin.ee/Xq4oYCH" target="_blank" rel="noopener noreferrer" className="cta-btn cta-btn--line" id="main-cta-btn" role="button" onClick={() => { if (typeof window !== "undefined" && (window as any).gtag_report_conversion) (window as any).gtag_report_conversion(); }}>
              {LINE_ICON}
              <span>LINEでお問い合わせ</span>
            </a>
          </div>
        </div>
      </section>

      {/* ── TRUST ── */}
      <section className="trust" id="trust">
        <div className="container">
          <div className="track-record reveal" id="track-record">
            <div className="track-record-emblem" aria-hidden="true">
              <svg viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M60 10C60 10 45 25 35 40C25 55 22 70 22 70C22 70 30 60 40 52C50 44 60 42 60 42C60 42 70 44 80 52C90 60 98 70 98 70C98 70 95 55 85 40C75 25 60 10 60 10Z" fill="currentColor" opacity="0.15" />
                <text x="60" y="68" textAnchor="middle" fontFamily="'Outfit', sans-serif" fontSize="28" fontWeight="700" fill="currentColor">10th</text>
              </svg>
            </div>
            <div className="track-record-content">
              <h3>10年の実績と信頼</h3>
              <p>株式会社Passo a Passoは2013年12月に創立し2014年3月から愛知県岡崎市・豊田市で事業を続けてきました。10年以上にわたる地元企業様や自治体様との信頼関係があるからこそ地元企業はもとより様々な企業様からの多彩な案件が集まっています。</p>
            </div>
          </div>
        </div>
      </section>

      {/* ── ABOUT ── */}
      <section className="about" id="about">
        <div className="container">
          <div className="about-header reveal">
            <div className="section-label"><span className="dot"></span> About</div>
            <h2 className="section-title">スタジオ概要</h2>
          </div>
          <div className="about-studios">
            <div className="about-studio glass reveal reveal-d1">
              <div className="about-studio-label">パッソアニメーションスタジオ</div>
              <address className="about-studio-address">
                〒444-0045<br />
                愛知県岡崎市康生通東1-1<br />
                岡崎フロントビル6-B
              </address>
              <div className="about-studio-map">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d1633.2!2d137.1641941!3d34.9584077!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x6004bd15847a915f%3A0xe6ca949c235af3a7!2z44OR44OD44K944Ki44OL44Oh44O844K344On44Oz44K544K_44K444Kq77yI5bCx5Yq057aZ57aa5pSv5o-0QuWei--8iQ!5e0!3m2!1sja!2sjp!4v1"
                  width="100%"
                  height="200"
                  style={{ border: 0, borderRadius: "var(--r-sm)", marginTop: 16 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="パッソアニメーションスタジオ 岡崎"
                ></iframe>
              </div>
            </div>
            <div className="about-studio glass reveal reveal-d2">
              <div className="about-studio-label">パッソアニメーションスタジオ豊田</div>
              <address className="about-studio-address">
                〒473-0901<br />
                愛知県豊田市御幸本町5-311-8
              </address>
              <div className="about-studio-map">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d1631.5!2d137.1479506!3d35.0490656!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x6004a13f4c6d7335%3A0x4781f4b5efb15f9f!2z44OR44OD44K944Ki44OL44Oh44O844K344On44Oz44K544K_44K444Kq6LGK55Sw77yI5bCx5Yq057aZ57aa5pSv5o-0QuWei--8iQ!5e0!3m2!1sja!2sjp!4v1"
                  width="100%"
                  height="200"
                  style={{ border: 0, borderRadius: "var(--r-sm)", marginTop: 16 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="パッソアニメーションスタジオ豊田"
                ></iframe>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="site-footer" id="footer">
        <p className="footer-supplement">※イラストレーターも同時募集しています。所属クリエイターが描いたイラストを動画で動かすなどチームでの制作も行っています。</p>
        <div className="footer-logo">
          <img src="/images/logo-passo.png" alt="パッソアニメーションスタジオ" className="footer-logo-img" />
        </div>
        <p className="footer-copy">&copy; 2026 Passo a Passo. All rights reserved.</p>
      </footer>

      {/* ── FLOATING CTA ── */}
      <div className="float-cta" id="float-cta" aria-hidden="true">
        <a href="https://lin.ee/Xq4oYCH" target="_blank" rel="noopener noreferrer" className="float-cta-btn" id="float-cta-btn" onClick={() => { if (typeof window !== "undefined" && (window as any).gtag_report_conversion) (window as any).gtag_report_conversion(); }}>
          <svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18" aria-hidden="true">
            <path d="M19.365 9.863c.349 0 .63.285.63.631 0 .345-.281.63-.63.63H17.61v1.125h1.755c.349 0 .63.283.63.63 0 .344-.281.629-.63.629h-2.386c-.345 0-.627-.285-.627-.629V8.108c0-.345.282-.63.63-.63h2.386c.346 0 .627.285.627.63 0 .349-.281.63-.63.63H17.61v1.125h1.755zm-3.855 3.016c0 .27-.174.51-.432.596-.064.021-.133.031-.199.031-.211 0-.391-.09-.51-.25l-2.443-3.317v2.94c0 .344-.279.629-.631.629-.346 0-.626-.285-.626-.629V8.108c0-.271.173-.508.43-.595.06-.023.136-.033.194-.033.195 0 .375.104.495.254l2.462 3.33V8.108c0-.345.282-.63.63-.63.345 0 .63.285.63.63v4.771zm-5.741 0c0 .344-.282.629-.631.629-.345 0-.627-.285-.627-.629V8.108c0-.345.282-.63.63-.63.346 0 .628.285.628.63v4.771zm-2.466.629H4.917c-.345 0-.63-.285-.63-.629V8.108c0-.345.285-.63.63-.63.348 0 .63.285.63.63v4.141h1.756c.348 0 .629.283.629.63 0 .344-.282.629-.629.629M24 10.314C24 4.943 18.615.572 12 .572S0 4.943 0 10.314c0 4.811 4.27 8.842 10.035 9.608.391.082.923.258 1.058.59.12.301.079.766.038 1.08l-.164 1.02c-.045.301-.24 1.186 1.049.645 1.291-.539 6.916-4.078 9.436-6.975C23.176 14.393 24 12.458 24 10.314" />
          </svg>
          <span>LINEでお問い合わせ</span>
        </a>
      </div>
    </>
  );
}
