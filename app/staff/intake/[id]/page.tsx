import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { StaffTopbar } from "../../components/Topbar";
import { StaffNotesEditor } from "./StaffNotesEditor";
import { BasicInfoEditor } from "./BasicInfoEditor";
import { DeleteIntakeButton, DeleteAgreementButton } from "./DeleteButtons";
import { supabaseAdmin } from "@/lib/supabase";
import {
  SOURCE_OPTIONS,
  EXPERIENCE_OPTIONS,
  TRANSPORT_OPTIONS,
  INTERESTED_WORK_OPTIONS,
  PC_USAGE_OPTIONS,
  PC_TYPE_OPTIONS,
  studioLabel,
  type TypingFieldMetrics,
} from "@/lib/intake-schema";
import {
  cpmToRank,
  evaluateBackspaceRatio,
  detectIdentityPaste,
  RANK_REFERENCE,
} from "@/lib/typing-rank";

export const dynamic = "force-dynamic";

// 動的タイトル: 名前があればその人の名前、なければ「面談票」
export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const { data } = await supabaseAdmin
    .from("intake_forms")
    .select("name")
    .eq("id", id)
    .maybeSingle();
  const name = (data?.name as string | undefined)?.trim();
  return {
    title: name ? `${name} - 面談票` : "面談票",
  };
}

// 電話番号の所有者コード → 表示ラベル
const PHONE_OWNER_LABEL: Record<string, string> = {
  self: "本人",
  mother: "母",
  father: "父",
  sibling: "兄弟・姉妹",
  spouse: "配偶者",
  guardian: "保護者・後見人",
  other: "その他",
};

const FIELD_LABEL_MAP: Record<string, string> = {
  last_name_kana: "ふりがな(姓)",
  first_name_kana: "ふりがな(名)",
  last_name: "お名前(姓)",
  first_name: "お名前(名)",
  // 旧データ互換（過去レコードで furigana / name フィールドにまとめて記録されていたもの）
  furigana: "ふりがな",
  name: "お名前",
  phone: "電話",
  postal_code: "郵便番号",
  address: "住所",
  source_sns_name: "SNS名",
  source_facility_name: "相談支援事業所",
  source_hospital_name: "病院名",
  source_other: "きっかけ(その他)",
  experience_other: "経験(その他)",
  interested_work_other: "興味(その他)",
  illness_name: "病名",
  notebook_grade: "手帳等級",
  hospital_name: "通院先",
  doctor_name: "主治医",
  support_office_name: "相談支援事業所名",
  support_office_contact: "担当者",
  symptom_detail: "症状詳細",
};

function labelFor<T extends { value: string; label: string }>(options: readonly T[], value: string | null) {
  if (!value) return "";
  return options.find((o) => o.value === value)?.label ?? value;
}
function labelsFor<T extends { value: string; label: string }>(options: readonly T[], values: string[] | null | undefined) {
  if (!values || values.length === 0) return "";
  return values.map((v) => labelFor(options, v)).join("、");
}

function formatDate(iso: string) {
  const d = new Date(iso);
  return d.toLocaleString("ja-JP", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function formatDuration(ms: number | null | undefined): string {
  if (!ms || ms <= 0) return "—";
  const s = Math.round(ms / 1000);
  if (s < 60) return `${s}秒`;
  const m = Math.floor(s / 60);
  const rs = s % 60;
  return `${m}分${rs}秒`;
}

function DetailRow({ label, value }: { label: string; value: React.ReactNode }) {
  const empty =
    value === undefined || value === null || value === "" || (Array.isArray(value) && value.length === 0);
  return (
    <div className="staff-detail-row">
      <div className="staff-detail-row-label">{label}</div>
      <div className="staff-detail-row-value">
        {empty ? <span className="staff-detail-row-empty">未入力</span> : value}
      </div>
    </div>
  );
}

type AgreementLite = {
  id: string;
  created_at: string;
  signed_name: string;
};

export default async function IntakeDetailPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ from?: string }>;
}) {
  const { id } = await params;
  const { from } = await searchParams;
  // 一覧ページは廃止されたのでダッシュボード（/staff）に戻す
  const backTo = { href: "/staff", label: "← ダッシュボードに戻る" };
  // from パラメータは互換性のため受け取るが、遷移先は常に /staff
  void from;

  const [intakeResult, agreementsResult] = await Promise.all([
    supabaseAdmin.from("intake_forms").select("*").eq("id", id).maybeSingle(),
    supabaseAdmin
      .from("trial_agreements")
      .select("id, created_at, signed_name")
      .eq("intake_id", id)
      .order("created_at", { ascending: false }),
  ]);

  const { data, error } = intakeResult;
  const agreements = (agreementsResult.data ?? []) as AgreementLite[];

  if (error) {
    return (
      <div className="staff-root">
        <StaffTopbar section="詳細" />
        <main className="staff-main">
          <div className="staff-list-empty">読み込みエラー: {error.message}</div>
        </main>
      </div>
    );
  }
  if (!data) notFound();

  const perField: Record<string, TypingFieldMetrics> = data.typing_per_field ?? {};
  const fieldEntries = Object.entries(perField).sort(
    ([, a], [, b]) => (b?.keystrokes ?? 0) - (a?.keystrokes ?? 0)
  );

  const rankInfo = cpmToRank(data.typing_avg_cpm);
  const bsInfo = evaluateBackspaceRatio(
    data.typing_total_keystrokes,
    data.typing_backspace_count
  );
  const identityPastes = detectIdentityPaste(perField);
  const usualPcUsageLabel =
    PC_USAGE_OPTIONS.find((o) => o.value === data.usual_pc_usage)?.label ?? null;
  const usualPcTypeLabel =
    PC_TYPE_OPTIONS.find((o) => o.value === data.usual_pc_type)?.label ?? null;

  return (
    <div className="staff-root">
      <StaffTopbar section="詳細" />
      <main className="staff-main">
        <Link href={backTo.href} className="staff-back-link">{backTo.label}</Link>

        <div className="staff-page-head">
          <div className="staff-page-label">
            <span className="dot" />
            <span>Intake Detail</span>
          </div>
          <h1 className="staff-page-title">
            {data.name} <span style={{ fontSize: 14, color: "var(--text-light)", fontWeight: 500, marginLeft: 10 }}>{data.furigana}</span>
          </h1>
          <p className="staff-page-sub">
            {data.studio_location && (
              <span className="staff-list-studio" style={{ marginRight: 10 }}>
                {studioLabel(data.studio_location)}
              </span>
            )}
            提出: {formatDate(data.submitted_at)}
          </p>

          <div className="staff-detail-actions">
            <Link
              href={`/agreement?intake_id=${data.id}`}
              target="_blank"
              rel="noopener noreferrer"
              className="staff-action-btn staff-action-btn--primary"
              title="誓約書フォーム（新しいタブで開きます。利用者にお渡し）"
            >
              誓約書に署名してもらう
            </Link>
            {agreements.length > 0 && (
              <span className="staff-action-note">
                発行済み {agreements.length} 件（最新: {formatDate(agreements[0].created_at)}）— 下の一覧から表示できます
              </span>
            )}
          </div>
        </div>

        {/* C ランク時の大きい警告（スタッフ判断用） */}
        {rankInfo.rank === "C" && (
          <div className="staff-alert staff-alert--warning">
            <div className="staff-alert-head">
              <span className="staff-alert-icon">⚠</span>
              <span className="staff-alert-title">タイピング練習を推奨</span>
            </div>
            <div className="staff-alert-body">
              {rankInfo.message}
              <br />
              <span className="staff-alert-hint">
                （本人には表示されていません。最終判断はスタッフにお任せします）
              </span>
            </div>
          </div>
        )}

        {/* お名前・ふりがなに貼り付け検出があった場合の警告 */}
        {identityPastes.length > 0 && (
          <div className="staff-alert staff-alert--info">
            <div className="staff-alert-head">
              <span className="staff-alert-icon">!</span>
              <span className="staff-alert-title">本人入力か要確認</span>
            </div>
            <div className="staff-alert-body">
              {identityPastes.join("・")}
              に貼り付け操作の形跡があります。ご本人ではなく代理入力の可能性があります。
            </div>
          </div>
        )}

        <div className="staff-detail-grid">
          {/* --- Left: intake details --- */}
          <div>
            <div className="staff-card">
              <div className="staff-card-label">Basic</div>
              <DetailRow label="事業所" value={studioLabel(data.studio_location)} />
              <DetailRow label="ふりがな" value={data.furigana} />
              <DetailRow label="お名前" value={data.name} />
              <DetailRow
                label="電話"
                value={
                  data.phone
                    ? `${data.phone}${data.phone_owner && data.phone_owner !== "self" ? `（${PHONE_OWNER_LABEL[data.phone_owner] ?? data.phone_owner}）` : ""}`
                    : null
                }
              />
              <DetailRow label="生年月日" value={data.birth_date} />
              <DetailRow label="性別" value={data.gender} />
              <DetailRow label="郵便番号" value={data.postal_code} />
              <DetailRow label="住所" value={data.address} />
              <DetailRow label="来所した日" value={data.visited_at} />
              <BasicInfoEditor
                id={data.id}
                initial={{
                  name: data.name ?? "",
                  furigana: data.furigana ?? "",
                  phone: data.phone ?? null,
                  phone_owner: data.phone_owner ?? null,
                  birth_date: data.birth_date ?? null,
                  gender: data.gender ?? null,
                  postal_code: data.postal_code ?? null,
                  address: data.address ?? null,
                  notebook_status: data.notebook_status ?? null,
                  notebook_grade: data.notebook_grade ?? null,
                  visited_at: data.visited_at ?? null,
                }}
              />
            </div>

            <div className="staff-card">
              <div className="staff-card-label">きっかけ・経験</div>
              <DetailRow label="きっかけ" value={labelsFor(SOURCE_OPTIONS, data.source_choices)} />
              <DetailRow label="SNS名" value={data.source_sns_name} />
              <DetailRow label="相談支援事業所" value={data.source_facility_name} />
              <DetailRow label="病院名" value={data.source_hospital_name} />
              <DetailRow label="きっかけ(その他)" value={data.source_other} />
              <DetailRow label="利用経験" value={labelsFor(EXPERIENCE_OPTIONS, data.experience_choices)} />
              <DetailRow label="経験(その他)" value={data.experience_other} />
            </div>

            <div className="staff-card">
              <div className="staff-card-label">移動・興味</div>
              <DetailRow label="移動手段" value={labelFor(TRANSPORT_OPTIONS, data.transport)} />
              <DetailRow label="興味のある業務" value={labelsFor(INTERESTED_WORK_OPTIONS, data.interested_work)} />
              <DetailRow label="興味(その他)" value={data.interested_work_other} />
            </div>

            <div className="staff-card">
              <div className="staff-card-label">健康・医療</div>
              <DetailRow label="病名" value={data.illness_name} />
              <DetailRow
                label="手帳"
                value={
                  data.notebook_status
                    ? `${data.notebook_status}${data.notebook_grade ? `・${data.notebook_grade}` : ""}`
                    : ""
                }
              />
              <DetailRow label="通院先" value={data.hospital_name} />
              <DetailRow label="主治医" value={data.doctor_name} />
              <DetailRow
                label="相談支援事業所"
                value={
                  data.support_office_used === true
                    ? `${data.support_office_name ?? ""}${data.support_office_contact ? `（${data.support_office_contact}）` : ""}`
                    : data.support_office_used === false
                    ? "無し"
                    : ""
                }
              />
              <DetailRow label="症状詳細" value={data.symptom_detail} />
            </div>
          </div>

          {/* --- Right: staff notes + agreements + typing metrics --- */}
          <div>
            <div className="staff-card">
              <div className="staff-card-label">Staff Notes</div>
              <StaffNotesEditor
                id={data.id}
                initial={{
                  inquiry_date: data.inquiry_date ?? null,
                  scheduled_visit_date: data.scheduled_visit_date ?? null,
                  service_start_date: data.service_start_date ?? null,
                  trial_sessions: Array.isArray(data.trial_sessions)
                    ? data.trial_sessions
                    : [],
                  city_office_meeting_at: data.city_office_meeting_at ?? null,
                  service_plan_completed_at: data.service_plan_completed_at ?? null,
                  contract_signed_at: data.contract_signed_at ?? null,
                  status: data.status ?? "active",
                  dropout_at_step: data.dropout_at_step ?? null,
                  dropout_reason: data.dropout_reason ?? null,
                  dropout_at: data.dropout_at ?? null,
                  staff_notes: data.staff_notes ?? "",
                }}
              />
            </div>

            <div className="staff-card">
              <div className="staff-card-label">Trial Agreements</div>
              {agreements.length === 0 ? (
                <div className="staff-empty-note">
                  まだ誓約書は発行されていません。
                  <br />
                  体験利用開始時に上部の「体験利用開始」ボタンから発行してください。
                </div>
              ) : (
                <div className="staff-agreement-list">
                  {agreements.map((ag) => (
                    <div key={ag.id} className="staff-agreement-row">
                      <Link
                        href={`/staff/agreement/${ag.id}?from=intake&intake_id=${data.id}`}
                        className="staff-agreement-row-body staff-agreement-row-link"
                      >
                        <div className="staff-agreement-date">
                          {formatDate(ag.created_at)}
                        </div>
                        <div className="staff-agreement-name">
                          署名: {ag.signed_name}
                          <span className="staff-agreement-row-view">
                            表示 →
                          </span>
                        </div>
                      </Link>
                      <DeleteAgreementButton
                        id={ag.id}
                        intakeId={data.id}
                        signedName={ag.signed_name}
                      />
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="staff-card">
              <div className="staff-card-label">Typing Evaluation</div>

              {/* ABC ランクバッジ（メイン評価） */}
              <div className={`typing-rank typing-rank--${rankInfo.cssClass}`}>
                <div className="typing-rank-badge">{rankInfo.rank}</div>
                <div className="typing-rank-body">
                  <div className="typing-rank-label">{rankInfo.label}</div>
                  <div className="typing-rank-range">{rankInfo.cpmRange}</div>
                  <div className="typing-rank-message">{rankInfo.message}</div>
                </div>
              </div>

              {/* PC 環境併記（評価の解釈材料） */}
              <div className="typing-context">
                <div className="typing-context-label">PC 環境</div>
                {usualPcUsageLabel ? (
                  <div className="typing-context-value">
                    普段: {usualPcUsageLabel}
                    {usualPcTypeLabel && <> ／ {usualPcTypeLabel}</>}
                  </div>
                ) : (
                  <div className="typing-context-empty">未入力</div>
                )}
                <div className="typing-context-note">
                  ※ 普段と違う OS／キーボードでは、実力より低めに出やすいです。
                </div>
              </div>

              {/* 補助指標: Backspace 率 + 貼り付け */}
              <div className="typing-secondary-grid">
                <div className="typing-secondary">
                  <div className="typing-secondary-label">Backspace 率</div>
                  {bsInfo ? (
                    <div className={`typing-secondary-value ${bsInfo.cssClass}`}>
                      {bsInfo.ratioPercent}%
                      <span className="typing-secondary-tag">{bsInfo.label}</span>
                    </div>
                  ) : (
                    <div className="typing-secondary-value">—</div>
                  )}
                </div>
                <div className="typing-secondary">
                  <div className="typing-secondary-label">Paste 回数</div>
                  <div className={`typing-secondary-value ${(data.typing_paste_count ?? 0) > 0 ? "bs-heavy" : ""}`}>
                    {data.typing_paste_count ?? 0}
                  </div>
                </div>
              </div>

              {/* 生データ（参考） */}
              <div className="typing-metrics-grid">
                <div className="typing-metric">
                  <div className="typing-metric-label">Total</div>
                  <div className="typing-metric-value">{formatDuration(data.typing_total_duration_ms)}</div>
                </div>
                <div className="typing-metric">
                  <div className="typing-metric-label">CPM</div>
                  <div className="typing-metric-value">
                    {data.typing_avg_cpm ?? 0}
                    <span className="typing-metric-unit">文字/分</span>
                  </div>
                </div>
                <div className="typing-metric">
                  <div className="typing-metric-label">Keystrokes</div>
                  <div className="typing-metric-value">{data.typing_total_keystrokes ?? 0}</div>
                </div>
                <div className="typing-metric">
                  <div className="typing-metric-label">Backspaces</div>
                  <div className="typing-metric-value">{data.typing_backspace_count ?? 0}</div>
                </div>
              </div>

              {/* 基準表（畳めるパネル） */}
              <details className="typing-reference">
                <summary>▶ 評価基準を開く</summary>
                <table className="typing-reference-table">
                  <thead>
                    <tr>
                      <th>ランク</th>
                      <th>CPM</th>
                      <th>目安</th>
                    </tr>
                  </thead>
                  <tbody>
                    {RANK_REFERENCE.map((r) => (
                      <tr key={r.rank}>
                        <td>
                          <span className={`typing-ref-dot rank-${r.rank.toLowerCase()}`}>
                            {r.rank}
                          </span>
                        </td>
                        <td>{r.range}</td>
                        <td>
                          <div>{r.label}</div>
                          <div className="typing-reference-hint">{r.hint}</div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                <p className="typing-reference-disclaimer">
                  ※ 住所・症状など「考えながら書く」項目も含むため、実効入力速度（思考時間込み）を測っています。
                  <br />
                  ※ 普段と違う OS／キーボード（Mac ⇔ Windows、ノート⇔デスクトップ）では数値が変動します。
                </p>
              </details>

              {fieldEntries.length > 0 && (
                <>
                  <div className="staff-card-label" style={{ marginTop: 16, marginBottom: 10 }}>
                    Per field
                  </div>
                  <div className="typing-field-list">
                    {fieldEntries.map(([fieldName, metrics]) => {
                      const label = FIELD_LABEL_MAP[fieldName] ?? fieldName;
                      return (
                        <div key={fieldName} className="typing-field-row">
                          <div className="typing-field-name">{label}</div>
                          <div className="typing-field-stat">
                            <strong>{metrics?.keystrokes ?? 0}</strong> keys
                          </div>
                          <div className="typing-field-stat">
                            <strong>{metrics?.backspaces ?? 0}</strong> BS
                          </div>
                          <div className="typing-field-stat">
                            {formatDuration(metrics?.durationMs ?? 0)}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </>
              )}
            </div>
          </div>
        </div>

        {/* 危険な操作 — ページ最下部 */}
        <section className="staff-danger-zone">
          <div className="staff-danger-head">Danger Zone · 危険な操作</div>
          <div className="staff-danger-body">
            <div className="staff-danger-text">
              <strong>面談票を削除</strong>
              <span>
                この面談票のレコードをデータベースから完全に削除します。元に戻せません。
                {agreements.length > 0 &&
                  `紐付けされている誓約書 ${agreements.length} 件は「面談票リンクなし」状態で残ります。`}
              </span>
            </div>
            <DeleteIntakeButton
              id={data.id}
              name={data.name}
              agreementCount={agreements.length}
            />
          </div>
        </section>
      </main>
    </div>
  );
}
