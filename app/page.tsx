
"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { track } from "@vercel/analytics";

import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import { useTheme } from "@/components/ThemeProvider";
import { SITE_NAVIGATION } from "@/lib/site-navigation";
import { PROJECTS } from "@/lib/portfolio-content";
import { PORTFOLIO_UPDATES } from "@/lib/portfolio-updates";

// The homepage stays intentionally concise: a typed introduction, a short personal bridge,
// a few portfolio-backed highlights, and one direct contact route.
// This fixed order puts published work first, then Crown Narratives, then the art signature.
const FEATURED_PROJECT_IDS = ["summer", "crown-narratives", "pencil-art"];
const featuredProjects = FEATURED_PROJECT_IDS.flatMap((id) => {
  const project = PROJECTS.find((entry) => entry.id === id);
  return project ? [project] : [];
});
const latestUpdates = [...PORTFOLIO_UPDATES]
  .sort((first, second) => (second.date ?? "").localeCompare(first.date ?? ""))
  .slice(0, 3);

export default function Home() {
  /* ==========================================
     1. WEBSITE STATE
     ========================================== */

  const { isLightMode, toggleTheme } = useTheme();

  // Controls whether the command palette is visible.
  const [isPaletteOpen, setIsPaletteOpen] = useState(false);

  // Stores what the visitor types into the palette search.
  const [commandSearch, setCommandSearch] = useState("");

  // Tracks which navigation section is currently active.
  const [activeSection, setActiveSection] = useState("home");

  // Types the full greeting into the hero once when the page loads.
  const [typedTitle, setTypedTitle] = useState("");
  const [isTitleTyped, setIsTitleTyped] = useState(false);
  const [typedDescription, setTypedDescription] = useState("");
  const [isDescriptionTyped, setIsDescriptionTyped] = useState(false);

  useEffect(() => {
    const fullTitle = "Hi, I’m Calmey Crown";
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const characterDelay = 110;

    let position = 0;
    let timeoutId = 0;
    const typeNextCharacter = () => {
      position += 1;
      setTypedTitle(fullTitle.slice(0, position));

      if (position < fullTitle.length) {
        timeoutId = window.setTimeout(typeNextCharacter, characterDelay);
      } else {
        setIsTitleTyped(true);
      }
    };

    timeoutId = window.setTimeout(typeNextCharacter, reduceMotion ? 120 : 300);
    return () => window.clearTimeout(timeoutId);
  }, []);

  useEffect(() => {
    if (!isTitleTyped) return;

    const fullDescription =
      "I explore ideas, build solutions, create stories and chase opportunities across tech, media, space and beyond.";
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const characterDelay = reduceMotion ? 20 : 32;
    let position = 0;
    let timeoutId = 0;

    const typeNextCharacter = () => {
      position += 1;
      setTypedDescription(fullDescription.slice(0, position));

      if (position < fullDescription.length) {
        timeoutId = window.setTimeout(typeNextCharacter, characterDelay);
      } else {
        setIsDescriptionTyped(true);
      }
    };

    timeoutId = window.setTimeout(typeNextCharacter, 180);
    return () => window.clearTimeout(timeoutId);
  }, [isTitleTyped]);


  /* ==========================================
     2. KEYBOARD SHORTCUTS
     ========================================== */

  useEffect(() => {
    function handleGlobalKeyDown(event: KeyboardEvent) {
      // Ctrl + K on Windows/Linux, or Command + K on Mac.
      // This shortcut opens and closes the command palette.
      const shortcutPressed =
        (event.ctrlKey || event.metaKey) &&
        event.key.toLowerCase() === "k";

      if (shortcutPressed) {
        event.preventDefault();
        setIsPaletteOpen((current) => !current);
      }

      // Escape closes whichever overlay is open.
      if (event.key === "Escape") {
        setIsPaletteOpen(false);
      }
    }

    window.addEventListener("keydown", handleGlobalKeyDown);

    // Clean up the listener when the component is removed.
    return () => {
      window.removeEventListener("keydown", handleGlobalKeyDown);
    };
  }, []);


  /* ==========================================
     5. SMART NAVIGATION
     ==========================================

     IntersectionObserver watches the sections as
     they enter the visible part of the screen.

     When a section becomes the best match, its name
     becomes active and the gold underline can follow.

     Sections that have not been built yet are skipped.
  */

  useEffect(() => {
    const sectionElements = SITE_NAVIGATION
      .filter((link) => link.homeSection)
      .map((link) => document.getElementById(link.homeSection!))
      .filter((element): element is HTMLElement => element !== null);

    if (sectionElements.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        // Prefer the visible section with the strongest
        // intersection with the observer's viewing area.
        const visibleSections = entries
          .filter((entry) => entry.isIntersecting)
          .sort(
            (a, b) =>
              b.intersectionRatio - a.intersectionRatio
          );

        if (visibleSections.length > 0) {
          const visibleId = visibleSections[0].target.id;

          if (visibleId) {
            setActiveSection(visibleId);
          }
        }
      },
      {
        // Focus on the middle region of the screen.
        rootMargin: "-20% 0px -55% 0px",
        threshold: [0, 0.1, 0.25, 0.5, 0.75, 1],
      }
    );

    sectionElements.forEach((section) => {
      observer.observe(section);
    });

    // Stop watching when this effect is cleaned up.
    return () => observer.disconnect();
  }, []);

  // Reveal content as it enters view and keep a fine progress cue in sync.
  useEffect(() => {
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const revealElements = document.querySelectorAll<HTMLElement>(".motion-reveal");
    let revealObserver: IntersectionObserver | undefined;

    if (!reduceMotion && "IntersectionObserver" in window) {
      document.documentElement.classList.add("motion-ready");
      revealObserver = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              entry.target.classList.add("is-visible");
              revealObserver?.unobserve(entry.target);
            }
          });
        },
        { threshold: 0.12, rootMargin: "0px 0px -48px 0px" }
      );

      revealElements.forEach((element) => revealObserver?.observe(element));
    }

    let frame = 0;
    const updateProgress = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const scrollableHeight =
          document.documentElement.scrollHeight - window.innerHeight;
        const progress = scrollableHeight > 0 ? window.scrollY / scrollableHeight : 0;
        document.documentElement.style.setProperty(
          "--scroll-progress",
          String(Math.min(1, Math.max(0, progress)))
        );
      });
    };

    updateProgress();
    window.addEventListener("scroll", updateProgress, { passive: true });
    window.addEventListener("resize", updateProgress);

    return () => {
      revealObserver?.disconnect();
      document.documentElement.classList.remove("motion-ready");
      document.documentElement.style.removeProperty("--scroll-progress");
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", updateProgress);
      window.removeEventListener("resize", updateProgress);
    };
  }, []);


  /* ==========================================
     6. SMALL REUSABLE ACTIONS
     ========================================== */

  // Open the palette and clear any old search.
  function openPalette() {
    setCommandSearch("");
    setIsPaletteOpen(true);
  }

  // Close the palette and return focus to its trigger.
  function closePalette() {
    setIsPaletteOpen(false);
    setCommandSearch("");

    window.setTimeout(() => {
      document.getElementById("site-command-trigger")?.focus();
    }, 0);
  }

  /*
    Command actions use this function.

    If a section does not exist yet, the command is
    disabled in the palette instead of sending visitors
    to a broken destination.
  */
  function runNavigationCommand(href: string) {
    if (href.startsWith("/")) {
      window.location.assign(href);
      return;
    }

    const target = document.querySelector(href);

    if (!target) return;

    setActiveSection(href.replace("#", ""));
    setIsPaletteOpen(false);
    setCommandSearch("");

    target.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });

    // Update the browser URL's hash without a page reload.
    window.history.replaceState(null, "", href);
  }

  // Keep this check safe during server rendering.
  // Only mark sections as available once their matching HTML IDs exist.
  const availableSectionHrefs = new Set([
    "/#home",
    "/skills",
    "/projects",
    "/about",
    "/#contact",
  ]);

  function isDestinationAvailable(href: string) {
    return availableSectionHrefs.has(href);
  }


  /* ==========================================
     7. COMMAND PALETTE CONTENT
     ==========================================

     Add more actions here in the future.

     Each action has:
     - label: the name shown to the visitor
     - description: a short explanation
     - keywords: extra words visitors might search
     - action: what happens when selected
     - available: whether the action can run now
  */

  const commandItems = [
    ...SITE_NAVIGATION.map((link) => ({
      label: `Go to ${link.label}`,
      description: `Navigate to the ${link.label} section`,
      keywords: `${link.label} navigation section`,
      action: () => runNavigationCommand(link.href),
      available: isDestinationAvailable(link.href),
    })),

    {
      label: isLightMode ? "Switch to dark mode" : "Switch to light mode",
      description: "Change the website appearance",
      keywords: "theme colour appearance sun moon",
      action: () => {
        toggleTheme();
        closePalette();
      },
      available: true,
    },

    {
      label: "Close command palette",
      description: "Return to the website",
      keywords: "close dismiss cancel exit",
      action: closePalette,
      available: true,
    },
  ];

  // Show only commands matching the visitor's search.
  const filteredCommands = commandItems.filter((command) => {
    const searchableText =
      `${command.label} ${command.description} ${command.keywords}`
        .toLowerCase();

    return searchableText.includes(commandSearch.toLowerCase().trim());
  });


  /* ==========================================
     8. WEBSITE INTERFACE
     ========================================== */

  return (
    <main
      className={`site-shell ${
        isLightMode ? "theme-light" : "theme-dark"
      }`}
      id="home"
    >
      <div className="scroll-progress" aria-hidden="true" />
      <SiteHeader
        activePage="home"
        activeSection={activeSection}
        onOpenCommandPalette={openPalette}
      />


      {/* ==========================================
          COMMAND PALETTE OVERLAY
          Hidden until a visitor asks for it.
          ========================================== */}

      {isPaletteOpen && (
        <div
          className="palette-backdrop"
          onMouseDown={(event) => {
            // Clicking the dark backdrop closes the palette.
            if (event.target === event.currentTarget) {
              closePalette();
            }
          }}
        >
          <section
            className="command-palette"
            role="dialog"
            aria-modal="true"
            aria-labelledby="palette-title"
          >
            {/* Palette heading */}
            <div className="palette-heading">
              <div>
                <h2 id="palette-title">Quick navigation</h2>
                <p>Where would you like to go?</p>
              </div>

              <button
                className="palette-close"
                type="button"
                onClick={closePalette}
                aria-label="Close command palette"
              >
                ×
              </button>
            </div>

            {/* Search field filters the commands below */}
            <div className="palette-search">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                aria-hidden="true"
              >
                <circle cx="10.8" cy="10.8" r="6.8" />
                <path d="m16 16 4.2 4.2" />
              </svg>

              <input
                autoFocus
                type="text"
                value={commandSearch}
                onChange={(event) => setCommandSearch(event.target.value)}
                placeholder="Search pages or actions..."
                aria-label="Search commands"
              />

              <kbd>ESC</kbd>
            </div>

            {/* Matching commands */}
            <div className="palette-results">
              {filteredCommands.length > 0 ? (
                filteredCommands.map((command) => (
                  <button
                    key={command.label}
                    className="palette-command"
                    type="button"
                    disabled={!command.available}
                    onClick={command.action}
                  >
                    <span className="command-marker" aria-hidden="true">
                      {command.label.startsWith("Switch") ? "◐" : "↗"}
                    </span>

                    <span className="command-copy">
                      <span className="command-label">
                        {command.label}
                      </span>

                      <span className="command-description">
                        {command.available
                          ? command.description
                          : "Coming soon — this section is not built yet"}
                      </span>
                    </span>

                    {!command.available && (
                      <span className="command-status">Soon</span>
                    )}
                  </button>
                ))
              ) : (
                <p className="palette-empty">
                  No matching commands. Try another search.
                </p>
              )}
            </div>

            {/* Small keyboard hint at the bottom */}
            <footer className="palette-footer">
              <span><kbd>Ctrl</kbd> + <kbd>K</kbd> to open</span>
              <span><kbd>ESC</kbd> to close</span>
            </footer>
          </section>
        </div>
      )}

      {/* The hero and content sections come next. */}
      
      {/* ==========================================
          MISSION 03: HERO / INTRODUCTION
          ========================================== */}

      <section className="hero-section" aria-labelledby="hero-title">
        <div className="hero-content">
          <p className="hero-eyebrow">
            CREATIVE <span>•</span> TECH <span>•</span> STORYTELLER <span>•</span> EXPLORER
          </p>

          <h1 id="hero-title" aria-label="Hi, I’m Calmey Crown">
            <span className="typing-title-copy" aria-hidden="true">
              {typedTitle.slice(0, 8)}
              {!isTitleTyped && typedTitle.length < 8 && (
                <span className="typing-caret typing-caret-intro" />
              )}
            </span>
            <span className="hero-name typing-name" aria-hidden="true">
              {typedTitle.slice(8)}
              {!isTitleTyped && typedTitle.length >= 8 && (
                <span className="typing-caret typing-caret-accent" />
              )}
            </span>
          </h1>

          <p className="hero-description">
            <span className="sr-only">
              I explore ideas, build solutions, create stories and chase opportunities across tech, media, space and beyond.
            </span>
            <span aria-hidden="true">
              {typedDescription}
              {!isDescriptionTyped && isTitleTyped && (
                <span className="typing-caret typing-caret-accent" />
              )}
            </span>
          </p>

          <p className="hero-motto">
            Part dreamer. Part builder. Always learning.
          </p>

          <a className="hero-cta" href="#about">
            Explore My World <span aria-hidden="true">→</span>
          </a>
        </div>

        <p className="hero-side-statement">
          Different
          <br />
          interests.
          <br />
          One mission.
        </p>

        <div className="hero-signature" aria-label="Space, Cybersecurity and STEM">
          <svg
            className="hero-crown"
            viewBox="0 0 48 40"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
          >
            <path
              d="M5 10 L15 22 L24 3 L33 22 L43 10 L38 34 L10 34 Z"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinejoin="round"
            />
            <path
              d="M10 28 H38 M13 37 H35"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
            />
          </svg>

          <span>Space</span>
          <span className="hero-dot">•</span>
          <span>Cybersecurity</span>
          <span className="hero-dot">•</span>
          <span>STEM</span>
        </div>
      </section>
      
      {/* A compact bridge sends deeper biography and proof to their dedicated pages. */}
      <section className="home-about-bridge motion-reveal" id="about" aria-labelledby="home-about-title">
        <div className="home-about-copy">
          <p className="section-eyebrow">A LITTLE ABOUT ME</p>
          <h2 id="home-about-title">Many interests. One thoughtful practice.</h2>
          <p>I’m Calmey Crown, a Kenyan creator and builder. I move between technology, African storytelling and creative work, learning by making things that can be shared.</p>
        </div>
        <div className="home-about-links">
          <Link className="home-about-link" href="/about">Meet Calmey <span aria-hidden="true">↗</span></Link>
          <Link className="home-about-link" href="/skills">Explore the skills behind the work <span aria-hidden="true">→</span></Link>
        </div>
      </section>

      {/* Cards come from the portfolio catalog so every highlight opens its full project record. */}
      <section className="projects-section home-featured-work" id="projects" aria-labelledby="projects-title">
        <div className="projects-intro motion-reveal">
          <p className="section-eyebrow">SELECTED WORK</p>
          <h2 id="projects-title">Ideas taking shape.</h2>
          <p>Published stories and early builds, with each project’s stage made clear.</p>
          <Link className="projects-all-link" href="/projects">Explore all projects <span aria-hidden="true">→</span></Link>
        </div>
        <div className="projects-grid">
          {featuredProjects.map((project) => (
            <article className="project-card motion-reveal" key={project.id}>
              <div className="project-image-wrap">
                {project.image ? (
                  <img className="project-image" src={project.image} alt={project.imageAlt ?? ""} loading="lazy" />
                ) : (
                  <div className="home-project-placeholder" aria-hidden="true">
                    <span>{project.category}</span>
                    <strong>{project.title}</strong>
                  </div>
                )}
              </div>
              <div className="project-card-content">
                <p className="home-project-status">{project.status}</p>
                <h3>{project.featuredTitle ?? project.title}</h3>
                <p className="project-tags">{project.tags.slice(0, 3).join(" · ")}</p>
                <Link
                  className="project-link"
                  href={project.id === "summer" ? "/summer" : `/projects#${project.id}`}
                  onClick={() => track("Featured Project Clicked", { project: project.id })}
                >
                  Project details <span aria-hidden="true">↗</span>
                </Link>
              </div>
            </article>
          ))}
        </div>
      </section>
      {/* New public milestones are edited as data, then surfaced here in date order. */}
      <section className="home-latest-section" aria-labelledby="home-latest-title">
        <div className="home-latest-heading motion-reveal">
          <p className="section-eyebrow">THE LATEST</p>
          <h2 id="home-latest-title">Fresh from the workbench.</h2>
          <p>New art, episodes and meaningful project milestones, gathered in one place.</p>
        </div>

        {latestUpdates.length > 0 ? (
          <div className="home-updates-grid">
            {latestUpdates.map((update) => (
              <article className="home-update-card motion-reveal" key={update.id}>
                {update.image ? (
                  <div className="home-update-image">
                    <Image
                      src={update.image}
                      alt={update.imageAlt ?? ""}
                      width={960}
                      height={600}
                      sizes="(max-width: 700px) 92vw, (max-width: 1050px) 45vw, 30vw"
                    />
                  </div>
                ) : (
                  <div className="home-update-art-placeholder" aria-hidden="true">
                    <span>{update.kind}</span>
                    <strong>{update.project}</strong>
                  </div>
                )}
                <div className="home-update-copy">
                  <div className="home-update-meta">
                    <span>{update.kind}</span>
                    {update.date ? (
                      <time dateTime={update.date}>
                        {new Date(`${update.date}T00:00:00Z`).toLocaleDateString("en-GB", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                          timeZone: "UTC",
                        })}
                      </time>
                    ) : (
                      <span>Latest</span>
                    )}
                  </div>
                  <p className="home-update-project">{update.project}</p>
                  <h3>{update.title}</h3>
                  <p>{update.description}</p>
                  {update.external ? (
                    <a
                      className="home-update-link"
                      href={update.href}
                      target="_blank"
                      rel="noreferrer"
                      onClick={() => track("Portfolio Update Opened", { update: update.id })}
                    >
                      Open update <span aria-hidden="true">↗</span>
                    </a>
                  ) : (
                    <Link
                      className="home-update-link"
                      href={update.href}
                      onClick={() => track("Portfolio Update Opened", { update: update.id })}
                    >
                      Explore update <span aria-hidden="true">→</span>
                    </Link>
                  )}
                  <div className="home-update-related-links" aria-label="Related portfolio pages">
                    <span>Explore related</span>
                    <Link href={`/projects#${update.projectId}`}>Project</Link>
                    <Link href={`/skills#${update.skillId}`}>Skill</Link>
                  </div>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className="home-updates-empty motion-reveal" role="status">
            <span className="home-updates-pulse" aria-hidden="true" />
            <div>
              <p className="section-eyebrow">NEXT UP</p>
              <h3>The next update is taking shape.</h3>
              <p>When a new artwork, Crown Narratives episode or project milestone is ready to share, it will appear here.</p>
            </div>
          </div>
        )}
      </section>

      <section className="mission-hub home-contact" aria-label="Contact" id="contact">
        <div className="contact-panel motion-reveal">
          <div className="contact-details">
            <p className="section-eyebrow">GET IN TOUCH</p>
            <h2>Let’s Work Together</h2>

            <p className="contact-intro">
              Have a project, collaboration, or just want to say hi?
              I’d love to hear from you.
            </p>

            <a
              className="contact-detail-link"
              href="mailto:ccalmey@gmail.com"
            >
              <span aria-hidden="true">✉</span>
              ccalmey@gmail.com
            </a>

            <p className="contact-detail-link">
              <span aria-hidden="true">⌖</span>
              Nairobi, Kenya
            </p>

            <div className="contact-socials" aria-label="Social media">
              <a
                href="https://www.youtube.com/@crowncalmey"
                target="_blank"
                rel="noreferrer"
                aria-label="YouTube"
              >
                <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                  <path d="M23 7.2a3 3 0 0 0-2.1-2.1C19 4.6 12 4.6 12 4.6s-7 0-8.9.5A3 3 0 0 0 1 7.2 31 31 0 0 0 .5 12a31 31 0 0 0 .5 4.8 3 3 0 0 0 2.1 2.1c1.9.5 8.9.5 8.9.5s7 0 8.9-.5a3 3 0 0 0 2.1-2.1A31 31 0 0 0 23.5 12a31 31 0 0 0-.5-4.8ZM9.5 15.5v-7l6 3.5-6 3.5Z" />
                </svg>
              </a>

              <a
                href="https://www.instagram.com/calmey.art"
                target="_blank"
                rel="noreferrer"
                aria-label="Instagram"
              >
                <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
                  <rect x="3" y="3" width="18" height="18" rx="5" />
                  <circle cx="12" cy="12" r="4" />
                  <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
                </svg>
              </a>

              <a
                href="https://www.facebook.com/crown.calmey"
                target="_blank"
                rel="noreferrer"
                aria-label="Facebook"
              >
                <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                  <path d="M13.5 21v-8h2.7l.4-3.1h-3.1V8c0-.9.3-1.5 1.6-1.5h1.7V3.7c-.8-.1-1.7-.2-2.6-.2-2.6 0-4.4 1.6-4.4 4.5v1.9H7V13h2.8v8h3.7Z" />
                </svg>
              </a>

              <a
                href="https://wa.me/254790971262"
                target="_blank"
                rel="noreferrer"
                aria-label="WhatsApp"
              >
                <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
                  <path d="M20.5 11.8a8.5 8.5 0 0 1-12.6 7.4L3 20.5l1.4-4.7a8.5 8.5 0 1 1 16.1-4Z" />
                  <path d="M8.5 7.8c.2-.5.4-.5.7-.5h.5c.2 0 .4.1.5.4l.8 1.8c.1.2.1.4-.1.6l-.6.7c-.2.2-.2.4-.1.6.6 1 1.4 1.8 2.4 2.3.2.1.4.1.6-.1l.8-.9c.2-.2.4-.2.6-.1l1.7.8c.3.1.4.3.4.5 0 .3-.2 1.3-.8 1.7-.5.4-1.1.6-1.8.4-1-.2-2.3-.8-3.6-1.9-1.1-.9-2-2.1-2.4-3.1-.4-1-.1-1.8.4-2.4Z" />
                </svg>
              </a>
            </div>
          </div>

          <form
            className="contact-form"
            action="mailto:ccalmey@gmail.com"
            method="post"
            encType="text/plain"
          >
            <label className="visually-hidden" htmlFor="contact-name">
              Name
            </label>
            <input
              id="contact-name"
              name="Name"
              type="text"
              placeholder="Name"
              required
            />

            <label className="visually-hidden" htmlFor="contact-email">
              Email
            </label>
            <input
              id="contact-email"
              name="Email"
              type="email"
              placeholder="Email"
              required
            />

            <label className="visually-hidden" htmlFor="contact-message">
              Message
            </label>
            <textarea
              id="contact-message"
              name="Message"
              placeholder="Message"
              rows={4}
              required
            />

            <button type="submit" className="contact-submit">
              Send Message <span aria-hidden="true">→</span>
            </button>

            <p className="contact-form-note">
              Your email app may open to send the message.
            </p>
          </form>
        </div>
      </section>

      {/* ==========================================
          MISSION 07: FOOTER
         ========================================== */}

      <SiteFooter />

    </main>
  );
}
