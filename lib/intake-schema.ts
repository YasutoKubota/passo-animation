// 事業所コード → 表示ラベル + 住所（ウェルカム画面のカード用）+ 事業所種別
// value: DB の studio_location に保存される短い英字コード
// label: 画面に表示する正式名称
// address: ウェルカムカードに表示する所在地
// type: 就労継続支援 B 型 or 就労移行支援
export const STUDIO_OPTIONS = [
  {
    value: "pas_okazaki",
    label: "パッソアニメーションスタジオ",
    description: "愛知県岡崎市康生通東",
    type: "B型",
  },
  {
    value: "pas_toyota",
    label: "パッソアニメーションスタジオ豊田",
    description: "愛知県豊田市御幸本町",
    type: "B型",
  },
  {
    value: "sozo",
    label: "創造空間 Passo a Passo",
    description: "愛知県岡崎市本町通",
    type: "B型",
  },
  {
    value: "shushoku",
    label: "就職ゼミナール Passo a Passo",
    description: "愛知県岡崎市柱",
    type: "就労移行",
  },
] as const;

// DB の studio_location コードを人間可読なラベルに変換する
export function studioLabel(value: string | null | undefined): string {
  if (!value) return "";
  const found = STUDIO_OPTIONS.find((o) => o.value === value);
  return found?.label ?? value;
}

export const GENDER_OPTIONS = ["男", "女", "回答しない"] as const;

export const SOURCE_OPTIONS = [
  { value: "newspaper", label: "新聞折り込みチラシ" },
  { value: "posting", label: "ポスティング" },
  { value: "passerby", label: "通りすがり" },
  { value: "homepage", label: "ホームページ" },
  { value: "hello_work", label: "ハローワーク" },
  { value: "support_office", label: "相談支援事業所", hasDetail: true, detailField: "source_facility_name", detailLabel: "事業所名" },
  { value: "city_office", label: "市役所 / 保健所" },
  { value: "hospital", label: "病院", hasDetail: true, detailField: "source_hospital_name", detailLabel: "病院名" },
  { value: "sns", label: "SNS", hasDetail: true, detailField: "source_sns_name", detailLabel: "どのSNS?（Instagram・TikTok など）" },
  { value: "other", label: "その他", hasDetail: true, detailField: "source_other", detailLabel: "詳細" },
] as const;

export const EXPERIENCE_OPTIONS = [
  { value: "none", label: "経験なし（初めて）" },
  { value: "type_a", label: "A型事業所" },
  { value: "type_b", label: "B型事業所" },
  { value: "transition", label: "移行支援事業所" },
  { value: "independent_training", label: "自立訓練事業所" },
  { value: "group_home", label: "グループホーム" },
  { value: "home_nursing", label: "訪問看護" },
  { value: "home_helper", label: "訪問介護（ヘルパー）" },
  { value: "oiden_club", label: "若者おいでんクラブ" },
  { value: "other", label: "その他", hasDetail: true, detailField: "experience_other", detailLabel: "詳細" },
] as const;

export const TRANSPORT_OPTIONS = [
  { value: "bus_train", label: "バス・電車" },
  { value: "walk", label: "歩き" },
  { value: "bicycle", label: "自転車" },
  { value: "car", label: "自家用車" },
] as const;

export const INTERESTED_WORK_OPTIONS = [
  { value: "storyboard", label: "絵コンテ制作" },
  { value: "illustration", label: "イラスト制作" },
  { value: "voice_acting", label: "声優" },
  { value: "anime_scene", label: "アニメシーン制作" },
  { value: "video_editing", label: "動画編集" },
  { value: "none", label: "特にない" },
  { value: "other", label: "その他", hasDetail: true, detailField: "interested_work_other", detailLabel: "詳細" },
] as const;

export const NOTEBOOK_STATUS_OPTIONS = ["無", "精神", "療育", "身体"] as const;

// 普段のパソコン利用状況。タイピング評価の解釈材料としてスタッフ画面に併記。
export const PC_USAGE_OPTIONS = [
  { value: "daily", label: "毎日使っている（仕事・学校・趣味で）" },
  { value: "sometimes", label: "時々使う" },
  { value: "rarely", label: "ほとんど使わない（スマホ中心）" },
  { value: "none", label: "持っていない" },
] as const;

export const PC_TYPE_OPTIONS = [
  { value: "windows_desktop", label: "Windows デスクトップ" },
  { value: "windows_laptop", label: "Windows ノート" },
  { value: "mac_desktop", label: "Mac デスクトップ" },
  { value: "mac_laptop", label: "Mac ノート" },
  { value: "other", label: "その他・分からない" },
] as const;

// 体験利用スケジュール（1 日単位のレコード）
// 原則 3 日。1 日ずつ「午前 / 午後」のどちらを使うかを選ぶ。
export const TRIAL_SLOT_OPTIONS = [
  { value: "morning", label: "午前" },
  { value: "afternoon", label: "午後" },
] as const;

export type TrialSlot = (typeof TRIAL_SLOT_OPTIONS)[number]["value"];

export type TrialSession = {
  date: string; // YYYY-MM-DD
  slot: TrialSlot;
};

export type StudioValue = (typeof STUDIO_OPTIONS)[number]["value"];
export type GenderValue = (typeof GENDER_OPTIONS)[number];
export type TransportValue = (typeof TRANSPORT_OPTIONS)[number]["value"];
export type NotebookStatusValue = (typeof NOTEBOOK_STATUS_OPTIONS)[number];
export type PcUsageValue = (typeof PC_USAGE_OPTIONS)[number]["value"];
export type PcTypeValue = (typeof PC_TYPE_OPTIONS)[number]["value"];

export type TypingFieldMetrics = {
  firstKeyAt: number | null;
  lastKeyAt: number | null;
  durationMs: number;
  keystrokes: number;
  backspaces: number;
  pastes: number;
  characterCount: number;
};

export type TypingMetrics = {
  startedAt: number | null;
  submittedAt: number | null;
  totalDurationMs: number;
  totalKeystrokes: number;
  totalBackspaces: number;
  totalPastes: number;
  avgCpm: number;
  perField: Record<string, TypingFieldMetrics>;
};
