"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { upsertAdCampaign, type AdCampaignPayload } from "./actions";
import { STUDIO_OPTIONS } from "@/lib/intake-schema";

export const AD_CHANNELS = [
  { value: "instagram", label: "Instagram 広告" },
  { value: "google", label: "Google 広告" },
  { value: "meta", label: "Meta（Facebook） 広告" },
  { value: "tiktok", label: "TikTok 広告" },
  { value: "newspaper", label: "新聞折込チラシ" },
  { value: "posting", label: "ポスティング" },
  { value: "hospital", label: "病院チラシ・リーフレット" },
  { value: "hello_work", label: "ハローワーク掲示" },
  { value: "support_office", label: "相談支援事業所配布" },
  { value: "other", label: "その他" },
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
  const [notes, setNotes] = useState<string>(initial?.notes ?? "");

  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

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
        end_date: endDate || null,
        budget_yen: Number.isFinite(budgetNum) ? budgetNum : null,
        target_description: target,
        creative_notes: creative,
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
    <div className="ads-form">
      <div className="ads-form-grid">
        <div className="field">
          <label className="field-label">媒体 <span className="required">必須</span></label>
          <select
            className="field-select"
            value={channel}
            onChange={(e) => setChannel(e.target.value)}
          >
            {AD_CHANNELS.map((c) => (
              <option key={c.value} value={c.value}>
                {c.label}
              </option>
            ))}
          </select>
        </div>
        <div className="field">
          <label className="field-label">対象事業所</label>
          <select
            className="field-select"
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

      <div className="field">
        <label className="field-label">キャンペーン名 <span className="required">必須</span></label>
        <input
          type="text"
          className="field-input"
          placeholder="例: 2026春・Instagram動画編集体験"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      </div>

      <div className="ads-form-grid ads-form-grid--3">
        <div className="field">
          <label className="field-label">開始日 <span className="required">必須</span></label>
          <input
            type="date"
            className="field-input"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
          />
        </div>
        <div className="field">
          <label className="field-label">終了日</label>
          <input
            type="date"
            className="field-input"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
          />
        </div>
        <div className="field">
          <label className="field-label">予算（円・税込）</label>
          <input
            type="text"
            inputMode="numeric"
            className="field-input"
            placeholder="100000"
            value={budget}
            onChange={(e) => setBudget(e.target.value)}
          />
        </div>
      </div>

      <div className="field">
        <label className="field-label">ターゲット説明</label>
        <textarea
          className="field-textarea"
          placeholder="例: 20代女性、岡崎市内、うつ・適応障害、動画編集に興味"
          value={target}
          onChange={(e) => setTarget(e.target.value)}
          rows={3}
        />
      </div>

      <div className="field">
        <label className="field-label">クリエイティブ・訴求内容</label>
        <textarea
          className="field-textarea"
          placeholder="例: 「在宅から始める、動画編集の体験会」3 種類のクリエイティブで配信"
          value={creative}
          onChange={(e) => setCreative(e.target.value)}
          rows={3}
        />
      </div>

      <div className="field">
        <label className="field-label">メモ</label>
        <textarea
          className="field-textarea"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          rows={2}
        />
      </div>

      {error && <div className="ads-form-error">{error}</div>}

      <div className="ads-form-actions">
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
