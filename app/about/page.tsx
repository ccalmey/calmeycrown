import type { Metadata } from "next";
import AboutExperience from "@/components/AboutExperience";

// Route metadata is kept with the page so search snippets and shared links stay specific.
export const metadata: Metadata = {
  title: "About Calmey Crown | Multipotentialite, Creative & Technologist",
  description:
    "Meet Calmey Crown, a Kenyan multipotentialite exploring the connections between technology, storytelling, creativity, space and STEM.",
  alternates: { canonical: "/about" },
  openGraph: {
    title: "About Calmey Crown | Multipotentialite, Creative & Technologist",
    description:
      "Meet Calmey Crown, a Kenyan multipotentialite exploring the connections between technology, storytelling, creativity, space and STEM.",
    type: "website",
    url: "/about",
  },
  twitter: {
    card: "summary_large_image",
    title: "About Calmey Crown | Multipotentialite, Creative & Technologist",
    description:
      "Meet Calmey Crown, a Kenyan multipotentialite exploring the connections between technology, storytelling, creativity, space and STEM.",
    images: [{ url: "/about/opengraph-image", alt: "About Calmey Crown, a Kenyan multipotentialite and creator" }],
  },
};

export default function AboutPage() {
  return <AboutExperience />;
}
