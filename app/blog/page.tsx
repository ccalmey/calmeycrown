import type { Metadata } from "next";
import BlogExperience from "@/components/BlogExperience";

// Route metadata gives the journal a distinct search and social-sharing identity.
export const metadata: Metadata = {
  title: "Journal | Calmey Crown",
  description: "Notes on stories, creative practice, and the work behind Calmey Crown’s projects.",
  alternates: { canonical: "/blog" },
  openGraph: {
    title: "Journal | Calmey Crown",
    description: "Notes on stories, creative practice, and the work behind Calmey Crown’s projects.",
    type: "website",
    url: "/blog",
  },
  twitter: {
    card: "summary_large_image",
    title: "Journal | Calmey Crown",
    description: "Notes on stories, creative practice, and the work behind Calmey Crown’s projects.",
    images: [{ url: "/opengraph-image", alt: "Calmey Crown journal" }],
  },
};

// The interactive magazine index is isolated from this server-rendered route wrapper.
export default function BlogPage() {
  return <BlogExperience />;
}
