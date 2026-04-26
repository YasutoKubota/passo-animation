import Link from "next/link";
import { StaffTopbar } from "../components/Topbar";
import { supabaseAdmin } from "@/lib/supabase";
import { studioShortLabel } from "@/lib/intake-schema";
import { AdCampaignForm, AD_CHANNELS } from "./AdCampaignForm";
import { DeleteAdButton } from "./DeleteAdButton";

export const dynamic = "force-dynamic";

type AdCampaign = {
  id: string;
  studio_location: string | null;
  ad_channel: string;
  name: string;
  start_date: string;
  end_date: string | null;
  budget_yen: number | null;
  target_description: string | null;
  creative_notes: string | null;
  creative_url: string | null;
  notes: string | null;
  created_at: string;
};

function formatDateOnly(iso: string) {
  const d = new Date(iso);
  return d.toLocaleDateString("ja-JP", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });
}

function channelLabel(value: string): string {
  return AD_CHANNELS.find((c) => c.value === value)?.label ?? value;
}

function formatBudget(yen: number | null): string {
  if (yen == null) return "—";
  return `¥${yen.toLocaleString("ja-JP")}`;
}

export default async function AdCampaignsPage() {
  const { data, error } = await supabaseAdmin
    .from("ad_campaigns")
    .select("*")
    .order("start_date", { ascending: false })
    .limit(200);

  const campaigns = (data ?? []) as AdCampaign[];

  return (
    <div className="staff-root">
      <StaffTopbar section="広告キャンペーン管理" />
      <main className="staff-main">
        <Link href="/staff" className="staff-back-link">← ダッシュボードに戻る</Link>

        <div className="staff-page-head">
          <div className="staff-page-label">
            <span className="dot" />
            <span>Ad Campaigns</span>
          </div>
          <h1 className="staff-page-title">広告キャンペーン管理</h1>
          <p className="staff-page-sub">
            いつ・どこに・いくらで・どんな広告を打ったかを記録します。
            分析画面で「広告 → お問合せ → 利用開始」のコンバージョンが見えるようになります。
          </p>
        </div>

        <section className="staff-card">
          <div className="staff-card-label">新規キャンペーンを登録</div>
          <AdCampaignForm />
        </section>

        <section className="staff-card">
          <div className="staff-card-label">登録済みキャンペーン（{campaigns.length} 件）</div>
          {error && (
            <div className="staff-list-empty">読み込みに失敗しました: {error.message}</div>
          )}
          {!error && campaigns.length === 0 && (
            <div className="staff-list-empty">まだキャンペーンが登録されていません。</div>
          )}
          {!error && campaigns.length > 0 && (
            <div className="ads-list">
              {campaigns.map((c) => (
                <div key={c.id} className="ads-row">
                  <div className="ads-row-head">
                    <span className="ads-row-channel">{channelLabel(c.ad_channel)}</span>
                    <span className="ads-row-name">{c.name}</span>
                    {c.studio_location && (
                      <span className="staff-list-studio">
                        {studioShortLabel(c.studio_location)}
                      </span>
                    )}
                  </div>
                  <div className="ads-row-meta">
                    <span>
                      {formatDateOnly(c.start_date)}
                      {c.end_date ? ` 〜 ${formatDateOnly(c.end_date)}` : " 〜 継続中"}
                    </span>
                    <span>予算 {formatBudget(c.budget_yen)}</span>
                  </div>
                  {c.target_description && (
                    <div className="ads-row-desc">
                      <strong>ターゲット:</strong> {c.target_description}
                    </div>
                  )}
                  {c.creative_notes && (
                    <div className="ads-row-desc">
                      <strong>クリエイティブ:</strong> {c.creative_notes}
                    </div>
                  )}
                  {c.notes && (
                    <div className="ads-row-desc ads-row-desc--note">
                      {c.notes}
                    </div>
                  )}
                  <div className="ads-row-actions">
                    {c.creative_url && (
                      <a
                        href={c.creative_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="ads-row-creative-link"
                        title="SharePoint / OneDrive のクリエイティブを別タブで開く"
                      >
                        📎 クリエイティブを見る
                      </a>
                    )}
                    <DeleteAdButton id={c.id} name={c.name} />
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  );
}
