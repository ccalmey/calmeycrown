import type { Metadata } from "next";
import SkillsExperience from "@/components/SkillsExperience";

// Route metadata is kept with the page so search snippets and shared links stay specific.
export const metadata: Metadata = {
  title: "Skills & Practice | Calmey Crown",
  description:
    "Explore Calmey Crown’s skills through published work, creative studies and projects in progress across technology, art, filmmaking, writing and STEM.",
  alternates: { canonical: "/skills" },
  openGraph: {
    title: "Skills & Practice | Calmey Crown",
    description:
      "Explore Calmey Crown’s skills through published work, creative studies and projects in progress across technology, art, filmmaking, writing and STEM.",
    type: "website",
    url: "/skills",
  },
  twitter: {
    card: "summary_large_image",
    title: "Skills & Practice | Calmey Crown",
    description:
      "Explore Calmey Crown’s skills through published work, creative studies and projects in progress across technology, art, filmmaking, writing and STEM.",
    images: [{ url: "/skills/opengraph-image", alt: "Calmey Crown's skills and creative practice" }],
  },
};

export default function SkillsPage() {
  return <SkillsExperience />;
}
