import { SozoIntakeForm } from "./SozoIntakeForm";

export const dynamic = "force-dynamic";

export default function IntakeSozoPage() {
  return (
    <main className="intake-main">
      <header className="intake-topbar">
        <div className="intake-brand">
          <img
            src="/images/logo-passo.png"
            alt="Passo a Passo"
            className="intake-brand-logo"
          />
        </div>
        <div className="intake-studio-pill">創造空間 Passo a Passo</div>
      </header>

      <section className="intake-intro">
        <div className="intake-eyebrow">STEP 1 / 5・基本情報</div>
        <h1 className="intake-title">見学／体験利用 事前アンケート</h1>
        <p className="intake-lead">
          ご本人からの聞き取り内容を、ここに書き込んでいただきます。
          書ける範囲で大丈夫です。後からスタッフが補足できます。
        </p>
      </section>

      <SozoIntakeForm />
    </main>
  );
}
