// Keep blog records together so post copy, tags, images, and related portfolio links are easy to update.
import { PENCIL_ARTWORKS, PROJECTS, SKILLS } from "@/lib/portfolio-content";
import { PORTFOLIO_UPDATES } from "@/lib/portfolio-updates";

// These types make every card and article page use the same predictable content shape.
export type BlogCategory = "Stories" | "Studio notes" | "Process";
export type BlogPost = {
  slug: string;
  category: BlogCategory;
  title: string;
  dek: string;
  excerpt: string;
  image: string;
  imageAlt: string;
  publishedAt?: string;
  externalLink?: string;
  externalLinkLabel?: string;
  relatedProject?: string;
  relatedSkill?: string;
  body: { heading?: string; paragraphs: string[] }[];
};

// Pull the lead story from the homepage update feed so the two places stay in sync.
const latestUpdate = [...PORTFOLIO_UPDATES].sort(
  (first, second) => (second.date ?? "").localeCompare(first.date ?? "")
)[0];

// Reuse project art and portfolio IDs instead of maintaining duplicate image paths or labels.
const pencilProject = PROJECTS.find((project) => project.id === "pencil-art");
const pencilSkill = SKILLS.find((skill) => skill.id === "pencil-art");
const filmmakingSkill = SKILLS.find((skill) => skill.id === "filmmaking");
const featuredArtwork = PENCIL_ARTWORKS[0];

// Edit the dek, excerpt, or body text below when adding more background to these first sample posts.
export const BLOG_POSTS: BlogPost[] = [
  {
    slug: "AFRICA’S FOODS THAT CONQUERED THE WORLD",
    category: "Stories",
    title: latestUpdate?.title ?? "Crown Narratives: latest episode",
    dek: latestUpdate?.description ?? "A new story from Crown Narratives.",
    excerpt:
      "Coffee from Ethiopia. Pepper-rich sauces. Rice traditions that crossed oceans. Okra and other ingredients woven into cuisines across the world. African food stories are stories of agriculture, trade, migration, creativity, and memory. In this episode of Crown Narratives, we trace how African crops, cooking knowledge, and food traditions travelled—and how communities transformed ingredients from elsewhere into beloved local flavours. We also explore the difficult history of forced migration, the African diaspora, and the question of who gets credit when food becomes popular. Africa is not one cuisine. It is a vast collection of food cultures, each with its own ingredients, techniques, histories, and innovations.",
    image: latestUpdate?.image ?? "/images/hero-cover.png",
    imageAlt: latestUpdate?.imageAlt ?? "Artwork for the latest Crown Narratives episode",
    publishedAt: latestUpdate?.date,
    externalLink: latestUpdate?.href,
    externalLinkLabel: latestUpdate?.kind === "Episode" ? "Watch the episode" : "Open the latest update",
    relatedProject: latestUpdate?.projectId,
    relatedSkill: latestUpdate?.skillId,
    body: [
      {
        heading: "A story carried through craft",
        paragraphs: [
          latestUpdate?.description ?? "A new story from Crown Narratives.",
          "This episode is part of Crown Narratives, a documentary project exploring African civilization stories.",
        ],
      },
      {
        heading: "Continue the story",
        paragraphs: [
          "Watch full episode through the project link below, then return for future notes on the stories and ideas behind the series.",
        ],
      },
    ],
  },
  {
    slug: "a-page-from-the-sketchbook",
    category: "Studio notes",
    title: "A page from the sketchbook",
    dek: "Small studies, a steady hand, and the pleasure of learning.",
    excerpt:
      "A first studio note from the calmey.art practice. This pencil portrait is a small study of a figure from a photograph. I find myself lost when drawing, taking in the details. It's a meditative process, and I enjoy the challenge of capturing likenesses and textures with pencil on paper and a few tools at my disposal; 14.5cm x 21cm/120g sheet of paper, blending stump, eraser included. For this particular piece, I was drawn to the interplay of Ella's soft beauty and expression. This page is one of many in my sketchbook, each a step in developing my skills and exploring the art form. I've never been so carried away by a creative practice, and I look forward to sharing more of these studies as they take shape.",
    image: featuredArtwork.src,
    imageAlt: featuredArtwork.alt,
    relatedProject: pencilProject?.id,
    relatedSkill: pencilSkill?.id,
    body: [
      {
        heading: "A practice still taking shape",
        paragraphs: [
          "I began exploring pencil art in May 2025. Portraits, name art, and landscapes give me room to practice observation and develop a craft I genuinely enjoy while gradually gravitating toward romanticism.",
          "This drawing is one small step in that process. The notes here are a placeholder for the details that make each piece personal: what sparked it, what felt difficult, and what I would try differently next time.",
        ],
      },
      {
        heading: "From the studio",
        paragraphs: [
          "I hope to keep growing calmey.art into a thoughtful body of work and, over time, a market-ready gallery. More artwork and process notes can be added here as new pieces are finished.",
        ],
      },
    ],
  },
];

// This reading time estimate stays useful as article text grows without requiring a manual edit.
export function getReadingMinutes(post: BlogPost) {
  const words = [post.title, post.dek, ...post.body.flatMap((section) => [
    section.heading ?? "",
    ...section.paragraphs,
  ])].join(" ").trim().split(/\s+/).length;
  return Math.max(1, Math.ceil(words / 220));
}

// Resolve friendly project/skill labels from canonical records for cross-linked article footers.
export function getRelatedLabels(post: BlogPost) {
  return {
    project: PROJECTS.find((project) => project.id === post.relatedProject),
    skill: SKILLS.find((skill) => skill.id === post.relatedSkill),
    filmmakingSkill,
  };
}
