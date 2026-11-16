"use client";

// Article pages add a calm, readable reading layout and a native share action when supported.
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import SiteFooter from "@/components/SiteFooter";
import SiteHeader from "@/components/SiteHeader";
import { useTheme } from "@/components/ThemeProvider";
import { getReadingMinutes, getRelatedLabels, type BlogPost } from "@/lib/blog-content";

// Browser share support falls back to copying a direct link for desktop visitors.
export default function BlogArticleExperience({ post }: { post: BlogPost }) {
  const { isLightMode } = useTheme();
  const [shareLabel, setShareLabel] = useState("Share story");
  const related = getRelatedLabels(post);

  // Share via the device sheet when available, otherwise copy this article's URL.
  async function shareStory() {
    const shareData = { title: post.title, text: post.dek, url: window.location.href };
    try {
      if (navigator.share) await navigator.share(shareData);
      else {
        await navigator.clipboard.writeText(shareData.url);
        setShareLabel("Link copied ✓");
        window.setTimeout(() => setShareLabel("Share story"), 2200);
      }
    } catch {
      setShareLabel("Share cancelled");
      window.setTimeout(() => setShareLabel("Share story"), 2200);
    }
  }

  return (
    <main className={`site-shell blog-shell ${isLightMode ? "theme-light" : "theme-dark"}`}>
      <a className="portfolio-skip-link" href="#article-content">Skip to article</a>
      <SiteHeader activePage="blog" />
      {/* The article breadcrumb preserves a simple path back to the magazine issue. */}
      <div className="blog-article-topline"><Link href="/blog">← Journal</Link><span>CALMEY CROWN · JOURNAL</span></div>
      <article id="article-content" className="blog-article">
        <header className="blog-article-header">
          <div className="blog-post-kicker"><span>{post.category}</span><span>{getReadingMinutes(post)} min read</span></div>
          <h1>{post.title}</h1>
          <p className="blog-article-dek">{post.dek}</p>
          <div className="blog-article-byline"><span>By Calmey Crown</span><span>{post.publishedAt ? new Date(`${post.publishedAt}T00:00:00Z`).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric", timeZone: "UTC" }) : "Studio journal"}</span><button type="button" onClick={shareStory}>{shareLabel}</button></div>
        </header>
        <figure className="blog-article-hero-image"><Image src={post.image} alt={post.imageAlt} width={1600} height={980} priority sizes="(max-width: 900px) 100vw, 88vw" /><figcaption>{post.imageAlt}</figcaption></figure>
        <div className="blog-article-layout">
          <aside className="blog-article-aside"><span>IN THIS STORY</span><p>{post.title}</p><Link href="/blog">Browse all stories ↗</Link></aside>
          <div className="blog-article-body">
            <p className="blog-article-intro">{post.excerpt}</p>
            {post.body.map((section, index) => <section key={`${post.slug}-section-${index}`}>{section.heading && <h2>{section.heading}</h2>}{section.paragraphs.map((paragraph, paragraphIndex) => <p key={`${post.slug}-paragraph-${index}-${paragraphIndex}`}>{paragraph}</p>)}</section>)}
            {/* Related portfolio links connect each journal piece to its deeper proof pages. */}
            <div className="blog-article-related"><span>RELATED WORK</span>{post.externalLink && <a href={post.externalLink} target="_blank" rel="noreferrer">{post.externalLinkLabel ?? "Open source"} ↗</a>}{related.project && <Link href={`/projects#${related.project.id}`}>{related.project.title} ↗</Link>}{related.skill && <Link href={`/skills#${related.skill.id}`}>{related.skill.title} ↗</Link>}</div>
            {post.relatedProject === "crown-narratives" && related.filmmakingSkill && <p className="blog-article-skill-note">Explore the <Link href={`/skills#${related.filmmakingSkill.id}`}>filmmaking and storytelling ↗</Link></p>}
          </div>
        </div>
      </article>
      <section className="blog-article-next"><p className="section-eyebrow">MORE FROM THE JOURNAL</p><h2>Keep turning the page.</h2><Link className="blog-read-link" href="/blog">Back to all stories <span aria-hidden="true">→</span></Link></section>
      <SiteFooter />
    </main>
  );
}
