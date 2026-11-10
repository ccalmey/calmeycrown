import { createPortfolioOgImage } from "@/lib/og-image";

// The homepage's share card introduces the full creative and technical portfolio.
export const alt = "Calmey Crown — creative technology, storytelling and exploration";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function Image() {
  return createPortfolioOgImage({
    eyebrow: "A creative technologist's portfolio",
    title: "Hi, I’m Calmey Crown.",
    description: "Ideas, projects and stories across technology, art, film and STEM.",
  });
}
