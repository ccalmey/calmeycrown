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
    kind: "Episode",
    project: "Crown Narratives",
    projectId: "crown-narratives",
    skillId: "filmmaking",
    title: "Digital Africa | How Technology Is Rewiring a Continent",
    description:
      "From mobile money and fintech to digital learning, creator economies, satellites, AI, and cybersecurity, this episode explores how technology is changing life across Africa—and asks who gets connected, who controls the data, and whether innovation can be built around African needs.",
    href: "https://youtu.be/wJaYHsi_-5U",
    external: true,
    image: "/images/projects/crown-narratives/digital-africa.png",
    imageAlt: "Crown Narratives episode artwork for Digital Africa, showing a connected map of the continent",
  },
];
