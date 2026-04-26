"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { upsertAdCampaign, type AdCampaignPayload } from "./actions";
import { STUDIO_OPTIONS } from "@/lib/intake-schema";

// 広告チャネル。媒体ごとに「必要な情報」が違うので、フォームで動的に出し分ける。
//   - flight: true なら 「期間 (開始/終了) + 予算」を聞く（Instagram/Google/Meta/TikTok 等）
//   - flight: false なら 「配布日（単発）+ 部数 / 印刷費」を聞く（折込/ポスティング/病院チラシ）
export const AD_CHANNELS = [
  { value: "instagram", label: "Instagram 広告", flight: true },
  { value: "google", label: "Google 広告", flight: true },
  { value: "meta", label: "Meta（Facebook） 広告", flight: true },
  { value: "tiktok", label: "TikTok 広告", flight: true },
  { value: "newspaper", label: "新聞折込チラシ", flight: false },
  { value: "posting", label: "ポスティング", flight: false },
  { value: "hospital", label: "病院チラシ・リーフレット", flight: false },
  { value: "hello_work", label: "ハローワーク掲示", flight: false },
  { value: "support_office", label: "相談支援事業所配布", flight: false },
  { value: "other", label: "その他", flight: true },
] as const;

type Props = {
  initial?: AdCampaignPayload & { id: string };
  onClose?: () => void;
};

export function AdCampaignForm({ initial }: Props) {
  const router = useRouter();
  const [studio, setStudio] = useState<string>(initial?.studio_location ?? "");
  const [channel, setChannel] = useState<string>(initial?.ad_channel ?? "instagram");
  const [name, setName] = useState<string>(initial?.name ?? "");
  const [startDate, setStartDate] = useState<string>(initial?.start_date ?? "");
  const [endDate, setEndDate] = useState<string>(initial?.end_date ?? "");
  const [budget, setBudget] = useState<string>(
    initial?.budget_yen != null ? String(initial.budget_yen) : ""
  );
  const [target, setTarget] = useState<string>(initial?.target_description ?? "");
  const [creative, setCreative] = useState<string>(initial?.creative_notes ?? "");
  const [creativeUrl, setCreativeUrl] = useState<string>(initial?.creative_url ?? "");
  const [notes, setNotes] = useState<string>(initial?.notes ?? "");

  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const channelMeta = AD_CHANNELS.find((c) => c.value === channel);
  const isFlight = channelMeta?.flight ?? true;

  const submit = () => {
    setError(null);
    startTransition(async () => {
      const budgetNum = budget ? parseInt(budget.replace(/[^0-9]/g, ""), 10) : null;
      const result = await upsertAdCampaign({
        id: initial?.id,
        studio_location: studio || null,
        ad_channel: channel,
        name,
        start_date: startDate,
        // 期間広告でない場合は終了日を開始日と同じに（DB 側は単発として扱う）
        end_date: isFlight ? endDate || null : startDate || null,
        budget_yen: Number.isFinite(budgetNum) ? budgetNum : null,
        target_description: target,
        creative_notes: creative,
        creative_url: creativeUrl || null,
        notes,
      });
      if (result.success) {
        router.push("/staff/ads");
        router.refresh();
      } else {
        setError(result.error);
      }
    });
  };

  return (
    <div className="ad-form">
      {/* 媒体（チャネル）— ラジオグリッドで視覚的に選ぶ */}
      <div className="ad-form-field">
        <label className="ad-form-label">
          媒体 <span className="ad-form-required">必須</span>
        </label>
        <div className="ad-form-radio-grid">
          {AD_CHANNELS.map((c) => (
            <label
              key={c.value}
              className={`ad-form-radio ${channel === c.value ? "is-selected" : ""}`}
            >
              <input
                type="radio"
                name="ad_channel"
                value={c.value}
                checked={channel === c.value}
                onChange={() => setChannel(c.value)}
              />
              <span>
                <strong>{c.label}</strong>
                <span className="ad-form-radio-sub">
                  {c.flight ? "期間広告" : "単発配布"}
                </span>
              </span>
            </label>
          ))}
        </div>
      </div>

      {/* 対象事業所 */}
      <div className="ad-form-row">
        <div className="ad-form-field">
          <label className="ad-form-label" htmlFor="ad-studio">
            対象事業所
          </label>
          <select
            id="ad-studio"
            className="ad-form-input"
            value={studio}
            onChange={(e) => setStudio(e.target.value)}
          >
            <option value="">— 全社共通 —</option>
            {STUDIO_OPTIONS.map((s) => (
              <option key={s.value} value={s.value}>
                {s.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* キャンペーン名 */}
      <div className="ad-form-field">
        <label className="ad-form-label" htmlFor="ad-name">
          キャンペーン名 <span className="ad-form-required">必須</span>
        </label>
        <input
          id="ad-name"
          type="text"
          className="ad-form-input"
          placeholder="例: 2026春・Instagram動画編集体験"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <p className="ad-form-hint">
          後から「ルート × 広告」で結果を見るので、媒体・季節・テーマがわかる名前にしてください
        </p>
      </div>

      {/* 期間 / 配布日 — 媒体タイプで切り替え */}
      <div className="ad-form-row">
        <div className="ad-form-field">
          <label className="ad-form-label" htmlFor="ad-start">
            {isFlight ? "開始日" : "配布日"}{" "}
            <span className="ad-form-required">必須</span>
          </label>
          <input
            id="ad-start"
            type="date"
            className="ad-form-input"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
          />
        </div>
        {isFlight && (
          <div className="ad-form-field">
            <label className="ad-form-label" htmlFor="ad-end">
              終了日
            </label>
            <input
              id="ad-end"
              type="date"
              className="ad-form-input"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
            />
          </div>
        )}
        <div className="ad-form-field">
          <label className="ad-form-label" htmlFor="ad-budget">
            {isFlight ? "予算（円・税込）" : "印刷・配布費用（円・税込）"}
          </label>
          <input
            id="ad-budget"
            type="text"
            inputMode="numeric"
            className="ad-form-input"
            placeholder="100000"
            value={budget}
            onChange={(e) => setBudget(e.target.value)}
          />
        </div>
      </div>

      {/* ターゲット説明 */}
      <div className="ad-form-field">
        <label className="ad-form-label" htmlFor="ad-target">
          ターゲット説明
        </label>
        <textarea
          id="ad-target"
          className="ad-form-textarea"
          placeholder="例: 20代女性、岡崎市内、うつ・適応障害、動画編集に興味"
          value={target}
          onChange={(e) => setTarget(e.target.value)}
          rows={3}
        />
      </div>

      {/* クリエイティブ・訴求内容 */}
      <div className="ad-form-field">
        <label className="ad-form-label" htmlFor="ad-creative">
          クリエイティブ・訴求内容
        </label>
        <textarea
          id="ad-creative"
          className="ad-form-textarea"
          placeholder="例: 「在宅から始める、動画編集の体験会」3 種類のクリエイティブで配信"
          value={creative}
          onChange={(e) => setCreative(e.target.value)}
          rows={3}
        />
        <p className="ad-form-hint">
          チラシのコンセプト・キャッチコピー・写真の方向性などを残しておくと
          後で AI に分析させたり、改稿の参考になります
        </p>
      </div>

      {/* クリエイティブのリンク（SharePoint・OneDrive） */}
      <div className="ad-form-field">
        <label className="ad-form-label" htmlFor="ad-creative-url">
          📎 クリエイティブのリンク（SharePoint / OneDrive）
        </label>
        <input
          id="ad-creative-url"
          type="url"
          className="ad-form-input"
          placeholder="https://passo-my.sharepoint.com/..."
          value={creativeUrl}
          onChange={(e) => setCreativeUrl(e.target.value)}
        />
        <p className="ad-form-hint">
          SharePoint でファイルを右クリック →「リンクをコピー」→ ここに貼り付け。
          画像本体はアプリには保存せず、SharePoint 上のリンクだけ記録します。
        </p>
      </div>

      {/* メモ */}
      <div className="ad-form-field">
        <label className="ad-form-label" htmlFor="ad-notes">
          メモ
        </label>
        <textarea
          id="ad-notes"
          className="ad-form-textarea"
          placeholder="特記事項・反省・次回への申し送りなど"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          rows={2}
        />
      </div>

      {error && <div className="ad-form-error">{error}</div>}

      <div className="ad-form-actions">
        <button
          type="button"
          className="staff-action-btn staff-action-btn--primary"
          onClick={submit}
          disabled={pending}
        >
          {pending ? "保存中..." : initial ? "更新する" : "登録する"}
        </button>
      </div>
    </div>
  );
}
