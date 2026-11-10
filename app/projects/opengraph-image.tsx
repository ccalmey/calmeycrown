import { createPortfolioOgImage } from "@/lib/og-image";

// This route-specific card previews the published work and early-stage builds catalog.
export const alt = "Selected creative, technology and STEM projects by Calmey Crown";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function Image() {
  return createPortfolioOgImage({
    eyebrow: "Projects and portfolio",
    title: "Ideas taking shape.",
    description: "Published stories, creative studies and early-stage builds, clearly labeled.",
  });
}
