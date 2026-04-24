import type { Metadata } from "next";
import StartLP from "./StartLP";

export const metadata: Metadata = {
  title: "就職ゼミナール Passo a Passo｜岡崎駅前の就労移行支援",
  description:
    "長く働き続けるための、最短距離。岡崎駅徒歩7分の就労移行支援「Passo a Passo」。失業保険期間内（半年〜1年）で就職を目指す短期集中プログラム。定着率100%（6ヶ月）・地元就職率約80%。",
  openGraph: {
    title: "長く働き続けるための、最短距離。― 就職ゼミナール Passo a Passo",
    description:
      "岡崎駅徒歩7分の就労移行支援。独自の体調管理アプリ、週2回の個別面談、出席率91%。あなた自身が決める「一歩ずつ」を私たちと。",
    type: "website",
  },
};

export default function StartPage() {
  return <StartLP />;
}
