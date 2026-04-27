import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { StaffTopbar } from "../../components/Topbar";
import { supabaseAdmin } from "@/lib/supabase";
import { studioLabel } from "@/lib/intake-schema";
import { DeleteAgreementFromView } from "./DeleteAgreementFromView";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const { data } = await supabaseAdmin
    .from("trial_agreements")
    .select("signed_name")
    .eq("id", id)
    .maybeSingle();
  const name = (data?.signed_name as string | undefined)?.trim();
  return {
    title: name ? `${name} - 体験利用誓約書` : "体験利用誓約書",
  };
}

type AgreementRow = {
  id: string;
  created_at: string;
  agreement_accepted_at: string;
  intake_id: string | null;
  studio_location: string | null;
  signed_name: string;
  agreement_accepted: boolean;
  typing_avg_cpm: number | null;
  typing_total_keystrokes: number | null;
  typing_backspace_count: number | null;
  typing_paste_count: number | null;
};

type IntakeLite = {
  id: string;
  name: string;
  furigana: string;
  studio_location: string | null;
};

function formatDateTime(iso: string) {
  const d = new Date(iso);
  return d.toLocaleString("ja-JP", {
    year: "numeric",
    month: "long",
    day: "numeric",
    weekday: "short",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default async function AgreementViewPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ from?: string; intake_id?: string }>;
}) {
  const { id } = await params;
  const { from, intake_id } = await searchParams;

  const { data: agreement, error } = await supabaseAdmin
    .from("trial_agreements")
    .select(
      "id, created_at, agreement_accepted_at, intake_id, studio_location, signed_name, agreement_accepted, typing_avg_cpm, typing_total_keystrokes, typing_backspace_count, typing_paste_count"
    )
    .eq("id", id)
    .maybeSingle();

  if (error) {
    return (
      <div className="staff-root">
        <StaffTopbar section="誓約書" />
        <main className="staff-main">
          <div className="staff-list-empty">読み込みエラー: {error.message}</div>
        </main>
      </div>
    );
  }
  if (!agreement) notFound();

  const ag = agreement as AgreementRow;

  let intake: IntakeLite | null = null;
  if (ag.intake_id) {
    const { data: intakeData } = await supabaseAdmin
      .from("intake_forms")
      .select("id, name, furigana, studio_location")
      .eq("id", ag.intake_id)
      .maybeSingle();
    if (intakeData) intake = intakeData as IntakeLite;
  }

  // 戻り先の決定（誓約書一覧は廃止されたのでダッシュボードに戻す）
  const backTo =
    from === "intake" && (intake_id || ag.intake_id)
      ? {
          href: `/staff/intake/${intake_id ?? ag.intake_id}`,
          label: "← 面談票の詳細に戻る",
        }
      : { href: "/staff", label: "← ダッシュボードに戻る" };

  return (
    <div className="staff-root">
      <StaffTopbar section="誓約書 詳細" />
      <main className="staff-main">
        <Link href={backTo.href} className="staff-back-link">
          {backTo.label}
        </Link>

        <div className="staff-page-head">
          <div className="staff-page-label">
            <span className="dot" />
            <span>Agreement Detail</span>
          </div>
          <h1 className="staff-page-title">体験利用 誓約書</h1>
          <p className="staff-page-sub">
            {ag.studio_location && (
              <span className="staff-list-studio" style={{ marginRight: 10 }}>
                {studioLabel(ag.studio_location)}
              </span>
            )}
            署名日時: {formatDateTime(ag.agreement_accepted_at)}
          </p>
        </div>

        <div className="staff-agreement-view">
          {/* メタ情報 */}
          <div className="staff-card">
            <div className="staff-card-label">Signed by</div>
            <div className="agreement-view-meta">
              <div className="agreement-view-meta-row">
                <span className="agreement-view-meta-label">お名前</span>
                <span className="agreement-view-meta-value">
                  {intake?.name ?? ag.signed_name}
                  {intake?.furigana && (
                    <span className="agreement-view-furigana">
                      {intake.furigana}
                    </span>
                  )}
                </span>
              </div>
              <div className="agreement-view-meta-row">
                <span className="agreement-view-meta-label">署名</span>
                <span className="agreement-view-signature">{ag.signed_name}</span>
              </div>
              {ag.studio_location && (
                <div className="agreement-view-meta-row">
                  <span className="agreement-view-meta-label">事業所</span>
                  <span className="agreement-view-meta-value">
                    {studioLabel(ag.studio_location)}
                  </span>
                </div>
              )}
              <div className="agreement-view-meta-row">
                <span className="agreement-view-meta-label">署名日時</span>
                <span className="agreement-view-meta-value">
                  {formatDateTime(ag.agreement_accepted_at)}
                </span>
              </div>
            </div>

            {intake && (
              <div className="agreement-view-intake-link">
                <Link href={`/staff/intake/${intake.id}`}>
                  この方の面談票を見る →
                </Link>
              </div>
            )}
          </div>

          {/* 誓約書本文（read-only） */}
          <div className="staff-card">
            <div className="staff-card-label">Agreement Content</div>
            <p className="agreement-view-preamble">
              本誓約書は、株式会社Passo a Passo が運営する就労継続支援B型事業所（以下「事業所」という）における体験利用の参加にあたり、参加者（以下「私」という）が守るべき事項を示すものです。私は以下を理解し、同意のうえ署名します。
            </p>

            <AgreementSectionView
              number="1"
              title="体験の目的と利用基準"
              items={[
                "体験利用は、事業所と私の相性や適性を確認するために行います。",
                "事業所は企業案件を中心に行っており、一定のスキルや経験、またはチームで協力する力が必要です。これらの条件に合うかどうかは、事業所の判断基準に基づき体験後に総合的に決定します。",
                "利用契約は体験後、事業所と私の双方が合意した場合のみ成立し、体験利用の実施は契約や利用開始を保証するものではありません。",
              ]}
            />

            <AgreementSectionView
              number="2"
              title="安全と設備の取扱い"
              items={[
                "体験利用中はスタッフの指示に従い、体調不良や怪我があればすぐにスタッフに報告します。",
                "発熱や感染症など健康状態に問題がある場合、参加を延期または中止することがあります。",
                "機器や備品は大切に扱い、故意や重大な過失による損壊時は修理・交換費用を負担します。",
              ]}
            />

            <AgreementSectionView
              number="3"
              title="禁止行為と守秘義務"
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

            <AgreementSectionView
              number="4"
              title="出欠連絡"
              items={[
                "遅刻や欠席時は、体験開始までに必ず事前連絡を行います。",
                "無断欠席や遅刻が続く場合、体験利用を終了します。",
              ]}
            />

            <p className="agreement-view-closing">
              本誓約書の内容を理解し、遵守することを誓約します。
            </p>
          </div>

          {/* 署名時のタイピング情報（参考） */}
          <div className="staff-card">
            <div className="staff-card-label">Signing Typing Metrics</div>
            <div className="typing-metrics-grid">
              <div className="typing-metric">
                <div className="typing-metric-label">CPM</div>
                <div className="typing-metric-value">
                  {ag.typing_avg_cpm ?? 0}
                  <span className="typing-metric-unit">文字/分</span>
                </div>
              </div>
              <div className="typing-metric">
                <div className="typing-metric-label">Keystrokes</div>
                <div className="typing-metric-value">
                  {ag.typing_total_keystrokes ?? 0}
                </div>
              </div>
              <div className="typing-metric">
                <div className="typing-metric-label">Backspaces</div>
                <div className="typing-metric-value">
                  {ag.typing_backspace_count ?? 0}
                </div>
              </div>
              <div className="typing-metric">
                <div className="typing-metric-label">Pastes</div>
                <div className="typing-metric-value">
                  {ag.typing_paste_count ?? 0}
                </div>
              </div>
            </div>
            <p
              style={{
                fontSize: 11,
                color: "var(--text-light)",
                lineHeight: 1.7,
                marginTop: 10,
              }}
            >
              ※ 署名フィールドへの入力時のみの計測値。面談票入力時の総合評価とは別。
            </p>
          </div>
        </div>

        {/* 危険な操作 */}
        <section className="staff-danger-zone">
          <div className="staff-danger-head">Danger Zone · 危険な操作</div>
          <div className="staff-danger-body">
            <div className="staff-danger-text">
              <strong>この誓約書を削除</strong>
              <span>
                署名「{ag.signed_name}」の誓約書レコードを完全に削除します。元に戻せません。
              </span>
            </div>
            <DeleteAgreementFromView
              id={ag.id}
              intakeId={ag.intake_id}
              signedName={ag.signed_name}
              from={from ?? "list"}
            />
          </div>
        </section>
      </main>
    </div>
  );
}

function AgreementSectionView({
  number,
  title,
  items,
  preamble,
  ordered,
}: {
  number: string;
  title: string;
  items: string[];
  preamble?: string;
  ordered?: boolean;
}) {
  const ListTag = ordered ? "ol" : "ul";
  return (
    <section className="agreement-view-section">
      <div className="agreement-view-section-head">
        <span className="agreement-view-section-num">{number}</span>
        <h2 className="agreement-view-section-title">{title}</h2>
      </div>
      {preamble && (
        <p className="agreement-view-section-preamble">{preamble}</p>
      )}
      <ListTag
        className={`agreement-view-section-list ${
          ordered ? "agreement-view-section-list--ol" : ""
        }`}
      >
        {items.map((item, i) => (
          <li key={i}>{item}</li>
        ))}
      </ListTag>
    </section>
  );
}
