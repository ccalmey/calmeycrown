"use client";

// The client experience powers quick search, category filters, and a persistent reading list.
import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import ProgressiveIntro from "@/components/ProgressiveIntro";
import SiteFooter from "@/components/SiteFooter";
import SiteHeader from "@/components/SiteHeader";
import { useTheme } from "@/components/ThemeProvider";
import { BLOG_POSTS, getReadingMinutes, type BlogCategory } from "@/lib/blog-content";

// Visitors can scan every post, narrow the issue, or view only saved reading-list entries.
const categories: Array<BlogCategory | "Everything"> = ["Everything", "Stories", "Studio notes", "Process"];
const savedPostsStorageKey = "calmey-blog-saved-posts";

// These small formatters keep dates readable while allowing undated demo posts to remain honest.
function formatDate(date?: string) {
  if (!date) return "Field notes";
  return new Intl.DateTimeFormat("en-GB", { day: "numeric", month: "long", year: "numeric", timeZone: "UTC" })
    .format(new Date(`${date}T00:00:00Z`));
}

export default function BlogExperience() {
  // Theme state mirrors the rest of the portfolio's light and dark visual system.
  const { isLightMode } = useTheme();
  const [activeCategory, setActiveCategory] = useState<BlogCategory | "Everything">("Everything");
  const [searchText, setSearchText] = useState("");
  const [savedOnly, setSavedOnly] = useState(false);
  const [savedSlugs, setSavedSlugs] = useState<string[]>([]);
  const [isSavedListReady, setIsSavedListReady] = useState(false);

  // Read saved items after hydration so the initial server and browser render match.
  useEffect(() => {
    try {
      const stored = window.localStorage.getItem(savedPostsStorageKey);
      if (stored) setSavedSlugs(JSON.parse(stored) as string[]);
    } catch {
      // Browsers that block local storage can still use search and category filters.
    }
    setIsSavedListReady(true);
  }, []);

  // Persist bookmark choices locally; saving never sends visitor data to a service.
  useEffect(() => {
    if (!isSavedListReady) return;
    try {
      window.localStorage.setItem(savedPostsStorageKey, JSON.stringify(savedSlugs));
    } catch {
      // Keep the current session interactive if browser storage is unavailable.
    }
  }, [isSavedListReady, savedSlugs]);

  // Combine title, excerpt, category, and body text so search finds the actual subject matter.
  const visiblePosts = useMemo(() => {
    const query = searchText.trim().toLocaleLowerCase();
    return BLOG_POSTS.filter((post) => {
      const matchesCategory = activeCategory === "Everything" || post.category === activeCategory;
      const matchesSaved = !savedOnly || savedSlugs.includes(post.slug);
      const searchableText = [post.title, post.dek, post.excerpt, post.category,
        ...post.body.flatMap((section) => [section.heading ?? "", ...section.paragraphs])]
        .join(" ").toLocaleLowerCase();
      return matchesCategory && matchesSaved && (!query || searchableText.includes(query));
    });
  }, [activeCategory, savedOnly, savedSlugs, searchText]);

  // Keep the lead post visually dominant and let the remaining entries form the magazine index.
  const [leadPost, ...otherPosts] = BLOG_POSTS;
  const visibleLead = visiblePosts.some((post) => post.slug === leadPost.slug) && !savedOnly && !searchText && activeCategory === "Everything";

  // Toggle a post in the locally stored reading list without changing its article destination.
  function toggleSaved(slug: string) {
    setSavedSlugs((current) => current.includes(slug)
      ? current.filter((savedSlug) => savedSlug !== slug)
      : [...current, slug]);
  }

  return (
    <main className={`site-shell blog-shell ${isLightMode ? "theme-light" : "theme-dark"}`}>
      <a className="portfolio-skip-link" href="#blog-content">Skip to content</a>
      <SiteHeader activePage="blog" />

      {/* The masthead uses the same progressive typing intro as the other portfolio pages. */}
      <section className="blog-masthead" aria-labelledby="blog-page-title">
        <div className="blog-masthead-rule"><span>CALMEY CROWN</span><span>NOTES · IDEAS · MAKING</span></div>
        <ProgressiveIntro
          eyebrow="THE JOURNAL · ISSUE 01"
          titlePrefix="Stories in "
          titleAccent="the making."
          description="A living journal of ideas, creative practice, and the work behind the work."
          titleId="blog-page-title"
          descriptionId="blog-page-description"
          titleDelay={95}
          descriptionDelay={26}
        />
        <div className="blog-masthead-foot"><span>Independent notes from the studio</span><span>{BLOG_POSTS.length} stories to explore</span></div>
      </section>

      <section id="blog-content" className="blog-editorial" aria-label="Blog posts">
        {/* The lead story borrows its content from the homepage update feed and sets the editorial tone. */}
        {visibleLead && (
          <article className="blog-lead-story">
            <Link className="blog-lead-image" href={`/blog/${leadPost.slug}`} aria-label={`Read ${leadPost.title}`}>
              <Image src={leadPost.image} alt={leadPost.imageAlt} width={1440} height={900} priority sizes="(max-width: 900px) 100vw, 62vw" />
              <span className="blog-image-index">01 / THE LEAD</span>
            </Link>
            <div className="blog-lead-copy">
              <div className="blog-post-kicker"><span>{leadPost.category}</span><span>{getReadingMinutes(leadPost)} min read</span></div>
              <h2><Link href={`/blog/${leadPost.slug}`}>{leadPost.title}</Link></h2>
              <p className="blog-lead-dek">{leadPost.dek}</p>
              <p className="blog-lead-excerpt">{leadPost.excerpt}</p>
              <div className="blog-lead-actions">
                <Link className="blog-read-link" href={`/blog/${leadPost.slug}`}>Read the story <span aria-hidden="true">↗</span></Link>
                <button className={`blog-save-button ${savedSlugs.includes(leadPost.slug) ? "is-saved" : ""}`} type="button" onClick={() => toggleSaved(leadPost.slug)} aria-pressed={savedSlugs.includes(leadPost.slug)}>
                  {savedSlugs.includes(leadPost.slug) ? "Saved for later ✓" : "Save for later +"}
                </button>
              </div>
            </div>
          </article>
        )}

        {/* The index bar and controls make even a small first issue feel useful and easy to browse. */}
        <div className="blog-index-heading">
          <div><p className="section-eyebrow">THE LATEST PAGES</p><h2>From the journal</h2></div>
          <p>Thoughts and progress from across the work.</p>
        </div>
        <div className="blog-controls" role="search">
          <label className="blog-search-wrap">
            <span className="sr-only">Search blog posts</span>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" aria-hidden="true"><circle cx="10.8" cy="10.8" r="6.8" /><path d="m16 16 4.2 4.2" /></svg>
            <input value={searchText} onChange={(event) => setSearchText(event.target.value)} placeholder="Search stories and notes" />
          </label>
          <div className="blog-filter-list" role="group" aria-label="Filter posts by category">
            {categories.map((category) => <button key={category} className={activeCategory === category ? "is-active" : ""} type="button" aria-pressed={activeCategory === category} onClick={() => setActiveCategory(category)}>{category}</button>)}
          </div>
          <button className={`blog-reading-list-toggle ${savedOnly ? "is-active" : ""}`} type="button" aria-pressed={savedOnly} onClick={() => setSavedOnly((current) => !current)}>Reading list <span>{savedSlugs.length}</span></button>
        </div>

        {/* Search/filter states replace the lead area with the complete matching set for predictable results. */}
        <p className="blog-results-count" aria-live="polite">Showing {visiblePosts.length} {visiblePosts.length === 1 ? "story" : "stories"}</p>
        {visiblePosts.length ? (
          <div className="blog-card-grid">
            {(visibleLead ? otherPosts.filter((post) => visiblePosts.some((match) => match.slug === post.slug)) : visiblePosts).map((post, index) => (
              <article className="blog-card" key={post.slug}>
                <Link className="blog-card-image" href={`/blog/${post.slug}`} aria-label={`Read ${post.title}`}>
                  <Image src={post.image} alt={post.imageAlt} width={900} height={650} sizes="(max-width: 700px) 92vw, (max-width: 1050px) 44vw, 30vw" />
                  <span className="blog-card-number">0{index + 2}</span>
                </Link>
                <div className="blog-card-copy">
                  <div className="blog-post-kicker"><span>{post.category}</span><span>{getReadingMinutes(post)} min read</span></div>
                  <h3><Link href={`/blog/${post.slug}`}>{post.title}</Link></h3>
                  <p>{post.excerpt}</p>
                  <div className="blog-card-footer"><Link className="blog-read-link" href={`/blog/${post.slug}`}>Read story <span aria-hidden="true">→</span></Link><button className={`blog-save-button ${savedSlugs.includes(post.slug) ? "is-saved" : ""}`} type="button" onClick={() => toggleSaved(post.slug)} aria-pressed={savedSlugs.includes(post.slug)}>{savedSlugs.includes(post.slug) ? "Saved ✓" : "Save +"}</button></div>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className="blog-empty-state"><span aria-hidden="true">✳</span><h3>No stories in this selection yet.</h3><p>Try another category or clear your search. New notes will appear here as the work grows.</p><button type="button" onClick={() => { setActiveCategory("Everything"); setSearchText(""); setSavedOnly(false); }}>Show all stories</button></div>
        )}
      </section>

      {/* A quiet callout links the journal back to the portfolio, keeping the sections interconnected. */}
      <section className="blog-endnote"><p className="section-eyebrow">KEEP EXPLORING</p><h2>Every story starts somewhere.</h2><Link className="blog-read-link" href="/projects">Explore the projects <span aria-hidden="true">↗</span></Link></section>
      <SiteFooter />
    </main>
  );
}
