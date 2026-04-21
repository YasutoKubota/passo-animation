"use client";

import { useEffect } from "react";

const LINE_ICON = (
  <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M19.365 9.863c.349 0 .63.285.63.631 0 .345-.281.63-.63.63H17.61v1.125h1.755c.349 0 .63.283.63.63 0 .344-.281.629-.63.629h-2.386c-.345 0-.627-.285-.627-.629V8.108c0-.345.282-.63.63-.63h2.386c.346 0 .627.285.627.63 0 .349-.281.63-.63.63H17.61v1.125h1.755zm-3.855 3.016c0 .27-.174.51-.432.596-.064.021-.133.031-.199.031-.211 0-.391-.09-.51-.25l-2.443-3.317v2.94c0 .344-.279.629-.631.629-.346 0-.626-.285-.626-.629V8.108c0-.271.173-.508.43-.595.06-.023.136-.033.194-.033.195 0 .375.104.495.254l2.462 3.33V8.108c0-.345.282-.63.63-.63.345 0 .63.285.63.63v4.771zm-5.741 0c0 .344-.282.629-.631.629-.345 0-.627-.285-.627-.629V8.108c0-.345.282-.63.63-.63.346 0 .628.285.628.63v4.771zm-2.466.629H4.917c-.345 0-.63-.285-.63-.629V8.108c0-.345.285-.63.63-.63.348 0 .63.285.63.63v4.141h1.756c.348 0 .629.283.629.63 0 .344-.282.629-.629.629M24 10.314C24 4.943 18.615.572 12 .572S0 4.943 0 10.314c0 4.811 4.27 8.842 10.035 9.608.391.082.923.258 1.058.59.12.301.079.766.038 1.08l-.164 1.02c-.045.301-.24 1.186 1.049.645 1.291-.539 6.916-4.078 9.436-6.975C23.176 14.393 24 12.458 24 10.314" />
  </svg>
);

export default function IllustLP() {
  useEffect(() => {
    const header = document.getElementById("header");
    const onScroll = () => {
      header?.classList.toggle("is-scrolled", window.scrollY > 40);
    };
    window.addEventListener("scroll", onScroll, { passive: true });

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
          <img src="/images/illust-hero.jpg" alt="" width={1200} height={800} className="hero-bg-fallback" />
        </div>
        <div className="hero-content">
          <div className="section-label" style={{ marginBottom: 16, opacity: 0, animation: "heroFade 0.8s var(--ease-out) 0.2s forwards" }}>
            <span className="dot"></span>
            PASSO ANIMATION STUDIO
          </div>
          <h1>
            <span style={{ display: "inline-block" }}>あなたの絵が、</span><span style={{ display: "inline-block" }}>世界に出る。</span>
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
              <span style={{ display: "inline-block" }}>描き続けてきた、</span><span style={{ display: "inline-block" }}>あなたへ。</span>
            </h2>
            <div className="bridge-body">
              <p>
                SNSに投稿しても、なかなか届かない。<br />
                趣味で描いているだけじゃもったいない。<br />
                そう感じながらも、絵を描くことをやめられない。
              </p>
              <p>
                パッソアニメーションスタジオは、<br />
                企業からイラスト制作を受託する<br />
                クリエイターチームです。
              </p>
              <p>
                年間2,000件以上の案件が動くこのスタジオで、<br />
                あなたが描いたイラストは、<br />
                企業の広告や商品として、世の中に届きます。
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
            <h2 className="section-title">あなたの絵が使われる場所</h2>
          </div>
          <div className="project-cards">
            {[
              { img: "illust-card-sns.jpg", alt: "SNSイラスト・アイコン制作", title: "SNSイラスト・アイコン制作", desc: "企業のSNSアカウントで使用するオリジナルイラストやアイコン制作。毎日目にするSNSの投稿に、あなたの絵が使われます。" },
              { img: "illust-card-character.jpg", alt: "キャラクターデザイン・商品イラスト", title: "キャラクターデザイン・商品イラスト", desc: "企業のマスコットキャラクターや商品パッケージのイラスト制作。あなたが描いたキャラクターが、店頭や広告で生き続けます。" },
              { img: "illust-card-manga.jpg", alt: "漫画・コミックイラスト", title: "漫画・コミックイラスト", desc: "企業のPR漫画や解説コミックの制作。コマの中のキャラクターや背景が、読者に届く瞬間を一緒につくります。" },
              { img: "illust-card-motion.jpg", alt: "モーション素材イラスト", title: "モーション素材イラスト", desc: "動画チームがアニメーションをつけるためのイラスト素材制作。あなたが描いたキャラクターが、動き出す瞬間を体験できます。" },
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
              <span style={{ display: "inline-block" }}>ひとりで描いていた絵が、</span>
              <span style={{ display: "inline-block" }}>企業の仕事として世の中に出ていく。</span>
            </p>
            <p className="section-sub" style={{ margin: "0 auto", marginTop: "12px" }}>
              <span style={{ display: "inline-block" }}>その積み重ねが、</span>
              <span style={{ display: "inline-block" }}>イラストレーターとしての確かな実績になります。</span>
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
            <p className="section-sub">あなたのタッチや得意なスタイルを活かして、企業案件に向き合える環境を。パッソアニメーションスタジオでは、専属のディレクターがあなたのイラストスタイルを理解したうえで案件を共有します。</p>
          </div>

          <div className="wf-steps-editorial">
            {[
              { img: "illust-wf-proposal.jpg", num: 1, title: "スタイルの把握・案件の共有", desc: "まずディレクターがあなたの得意なタッチや表現スタイルを把握します。そのうえで、あなたの絵に合った案件を共有します。「自分のスタイルを変えなければいけない」という心配はありません。クライアントとのやり取りはすべてディレクターが担当するので、描くことに集中できます。", note: "", reverse: false },
              { img: "illust-wf-drawing.jpg", num: 2, title: "ラフ・制作作業", desc: "共有されたイメージをもとに、ラフから丁寧に描き進めます。制作中の方向性の確認やアイデアの共有は、チャットツールを通じてスムーズに行えます。ペンを止めることなく、チームと連携しながら形にしていきます。", note: "", reverse: true },
              { img: "illust-wf-review.jpg", num: 3, title: "チームでのブラッシュアップ", desc: "仕上がったイラストは、ディレクターと一緒に確認します。「もっとよくなる」という視点で一緒に磨き上げる時間です。自分ひとりでは気づかなかった表現に出会えることもあります。", note: "", reverse: false },
              { img: "illust-wf-portfolio.jpg", num: 4, title: "納品・そして実績へ", desc: "完成したイラストがクライアントのもとへ届き、広告や商品として世の中に出ていきます。SNSに投稿し続けても届かなかった絵が、確かな仕事として誰かの目に触れる。その手応えが、次の制作への力になります。", note: "", reverse: true },
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
            <p className="section-sub">チームの一員として、目の前の絵に向き合える環境が整っています。</p>
          </div>
          <div className="env-items">
            {[
              { img: "photo-env-desk.jpg", title: "【パーソナルデスク】自分の作業スペース", desc: "視界を遮り、制作に専念できる半個室型のデスクを採用。液晶タブレットを使ったデジタルイラスト制作に対応しています。", cls: "reveal-left", reverse: false },
              { img: "illust-env-clipstudio.jpg", title: "【Clip Studio Paint】業界標準の制作ツール", desc: "Clip Studio Paintを使用。漫画・イラスト制作に特化した機能が揃っており、プロの現場と同じ環境で制作に取り組めます。", cls: "reveal-right", reverse: true },
              { img: "photo-env-teams.jpg", title: "【チャットツール】スマートなチーム連携", desc: "ビジネスチャットツールでチームと連携します。ひとりで悩まず、ディレクターや他のクリエイターにすぐ相談できる環境です。", cls: "reveal-left", reverse: false },
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

      {/* ── VOICE ── */}
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
                heading: "自分の絵が、広告になった日。",
                body: "ずっとSNSにイラストを投稿していたけど、反応はほとんどなくて。描くのは好きなのに、誰にも届いていない感じが辛かったです。\n\nパッソに来て最初に驚いたのは、企業から本当に仕事として依頼が来ていること。自分が描いたイラストが、実際に企業の広告として使われたとき、初めて「届いた」という実感がありました。",
                credit: "Aさん（在籍クリエイター）",
              },
              {
                label: "STORY B",
                heading: "「スタイルを変えなくていい」と言われて、安心した。",
                body: "企業案件と聞いて、最初は自分の絵柄を無理やり変えさせられるんじゃないかと思っていました。\n\nでも実際はディレクターが私のタッチに合った案件を選んで持ってきてくれて。「この人のスタイルでお願いしたい」という形で仕事が来るんです。\n\n自分の絵のまま、仕事ができている。それが一番驚いたことでした。",
                credit: "Bさん（在籍クリエイター）",
              },
              {
                label: "STORY C",
                heading: "パッソで描いた実績が、独立への自信になった。",
                body: "ひとりで在宅で描いていた頃は、自分の実力が客観的にわからなくて不安でした。\n\nパッソで企業案件をこなすうちに、「自分の絵は仕事になる」という確信が少しずつ育っていきました。ここで積んだ実績をポートフォリオにまとめたら、フリーランスとして独立してからも継続的に仕事が来るようになりました。",
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

      {/* ── FLOW ── */}
      <section className="flow" id="flow">
        <div className="container">
          <div className="flow-header reveal">
            <div className="section-label"><span className="dot"></span> FLOW</div>
            <h2 className="section-title">スタジオへ</h2>
          </div>
          <div className="flow-steps">
            {[
              { num: 1, icon: <path d="M6 8h20v14H10l-4 4V8z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />, circles: [12, 16, 20], title: "お問い合わせ", desc: "LINEよりお問い合わせください。ご質問だけでも構いません。" },
              { num: 2, icon: <><path d="M4 16s5-8 12-8 12 8 12 8-5 8-12 8S4 16 4 16z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /><circle cx="16" cy="16" r="4" stroke="currentColor" strokeWidth="2" /></>, title: "見学（ご希望の方）", desc: "ご希望の方は、スタジオの雰囲気や制作現場をご覧いただけます。" },
              { num: 3, icon: <><rect x="6" y="8" width="20" height="14" rx="2" stroke="currentColor" strokeWidth="2" /><path d="M2 24h28" stroke="currentColor" strokeWidth="2" strokeLinecap="round" /></>, title: "体験利用（3日間）", desc: "希望される方は、3日間スタジオで制作を体験いただけます。" },
              { num: 4, icon: <><path d="M10 4h8l6 6v18H10a2 2 0 01-2-2V6a2 2 0 012-2z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /><path d="M18 4v6h6M12 16h8M12 20h8M12 24h4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" /></>, title: "受給者証の申請", desc: "参加を決められた場合、必要な手続きはディレクターが一緒に進めます。" },
              { num: 5, icon: <><path d="M16 4c0 0-8 6-8 18h16C24 10 16 4 16 4z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /><circle cx="16" cy="16" r="3" stroke="currentColor" strokeWidth="2" /><path d="M10 22l-4 4M22 22l4 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" /></>, title: "チームへ", desc: "チームの一員として、企業案件に向けた制作がスタートします。" },
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

      {/* ── Q&A ── */}
      <section className="faq" id="faq">
        <div className="container">
          <div className="faq-header reveal">
            <div className="section-label"><span className="dot"></span> Q&A</div>
            <h2 className="section-title">よくある質問</h2>
          </div>
          <div className="faq-list">
            {[
              { q: "ここはイラストのスクールですか？", a: "いいえ、当スタジオは「学校」ではなく企業案件を手がける「制作スタジオ」です。関わった案件がそのままあなたの実績として積み上がります。パッソアニメーションスタジオは働くことに障がいのある方のための就労継続支援B型事業所です。" },
              { q: "自分のイラストスタイルを変えなければいけませんか？", a: "いいえ。ディレクターがあなたのタッチや得意なスタイルを把握したうえで、それに合った案件を選んでお声がけします。あなたの絵柄を活かすことがチームの制作力につながると考えているからです。" },
              { q: "就労継続支援B型とは何ですか？", a: "制作活動を通して職業スキルを向上させることを目的とし、フリーランスや一般就労といった「次のステップ」を目指していくための福祉サービスです。" },
              { q: "利用するための条件はありますか？", a: "精神・知的・身体障がい・難病があり、原則として「障がい者手帳」をお持ちの方、あるいは医師の診断や意見書がある方にご利用いただけます。ご利用にあたっては「受給者証」という証明書の取得が必要です（詳しくは下記をご覧ください）。" },
              { q: "「受給者証」とは何ですか？持っていなくても利用できますか？", a: "受給者証とは、障害福祉サービスを利用するために必要な証明書で、お住まいの市区町村の窓口で申請します。障がい者手帳をお持ちでない方でも、主治医の意見書があれば申請できる場合があります。手続きが不安という方も、ディレクターが一緒に確認しますので、まずはLINEよりご連絡ください。" },
              { q: "利用するのにお金はかかりますか？", a: "前年度の世帯収入に応じて自己負担額が決定されますが、多くの方が自己負担なくご利用されています。詳細な負担額については、お住まいの市区町村の窓口にてご確認ください。" },
              { q: "制作に対する報酬は支払われますか？", a: "はい。作業時間に応じた基本工賃に加え、企業案件に携わった成果や貢献度に応じた『生産活動ボーナス』を上乗せしてお支払いしています。頑張りがしっかり評価される仕組みです。" },
              { q: "デジタルイラストが未経験でも大丈夫ですか？", a: "はい。アナログで絵を描いてきた方も、ディレクターが一緒にClip Studio Paintの操作から丁寧にサポートします。「絵を描くことが好き」という気持ちがあれば大丈夫です。" },
              { q: "週に何日から利用できますか？", a: "経験の有無に関わらず、当スタジオでは「週3日・1日4時間以上」からのご利用を推奨しています。企業案件の納期を守り、安定した制作リズムを作るためには、継続的な時間が不可欠だと考えているからです。" },
              { q: "在宅での制作（リモートワーク）は可能ですか？", a: "当スタジオでは、原則としてスタジオへお越しいただいての制作をお願いしております。ディレクターやチームのメンバーと同じ空間でコミュニケーションを取りながら進めることが、制作のクオリティを高め、成長につながると考えているからです。" },
              { q: "この先どんな働き方に繋がっていきますか？", a: "「フリーランスのイラストレーターとして独立したい」という方もいれば、「副業として収入を得たい」「企業のデザイン部門に就職したい」という方もいます。ここで積んだ企業案件の実績は、どの道に進むにしても、あなたの絵が仕事になるという確かな証明になります。" },
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
          <div className="cta-message reveal">
            <h2 className="cta-message-heading">まずは、LINEから。</h2>
            <div className="cta-message-body">
              <p>ご質問や見学のご相談など、<br />LINEからいつでもメッセージを送ってみてください。</p>
              <p>あなたの絵のこと、ここからお話ししましょう。</p>
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
        <p className="footer-supplement">※動画編集クリエイターも同時募集しています。所属クリエイターが描いたイラストを動画で動かすなど、チームでの制作も行っています。</p>
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
