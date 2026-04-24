"use client";

import { useEffect } from "react";
import "./start.css";

export default function StartLP() {
  useEffect(() => {
    const header = document.querySelector<HTMLElement>(".sp-header");
    const onScroll = () => {
      if (!header) return;
      header.style.boxShadow = window.scrollY > 8 ? "0 2px 16px rgba(45, 62, 79, 0.06)" : "none";
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();

    // Smooth scroll for in-page anchors (account for sticky header height)
    const getHeaderOffset = () => (header ? header.getBoundingClientRect().height : 0);
    const onAnchorClick = (e: Event) => {
      const link = e.currentTarget as HTMLAnchorElement;
      const href = link.getAttribute("href");
      if (!href || href === "#" || href.length < 2 || !href.startsWith("#")) return;
      const target = document.querySelector(href);
      if (!target) return;
      e.preventDefault();
      const y = (target as HTMLElement).getBoundingClientRect().top + window.pageYOffset - getHeaderOffset() - 12;
      window.scrollTo({ top: y, behavior: "smooth" });
    };
    const anchors = document.querySelectorAll<HTMLAnchorElement>('.start-page a[href^="#"]');
    anchors.forEach((a) => a.addEventListener("click", onAnchorClick));

    // Fade-in on scroll
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("sp-is-in-view");
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
    );
    const selectors = [
      ".sp-section-head", ".sp-empathy-item", ".sp-manager-message__card",
      ".sp-gap__diagram", ".sp-gap__key", ".sp-gap__data-item",
      ".sp-pyramid-figure", ".sp-element-card", ".sp-diff-card",
      ".sp-number-card", ".sp-voice-card", ".sp-staircase",
      ".sp-program-cat", ".sp-pick-card", ".sp-schedule-item",
      ".sp-staff-card", ".sp-flow-step", ".sp-faq-item",
      ".sp-access__info", ".sp-access__map",
    ];
    const targets = document.querySelectorAll(selectors.join(","));
    targets.forEach((el) => { el.classList.add("sp-fade-init"); io.observe(el); });

    // FAQ: close others when one opens
    const faqItems = document.querySelectorAll<HTMLDetailsElement>(".sp-faq-item");
    const onToggle = (item: HTMLDetailsElement) => () => {
      if (item.open) faqItems.forEach((o) => { if (o !== item) o.open = false; });
    };
    const toggleHandlers: Array<[HTMLDetailsElement, () => void]> = [];
    faqItems.forEach((item) => {
      const h = onToggle(item);
      item.addEventListener("toggle", h);
      toggleHandlers.push([item, h]);
    });

    return () => {
      window.removeEventListener("scroll", onScroll);
      anchors.forEach((a) => a.removeEventListener("click", onAnchorClick));
      io.disconnect();
      toggleHandlers.forEach(([item, h]) => item.removeEventListener("toggle", h));
    };
  }, []);

  return (
    <div className="start-page" id="top">
      {/* SVG Sprite */}
      <svg width="0" height="0" style={{ position: "absolute" }} aria-hidden="true">
        <defs>
          <symbol id="sp-i-line" viewBox="0 0 24 24"><path fill="currentColor" d="M19.365 9.863c.349 0 .63.285.63.631 0 .345-.281.63-.63.63H17.61v1.125h1.755c.349 0 .63.283.63.63 0 .344-.281.628-.63.628H16.98a.633.633 0 01-.63-.628V8.108a.631.631 0 01.63-.63h2.386c.349 0 .629.284.629.63 0 .349-.28.63-.629.63H17.61v1.125h1.755zm-3.855 3.016a.631.631 0 01-.629.63.634.634 0 01-.508-.256L12.429 11.22v1.66a.631.631 0 01-1.261 0V8.108a.631.631 0 01.629-.63.623.623 0 01.495.253L14.248 10.143V8.108c0-.347.28-.63.629-.63.345 0 .629.283.629.63v4.771zm-5.435 0a.631.631 0 01-.629.63H7.06a.625.625 0 01-.438-.178.64.64 0 01-.192-.45V8.108a.631.631 0 01.63-.63c.346 0 .63.283.63.63v4.141h1.756c.345 0 .629.283.629.63M5.048 12.879a.631.631 0 01-.63.63.631.631 0 01-.629-.63V8.108a.631.631 0 01.629-.63c.346 0 .63.283.63.63v4.771M24 10.314C24 4.943 18.615.572 12 .572S0 4.943 0 10.314c0 4.811 4.27 8.842 10.035 9.608.391.082.923.258 1.058.59.12.301.079.766.038 1.08l-.164 1.02c-.045.301-.24 1.186 1.049.645 1.291-.539 6.916-4.078 9.436-6.975C23.176 14.393 24 12.458 24 10.314" /></symbol>
          <symbol id="sp-i-phone" viewBox="0 0 24 24"><path fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72 12.84 12.84 0 00.7 2.81 2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45 12.84 12.84 0 002.81.7A2 2 0 0122 16.92z" /></symbol>
          <symbol id="sp-i-check" viewBox="0 0 24 24"><path fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" d="M5 12l5 5L20 7" /></symbol>
          <symbol id="sp-i-user" viewBox="0 0 24 24"><path fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" /><circle cx="12" cy="7" r="4" fill="none" stroke="currentColor" strokeWidth="1.6" /></symbol>
          <symbol id="sp-i-users" viewBox="0 0 24 24"><path fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" /><circle cx="9" cy="7" r="4" fill="none" stroke="currentColor" strokeWidth="1.6" /><path fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75" /></symbol>
          <symbol id="sp-i-heart" viewBox="0 0 24 24"><path fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z" /></symbol>
          <symbol id="sp-i-target" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" fill="none" stroke="currentColor" strokeWidth="1.6" /><circle cx="12" cy="12" r="6" fill="none" stroke="currentColor" strokeWidth="1.6" /><circle cx="12" cy="12" r="2" fill="currentColor" /></symbol>
          <symbol id="sp-i-money" viewBox="0 0 24 24"><line x1="12" y1="1" x2="12" y2="23" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" /><path fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" d="M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6" /></symbol>
          <symbol id="sp-i-chat" viewBox="0 0 24 24"><path fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" /></symbol>
          <symbol id="sp-i-map-pin" viewBox="0 0 24 24"><path fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" /><circle cx="12" cy="10" r="3" fill="none" stroke="currentColor" strokeWidth="1.6" /></symbol>
          <symbol id="sp-i-calendar" viewBox="0 0 24 24"><rect x="3" y="4" width="18" height="18" rx="2" ry="2" fill="none" stroke="currentColor" strokeWidth="1.6" /><line x1="16" y1="2" x2="16" y2="6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" /><line x1="8" y1="2" x2="8" y2="6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" /><line x1="3" y1="10" x2="21" y2="10" stroke="currentColor" strokeWidth="1.6" /></symbol>
          <symbol id="sp-i-briefcase" viewBox="0 0 24 24"><rect x="2" y="7" width="20" height="14" rx="2" ry="2" fill="none" stroke="currentColor" strokeWidth="1.6" /><path fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" d="M16 21V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v16" /></symbol>
          <symbol id="sp-i-book" viewBox="0 0 24 24"><path fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" d="M4 19.5A2.5 2.5 0 016.5 17H20M6.5 2H20v20H6.5A2.5 2.5 0 014 19.5v-15A2.5 2.5 0 016.5 2z" /></symbol>
          <symbol id="sp-i-shield" viewBox="0 0 24 24"><path fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /></symbol>
          <symbol id="sp-i-flag" viewBox="0 0 24 24"><path fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1zM4 22V4" /></symbol>
          <symbol id="sp-i-instagram" viewBox="0 0 24 24"><rect x="2" y="2" width="20" height="20" rx="5" ry="5" fill="none" stroke="currentColor" strokeWidth="1.6" /><path fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" d="M16 11.37A4 4 0 1112.63 8 4 4 0 0116 11.37zM17.5 6.5h.01" /></symbol>
          <symbol id="sp-i-home" viewBox="0 0 24 24"><path fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" /><polyline points="9,22 9,12 15,12 15,22" fill="none" stroke="currentColor" strokeWidth="1.6" /></symbol>
          <symbol id="sp-i-edit" viewBox="0 0 24 24"><path fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" /></symbol>
          <symbol id="sp-i-handshake" viewBox="0 0 24 24"><path fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" d="M20 12V8l-8 4-8-4v4l8 4zM20 12l-8 4-8-4M12 16v6" /></symbol>
        </defs>
      </svg>

      {/* Header */}
      <header className="sp-header">
        <div className="sp-header__inner">
          <a href="#top" className="sp-header__logo">
            <img src="/start/logo.png" alt="Passo a Passo ロゴ" />
            <div className="sp-header__logo-text">
              <strong>就職ゼミナール Passo a Passo</strong>
              岡崎駅徒歩7分の就労移行支援
            </div>
          </a>
          <div className="sp-header__actions">
            <div className="sp-header__tel">
              <span className="sp-header__tel-label">お電話はこちら（平日 9:50〜15:00）</span>
              <strong>0564-83-5551</strong>
            </div>
            <a href="#contact" className="sp-btn sp-btn--line sp-btn--sm">
              <svg width="18" height="18" aria-hidden="true"><use href="#sp-i-line" /></svg>
              LINEで相談
            </a>
          </div>
        </div>
      </header>

      <main>
        {/* 02. Hero */}
        <section className="sp-hero">
          <div className="sp-hero__inner">
            <div>
              <span className="sp-hero__badge">就労移行支援 / 岡崎駅 徒歩7分</span>
              <h1 className="sp-hero__title">
                長く働き続けるための、<br />
                <em>最短距離</em>。
              </h1>
              <p className="sp-hero__lead">
                あなた自身が決める「一歩ずつ」を、私たちと。<br />
                Passo a Passo（パッソ ア パッソ）はイタリア語で「一歩ずつ」。失業保険の期間内（半年〜1年）で就職を目指す、<strong>短期集中</strong>の就労移行支援です。
              </p>
              <p className="sp-hero__place">愛知県岡崎市柱・JR岡崎駅徒歩7分 ／ 平日 9:50〜15:00</p>

              <div className="sp-hero__stats">
                <div className="sp-stat-card">
                  <div className="sp-stat-card__value">91<small>%</small></div>
                  <div className="sp-stat-card__label">通所率<br />（直近6ヶ月平均）</div>
                </div>
                <div className="sp-stat-card">
                  <div className="sp-stat-card__value">100<small>%</small></div>
                  <div className="sp-stat-card__label">定着率<br />（就職後6ヶ月）</div>
                </div>
                <div className="sp-stat-card">
                  <div className="sp-stat-card__value">約80<small>%</small></div>
                  <div className="sp-stat-card__label">地元就職率<br />（岡崎・幸田）</div>
                </div>
              </div>

              <div className="sp-hero__cta">
                <a href="#contact" className="sp-btn sp-btn--line sp-btn--lg">
                  <svg width="22" height="22" aria-hidden="true"><use href="#sp-i-line" /></svg>
                  LINEで無料相談する
                </a>
                <a href="#flow" className="sp-btn sp-btn--ghost sp-btn--lg">見学の流れを見る</a>
              </div>
              <p className="sp-hero__cta-note">※ 見学・体験は無料です。お弁当100円で1日体験もできます。</p>
            </div>

            <div className="sp-hero__visual">
              <div className="sp-hero__visual-placeholder">
                <svg viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg">
                  <circle cx="60" cy="60" r="58" fill="#FFFFFF" fillOpacity="0.5" />
                  <circle cx="60" cy="42" r="16" fill="#7FB8D4" />
                  <path d="M30 95 Q30 70 60 70 Q90 70 90 95 L90 110 L30 110 Z" fill="#7FB8D4" />
                  <circle cx="82" cy="30" r="8" fill="#F5B976" />
                  <path d="M95 60 L105 60 M100 55 L100 65" stroke="#F5B976" strokeWidth="2" strokeLinecap="round" />
                </svg>
                <p>写真：事業所の内観または<br />スタッフの笑顔（自然光）</p>
              </div>
              <div className="sp-hero__chara">
                <img src="/start/logo-chara.png" alt="" />
              </div>
            </div>
          </div>
        </section>

        {/* 03. Empathy */}
        <section className="sp-section sp-empathy">
          <div className="sp-container">
            <div className="sp-section-head">
              <span className="sp-section-head__eyebrow">STEP 1 — 思い当たることはありますか</span>
              <h2 className="sp-section-head__title">もし今、こんな状態なら<br />まず、<em>この先を読んでみてください</em>。</h2>
            </div>

            <ul className="sp-empathy__list">
              {[
                "気力がわかず、外に出るのがしんどい日が続いている",
                "「自分にはもう、働けないのかもしれない」と自分の価値を疑ってしまう",
                "ハローワークには行っているけれど、動いている実感がない",
                "一度は就職したものの、長く続かずに辞めてしまった",
                "家族以外の人と関わる機会が、ほとんどない",
              ].map((text, i) => (
                <li key={i} className="sp-empathy-item">
                  <span className="sp-empathy-item__check"><svg width="16" height="16"><use href="#sp-i-check" /></svg></span>
                  <span className="sp-empathy-item__text">{text}</span>
                </li>
              ))}
            </ul>

            <div className="sp-empathy__foot">
              <p>
                ひとつでも当てはまったら、<br />
                <strong>「ここから動き始める」</strong>という選択肢があります。<br />
                決めるのは、あなた自身。まずは話を聞くだけで大丈夫です。
              </p>
              <a href="#contact" className="sp-btn sp-btn--line">
                <svg width="18" height="18" aria-hidden="true"><use href="#sp-i-line" /></svg>
                まずはLINEで話してみる
              </a>
            </div>
          </div>
        </section>

        {/* 04. 管理者メッセージ */}
        <section className="sp-section sp-manager-message">
          <div className="sp-container">
            <div className="sp-section-head">
              <span className="sp-section-head__eyebrow">管理者からのメッセージ</span>
              <h2 className="sp-section-head__title">お電話、少し怖いですよね。<br /><em>でも、大丈夫です。</em></h2>
            </div>

            <div className="sp-manager-message__card">
              <div className="sp-manager-message__avatar">
                <svg viewBox="0 0 100 100" aria-hidden="true">
                  <circle cx="50" cy="38" r="18" fill="#5A9CB8" />
                  <path d="M20 90 Q20 60 50 60 Q80 60 80 90 Z" fill="#5A9CB8" />
                  <circle cx="42" cy="36" r="2" fill="#FFFFFF" />
                  <circle cx="58" cy="36" r="2" fill="#FFFFFF" />
                  <path d="M44 46 Q50 50 56 46" stroke="#FFFFFF" strokeWidth="2" fill="none" strokeLinecap="round" />
                </svg>
                <span className="sp-manager-message__avatar-note">※ イラスト差替え予定</span>
              </div>
              <div>
                <div className="sp-manager-message__role">SERVICE MANAGER</div>
                <div className="sp-manager-message__name">加藤 法子</div>
                <div className="sp-manager-message__title">サービス管理者／介護福祉士／就労移行支援 10年</div>
                <p className="sp-manager-message__quote">
                  今は不安な気持ちがあっても大丈夫です。私たちと一緒に、自分に合った仕事を探していきましょう。
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* 05. 理想と現状のギャップ */}
        <section className="sp-section sp-gap">
          <div className="sp-container">
            <div className="sp-section-head">
              <span className="sp-section-head__eyebrow">STEP 2 — 本当に解きたい課題</span>
              <h2 className="sp-section-head__title">問題は、<em>「就職できないこと」</em>じゃない。<br />「続かないこと」の方かもしれません。</h2>
            </div>

            <div className="sp-gap__diagram">
              <div className="sp-gap__row sp-gap__row--ideal">
                <span className="sp-gap__row-label">理想</span>
                <p className="sp-gap__row-text">安定して働いて、生活を自分で整えたい。</p>
              </div>
              <div className="sp-gap__arrow">ここに差がある</div>
              <div className="sp-gap__row sp-gap__row--current">
                <span className="sp-gap__row-label">現状</span>
                <p className="sp-gap__row-text">無職、または就職しても長く続かない。</p>
              </div>
            </div>

            <div className="sp-gap__key">
              <div className="sp-gap__key-label">WHAT — ここが本当の課題</div>
              <p className="sp-gap__key-text">
                就職すること自体は、実は一人でもできる。<br />
                難しいのは、<strong>「続けること」</strong>のほう。
              </p>
            </div>

            <div className="sp-gap__data">
              <h3>精神障害のある方が離職する理由 TOP3 ―― 厚生労働省「障害者雇用実態調査」より</h3>
              <div className="sp-gap__data-list">
                <div className="sp-gap__data-item">
                  <div className="sp-gap__data-rank">1</div>
                  <p className="sp-gap__data-text">職場の雰囲気・人間関係</p>
                  <div className="sp-gap__data-value">33.8%</div>
                </div>
                <div className="sp-gap__data-item">
                  <div className="sp-gap__data-rank">2</div>
                  <p className="sp-gap__data-text">賃金・労働条件に不満</p>
                  <div className="sp-gap__data-value">29.7%</div>
                </div>
                <div className="sp-gap__data-item">
                  <div className="sp-gap__data-rank">3</div>
                  <p className="sp-gap__data-text">疲れやすく体力・意欲が続かない／仕事内容が合わない</p>
                  <div className="sp-gap__data-value">28.4%</div>
                </div>
              </div>
              <p className="sp-gap__data-source">「続かない」には、ちゃんと理由があります。そして、その理由は準備できる。</p>
            </div>
          </div>
        </section>

        {/* 06. 3層構造 */}
        <section className="sp-section sp-pyramid-wrap">
          <div className="sp-container">
            <div className="sp-section-head">
              <span className="sp-section-head__eyebrow">STEP 3 — Passo a Passo の解決方法</span>
              <h2 className="sp-section-head__title">「長く働き続ける」を<br /><em>3つの層</em>で準備する。</h2>
              <p className="sp-section-head__lead">
                Passo a Passo の支援は、「200種類のプログラム」を並べるのではなく、<br />
                1つの設計思想に基づいた<strong>3層構造</strong>で組み立てられています。
              </p>
            </div>

            <figure className="sp-pyramid-figure">
              <div className="sp-pyramid">
                <div className="sp-pyramid__level sp-pyramid__level--top">
                  <div className="sp-pyramid__level-step">STEP 6</div>
                  <div className="sp-pyramid__level-title">就職活動</div>
                  <div className="sp-pyramid__level-desc">履歴書・面接対策。下の層の精度が上がるほど、ジョブマッチングの精度が上がります。</div>
                </div>
                <div className="sp-pyramid__level sp-pyramid__level--mid">
                  <div className="sp-pyramid__level-step">STEP 2 – 5 ／ 並列で進める</div>
                  <div className="sp-pyramid__level-title">働くための準備（4つの領域）</div>
                  <div className="sp-pyramid__level-desc">順番ではなく、あなた自身のボトルネックになっている所から取り組みます。</div>
                  <div className="sp-pyramid__mid-steps">
                    {[
                      { step: "STEP 2", title: "プライベート管理", sub: "（生活リズム・収支）" },
                      { step: "STEP 3", title: "コミュニケーション", sub: "（自分を守るため）" },
                      { step: "STEP 4", title: "社会人基礎", sub: "（マナー・ストレス予防）" },
                      { step: "STEP 5", title: "ジョブマッチング", sub: "（長所・配慮事項）" },
                    ].map((s, i) => (
                      <div key={i} className="sp-pyramid__mid-step">
                        <div className="sp-pyramid__mid-step-label">{s.step}</div>
                        <div className="sp-pyramid__mid-step-title">{s.title}<br />{s.sub}</div>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="sp-pyramid__level sp-pyramid__level--base">
                  <div className="sp-pyramid__level-step">STEP 1</div>
                  <div className="sp-pyramid__level-title">健康管理</div>
                  <div className="sp-pyramid__level-desc">
                    独自の「セルフコントロールプラン」＋体調管理Webアプリで、働き続けられる心身の状態を整える。ここが、すべての土台です。
                  </div>
                </div>
              </div>

              <p className="sp-pyramid__note">
                <strong>なぜ3層構造なのか？</strong> ――
                STEP 1〜5 を飛ばしても、就職自体はできます。でも、<strong>長くは続かない</strong>。
                一度就職して離職した方のほとんどは、このSTEP 1〜5のどこかに課題があったから続かなかった。
                <strong>Passo a Passo に通う意味は「就職させること」ではなく、「長く働き続けられるようになること」</strong>です。
              </p>
            </figure>

            <div className="sp-four-elements">
              <h3 className="sp-four-elements__title">「続けるための4つの要素」に、すべて対応しています。</h3>
              <p className="sp-four-elements__lead">先ほどの離職理由TOP3は、実はこの4つに整理できます。</p>
              <div className="sp-four-elements__grid">
                {[
                  { icon: "sp-i-heart", title: "健康", text: "心身の安定。疲れて続かないを防ぐ。", tag: "STEP 1 で対応" },
                  { icon: "sp-i-target", title: "適性", text: "仕事内容・環境が自分に合っているか。", tag: "STEP 5 で対応" },
                  { icon: "sp-i-users", title: "環境・人間関係", text: "職場でうまくやれるかを、実際に確認する。", tag: "STEP 3 + 見学・実習" },
                  { icon: "sp-i-money", title: "収入", text: "生活に合った働き方と収入のバランス。", tag: "STEP 2 で対応" },
                ].map((e, i) => (
                  <div key={i} className="sp-element-card">
                    <div className="sp-element-card__icon"><svg><use href={`#${e.icon}`} /></svg></div>
                    <div className="sp-element-card__title">{e.title}</div>
                    <p className="sp-element-card__text">{e.text}</p>
                    <span className="sp-element-card__tag">{e.tag}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* 07. 他と違う5つのこと */}
        <section className="sp-section sp-diff">
          <div className="sp-container">
            <div className="sp-section-head">
              <span className="sp-section-head__eyebrow">Passo a Passo だからできること</span>
              <h2 className="sp-section-head__title">他の事業所と違う、<em>5つのこと</em>。</h2>
              <p className="sp-section-head__lead">他社との比較ではなく、「Passoが大事にしていること」として読んでください。</p>
            </div>

            <div className="sp-diff__grid">
              {[
                {
                  num: 1,
                  title: <>独自開発の<em>体調管理アプリ</em>で<br />主治医と連携できる</>,
                  text: "毎日の体調・気分・服薬などを入力すると、月1回まとめたレポートが自動で出ます。それを主治医に見せることで、通院時の話し合いが正確になります。",
                  foot: "※ 自己理解ワークブック → セルフコントロールプラン → アプリ記録 → 主治医連携まで、一気通貫で繋がっています。",
                },
                {
                  num: 2,
                  title: <><em>出席率 91%以上</em>が続いている</>,
                  text: "業界の平均は 70〜80%と言われる中で、Passo は 91%（2026年4月時点では 97.8%）。これは「毎日通い続けたい場所だ」と利用者さんが感じている結果です。",
                  foot: "※ 企業側も、採用時に通所率を見ることがあります。",
                },
                {
                  num: 3,
                  title: <>毎週2回、<em>個別面談</em>の時間がある</>,
                  text: "毎週 月曜・金曜の2回、スタッフと1対1で話す時間があります。体調・困っていること・就活の進捗を、こまめに一緒に整理していきます。",
                  foot: "※ 1対1だから、言いにくいことも話しやすい環境です。",
                },
                {
                  num: 4,
                  title: <><em>地元就職率 約80%</em><br />岡崎・幸田エリアに強い</>,
                  text: "就職者の約8割が岡崎・幸田エリア内で就職しています。長い通勤は体調に響きやすいため、「無理なく通える距離」で働けることが続く秘訣です。",
                  foot: "※ JR岡崎駅から徒歩7分。西三河全域からアクセス可能。",
                },
                {
                  num: 5,
                  title: <>「<em>相談しやすい</em>」と、<br />よく言ってもらえる</>,
                  text: "通所を決めた方から繰り返し聞くのが「相談しやすそうなスタッフが多かった」という声です。一方的に教えるのではなく、一緒に考え、寄り添う姿勢を大切にしています。",
                  foot: "※ 利用者さんへのヒアリングで「通うと決めた一番の理由」として複数回出てきた声です。",
                },
              ].map((d) => (
                <div key={d.num} className="sp-diff-card">
                  <div className="sp-diff-card__num">{d.num}</div>
                  <h3 className="sp-diff-card__title">{d.title}</h3>
                  <p className="sp-diff-card__text">{d.text}</p>
                  <p className="sp-diff-card__foot">{d.foot}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 08. 数字 */}
        <section className="sp-section sp-numbers">
          <div className="sp-container">
            <div className="sp-section-head">
              <span className="sp-section-head__eyebrow">数字で見る Passo a Passo</span>
              <h2 className="sp-section-head__title">大事なのは、就職の数より<br /><em>「続いた数」</em>です。</h2>
              <p className="sp-section-head__lead">
                失業保険期間内（半年〜1年）で就職を目指す、<strong>短期集中</strong>の設計。<br />
                だからこそ、定着率として結果に表れます。
              </p>
            </div>

            <div className="sp-numbers__grid">
              {[
                { label: "定着率", value: "100", unit: "%", desc: "就職後6ヶ月 / 令和6〜7年末", accent: false },
                { label: "定着率", value: "87", unit: "%", desc: "就職後1年 / 令和6〜7年末", accent: false },
                { label: "累計就職者数", value: "111", unit: "名", desc: "10年間 ／ 直近5年では44名", accent: true },
                { label: "通所率（直近6ヶ月平均）", value: "91", unit: "%", desc: "2026年4月時点 97.8%", accent: false },
                { label: "利用者満足度", value: "80", unit: "%", desc: "通所中の方へのアンケート結果", accent: true },
              ].map((n, i) => (
                <div key={i} className={`sp-number-card${n.accent ? " sp-number-card--accent" : ""}`}>
                  <div className="sp-number-card__label">{n.label}</div>
                  <div className="sp-number-card__value">{n.value}<small>{n.unit}</small></div>
                  <p className="sp-number-card__desc">{n.desc}</p>
                </div>
              ))}
            </div>

            <div className="sp-numbers__jobs">
              <h3>主な就職先</h3>
              <div className="sp-numbers__jobs-grid">
                <div>
                  <strong>業種</strong>
                  <ul>
                    <li>製造業</li>
                    <li>サービス業</li>
                    <li>販売業</li>
                  </ul>
                </div>
                <div>
                  <strong>職種</strong>
                  <ul>
                    <li>事務補助・PC入力作業</li>
                    <li>検査作業</li>
                    <li>軽作業</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 09. 体験談 + リスクの階段 */}
        <section className="sp-section sp-voices">
          <div className="sp-container">
            <div className="sp-section-head">
              <span className="sp-section-head__eyebrow">通った方のリアルな声</span>
              <h2 className="sp-section-head__title">「来る前」と「今」の、<br />一人ひとりの<em>小さな変化</em>を聞きました。</h2>
            </div>
            <p className="sp-voices__intro">
              通所中の3名と、卒業して働いている2名の声を紹介します。<br />
              ※ 写真は差し替え予定／本人の許可の範囲でシルエット・イラストを使用しています。
            </p>

            <div className="sp-voices__grid">
              {[
                {
                  avatar: "R.O", name: "R.O さん（仮名）", status: "現在通所中", tag: "精神障害",
                  before: "10年以上接客業に従事。難しいお客様対応で体調を崩して退職。その後は不眠で、ずっと横になって人と関わらない生活が続いていた。",
                  now: "体調に合わせて利用時間を少しずつ伸ばし、遅刻・早退なく毎日通所できるようになった。",
                  quote: "もっと早く行動すれば、よかった。",
                },
                {
                  avatar: "N.K", name: "N.K さん（仮名）", status: "現在通所中", tag: "発達障害",
                  before: "卒業後に就職したが、約1年で退職。自宅で昼夜逆転の生活が続いていた。",
                  now: "1年以上かけて、午後からの通所が毎日できるように。今は自分に合う就職先を探している。",
                  quote: "やっと時間通りに通えるようになってきた。慎重に、条件に合う職場を探したい。",
                },
                {
                  avatar: "T.K", name: "T.K さん（仮名）", status: "現在通所中", tag: "精神・軽度知的",
                  before: "就職後に体調を崩して入院。落ち着いた後、一人での就活に不安があり、手伝ってくれる場所を探していた。",
                  now: "利用開始から6ヶ月。毎日の通所が無理なくできて、体調が安定してきたので就活をスタート。先日、企業見学にも行けた。",
                  quote: "気持ちの準備をしながら、自分のペースで就活していこうと思います。",
                },
                {
                  avatar: "OG1", name: "卒業生 Aさん", status: "就職・就労中", tag: "精神障害",
                  before: "家から出られない日が数ヶ月続き受診。通所を始めた最初は、1日1時間もしんどかった。",
                  now: "初めての就職で不安があったが、Passoで自己理解とコミュニケーションを積んだことでジョブマッチングでき、仕事を続けている。",
                  quote: "自分の力で生きることができて、うれしいです。",
                },
                {
                  avatar: "OG2", name: "卒業生 Bさん", status: "就職・就労中", tag: "発達障害",
                  before: "転職活動がうまくいかない中でPassoを知る。一人でなく、誰かと一緒に仕事を探せることに安心した。",
                  now: "初めての検査業務で慣れないことはあるが、自分の特性（視覚優位）と職場環境が合っていて働きやすい。",
                  quote: "働いたお金で、旅行に行って、おいしいものを食べたい。",
                },
              ].map((v, i) => (
                <article key={i} className="sp-voice-card">
                  <div className="sp-voice-card__head">
                    <div className="sp-voice-card__avatar">{v.avatar}</div>
                    <div className="sp-voice-card__meta">
                      <strong>{v.name}</strong>
                      <small>{v.status}</small>
                      <span className="sp-voice-card__tag">{v.tag}</span>
                    </div>
                  </div>
                  <div className="sp-voice-card__row">
                    <span className="sp-voice-card__row-label">来る前</span>
                    <span className="sp-voice-card__row-text">{v.before}</span>
                  </div>
                  <div className="sp-voice-card__row">
                    <span className="sp-voice-card__row-label">今</span>
                    <span className="sp-voice-card__row-text">{v.now}</span>
                  </div>
                  <p className="sp-voice-card__quote">{v.quote}</p>
                </article>
              ))}
            </div>

            <div className="sp-staircase">
              <h3 className="sp-staircase__title">いきなり就職、ではありません。<br /><span style={{ color: "var(--sp-primary-dark)" }}>段階的に確かめていく仕組み</span>があります。</h3>
              <p className="sp-staircase__lead">「合わないと気づける早さ」が、あなたを守ります。</p>
              <div className="sp-staircase__steps">
                <div className="sp-staircase-step sp-staircase-step--1"><strong>01</strong>自己理解<br />ワークブック<span className="sp-staircase-step__risk">リスク：ゼロ</span></div>
                <div className="sp-staircase-step sp-staircase-step--2"><strong>02</strong>企業見学<span className="sp-staircase-step__risk">外から見る</span></div>
                <div className="sp-staircase-step sp-staircase-step--3"><strong>03</strong>企業実習<br />（1週間）<span className="sp-staircase-step__risk">雇用なし</span></div>
                <div className="sp-staircase-step sp-staircase-step--4"><strong>04</strong>トライアル<br />雇用<span className="sp-staircase-step__risk">補助金あり</span></div>
                <div className="sp-staircase-step sp-staircase-step--5"><strong>05</strong>正社員<br />として就職<span className="sp-staircase-step__risk">Goal</span></div>
              </div>
            </div>
          </div>
        </section>

        {/* 10. プログラム */}
        <section className="sp-section sp-programs">
          <div className="sp-container">
            <div className="sp-section-head">
              <span className="sp-section-head__eyebrow">プログラム紹介</span>
              <h2 className="sp-section-head__title">具体的には、<em>こんなこと</em>をやります。</h2>
            </div>

            <div className="sp-programs__categories">
              {[
                { icon: "sp-i-book", title: "自己理解系", items: ["個別課題（自己理解・就活）", "スタッフ面談（週2回）", "フィードバックタイム"] },
                { icon: "sp-i-briefcase", title: "ビジネス・PC系", items: ["ビジネススキルアップ／ベーシック", "パソコンスキルアップ", "就活チェック"] },
                { icon: "sp-i-chat", title: "コミュニケーション系", items: ["トークスキルアップ", "JST（職場対人トレーニング）", "バーチャルカンパニー"] },
                { icon: "sp-i-handshake", title: "実務・就職活動", items: ["職種別アセスメント（軽作業・PC）", "企業実習（打合せ・同行・評価）", "面接対策・模擬面接・同行"] },
              ].map((p, i) => (
                <div key={i} className="sp-program-cat">
                  <div className="sp-program-cat__icon"><svg><use href={`#${p.icon}`} /></svg></div>
                  <h3 className="sp-program-cat__title">{p.title}</h3>
                  <ul className="sp-program-cat__list">
                    {p.items.map((it, j) => <li key={j}>{it}</li>)}
                  </ul>
                </div>
              ))}
            </div>

            <div className="sp-programs__picks">
              <div className="sp-pick-card sp-pick-card--popular">
                <div className="sp-pick-card__label">★ 一番人気 ★</div>
                <div className="sp-pick-card__name">トークスキルアップ</div>
                <p className="sp-pick-card__desc">「話すこと」に慣れていない方が、安心して会話を練習できる。</p>
              </div>
              <div className="sp-pick-card sp-pick-card--effect">
                <div className="sp-pick-card__label">★ 一番効果があった ★</div>
                <div className="sp-pick-card__name">バーチャルカンパニー</div>
                <p className="sp-pick-card__desc">模擬企業の中で、実際の仕事の流れを体験できる。</p>
              </div>
            </div>
          </div>
        </section>

        {/* 11. 1日のスケジュール */}
        <section className="sp-section sp-schedule">
          <div className="sp-container">
            <div className="sp-section-head">
              <span className="sp-section-head__eyebrow">1日のスケジュール（例）</span>
              <h2 className="sp-section-head__title">朝から15時まで、週5日で<br /><em>集中して通う</em>設計。</h2>
              <p className="sp-section-head__lead">※ 最初は週1日・1日1時間からでも始められます。体調・状況に合わせて段階的に調整できます。</p>
            </div>

            <div className="sp-schedule__tbd-wrap">
              <span className="sp-schedule__tbd">※ 詳細スケジュールは現場確認後に最終確定します</span>
            </div>

            <div className="sp-schedule__timeline">
              {[
                { time: "09:50", title: "朝礼", sub: "今日の体調・予定を共有" },
                { time: "10:10", title: "午前プログラム", sub: "ビジネス／PC／コミュニケーション等" },
                { time: "12:00", title: "お昼休み（お弁当 100円）", sub: "希望者は1食100円で注文できます", highlight: true },
                { time: "13:00", title: "午後プログラム", sub: "バーチャルカンパニー、実務アセスメント等" },
                { time: "14:30", title: "4限目（個別課題）", sub: "その日の自分のペースで取り組む" },
                { time: "15:00", title: "終礼", sub: "今日の振り返り" },
              ].map((s, i) => (
                <div key={i} className={`sp-schedule-item${s.highlight ? " sp-schedule-item--highlight" : ""}`}>
                  <div className="sp-schedule-item__time">{s.time}</div>
                  <div className="sp-schedule-item__content"><strong>{s.title}</strong><small>{s.sub}</small></div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 12. スタッフ紹介 */}
        <section className="sp-section sp-staff">
          <div className="sp-container">
            <div className="sp-section-head">
              <span className="sp-section-head__eyebrow">スタッフ紹介</span>
              <h2 className="sp-section-head__title">毎日一緒に過ごすのは、<br /><em>この6名</em>です。</h2>
              <p className="sp-section-head__lead">「相談しやすそうなスタッフが多かった」――実際に通ってくださっている方が通所を決めた、一番の理由です。</p>
            </div>

            <div className="sp-staff__grid">
              {[
                { name: "加藤 法子", role: "サービス管理者", msg: "一緒に、あなたに合った仕事を。" },
                { name: "白井", role: "支援員", msg: "※ 写真差替え予定" },
                { name: "埋田", role: "支援員", msg: "※ 写真差替え予定" },
                { name: "戸叶", role: "支援員", msg: "※ 写真差替え予定" },
                { name: "竹内", role: "支援員", msg: "※ 写真差替え予定" },
                { name: "大門", role: "支援員", msg: "※ 写真差替え予定" },
              ].map((s, i) => (
                <div key={i} className="sp-staff-card">
                  <div className="sp-staff-card__photo"><svg><use href="#sp-i-user" /></svg></div>
                  <div className="sp-staff-card__name">{s.name}</div>
                  <div className="sp-staff-card__role">{s.role}</div>
                  <p className="sp-staff-card__msg">{s.msg}</p>
                </div>
              ))}
            </div>

            <div className="sp-staff__creds">
              <h3>スタッフの保有資格（主なもの）</h3>
              <ul className="sp-staff__creds-list">
                {["社会福祉士", "介護福祉士", "サービス管理責任者", "介護支援専門員（ケアマネジャー）", "介護職員初任者研修", "上級心理カウンセラー", "秘書検定2級", "ファイナンシャルプランナー3級", "写真技能士2級", "家庭犬しつけ訓練指導員"].map((c, i) => (
                  <li key={i}>{c}</li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        {/* 13. 利用開始の流れ */}
        <section id="flow" className="sp-section sp-flow">
          <div className="sp-container">
            <div className="sp-section-head">
              <span className="sp-section-head__eyebrow">利用開始までの流れ</span>
              <h2 className="sp-section-head__title">問い合わせてから<br />通所開始まで、<em>こんな流れ</em>です。</h2>
            </div>

            <div className="sp-flow__steps">
              {[
                { icon: "sp-i-line", step: "STEP 1", title: "問い合わせ", desc: "LINE推奨／電話でもOK", main: true },
                { icon: "sp-i-chat", step: "STEP 2", title: "インテーク面談・見学", desc: "無料。相談だけでもOK" },
                { icon: "sp-i-calendar", step: "STEP 3", title: "体験", desc: "半日〜2日間が多いです" },
                { icon: "sp-i-edit", step: "STEP 4", title: "利用手続き", desc: "自治体への申請等" },
                { icon: "sp-i-shield", step: "STEP 5", title: "契約", desc: "利用計画の確認" },
                { icon: "sp-i-flag", step: "STEP 6", title: "利用開始", desc: "週1日／1日1時間〜可" },
              ].map((f, i) => (
                <div key={i} className={`sp-flow-step${f.main ? " sp-flow-step--main" : ""}`}>
                  <div className="sp-flow-step__num">{f.step}</div>
                  <div className="sp-flow-step__icon"><svg><use href={`#${f.icon}`} /></svg></div>
                  <div className="sp-flow-step__title">{f.title}</div>
                  <div className="sp-flow-step__desc">{f.desc}</div>
                </div>
              ))}
            </div>

            <div className="sp-flow__cost">
              <h3>ご利用料金について</h3>
              <p>
                <strong>多くの方が自己負担なし</strong>でご利用いただいています。<br />
                所得に応じて、9,300円〜37,200円（月額上限）の負担があります。詳しくはお気軽にお問い合わせください。
              </p>
            </div>
          </div>
        </section>

        {/* 14. FAQ */}
        <section className="sp-section sp-faq">
          <div className="sp-container">
            <div className="sp-section-head">
              <span className="sp-section-head__eyebrow">よくあるご質問</span>
              <h2 className="sp-section-head__title">通う前に気になる<br /><em>ご質問</em>にお答えします。</h2>
            </div>

            <div className="sp-faq__list">
              {[
                { q: "就労移行支援はどんな場所で、どんな人が利用できますか？", a: "就労移行支援事業所は、障害や体調面の理由で一般就労に不安がある方が、働くための準備や訓練を行う場所です。障害者手帳をお持ちの方、または医師の診断書・意見書がある方が対象です。障害者手帳がなくても、医師の診断書や自治体の判断により利用できる場合があります。原則として18歳以上65歳未満の方が対象です。" },
                { q: "利用する前に、見学や体験はできますか？", a: "はい、もちろんできます。見学や体験を通して、実際の雰囲気やプログラムを確認できます。持ち物は不要ですが、不安なことや聞いてみたいことを事前にメモしておくと安心です。利用に関しては、ご本人の意思を大切にしていますので、無理強いすることはありません。見学や相談だけでも大丈夫です。" },
                { q: "体調が不安定でも、大丈夫ですか？", a: "はい、大丈夫です。無理のないペースを大切にし、体調面に配慮しながら支援します。通所日数や時間は、体調・状況に合わせて段階的に調整できます。カリキュラムでは就職に必要なビジネスマナー、PCスキル、コミュニケーション練習、自己理解などを行います。" },
                { q: "就職までにどのくらいの期間がかかりますか？", a: "数ヶ月〜1年程度の方が多いです。ご本人の状況によって異なりますが、就職に向けてスタッフと一緒に準備を進めていきます。事務補助、軽作業、PC入力、商品補充など、個々の特性や希望に合わせた就職先があります。就職後の定着支援も行っています。" },
                { q: "利用料金はかかりますか？", a: "多くの方は自己負担なし、または少額でご利用いただけます。収入状況により異なりますので、見学時にご相談ください。見学 → 体験 → 申請手続き → 利用開始、という流れが一般的です。" },
                { q: "就職に至らなかった場合はどうなりますか？", a: "入所後に体調の継続が難しくなった方には、通所時間の調整など「続けられる形」を一緒に考えます。ただし、ご本人から「今はまだ就職を目指す時期ではない」というお気持ちが出て、こちらも無理があると判断した場合は、貴重な2年間の利用期間を守るために、一度退所して体調を整えてから再度ご利用いただくこともあります。「就職させること」よりも「続けられる状態で就職すること」を大切にしています。" },
              ].map((f, i) => (
                <details key={i} className="sp-faq-item">
                  <summary className="sp-faq-item__summary">{f.q}</summary>
                  <div className="sp-faq-item__answer">{f.a}</div>
                </details>
              ))}
            </div>
          </div>
        </section>

        {/* 15. Access */}
        <section className="sp-section sp-access">
          <div className="sp-container">
            <div className="sp-section-head">
              <span className="sp-section-head__eyebrow">アクセス</span>
              <h2 className="sp-section-head__title">JR岡崎駅から、<em>徒歩7分</em>。</h2>
            </div>

            <div className="sp-access__wrap">
              <div className="sp-access__info">
                <h3 className="sp-access__name">就職ゼミナール Passo a Passo</h3>
                <dl className="sp-access__table">
                  <dt>住所</dt>
                  <dd>〒444-0840<br />愛知県岡崎市柱4-2-9 アクティブ72 1-A</dd>

                  <dt>最寄</dt>
                  <dd>JR岡崎駅 徒歩7分<br />愛知環状鉄道 岡崎駅 徒歩7分<br />名鉄バス「柱郷」バス停 徒歩2分</dd>

                  <dt>電話</dt>
                  <dd><a href="tel:0564-83-5551" style={{ color: "var(--sp-primary-dark)", fontWeight: 700 }}>0564-83-5551</a></dd>

                  <dt>開所時間</dt>
                  <dd>平日 9:50〜15:00</dd>

                  <dt>定休日</dt>
                  <dd>土・日・祝 ／ 当社カレンダーに準ずる<br />（年に数回 土曜通所あり）</dd>

                  <dt>駐車場</dt>
                  <dd>あり（11台）</dd>
                </dl>

                <div className="sp-access__sns">
                  <a href="https://www.instagram.com/passo.okaekimae/" target="_blank" rel="noopener noreferrer">
                    <svg width="18" height="18"><use href="#sp-i-instagram" /></svg>
                    Instagram @passo.okaekimae
                  </a>
                  <a href="#contact">
                    <svg width="18" height="18"><use href="#sp-i-line" /></svg>
                    LINE @951rpgod
                  </a>
                  <a href="https://passo-10ft.com" target="_blank" rel="noopener noreferrer">
                    <svg width="18" height="18"><use href="#sp-i-home" /></svg>
                    公式サイト
                  </a>
                </div>
              </div>

              <div className="sp-access__map">
                <div className="sp-access__map-inner">
                  <svg><use href="#sp-i-map-pin" /></svg>
                  <strong>Google Map</strong>
                  <p>公開時にGoogle Maps埋め込みに差し替え</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 16. 最終CTA */}
        <section id="contact" className="sp-final-cta">
          <div className="sp-final-cta__inner">
            <h2 className="sp-final-cta__title">まずは、話を聞いてみませんか？</h2>
            <p className="sp-final-cta__lead">
              無理に利用を決める必要はありません。<br />
              見学だけ、相談だけでも大丈夫です。<br />
              3つの方法から、あなたの気持ちに合うものを選んでください。
            </p>

            <div className="sp-final-cta__options">
              <a href="https://www.instagram.com/passo.okaekimae/" target="_blank" rel="noopener noreferrer" className="sp-cta-option">
                <svg className="sp-cta-option__icon"><use href="#sp-i-instagram" /></svg>
                <span className="sp-cta-option__label">一番気軽に</span>
                <span className="sp-cta-option__text">Instagram で<br />雰囲気を見る</span>
              </a>
              <a href="#" className="sp-cta-option sp-cta-option--main">
                <svg className="sp-cta-option__icon"><use href="#sp-i-line" /></svg>
                <span className="sp-cta-option__label">おすすめ</span>
                <span className="sp-cta-option__text">LINE で<br />無料相談する</span>
              </a>
              <a href="tel:0564-83-5551" className="sp-cta-option">
                <svg className="sp-cta-option__icon"><use href="#sp-i-phone" /></svg>
                <span className="sp-cta-option__label">直接話したい方</span>
                <span className="sp-cta-option__text">お電話で<br />相談する</span>
              </a>
            </div>
            <p className="sp-final-cta__note">電話受付：平日 9:50〜15:00 ／ 0564-83-5551</p>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="sp-footer">
        <div className="sp-footer__logo">
          <img src="/start/logo.png" alt="" />
          <span className="sp-footer__logo-text">就職ゼミナール Passo a Passo</span>
        </div>
        <div className="sp-footer__info">
          〒444-0840 愛知県岡崎市柱4-2-9 アクティブ72 1-A<br />
          TEL: 0564-83-5551 ／ 平日 9:50〜15:00
        </div>
        <div className="sp-footer__links">
          <a href="#top">トップへ戻る</a>
          <a href="https://passo-10ft.com" target="_blank" rel="noopener noreferrer">公式サイト</a>
          <a href="#">プライバシーポリシー</a>
          <a href="#">特定商取引法表記</a>
        </div>
        <p className="sp-footer__copy">© Passo a Passo. All Rights Reserved.</p>
      </footer>

      {/* Mobile Fixed CTA */}
      <div className="sp-mobile-cta">
        <a href="#contact" className="sp-btn sp-btn--line">
          <svg width="20" height="20"><use href="#sp-i-line" /></svg>
          LINEで無料相談する
        </a>
      </div>
    </div>
  );
}
