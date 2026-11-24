import type { Metadata } from "next";
import { notFound, permanentRedirect } from "next/navigation";
import BlogArticleExperience from "@/components/BlogArticleExperience";
import { BLOG_POSTS, LEGACY_BLOG_SLUG_REDIRECTS } from "@/lib/blog-content";

// Pre-render each known article so the initial issue loads as a fast static page.
export function generateStaticParams() {
  return BLOG_POSTS.map((post) => ({ slug: post.slug }));
}

// Article-specific metadata keeps shared links and search previews focused on each story.
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = BLOG_POSTS.find((entry) => entry.slug === slug);
  if (!post) return { title: "Story not found | Calmey Crown" };

  return {
    title: `${post.title} | Calmey Crown Journal`,
    description: post.excerpt,
    alternates: { canonical: `/blog/${post.slug}` },
    openGraph: {
      title: post.title,
      description: post.excerpt,
      type: "article",
      url: `/blog/${post.slug}`,
      images: [{ url: post.image, alt: post.imageAlt }],
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.excerpt,
      images: [{ url: post.image, alt: post.imageAlt }],
    },
  };
}

// Unknown slugs return the site's standard not-found state instead of a blank article.
export default async function BlogArticlePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  // Preserve the old title-based article URL while routing readers to its canonical safe slug.
  const canonicalSlug = LEGACY_BLOG_SLUG_REDIRECTS[slug];
  if (canonicalSlug) permanentRedirect(`/blog/${canonicalSlug}`);

  const post = BLOG_POSTS.find((entry) => entry.slug === slug);
  if (!post) notFound();
  return <BlogArticleExperience post={post} />;
}
