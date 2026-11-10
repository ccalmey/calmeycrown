import type { Metadata } from "next";
import BookDetailExperience from "@/components/BookDetailExperience";
import { SUMMER_BOOK } from "@/content/books/summer";

// Book-route metadata keeps Summer independently discoverable and shareable.
export const metadata: Metadata = {
  title: "Summer | Calmey Crown",
  description:
    "Discover Summer, Calmey Crown’s debut novel about unforgotten love, motherhood, family secrets, and the possibility of beginning again.",
  alternates: { canonical: "/summer" },
  openGraph: {
    title: "Summer | Calmey Crown",
    description:
      "A spoiler-light introduction to Summer, a novel by Calmey Crown about unforgotten love and the ties that shape a family.",
    type: "book",
    url: "/summer",
  },
  twitter: {
    card: "summary_large_image",
    title: "Summer | Calmey Crown",
    description:
      "A spoiler-light introduction to Summer, a novel by Calmey Crown about unforgotten love and the ties that shape a family.",
    images: [{ url: "/summer/opengraph-image", alt: "Summer, the debut novel by Calmey Crown" }],
  },
};

export default function SummerPage() {
  return <BookDetailExperience book={SUMMER_BOOK} />;
}
