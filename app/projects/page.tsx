import type { Metadata } from "next";
import ProjectsExperience from "@/components/ProjectsExperience";

// Route metadata is kept with the page so search snippets and shared links stay specific.
export const metadata: Metadata = {
  title: "Projects & Portfolio | Calmey Crown",
  description:
    "Explore Calmey Crown’s published, creative and in-progress projects across technology, art, storytelling and STEM.",
  alternates: { canonical: "/projects" },
  openGraph: {
    title: "Projects & Portfolio | Calmey Crown",
    description:
      "Explore Calmey Crown’s published, creative and in-progress projects across technology, art, storytelling and STEM.",
    type: "website",
    url: "/projects",
  },
  twitter: {
    card: "summary_large_image",
    title: "Projects & Portfolio | Calmey Crown",
    description:
      "Explore Calmey Crown’s published, creative and in-progress projects across technology, art, storytelling and STEM.",
    images: [{ url: "/projects/opengraph-image", alt: "Selected creative, technology and STEM projects by Calmey Crown" }],
  },
};

export default function ProjectsPage() {
  return <ProjectsExperience />;
}
