import type { Metadata } from "next";
import MovieLP from "./MovieLP";

export const metadata: Metadata = {
  title: "パッソ アニメーションスタジオ",
  description:
    "パッソは働くことに障がいのあるクリエイターのための制作スタジオ（就労継続支援B型）。10年の実績と多彩な企業案件であなたの「好き」を仕事にします。",
};

export default function MoviePage() {
  return <MovieLP />;
}
