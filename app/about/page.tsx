import type { Metadata } from "next";
import AboutExperience from "@/components/AboutExperience";

export const metadata: Metadata = {
  title: "About Calmey Crown | Multipotentialite, Creative & Technologist",
  description:
    "Meet Calmey Crown, a Kenyan multipotentialite exploring the connections between technology, storytelling, creativity, space and STEM.",
};

export default function AboutPage() {
  return <AboutExperience />;
}
