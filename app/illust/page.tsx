import type { Metadata } from "next";
import IllustLP from "./IllustLP";

export const metadata: Metadata = {
  title: "パッソ アニメーションスタジオ — イラスト制作",
  description:
    "パッソは働くことに障がいのあるクリエイターのための制作スタジオ（就労継続支援B型）。10年の実績と多彩な企業案件でイラストレーターとしての「好き」を仕事にします。",
};

export default function IllustPage() {
  return <IllustLP />;
}
