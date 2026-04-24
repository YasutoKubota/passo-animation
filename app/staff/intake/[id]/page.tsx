import Link from "next/link";
import { notFound } from "next/navigation";
import { StaffTopbar } from "../../components/Topbar";
import { StaffNotesEditor } from "./StaffNotesEditor";
import { supabaseAdmin } from "@/lib/supabase";
import {
  SOURCE_OPTIONS,
  EXPERIENCE_OPTIONS,
  TRANSPORT_OPTIONS,
  INTERESTED_WORK_OPTIONS,
  type TypingFieldMetrics,
} from "@/lib/intake-schema";

export const dynamic = "force-dynamic";

const FIELD_LABEL_MAP: Record<string, string> = {
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

export default async function IntakeDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const { data, error } = await supabaseAdmin
    .from("intake_forms")
    .select("*")
    .eq("id", id)
    .maybeSingle();

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

  return (
    <div className="staff-root">
      <StaffTopbar section="詳細" />
      <main className="staff-main">
        <Link href="/staff/intake" className="staff-back-link">← 一覧に戻る</Link>

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
              <span className="staff-list-studio" style={{ marginRight: 10 }}>{data.studio_location}</span>
            )}
            提出: {formatDate(data.submitted_at)}
          </p>
        </div>

        <div className="staff-detail-grid">
          {/* --- Left: intake details --- */}
          <div>
            <div className="staff-card">
              <div className="staff-card-label">Basic</div>
              <DetailRow label="事業所" value={data.studio_location} />
              <DetailRow label="ふりがな" value={data.furigana} />
              <DetailRow label="お名前" value={data.name} />
              <DetailRow label="電話" value={data.phone} />
              <DetailRow label="生年月日" value={data.birth_date} />
              <DetailRow label="性別" value={data.gender} />
              <DetailRow label="郵便番号" value={data.postal_code} />
              <DetailRow label="住所" value={data.address} />
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

          {/* --- Right: staff notes + typing metrics --- */}
          <div>
            <div className="staff-card">
              <div className="staff-card-label">Staff Notes</div>
              <StaffNotesEditor
                id={data.id}
                initial={{
                  staff_trial_use: data.staff_trial_use ?? "",
                  staff_city_office_meeting: data.staff_city_office_meeting ?? "",
                  staff_notes: data.staff_notes ?? "",
                }}
              />
            </div>

            <div className="staff-card">
              <div className="staff-card-label">Typing Metrics</div>
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
                <div className="typing-metric">
                  <div className="typing-metric-label">Pastes</div>
                  <div className="typing-metric-value">{data.typing_paste_count ?? 0}</div>
                </div>
              </div>

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
      </main>
    </div>
  );
}
