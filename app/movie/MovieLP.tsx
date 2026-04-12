"use client";

import { useEffect } from "react";

/* ── SVG icon data (shared across sections) ── */
const LINE_ICON = (
  <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M19.365 9.863c.349 0 .63.285.63.631 0 .345-.281.63-.63.63H17.61v1.125h1.755c.349 0 .63.283.63.63 0 .344-.281.629-.63.629h-2.386c-.345 0-.627-.285-.627-.629V8.108c0-.345.282-.63.63-.63h2.386c.346 0 .627.285.627.63 0 .349-.281.63-.63.63H17.61v1.125h1.755zm-3.855 3.016c0 .27-.174.51-.432.596-.064.021-.133.031-.199.031-.211 0-.391-.09-.51-.25l-2.443-3.317v2.94c0 .344-.279.629-.631.629-.346 0-.626-.285-.626-.629V8.108c0-.271.173-.508.43-.595.06-.023.136-.033.194-.033.195 0 .375.104.495.254l2.462 3.33V8.108c0-.345.282-.63.63-.63.345 0 .63.285.63.63v4.771zm-5.741 0c0 .344-.282.629-.631.629-.345 0-.627-.285-.627-.629V8.108c0-.345.282-.63.63-.63.346 0 .628.285.628.63v4.771zm-2.466.629H4.917c-.345 0-.63-.285-.63-.629V8.108c0-.345.285-.63.63-.63.348 0 .63.285.63.63v4.141h1.756c.348 0 .629.283.629.63 0 .344-.282.629-.629.629M24 10.314C24 4.943 18.615.572 12 .572S0 4.943 0 10.314c0 4.811 4.27 8.842 10.035 9.608.391.082.923.258 1.058.59.12.301.079.766.038 1.08l-.164 1.02c-.045.301-.24 1.186 1.049.645 1.291-.539 6.916-4.078 9.436-6.975C23.176 14.393 24 12.458 24 10.314" />
  </svg>
);

export default function MovieLP() {
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
          <a href="#final-cta" className="header-cta" id="header-cta-btn" onClick={scrollTo("final-cta")}>
            お問い合わせ
          </a>
        </div>
      </header>

      {/* ── 1. HERO ── */}
      <section className="hero" id="hero">
        <div className="hero-bg">
          <img src="/images/hero-creator.png" alt="" width={1200} height={800} className="hero-bg-fallback" />
          <video className="hero-video" autoPlay muted loop playsInline disablePictureInPicture>
            <source src="/images/hero-bg-video.mp4" type="video/mp4" />
          </video>
        </div>
        <div className="hero-content">
          <p className="hero-sub-copy">働くことに障がいのあるクリエイターのための制作スタジオ（就労継続支援B型）</p>
          <h1>
            あなたの「好き」が、仕事になる。<br />
            多彩な企業案件が、揃っています。
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
              「好き」であること。<br />
              それが、何よりの強みになります。
            </h2>
            <div className="bridge-body">
              <p>「好きなことには、時間を忘れてのめり込める」</p>
              <p>
                もしあなたがそうなら、その「好き」という純粋なエネルギーは、<br />
                動画制作において、どんなスキルよりも強い武器になります。
              </p>
              <p>
                ここは、あなたの「好き」という気持ちを、<br />
                そのまま「仕事」に変えるための場所です。
              </p>
              <p>
                あなたの「好き」がどんな仕事になるのか。<br />
                まずは、実際の企業案件を覗いてみてください。
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
            <h2 className="section-title">企業案件の例</h2>
            <p className="section-sub">パッソでは、多彩なジャンルの動画制作案件に携わることができます。</p>
          </div>
          <div className="project-cards">
            {[
              { img: "card-short-video.png", alt: "SNSショート動画", title: "SNSショート動画（実写・編集）", desc: "TikTok、Instagramリール、YouTubeショートなど。最新のトレンドを掴む案件です。" },
              { img: "card-corporate-video.png", alt: "企業PR動画", title: "企業PR・インタビュー動画", desc: "企業の公式チャンネル向けに、インタビューや会社紹介の動画を制作します。" },
              { img: "card-manga-video.png", alt: "漫画動画", title: "漫画動画の編集", desc: "イラスト素材に動きや音をつけ、多種多様なエンタメ・PR案件に携わります。" },
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
        </div>
      </section>

      {/* ── 2.5 WORKFLOW ── */}
      <section className="workflow" id="workflow">
        <div className="container">
          <div className="workflow-header reveal">
            <div className="section-label"><span className="dot"></span> Workflow</div>
            <h2 className="section-title">企業案件ってどう進めるの？<span className="title-sub">（制作のステップ）</span></h2>
            <p className="section-sub">「実際の企業案件って、どんな風に進めるの？」<br />パッソでは、クリエイターが作ることに集中できるよう、このようなステップで仕事を進めていきます。</p>
          </div>

          <div className="wf-steps-editorial">
            {[
              { img: "wf-proposal.png", num: 1, title: "あなたにぴったりの案件をご提案", desc: "ディレクターが、あなたの現在のスキルや目標、日々のコンディションに合わせて、「こちら、お願いできますか？」と最適なプロジェクトをご提案します。", note: "体調やスキルに合わせて、あなただけのカリキュラムと案件を一緒に考えます。", reverse: false },
              { img: "wf-briefing.png", num: 2, title: "お仕事の説明とスタート", desc: "「こんな動画を作ってほしい」という具体的な内容を、対面やチャット（Teams）を使って分かりやすくお伝えします。企業様との連絡はすべてスタッフが担当するので、あなたは制作にだけ集中できる環境です。", note: "企業とのやりとりはすべてスタッフが対応。直接連絡する必要はありません。", reverse: true },
              { img: "wf-production.png", num: 3, title: "制作スタート＆いつでも相談", desc: "パーソナルデスクで、自分の作業に没頭できます。もし操作やデザインで迷った時は、対面やチャットでいつでもディレクターや仲間に相談できるので、一人で抱え込むことはありません。", note: "困ったら手を挙げるだけ。すぐに誰かが一緒に考えてくれます。", reverse: false },
              { img: "wf-review.png", num: 4, title: "一緒に確認・ブラッシュアップ", desc: "できあがった動画は、ディレクターと一緒に確認します。「ここをこう工夫すると、もっとクライアントに喜んでもらえますよ」というクリエイター視点でのアドバイスを交えながら、一緒に作品のクオリティを高めていきます。", note: "ダメ出しではなく、一緒にクオリティを上げるためのフィードバックです。", reverse: true },
              { img: "wf-portfolio.png", num: 5, title: "完成。そしてあなたの「実績」へ", desc: "完成した作品は、ディレクターが責任をもって企業様へ納品します。クライアントからの喜びの声を受け取れるだけでなく、携わった作品はあなた自身の確かな「実績（ポートフォリオ）」としてどんどん積み上がっていきます。", note: "あなたの名前が入った作品が、世の中に届いていきます。", reverse: false },
            ].map((s) => (
              <div className={`wf-editorial-step${s.reverse ? " wf-editorial-step--reverse" : ""} reveal`} key={s.num} id={`wf-step${s.num}`}>
                <div className="wf-editorial-photo">
                  <img src={`/images/${s.img}`} alt="" width={600} height={600} />
                </div>
                <div className="wf-editorial-body">
                  <span className="wf-editorial-num">{s.num}</span>
                  <h3>{s.title}</h3>
                  <p>{s.desc}</p>
                  <span className="wf-editorial-note">{s.note}</span>
                </div>
              </div>
            ))}
          </div>

          <div className="workflow-closing reveal">
            <div className="workflow-closing-inner glass">
              <p>この制作のサイクルを、無理のないペースで繰り返していく。<br />その経験の積み重ねの中で、実践的なテクニックや仕事の進め方など、クリエイターとしての多彩なスキルが自然と身についていきます。</p>
            </div>
          </div>
        </div>
      </section>

      {/* ── 4. SUPPORT ── */}
      <section className="support" id="support">
        <div className="container">
          <div className="support-header reveal">
            <div className="section-label"><span className="dot"></span> Support</div>
            <h2 className="section-title">現場を支える強力なサポート体制</h2>
            <p className="section-sub">パッソでは、あなたが着実にスキルアップし、安心して活動できるよう、それぞれの専門スタッフが役割を持って支えています。</p>
          </div>
          <div className="support-dual">
            <div className="support-pillar glass reveal reveal-d1" id="support-sales">
              <div className="support-pillar-icon">
                <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <circle cx="32" cy="32" r="32" fill="currentColor" opacity="0.08" />
                  <path d="M20 36l-4-4c-1.1-1.1-1.1-2.9 0-4l8-8c1.1-1.1 2.9-1.1 4 0l2 2M44 28l4 4c1.1 1.1 1.1 2.9 0 4l-8 8c-1.1 1.1-2.9 1.1-4 0l-2-2M22 30l10 10M28 24l10 10" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
              <h3>【案件獲得】専属の営業スタッフ</h3>
              <p>日々、企業案件を獲得しています。企業様とのやり取りはすべて営業スタッフが担当するため、あなたはプレッシャーを感じることなく、制作のみに集中できる環境です。</p>
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
              <h3>【制作サポート】実務経験豊富な専門スタッフ</h3>
              <p>動画制作の現場を知り尽くしたスタッフが、あなたの制作活動をサポート。技術的な相談からクオリティ管理まで、現場の視点でしっかり支えます。</p>
            </div>
          </div>
        </div>
      </section>

      {/* ── 5. ENVIRONMENT ── */}
      <section className="environment" id="environment">
        <div className="container">
          <div className="env-header reveal">
            <div className="section-label"><span className="dot"></span> Environment</div>
            <h2 className="section-title">クリエイティブを加速させる「環境」</h2>
            <p className="section-sub">制作の現場を想定した設備とコミュニケーションツールを完備しています。</p>
          </div>
          <div className="env-items">
            {[
              { img: "env-personal-desk.png", title: "【パーソナルデスク】没頭できる自分だけの空間", desc: "周囲の視線を気にせず、自分の制作に深く集中できる半個室型のデスク。", cls: "reveal-left", reverse: false },
              { img: "env-premiere-pro.png", title: "【Premiere Pro】業界標準の制作ツール", desc: "動画制作の現場で欠かせないAdobe Premiere Proを使用。実戦的なスキルが身につきます。", cls: "reveal-right", reverse: true },
              { img: "env-teams-chat.png", title: "【チャットツール】仕事の進め方を学ぶ", desc: "案件の指示や相談は、Microsoft Teamsなどのチャットツールで行います。将来の就職やフリーランス活動でも通用する、現代的な仕事の進め方を体験できます。", cls: "reveal-left", reverse: false },
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

      {/* ── 6. LIFESTYLE ── */}
      <section className="lifestyle" id="lifestyle">
        <div className="container">
          <div className="lifestyle-header reveal">
            <div className="section-label"><span className="dot"></span> Lifestyle</div>
            <h2 className="section-title">パッソでの過ごし方</h2>
          </div>
          <div className="lifestyle-blocks">
            <div className="lifestyle-block glass reveal reveal-d1" id="lifestyle-work">
              <div className="lifestyle-block-inner">
                <h3>働き方について：あなたのスキルとペースに合わせて</h3>
                <p>動画制作の現場では、短納期の案件ももちろん存在します。しかしパッソでは、すべての案件を専属スタッフが管理し、「あなたの現在のスキル」と「その時のペース」に合わせて最適な案件をお願いしています。一人で抱え込むことなく、無理のない範囲で企業様からの案件に向き合える環境です。</p>
              </div>
            </div>
            <div className="lifestyle-block lifestyle-block--fitel glass reveal reveal-d2" id="lifestyle-health">
              <div className="lifestyle-block-inner">
                <h3>体調管理について：大きな崩れを防ぐために</h3>
                <p>弊社独自開発の体調管理ソフト<strong>『Fitel（フィッテル）』</strong>を活用します。日々の小さな体調の変化（波）を毎日記録し続けることで、自分のコンディションを客観的に把握でき、大きな体調の崩れを未然に防ぐことができます。安定して長く制作を続けるためのセルフケアとして役立ててください。</p>
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
            <div className="section-label"><span className="dot"></span> Flow</div>
            <h2 className="section-title">ご利用までの流れ</h2>
          </div>
          <div className="flow-steps">
            {[
              { num: 1, icon: <path d="M6 8h20v14H10l-4 4V8z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />, circles: [12, 16, 20], title: "お問い合わせ", desc: "まずはLINEからお気軽にご連絡ください。" },
              { num: 2, icon: <><path d="M4 16s5-8 12-8 12 8 12 8-5 8-12 8S4 16 4 16z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /><circle cx="16" cy="16" r="4" stroke="currentColor" strokeWidth="2" /></>, title: "見学", desc: "スタジオの雰囲気や、実際の制作現場を見学してください。" },
              { num: 3, icon: <><rect x="6" y="8" width="20" height="14" rx="2" stroke="currentColor" strokeWidth="2" /><path d="M2 24h28" stroke="currentColor" strokeWidth="2" strokeLinecap="round" /></>, title: "体験利用（原則3日間）", desc: "実際にソフトを触り、あなたの特性や適性を一緒に確認します。" },
              { num: 4, icon: <><path d="M10 4h8l6 6v18H10a2 2 0 01-2-2V6a2 2 0 012-2z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /><path d="M18 4v6h6M12 16h8M12 20h8M12 24h4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" /></>, title: "受給者証の申請", desc: "お住まいの自治体での申請をスタッフがサポートします。" },
              { num: 5, icon: <><path d="M16 4c0 0-8 6-8 18h16C24 10 16 4 16 4z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /><circle cx="16" cy="16" r="3" stroke="currentColor" strokeWidth="2" /><path d="M10 22l-4 4M22 22l4 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" /></>, title: "利用開始", desc: "あなたの体調に合わせ、クリエイティブ活動が始まります。" },
            ].map((step, i) => (
              <div key={step.num}>
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
              { q: "対象者はどのような人ですか？", a: "精神・知的・身体障がい、難病をお持ちの方で、原則として「障がい者手帳」をお持ちの方、あるいは医師の診断や意見書がある方が対象です。" },
              { q: "プレミアプロを使ったことがないのですが……", a: "大丈夫です。現在活躍しているクリエイターの中にも、未経験からスタートした方がたくさんいます。独自のマニュアルと、専門スタッフによる丁寧な指導で、着実にステップアップできます。" },
              { q: "週に何日から通う必要がありますか？", a: <>企業案件を扱う都合上、原則として<strong>1日4時間・週3日以上</strong>の利用をお願いしています。納期を守り、安定して制作に取り組むための「仕事のリズム」を一緒に作っていきましょう。</> },
              { q: "在宅でのサポート（在宅支援）は受けられますか？", a: "当スタジオでは、原則として通所によるサポートを行っており、在宅支援は行っておりません。スタジオという「仕事の場」に通うことで、生活リズムにメリハリが生まれ、体調の安定にも繋がると考えているからです。対面でのコミュニケーションや現場の空気感に触れることが、社会的な自立への確かな一歩になると信じています。" },
              { q: "工賃（報酬）は発生しますか？", a: "はい。作業時間に応じた基本工賃に加え、実際の企業案件に携わった成果や貢献度に応じた『生産活動ボーナス』を上乗せしてお支払いしています。頑張りがしっかり評価される仕組みです。" },
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

      {/* ── CTA ── */}
      <section className="final-cta" id="final-cta">
        <div className="container">
          <div className="reveal">
            <a href="#" className="cta-btn cta-btn--line" id="main-cta-btn" role="button">
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
              <p>株式会社Passo a Passoは2013年12月に創立し、2014年3月から愛知県岡崎市・豊田市で事業を続けてきました。10年以上にわたる地元企業様や自治体様との信頼関係があるからこそ、地元企業はもとより、様々な企業様からの多彩な案件が集まっています。</p>
            </div>
          </div>
        </div>
      </section>

      {/* ── ABOUT ── */}
      <section className="about" id="about">
        <div className="container">
          <div className="about-header reveal">
            <div className="section-label"><span className="dot"></span> About</div>
            <h2 className="section-title">施設概要</h2>
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
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3266.7!2d137.1617!3d34.9563!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x6004a31e2a9a1a1d%3A0x0!2z5bKh5bSO44OV44Ot44Oz44OI44OT44Or!5e0!3m2!1sja!2sjp!4v1"
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
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3263.5!2d137.1555!3d35.0825!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x6004bb8e8e8e8e8d%3A0x0!2z6LGK55Sw5biC5b6h5bm45pys55S6!5e0!3m2!1sja!2sjp!4v1"
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
        <p className="footer-supplement">※イラストレーターも同時募集しています。所属クリエイターが描いたイラストを動画で動かすなど、チームでの制作も行っています。</p>
        <div className="footer-logo">
          <img src="/images/logo-passo.png" alt="パッソアニメーションスタジオ" className="footer-logo-img" />
        </div>
        <p className="footer-copy">&copy; 2026 Passo a Passo. All rights reserved.</p>
      </footer>

      {/* ── FLOATING CTA ── */}
      <div className="float-cta" id="float-cta" aria-hidden="true">
        <a href="#" className="float-cta-btn" id="float-cta-btn">
          <svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18" aria-hidden="true">
            <path d="M19.365 9.863c.349 0 .63.285.63.631 0 .345-.281.63-.63.63H17.61v1.125h1.755c.349 0 .63.283.63.63 0 .344-.281.629-.63.629h-2.386c-.345 0-.627-.285-.627-.629V8.108c0-.345.282-.63.63-.63h2.386c.346 0 .627.285.627.63 0 .349-.281.63-.63.63H17.61v1.125h1.755zm-3.855 3.016c0 .27-.174.51-.432.596-.064.021-.133.031-.199.031-.211 0-.391-.09-.51-.25l-2.443-3.317v2.94c0 .344-.279.629-.631.629-.346 0-.626-.285-.626-.629V8.108c0-.271.173-.508.43-.595.06-.023.136-.033.194-.033.195 0 .375.104.495.254l2.462 3.33V8.108c0-.345.282-.63.63-.63.345 0 .63.285.63.63v4.771zm-5.741 0c0 .344-.282.629-.631.629-.345 0-.627-.285-.627-.629V8.108c0-.345.282-.63.63-.63.346 0 .628.285.628.63v4.771zm-2.466.629H4.917c-.345 0-.63-.285-.63-.629V8.108c0-.345.285-.63.63-.63.348 0 .63.285.63.63v4.141h1.756c.348 0 .629.283.629.63 0 .344-.282.629-.629.629M24 10.314C24 4.943 18.615.572 12 .572S0 4.943 0 10.314c0 4.811 4.27 8.842 10.035 9.608.391.082.923.258 1.058.59.12.301.079.766.038 1.08l-.164 1.02c-.045.301-.24 1.186 1.049.645 1.291-.539 6.916-4.078 9.436-6.975C23.176 14.393 24 12.458 24 10.314" />
          </svg>
          <span>LINEでお問い合わせ</span>
        </a>
      </div>
    </>
  );
}
