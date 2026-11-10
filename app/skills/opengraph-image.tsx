import { createPortfolioOgImage } from "@/lib/og-image";

// This route-specific card previews the skills page and its evidence-led practice.
export const alt = "Calmey Crown's skills and creative practice";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function Image() {
  return createPortfolioOgImage({
    eyebrow: "Skills and practice",
    title: "Learning by making.",
    description: "Proof-led work across pencil art, software, film, voice, music and STEM.",
  });
}
