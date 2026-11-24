// Add one entry for each public art release, episode, project milestone, or other meaningful update.
// Match projectId and skillId to IDs in portfolio-content.ts so every update links into both pages.
// Use an ISO date (YYYY-MM-DD) when known, a public destination, and an optional public/ image.
export type PortfolioUpdate = {
  id: string;
  date?: string;
  kind: "Artwork" | "Episode" | "Project milestone" | "Release";
  project: string;
  projectId: string;
  skillId: string;
  title: string;
  description: string;
  href: string;
  external?: boolean;
  image?: string;
  imageAlt?: string;
}; 

// The homepage sorts these records by date and displays the three newest public updates.
export const PORTFOLIO_UPDATES: PortfolioUpdate[] = [
  {
    id: "crown-narratives-digital-africa",
    date: "2026-11-20",
    kind: "Episode",
    project: "Crown Narratives",
    projectId: "crown-narratives",
    skillId: "filmmaking",
    title: "Africa’s foods that conquered the world",
    description:
      "African food traditions and ingredients travel through trade, migration, and diaspora—and can become global favourites while their origins are overlooked.",
    href: "https://youtu.be/40jMvlmt8sE?si=oUl32cOLpk_8il8f",
    external: true,
    // Match the real filename in public/images/projects/crown-narratives (including capitalization).
    image: "/images/projects/crown-narratives/Africa.png",
    imageAlt: "Crown Narratives episode artwork for Africa’s foods that conquered the world.",
  },
];
