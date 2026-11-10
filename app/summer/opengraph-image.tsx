import { createPortfolioOgImage } from "@/lib/og-image";

// This generated card gives Summer a distinct, branded preview when its page is shared.
export const alt = "Summer, the debut novel by Calmey Crown";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function Image() {
  return createPortfolioOgImage({
    eyebrow: "A DEBUT NOVEL BY CALMEY CROWN",
    title: "Summer.",
    description: "A story of unforgotten love, motherhood, and the possibility of beginning again.",
  });
}
