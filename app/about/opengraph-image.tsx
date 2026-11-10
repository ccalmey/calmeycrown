import { createPortfolioOgImage } from "@/lib/og-image";

// This route-specific card previews Calmey's biography when the About page is shared.
export const alt = "About Calmey Crown, a Kenyan multipotentialite and creator";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function Image() {
  return createPortfolioOgImage({
    eyebrow: "About Calmey Crown",
    title: "Curiosity across disciplines.",
    description: "A Kenyan multipotentialite exploring technology, creativity and African storytelling.",
  });
}
