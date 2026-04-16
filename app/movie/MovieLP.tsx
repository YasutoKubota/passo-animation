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
          <div className="section-label" style={{ marginBottom: 16, opacity: 0, animation: "heroFade 0.8s var(--ease-out) 0.2s forwards" }}>
            <span className="dot"></span>
            PASSO ANIMATION STUDIO
          </div>
          <h1>
            <span style={{ display: "inline-block" }}>企業案件で創る、</span><span style={{ display: "inline-block" }}>「実務レベル」のポートフォリオ。</span><br />
            <span style={{ display: "inline-block" }}>それが、あなたを</span><span style={{ display: "inline-block" }}>「選ばれるクリエイター」にする。</span>
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
              <span style={{ display: "inline-block" }}>動画編集を、</span><span style={{ display: "inline-block" }}>続けてきたあなたへ。</span>
            </h2>
            <div className="bridge-body">
              <p>
                パッソアニメーションスタジオは、<br />
                企業から映像制作を受託する<br />
                クリエイターチームです。
              </p>
              <p>
                年間200件以上の案件が常に動くこのチームで、<br />
                あなたが携わる仕事は、<br />
                そのままあなたのポートフォリオになります。
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── 2. PROJECTS ── */}
      <section className="projects" id="projects">
        <div className="container">
          <div className="projects-header reveal">
            <div className="section-label"><span className="dot"></span> WORKS</div>
            <h2 className="section-title">チームで手がける企業案件</h2>
          </div>
          <div className="project-cards">
            {[
              { img: "card-short-video.png", alt: "SNSショート・Web動画広告", title: "SNSショート・Web動画広告", desc: "TikTok、Instagramリール、YouTubeショートなどの縦型動画から、Web上の動画広告まで。テンポの良いカット編集やテロップデザインを形にします。" },
              { img: "card-corporate-video.png", alt: "コーポレート・採用PR映像", title: "コーポレート・採用PR映像", desc: "企業の公式チャンネルや採用特設サイトに向けた映像制作。経営者や社員のインタビュー、社内風景のドキュメンタリーなど、企業の魅力を視覚的に翻訳し、制作します。" },
              { img: "card-manga-video.png", alt: "漫画動画・YouTubeエンタメ編集", title: "漫画動画・YouTubeエンタメ編集", desc: "企業が運営するビジネス系・エンタメ系チャンネルの動画編集。トークのカットアップや、イラスト素材を活用した漫画動画など、それぞれのチャンネルに合わせた世界観を形にします。" },
              { img: "card-motion-graphics.png", alt: "モーショングラフィックス", title: "モーショングラフィックス（キーフレームアニメーション）", desc: "イラストやテキストなどの素材を、キーフレームを使って動かしていく編集作業。静止画に細やかな動きや表情を加え、映像ならではの豊かな表現を手がけます。" },
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
              <span style={{ display: "inline-block" }}>スタジオが手がけるのは、</span>
              <span style={{ display: "inline-block" }}>多岐にわたるジャンルの企業案件です。</span>
            </p>
            <p className="section-sub" style={{ margin: "0 auto", marginTop: "12px" }}>
              <span style={{ display: "inline-block" }}>クライアントの意図を汲み取り、</span>
              <span style={{ display: "inline-block" }}>チームで映像として完成させる。</span><br />
              <span style={{ display: "inline-block" }}>その日々の仕事が、</span>
              <span style={{ display: "inline-block" }}>あなたを「選ばれるクリエイター」にします。</span>
            </p>
          </div>
        </div>
      </section>

      {/* ── 3. WORKFLOW ── */}
      <section className="workflow" id="workflow">
        <div className="container">
          <div className="workflow-header reveal">
            <div className="section-label"><span className="dot"></span> WORKFLOW</div>
            <h2 className="section-title">チームで進める制作ステップ</h2>
            <p className="section-sub">映像制作の現場で、実務に集中できる環境を。パッソアニメーションスタジオでは、専属のディレクターを中心に、それぞれの強みを掛け合わせてひとつのプロジェクトを動かします。</p>
          </div>

          <div className="wf-steps-editorial">
            {[
              { img: "wf-proposal.png", num: 1, title: "案件の共有・キックオフ", desc: "あなたのスキルに合わせて、ディレクターから最適な案件が共有されます。クライアントとのやり取りもすべてディレクターが担当し、目的や構成が整理された状態でスタートするため、目の前の制作に集中できる環境です。", note: "", reverse: false },
              { img: "wf-briefing.png", num: 2, title: "編集・制作作業", desc: "共有された構成をもとに、あなたのスキルを活かして編集を進めます。制作中の仕様確認やアイデアの共有は、チャットツール等を用いてシームレスに行われます。作業の手を止めることなく、チームと連携しながら形にしていきます。", note: "", reverse: true },
              { img: "wf-review.png", num: 3, title: "チームでのブラッシュアップ", desc: "出来上がった映像は、ディレクターと一緒に確認します。作品のクオリティを一段引き上げ、クライアントの期待を超えるための「磨き上げ」の時間です。", note: "", reverse: false },
              { img: "wf-portfolio.png", num: 4, title: "納品・そして実績へ", desc: "完成した映像をクライアントへ納品します。チームで品質を担保して世に出した実績。その一つひとつが、クリエイターとしてのあなたの価値を証明します。", note: "", reverse: true },
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
        </div>
      </section>


      {/* ── 5. ENVIRONMENT ── */}
      <section className="environment" id="environment">
        <div className="container">
          <div className="env-header reveal">
            <div className="section-label"><span className="dot"></span> ENVIRONMENT</div>
            <h2 className="section-title">制作に集中できる環境</h2>
            <p className="section-sub">チームの一員として、目の前の仕事に向き合える環境が整っています。</p>
          </div>
          <div className="env-items">
            {[
              { img: "env-personal-desk.png", title: "【パーソナルデスク】自分の作業スペース", desc: "視界を遮り、制作に専念できる半個室型のデスクを採用。", cls: "reveal-left", reverse: false },
              { img: "env-premiere-pro.png", title: "【Premiere Pro】業界標準の制作ツール", desc: "Adobe Premiere Proを使用しています。", cls: "reveal-right", reverse: true },
              { img: "env-teams-chat.png", title: "【チャットツール】スマートなチーム連携", desc: "ビジネスチャットツールで、チームと連携します。", cls: "reveal-left", reverse: false },
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
              { num: 2, icon: <><path d="M4 16s5-8 12-8 12 8 12 8-5 8-12 8S4 16 4 16z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /><circle cx="16" cy="16" r="4" stroke="currentColor" strokeWidth="2" /></>, title: "見学", desc: "スタジオの洗練された雰囲気や、制作現場をご案内します。" },
              { num: 3, icon: <><rect x="6" y="8" width="20" height="14" rx="2" stroke="currentColor" strokeWidth="2" /><path d="M2 24h28" stroke="currentColor" strokeWidth="2" strokeLinecap="round" /></>, title: "体験利用（3日間）", desc: "制作環境に触れていただき、ご自身のペースに合うかをご確認いただけます。" },
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
              { q: "ここは動画編集のスクールですか？", a: "いいえ、当スタジオは「学校」ではなく企業案件を手がける「制作スタジオ」です。携わった案件がそのままあなたの実績として積み上がります。なお、パッソアニメーションスタジオは働くことに障がいのある方のための就労継続支援B型事業所です。" },
              { q: "利用するための条件はありますか？", a: "精神・知的・身体障がい・難病をお持ちの方で、原則として「障がい者手帳」をお持ちの方、あるいは医師の診断や意見書がある方が対象です。なお、ご利用にあたっては「受給者証」という証明書の取得が必要です（詳しくは下記をご覧ください）。" },
              { q: "「受給者証」とは何ですか？持っていなくても利用できますか？", a: "受給者証とは、障害福祉サービスを利用するために必要な証明書で、お住まいの市区町村の窓口で申請します。障がい者手帳をお持ちでない方でも、主治医の意見書（または診断書）があれば申請できる場合があります。ただし申請には市区町村による審査があり、状況によって異なります。「自分は対象になるの？」「手続きが不安」という方も、スタッフが一緒に確認しますのでまずはお気軽にご相談ください。" },
              { q: "動画編集が全くの未経験なのですが、利用できますか？", a: "はい、パソコンの基本操作ができれば問題ありません。最初はディレクターが基礎から丁寧にお教えしますがおおむね1ヶ月ほどで企業案件に携わり始める方がほとんどです。" },
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
            <div className="section-label"><span className="dot"></span> VOICE</div>
            <h2 className="section-title">クリエイターの声</h2>
          </div>
          <div className="story-editorial-list">
            {[
              {
                label: "STORY A",
                heading: "趣味だった動画制作が、仕事になった。",
                body: "元々は趣味でYouTubeの切り抜き動画などを作っていて、パッソを知りました。最初は「本当にできるのかな？」と不安でしたが、企業の案件を任せてもらえることが大きなモチベーションになりました。今では自分から「もっと案件はないですか？」とスタッフに聞いてしまうほど、前向きに取り組めています。",
                credit: "Aさん（在籍クリエイター）",
              },
              {
                label: "STORY B",
                heading: "ひとりでは越えられなかった壁を、パッソで越えました。",
                body: "動画編集でお金を稼ぎたいと思い、無料ソフトでひとりで試行錯誤しながら始めました。\n\nでも思うように収入には繋がらなくて。そんな時にパッソを知りました。\n\n来てからはPremiere Proでの編集に移りましたが、これまでとは違うソフトで最初の数週間は戸惑いの連続でした。それでもスタッフが丁寧に教えてくれたおかげで、気づいたら楽しくなっていて、企業案件を任せてもらえるようになっていました。\n\n今では毎日制作に向き合えています。",
                credit: "Bさん（在籍クリエイター）",
              },
              {
                label: "STORY C",
                heading: "パッソでの仕事が、フリーランス独立へ繋がった。",
                body: "パッソに通うリズムができたことで、昼夜逆転していた生活が自然と整っていきました。\n\n企業案件に携わることで、仕事の進め方やチームでの動き方を覚え、いつの間にか自信がついていきました。ここで手がけた企業案件がそのまま自分のポートフォリオになったことで、独立してからも仕事が取りやすくなりました。",
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
              <p>「制作環境はどんな雰囲気だろう？」<br />そんな疑問があればぜひ一度スタジオの空気を感じにいらしてください。<br />現在の状況やこれから目指したい働き方についてお話ししましょう。</p>
              <p>見学やご相談にお越しいただいたからといってすぐに利用を決める必要はありません。<br />ここがあなたにとって「心地よく制作に向き合える場所」かどうか、あなた自身の目でゆっくりと確かめていただければと思います。</p>
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
              <p>株式会社Passo a Passoは2014年3月から愛知県岡崎市・豊田市で事業を続けてきました。10年以上にわたる地元企業様や自治体様との信頼関係があるからこそ地元企業はもとより様々な企業様からの多彩な案件が集まっています。</p>
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
