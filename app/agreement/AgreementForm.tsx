"use client";

import Link from "next/link";
import { useMemo, useState, useTransition } from "react";
import { useTypingTracker } from "@/lib/typing-tracker";
import { studioLabel } from "@/lib/intake-schema";
import { verifyPin } from "@/app/staff/login/actions";
import { submitAgreement } from "./actions";

type IntakeLite = {
  id: string;
  name: string;
  furigana: string;
  studio_location: string | null;
};

type Props = {
  intake: IntakeLite | null;
  loadError: string | null;
  queryIntakeId: string | null;
};

const SECTION_CHECK_COUNT = 4;

export function AgreementForm({ intake, loadError, queryIntakeId }: Props) {
  const [sections, setSections] = useState<boolean[]>(
    Array(SECTION_CHECK_COUNT).fill(false)
  );
  const [signature, setSignature] = useState("");
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [pending, startTransition] = useTransition();

  const { trackField, finalize } = useTypingTracker();
  const signatureTracker = useMemo(() => trackField("signed_name"), [trackField]);

  const expectedName = intake?.name ?? "";
  const allSectionsChecked = sections.every(Boolean);
  const signatureTrimmed = signature.trim();

  // 空白・改行を除いて比較。未指定（intake なし）は常に通す。
  const normalize = (s: string) => s.replace(/[\s\u3000]/g, "");
  const nameMatches = expectedName
    ? normalize(signatureTrimmed) === normalize(expectedName)
    : signatureTrimmed.length > 0;

  const canSubmit =
    !pending && !submitted && allSectionsChecked && nameMatches && intake !== null;

  const toggleSection = (idx: number) => {
    setSections((prev) => {
      const next = [...prev];
      next[idx] = !next[idx];
      return next;
    });
  };

  const handleSubmit = () => {
    if (!canSubmit || !intake) return;
    setSubmitError(null);

    const metrics = finalize();

    startTransition(async () => {
      const result = await submitAgreement({
        intake_id: intake.id,
        studio_location: intake.studio_location,
        signed_name: signature,
        expected_name: intake.name,
        typing_metrics: metrics,
      });

      if (result.success) {
        setSubmitted(true);
      } else {
        setSubmitError(result.error);
      }
    });
  };

  // ----- 面談票が指定されていない / 見つからない場合 -----
  if (!queryIntakeId) {
    return (
      <>
        <AgreementTopbar />
        <main className="agreement-stage">
          <div className="agreement-notice">
            <div className="agreement-notice-mark">!</div>
            <h1>面談票が指定されていません</h1>
            <p>
              体験利用の誓約書は、見学時に登録された面談票と紐付けて作成します。
              <br />
              スタッフ画面のダッシュボードから該当の方を選んで開いてください。
            </p>
            <Link href="/staff" className="agreement-notice-link">
              ダッシュボードへ
            </Link>
          </div>
        </main>
      </>
    );
  }

  if (loadError || !intake) {
    return (
      <>
        <AgreementTopbar />
        <main className="agreement-stage">
          <div className="agreement-notice">
            <div className="agreement-notice-mark">!</div>
            <h1>面談票を読み込めませんでした</h1>
            <p>{loadError ?? "該当する面談票が見つかりません。"}</p>
            <Link href="/staff" className="agreement-notice-link">
              ダッシュボードへ戻る
            </Link>
          </div>
        </main>
      </>
    );
  }

  // ----- 完了画面（下部の PIN フォームで遷移するので、トップバーに戻るリンクは置かない） -----
  if (submitted) {
    return (
      <>
        <AgreementTopbar />
        <main className="agreement-stage">
          <div className="agreement-done">
            <div className="agreement-done-mark">
              <svg viewBox="0 0 24 24" fill="none" strokeWidth="2.5" stroke="currentColor">
                <path
                  d="M4 12l5 5L20 6"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
            <h1>誓約書を受領しました</h1>
            <p>
              ありがとうございました。
              <br />
              <strong>このパソコンをスタッフにお返しください。</strong>
            </p>

            <div className="agreement-staff-gate">
              <div className="agreement-staff-gate-label">スタッフの方へ</div>
              <form action={verifyPin} className="agreement-staff-gate-form">
                <input
                  type="hidden"
                  name="next"
                  value={`/staff/intake/${intake.id}`}
                />
                <input
                  type="password"
                  name="pin"
                  inputMode="numeric"
                  autoComplete="off"
                  required
                  placeholder="PINコード"
                  className="agreement-staff-gate-input"
                  aria-label="スタッフPIN"
                />
                <button type="submit" className="agreement-staff-gate-btn">
                  確認
                </button>
              </form>
              <p className="agreement-staff-gate-hint">
                PIN を入力すると、面談票の詳細ページに戻ります。
              </p>
            </div>
          </div>
        </main>
      </>
    );
  }

  // ----- メインフォーム（利用者が署名する画面・スタッフ用リンクは見せない）-----
  return (
    <>
      <AgreementTopbar />
      <main className="agreement-stage">
        <header className="agreement-head">
          <div className="agreement-label">
            <span className="dot" />
            <span>Trial Agreement</span>
          </div>
          <h1 className="agreement-title">体験利用 誓約書</h1>
          <p className="agreement-sub">
            以下の内容をお読みいただき、同意のうえ、最後にお名前をご署名ください。
          </p>

          <div className="agreement-meta">
            <div className="agreement-meta-row">
              <span className="agreement-meta-label">お名前</span>
              <span className="agreement-meta-value">
                {intake.name}
                <span className="agreement-meta-furigana">{intake.furigana}</span>
              </span>
            </div>
            {intake.studio_location && (
              <div className="agreement-meta-row">
                <span className="agreement-meta-label">事業所</span>
                <span className="agreement-meta-value">
                  {studioLabel(intake.studio_location)}
                </span>
              </div>
            )}
            <div className="agreement-meta-row">
              <span className="agreement-meta-label">日付</span>
              <span className="agreement-meta-value">
                {new Date().toLocaleDateString("ja-JP", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </span>
            </div>
          </div>
        </header>

        <div className="agreement-body">
          <p className="agreement-preamble">
            本誓約書は、株式会社Passo a Passo が運営する就労継続支援B型事業所（以下「事業所」という）における体験利用の参加にあたり、参加者（以下「私」という）が守るべき事項を示すものです。私は以下を理解し、同意のうえ署名します。
          </p>

          <AgreementSection
            index={0}
            number="1"
            title="体験の目的と利用基準"
            checked={sections[0]}
            onToggle={() => toggleSection(0)}
            items={[
              "体験利用は、事業所と私の相性や適性を確認するために行います。",
              "事業所は企業案件を中心に行っており、一定のスキルや経験、またはチームで協力する力が必要です。これらの条件に合うかどうかは、事業所の判断基準に基づき体験後に総合的に決定します。",
              "利用契約は体験後、事業所と私の双方が合意した場合のみ成立し、体験利用の実施は契約や利用開始を保証するものではありません。",
            ]}
          />

          <AgreementSection
            index={1}
            number="2"
            title="安全と設備の取扱い"
            checked={sections[1]}
            onToggle={() => toggleSection(1)}
            items={[
              "体験利用中はスタッフの指示に従い、体調不良や怪我があればすぐにスタッフに報告します。",
              "発熱や感染症など健康状態に問題がある場合、参加を延期または中止することがあります。",
              "機器や備品は大切に扱い、故意や重大な過失による損壊時は修理・交換費用を負担します。",
            ]}
          />

          <AgreementSection
            index={2}
            number="3"
            title="禁止行為と守秘義務"
            checked={sections[2]}
            onToggle={() => toggleSection(2)}
            preamble="以下の行為は禁止し、違反時は体験利用を即時終了します。"
            items={[
              "スタッフや他の利用者等への暴言・威嚇・侮辱などのハラスメント行為",
              "機器・設備の不適切な使用や業務妨害",
              "許可のない写真撮影・録音・録画・SNS投稿",
              "他の利用者や事業所の情報を外部へ漏らす行為（体験後も禁止）",
              "危険物や不要物の持ち込み、事業所の物品の無断持ち出し",
              "その他、事業所が禁止とする事項",
            ]}
            ordered
          />

          <AgreementSection
            index={3}
            number="4"
            title="出欠連絡"
            checked={sections[3]}
            onToggle={() => toggleSection(3)}
            items={[
              "遅刻や欠席時は、体験開始までに必ず事前連絡を行います。",
              "無断欠席や遅刻が続く場合、体験利用を終了します。",
            ]}
          />

          <p className="agreement-closing">
            本誓約書の内容を理解し、遵守することを誓約します。
          </p>

          <section className="agreement-signature-block">
            <label htmlFor="signature" className="agreement-signature-label">
              署名
              <span className="required">REQUIRED</span>
            </label>
            <p className="agreement-signature-hint">
              面談票にご登録いただいたお名前（<strong>{intake.name}</strong>）を
              ご入力ください。
            </p>
            <input
              id="signature"
              type="text"
              className={`agreement-signature-input ${
                signatureTrimmed.length > 0 && !nameMatches ? "is-mismatch" : ""
              }`}
              value={signature}
              onChange={(e) => setSignature(e.target.value)}
              onKeyDown={signatureTracker.onKeyDown}
              onInput={signatureTracker.onInput}
              onPaste={signatureTracker.onPaste}
              placeholder="お名前をご入力ください"
              autoComplete="off"
              autoCapitalize="off"
              spellCheck={false}
              disabled={pending}
            />
            {signatureTrimmed.length > 0 && !nameMatches && (
              <div className="agreement-signature-error">
                面談票のお名前と一致していません。漢字を確認してください。
              </div>
            )}
          </section>
        </div>

        <div className="agreement-nav">
          <div className="agreement-nav-inner">
            <div className="agreement-nav-status">
              <span className="agreement-nav-checks">
                {sections.filter(Boolean).length} / {SECTION_CHECK_COUNT} セクション確認
              </span>
              {!allSectionsChecked && (
                <span className="agreement-nav-hint">
                  すべてのセクションを確認してください
                </span>
              )}
            </div>
            <button
              type="button"
              className="nav-btn nav-btn--primary"
              disabled={!canSubmit}
              onClick={handleSubmit}
            >
              {pending ? "送信中…" : "同意して送信"}
            </button>
          </div>
          {submitError && <div className="nav-error">{submitError}</div>}
        </div>
      </main>
    </>
  );
}

function AgreementTopbar({ backHref }: { backHref?: string }) {
  return (
    <header className="agreement-topbar">
      <div className="agreement-brand">
        <img
          src="/images/logo-passo.png"
          alt="Passo a Passo"
          className="agreement-brand-logo"
        />
      </div>
      {backHref && (
        <Link href={backHref} className="agreement-back-link">
          ← 面談票の詳細に戻る
        </Link>
      )}
    </header>
  );
}

type SectionProps = {
  index: number;
  number: string;
  title: string;
  items: string[];
  preamble?: string;
  ordered?: boolean;
  checked: boolean;
  onToggle: () => void;
};

function AgreementSection({
  index,
  number,
  title,
  items,
  preamble,
  ordered,
  checked,
  onToggle,
}: SectionProps) {
  const ListTag = ordered ? "ol" : "ul";
  const sectionId = `section-${index}`;
  const checkboxId = `confirm-${index}`;

  return (
    <section
      className={`agreement-section ${checked ? "is-confirmed" : ""}`}
      id={sectionId}
    >
      <div className="agreement-section-head">
        <span className="agreement-section-num">{number}</span>
        <h2 className="agreement-section-title">{title}</h2>
      </div>
      {preamble && <p className="agreement-section-preamble">{preamble}</p>}
      <ListTag
        className={`agreement-section-list ${
          ordered ? "agreement-section-list--ol" : ""
        }`}
      >
        {items.map((item, i) => (
          <li key={i}>{item}</li>
        ))}
      </ListTag>

      <label htmlFor={checkboxId} className="agreement-confirm">
        <input
          id={checkboxId}
          type="checkbox"
          checked={checked}
          onChange={onToggle}
        />
        <span className="agreement-confirm-box" aria-hidden />
        <span className="agreement-confirm-text">
          上記の内容を確認しました
        </span>
      </label>
    </section>
  );
}
