// タイピング評価（ABC）
// ※ スタッフ画面にのみ表示。本人には見せない。
//
// このフォームは住所や病歴など「考えながら書く」フィールドを含むため、
// 純粋なタイピング速度ではなく「実効入力速度（思考時間込み）」を評価している。
// そのうえで、御社の業務要件（動画編集ショートカット・Teams チャット）に対する
// 入所判断の参考値として、CPM を ABC にマッピングする。

export type TypingRank = "A" | "B" | "C";

export type TypingRankInfo = {
  rank: TypingRank;
  label: string;
  message: string;
  cpmRange: string;
  cssClass: string;
};

export function cpmToRank(cpm: number | null | undefined): TypingRankInfo {
  const v = cpm ?? 0;

  if (v >= 40) {
    return {
      rank: "A",
      label: "業務水準",
      message:
        "動画編集ショートカット・Teams チャットに支障なし。データ入力系も含めて戦力。",
      cpmRange: "40 CPM 以上",
      cssClass: "rank-a",
    };
  }
  if (v >= 20) {
    return {
      rank: "B",
      label: "要フォロー",
      message:
        "業務開始は可能。チャット連絡・編集ショートカットで当初は苦戦するが、並行で慣れていく前提なら受入れ可。",
      cpmRange: "20 – 39 CPM",
      cssClass: "rank-b",
    };
  }
  return {
    rank: "C",
    label: "タイピング練習を推奨",
    message:
      "現時点ではチャット連絡・動画編集のショートカット操作に支障が出る可能性が高い。先にタイピング練習を案内し、一定水準に達してから再度検討するのが現実的。",
    cpmRange: "0 – 19 CPM",
    cssClass: "rank-c",
  };
}

export const RANK_REFERENCE: {
  rank: TypingRank;
  range: string;
  label: string;
  hint: string;
}[] = [
  { rank: "A", range: "40+ CPM", label: "業務水準", hint: "問題なく業務可能" },
  { rank: "B", range: "20–39 CPM", label: "要フォロー", hint: "業務可・並行で慣れる前提" },
  { rank: "C", range: "0–19 CPM", label: "練習推奨", hint: "先にタイピング練習から" },
];

// Backspace 率（消した回数 ÷ 全打鍵数）の評価
export type BackspaceInfo = {
  ratioPercent: number;
  label: "クリーン" | "修正多め" | "迷い多い";
  cssClass: "bs-clean" | "bs-moderate" | "bs-heavy";
};

export function evaluateBackspaceRatio(
  keystrokes: number | null | undefined,
  backspaces: number | null | undefined
): BackspaceInfo | null {
  const k = keystrokes ?? 0;
  const b = backspaces ?? 0;
  if (k <= 0) return null;

  const ratio = b / k;
  const percent = Math.round(ratio * 1000) / 10; // 小数第1位まで

  if (ratio <= 0.15) {
    return { ratioPercent: percent, label: "クリーン", cssClass: "bs-clean" };
  }
  if (ratio <= 0.25) {
    return { ratioPercent: percent, label: "修正多め", cssClass: "bs-moderate" };
  }
  return { ratioPercent: percent, label: "迷い多い", cssClass: "bs-heavy" };
}

// お名前・ふりがなへの貼り付け検出（本人入力か要確認のシグナル）
export function detectIdentityPaste(
  perField: Record<string, { pastes?: number }> | null | undefined
): string[] {
  if (!perField) return [];
  const flagged: string[] = [];
  const identityFields: Record<string, string> = {
    name: "お名前",
    furigana: "ふりがな",
  };
  for (const [key, jaLabel] of Object.entries(identityFields)) {
    const f = perField[key];
    if (f && typeof f.pastes === "number" && f.pastes > 0) {
      flagged.push(jaLabel);
    }
  }
  return flagged;
}
