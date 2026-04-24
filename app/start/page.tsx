import type { Metadata } from "next";
import StartLP from "./StartLP";

export const metadata: Metadata = {
  title: "就職ゼミナール Passo a Passo｜岡崎駅前の就労移行支援",
  description:
    "岡崎駅徒歩7分の就労移行支援「Passo a Passo」。就職よりも「続けられる働き方」を一緒に。半年〜1年の集中プログラムで就職を目指します。定着率100%（半年後）。",
  openGraph: {
    title: "長く働くための、最短距離。― 就職ゼミナール Passo a Passo",
    description:
      "岡崎駅徒歩7分の就労移行支援。就職よりも「続けられる働き方」を一緒に。半年〜1年の集中プログラムで就職を目指します。",
    type: "website",
  },
};

export default function StartPage() {
  return <StartLP />;
}
