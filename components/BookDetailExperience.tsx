"use client";

// Reusable book detail surface keeps story copy separate from the UI for future titles.
import Image from "next/image";
import Link from "next/link";
import { track } from "@vercel/analytics";
import ProgressiveIntro from "@/components/ProgressiveIntro";
import SiteFooter from "@/components/SiteFooter";
import SiteHeader from "@/components/SiteHeader";
import { useTheme } from "@/components/ThemeProvider";
import type { BookPageContent } from "@/content/books/types";

export default function BookDetailExperience({ book }: { book: BookPageContent }) {
  const { isLightMode } = useTheme();

  return (
    <main className={`site-shell portfolio-shell book-shell ${isLightMode ? "theme-light" : "theme-dark"}`}>
      <a className="portfolio-skip-link" href="#book-content">Skip to book details</a>
      <SiteHeader activePage="projects" />

      <article id="book-content">
        <section className="summer-book-hero" aria-labelledby="summer-book-title">
          <div className="summer-book-copy">
            <Link className="summer-book-breadcrumb" href={book.projectHref}>← Back to projects</Link>
            <ProgressiveIntro
              eyebrow="DEBUT NOVEL · A CALMEY CROWN STORY"
              titlePrefix=""
              titleAccent={book.title}
              description={book.teaser}
              titleId="summer-book-title"
              descriptionId="summer-book-teaser"
              titleDelay={115}
              descriptionDelay={35}
            />
            <p className="summer-book-byline">A novel by {book.author}</p>
            <p className="summer-book-tagline">“{book.tagline}”</p>
            <a
              className="hero-cta summer-retailer-cta"
              href={book.retailerUrl}
              target="_blank"
              rel="noreferrer"
              onClick={() => track("Book Retailer Opened", { book: book.slug, retailer: book.retailer.toLowerCase() })}
            >
              Read Summer on {book.retailer} <span aria-hidden="true">↗</span>
            </a>
            <div className="summer-book-related-links">
              <Link href={book.projectHref}>Project details</Link>
              <Link href={book.skillHref}>Writing &amp; storytelling</Link>
            </div>
          </div>

          <figure className="summer-book-cover">
            <Image
              src={book.coverImage}
              alt={book.coverAlt}
              width={1536}
              height={1024}
              sizes="(max-width: 700px) 92vw, (max-width: 1050px) 48vw, 44vw"
              priority
            />
            <figcaption>Summer · {book.author}</figcaption>
          </figure>
        </section>

        <section className="summer-book-synopsis" aria-labelledby="summer-synopsis-title">
          <div className="summer-synopsis-heading">
            <p className="section-eyebrow">THE STORY</p>
            <h2 id="summer-synopsis-title">A past that never quite stayed there.</h2>
          </div>
          <div className="summer-synopsis-copy">
            {book.synopsis.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
            <div className="summer-book-themes" aria-label="Themes in Summer">
              {book.themes.map((theme) => <span key={theme}>{theme}</span>)}
            </div>
          </div>
        </section>

        <section className="summer-book-endnote" aria-label="Book details and call to action">
          <div>
            <p className="section-eyebrow">WHEN THE PAST CALLS</p>
            <h2>Some stories stay with you.</h2>
            <p>Follow Elena’s story and discover where an unforgotten love can lead.</p>
          </div>
          <a
            className="hero-cta"
            href={book.retailerUrl}
            target="_blank"
            rel="noreferrer"
            onClick={() => track("Book Retailer Opened", { book: book.slug, retailer: book.retailer.toLowerCase() })}
          >
            Find the book on {book.retailer} <span aria-hidden="true">↗</span>
          </a>
        </section>
      </article>

      <SiteFooter />
    </main>
  );
}
