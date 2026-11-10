import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import { ThemeProvider } from "@/components/ThemeProvider";
import "./globals.css";

// Root document owns the shared type, theme, canonical origin, and Vercel page-view tracking.
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.calmeycrown.com"),
  title: "Calmey Crown | Creative Technologist & Storyteller",
  description:
    "Explore the work and ideas of Calmey Crown: creative technology, cybersecurity, storytelling, space and STEM.",
  alternates: { canonical: "/" },
  openGraph: {
    title: "Calmey Crown | Creative Technologist & Storyteller",
    description:
      "Explore the work and ideas of Calmey Crown: creative technology, cybersecurity, storytelling, space and STEM.",
    type: "website",
    siteName: "Calmey Crown",
    url: "/",
  },
  twitter: {
    card: "summary_large_image",
    title: "Calmey Crown | Creative Technologist & Storyteller",
    description:
      "Explore the work and ideas of Calmey Crown: creative technology, cybersecurity, storytelling, space and STEM.",
    images: [{ url: "/opengraph-image", alt: "Calmey Crown — creative technology, storytelling and exploration" }],
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <ThemeProvider>{children}</ThemeProvider>
        <Analytics />
      </body>
    </html>
  );
}
