"use client";

// Project cards emit only stable project IDs when a visitor opens published proof.
import Image from "next/image";
import Link from "next/link";
import { track } from "@vercel/analytics";
import { useMemo, useState } from "react";
import ProgressiveIntro from "@/components/ProgressiveIntro";
import SiteFooter from "@/components/SiteFooter";
import SiteHeader from "@/components/SiteHeader";
import { useTheme } from "@/components/ThemeProvider";
import { PROJECTS } from "@/lib/portfolio-content";
import type { ProjectCategory } from "@/lib/portfolio-content";
import { useScrollReveal } from "@/components/useScrollReveal";

const filters: Array<{ label: string; value: ProjectCategory | "All" }> = [
  { label: "Everything", value: "All" },
  { label: "Creative work", value: "Creative" },
  { label: "Technology", value: "Technology" },
  { label: "STEM", value: "STEM" },
];

export default function ProjectsExperience() {
  const { isLightMode } = useTheme();
  const [activeFilter, setActiveFilter] = useState<ProjectCategory | "All">("All");
  useScrollReveal("portfolio-reveal", activeFilter);

  const visibleProjects = useMemo(
    () => activeFilter === "All"
      ? PROJECTS
      : PROJECTS.filter((project) => project.category === activeFilter),
    [activeFilter]
  );

  return (
    <main className={`site-shell portfolio-shell projects-shell ${isLightMode ? "theme-light" : "theme-dark"}`}>
      <a className="portfolio-skip-link" href="#projects-content">Skip to content</a>
      <SiteHeader activePage="projects" />

      <section id="projects-content" className="portfolio-page-hero projects-page-hero" aria-labelledby="projects-page-title">
        <ProgressiveIntro
          eyebrow="SELECTED PROJECTS · REAL WORK · WORK IN PROGRESS"
          titlePrefix="Curiosity, made "
          titleAccent="tangible."
          description="A growing portfolio of published stories, creative studies and early-stage builds—each one labeled clearly so you can see what’s finished and what’s still taking shape."
          titleId="projects-page-title"
          descriptionId="projects-page-description"
        />
        <div className="portfolio-hero-footnote">
          <span>{PROJECTS.length} projects and practices</span>
          <span aria-hidden="true">·</span>
          <span>Updated as work develops</span>
        </div>
      </section>

      <section className="projects-collection" aria-labelledby="projects-collection-title">
        <div className="portfolio-section-heading">
          <div>
            <p className="section-eyebrow">THE PORTFOLIO</p>
            <h2 id="projects-collection-title">Built, written, drawn and explored.</h2>
          </div>
          <p>Browse by the kind of work. Early ideas stay marked as early ideas.</p>
        </div>

        <div className="project-filters" role="group" aria-label="Filter projects by category">
          {filters.map((filter) => (
            <button
              key={filter.value}
              type="button"
              className={`project-filter ${activeFilter === filter.value ? "is-active" : ""}`}
              aria-pressed={activeFilter === filter.value}
              onClick={() => setActiveFilter(filter.value)}
            >
              {filter.label}
            </button>
          ))}
        </div>

        <p className="project-result-count" aria-live="polite">
          Showing {visibleProjects.length} {visibleProjects.length === 1 ? "entry" : "entries"}
        </p>

        <div className="portfolio-project-grid">
          {visibleProjects.map((project, index) => (
            <article
              className={`portfolio-project-card portfolio-reveal ${project.gallery ? "has-gallery" : ""}`}
              id={project.id}
              key={project.id}
            >
              {project.gallery ? (
                <div className="project-art-gallery" aria-label="Pencil art collection">
                  {project.gallery.map((artwork) => (
                    <figure key={artwork.src}>
                      <Image
                        src={artwork.src}
                        alt={artwork.alt}
                        width={700}
                        height={960}
                        sizes="(max-width: 700px) 42vw, (max-width: 1050px) 27vw, 16vw"
                      />
                      <figcaption>{artwork.title}</figcaption>
                    </figure>
                  ))}
                </div>
              ) : project.image ? (
                <div className="portfolio-project-image">
                  <Image
                    src={project.image}
                    alt={project.imageAlt ?? ""}
                    width={960}
                    height={620}
                    sizes="(max-width: 700px) 92vw, (max-width: 1050px) 45vw, 40vw"
                  />
                </div>
              ) : (
                <div className="portfolio-project-placeholder" aria-label={`${project.title} project preview placeholder`}>
                  <span className="project-placeholder-mark" aria-hidden="true">{project.title.slice(0, 2).toUpperCase()}</span>
                  <span className="project-placeholder-title">{project.title}</span>
                  <span className="project-placeholder-status">{project.status}</span>
                </div>
              )}

              <div className="portfolio-project-copy">
                <div className="portfolio-project-meta">
                  <span>{project.category}</span>
                  <span>{String(index + 1).padStart(2, "0")}</span>
                </div>
                <h3>{project.title}</h3>
                <p className="portfolio-project-status">{project.status}</p>
                <p className="portfolio-project-description">{project.description}</p>
                {project.collaborator ? (
                  <p className="portfolio-project-collaborator">
                    Recorded with <a href={project.collaborator.href} target="_blank" rel="noreferrer" onClick={() => track("Collaborator Channel Opened", { collaborator: "reassess-teejay" })}>{project.collaborator.name}</a>
                  </p>
                ) : null}
                <p className="portfolio-project-proof"><span aria-hidden="true">✦</span> {project.proof}</p>
                <ul className="portfolio-project-tags" aria-label={`${project.title} topics`}>
                  {project.tags.map((tag) => <li key={tag}>{tag}</li>)}
                </ul>
                {project.audioSrc ? (
                  <audio className="portfolio-audio-player" controls preload="none" aria-label={`Listen to the ${project.title}`}>
                    <source src={project.audioSrc} type="audio/mpeg" />
                    Your browser does not support audio playback.
                  </audio>
                ) : null}
                {project.href ? (
                  project.external ? (
                    <a
                      className="portfolio-project-link"
                      href={project.href}
                      target="_blank"
                      rel="noreferrer"
                      onClick={() => track("Published Project Opened", { project: project.id })}
                    >
                      Open the work <span aria-hidden="true">↗</span>
                    </a>
                  ) : (
                    <Link className="portfolio-project-link" href={project.href}>
                      {project.id === "portfolio-homepage"
                        ? "Visit the homepage"
                        : project.id === "summer"
                          ? "Discover the novel"
                          : "Explore related work"} <span aria-hidden="true">→</span>
                    </Link>
                  )
                ) : project.previewPlaceholder ? (
                  <p className="project-followup-note">Build notes and public previews will appear here as they’re ready.</p>
                ) : null}
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="projects-page-cta" aria-labelledby="projects-cta-title">
        <p className="section-eyebrow">EVERY PROJECT STARTS SOMEWHERE</p>
        <h2 id="projects-cta-title">A work in progress is still a work worth sharing.</h2>
        <p>I’m building, learning and adding detail as each project matures.</p>
        <div className="projects-page-cta-actions">
          <Link className="hero-cta" href="/skills">See the skills behind the work <span aria-hidden="true">→</span></Link>
          <Link className="portfolio-text-link" href="/#contact">Start a conversation <span aria-hidden="true">↗</span></Link>
        </div>
      </section>

      <SiteFooter />
    </main>
  );
}
