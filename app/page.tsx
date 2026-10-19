
"use client";

import { useEffect, useRef, useState } from "react";

import SkillIcon from "@/components/SkillIcon";

import { Analytics } from "@vercel/analytics/next"

/*
  ==========================================
  CALMEY CROWN — NAVIGATION CONFIGURATION
  ==========================================

  This is the main list of website sections.

  When we build a new section later, update this
  list with its label and matching HTML ID.

  Example:
  { label: "Projects", href: "#projects" }

  The href must match the section's id.
*/

const navigationLinks = [
  { label: "Home", href: "#home" },
  { label: "About", href: "#about" },
  { label: "Skills", href: "#skills" },
  { label: "Projects", href: "#projects" },
  { label: "Blog", href: "#blog" },
  { label: "Contact", href: "#contact" },
];

/*
  This key is the name of the preference stored
  in the visitor's browser.

  Keep it consistent so their theme is remembered.
*/
const THEME_STORAGE_KEY = "calmey-crown-theme";

export default function Home() {
  /* ==========================================
     1. WEBSITE STATE
     ========================================== */

  // Controls the colour theme. Dark mode is the default.
  const [isLightMode, setIsLightMode] = useState(false);

  // Stops the default theme from overwriting a saved theme
  // before we've had a chance to read the browser storage.
  const [hasLoadedTheme, setHasLoadedTheme] = useState(false);

  // Controls the mobile navigation dropdown.
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Controls whether the command palette is visible.
  const [isPaletteOpen, setIsPaletteOpen] = useState(false);

  // Stores what the visitor types into the palette search.
  const [commandSearch, setCommandSearch] = useState("");

  // Tracks which navigation section is currently active.
  const [activeSection, setActiveSection] = useState("home");

  // Lets us return keyboard focus to the search button
  // after the command palette closes.
  const searchButtonRef = useRef<HTMLButtonElement>(null);


  /* ==========================================
     2. LOAD THE VISITOR'S SAVED THEME
     ========================================== */

  useEffect(() => {
    try {
      const savedTheme = localStorage.getItem(THEME_STORAGE_KEY);

      if (savedTheme === "light") {
        setIsLightMode(true);
      } else if (savedTheme === "dark") {
        setIsLightMode(false);
      }
    } catch {
      // If browser storage is unavailable, keep dark mode.
    } finally {
      setHasLoadedTheme(true);
    }
  }, []);


  /* ==========================================
     3. SAVE THE THEME WHEN IT CHANGES
     ========================================== */

  useEffect(() => {
    // Do not save the default until the old preference
    // has been checked. Otherwise, we might overwrite it.
    if (!hasLoadedTheme) return;

    try {
      localStorage.setItem(
        THEME_STORAGE_KEY,
        isLightMode ? "light" : "dark"
      );
    } catch {
      // The theme still works if storage is unavailable.
    }
  }, [isLightMode, hasLoadedTheme]);


  /* ==========================================
     4. KEYBOARD SHORTCUTS
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
        setIsMenuOpen(false);
      }

      // Escape closes whichever overlay is open.
      if (event.key === "Escape") {
        setIsPaletteOpen(false);
        setIsMenuOpen(false);
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
    const sectionElements = navigationLinks
      .map((link) => document.querySelector(link.href))
      .filter((element): element is Element => element !== null);

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


  /* ==========================================
     6. SMALL REUSABLE ACTIONS
     ========================================== */

  // Close the mobile menu after a visitor selects a link.
  function closeMenu() {
    setIsMenuOpen(false);
  }

  // Open the palette and clear any old search.
  function openPalette() {
    setCommandSearch("");
    setIsPaletteOpen(true);
    setIsMenuOpen(false);
  }

  // Close the palette and return focus to its trigger.
  function closePalette() {
    setIsPaletteOpen(false);
    setCommandSearch("");

    window.setTimeout(() => {
      searchButtonRef.current?.focus();
    }, 0);
  }

  // Change the theme and save it through the effect above.
  function toggleTheme() {
    setIsLightMode((current) => !current);
  }

  /*
    Command actions use this function.

    If a section does not exist yet, the command is
    disabled in the palette instead of sending visitors
    to a broken destination.
  */
  function runNavigationCommand(href: string) {
    const target = document.querySelector(href);

    if (!target) return;

    setActiveSection(href.replace("#", ""));
    setIsPaletteOpen(false);
    setCommandSearch("");
    setIsMenuOpen(false);

    target.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });

    // Update the browser URL's hash without a page reload.
    window.history.replaceState(null, "", href);
  }

  // Keep this check safe during server rendering.
  // Only mark sections as available once their matching HTML IDs exist.
  const availableSectionHrefs = new Set(["#home"]);

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
    ...navigationLinks.map((link) => ({
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
      <header className="site-header">

        {/* LEFT: crown logo and brand name */}
        <a
          className="brand"
          href="#home"
          aria-label="Calmey Crown home"
          onClick={closeMenu}
        >
          <svg
            className="crown-logo"
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

          <span className="brand-name">CALMEY CROWN</span>
        </a>


        {/* DESKTOP: full navigation */}
        <nav
          className="main-nav desktop-nav"
          aria-label="Main navigation"
        >
          {navigationLinks.map((link) => (
            <a
              key={link.href}
              className={`nav-link ${
                activeSection === link.href.slice(1) ? "active" : ""
              }`}
              href={link.href}
              aria-current={
                activeSection === link.href.slice(1)
                  ? "location"
                  : undefined
              }
            >
              {link.label}
            </a>
          ))}
        </nav>


        {/* MOBILE: hamburger button */}
        <button
          className="menu-toggle"
          type="button"
          onClick={() => setIsMenuOpen((current) => !current)}
          aria-label={
            isMenuOpen ? "Close navigation menu" : "Open navigation menu"
          }
          aria-expanded={isMenuOpen}
          aria-controls="mobile-navigation"
        >
          {isMenuOpen ? (
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              aria-hidden="true"
            >
              <path d="M6 6 L18 18 M18 6 L6 18" />
            </svg>
          ) : (
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              aria-hidden="true"
            >
              <path d="M3 6 H21 M3 12 H21 M3 18 H21" />
            </svg>
          )}
        </button>


        {/* RIGHT: contact button */}
        <a
          className="connect-button"
          href="#contact"
          onClick={closeMenu}
        >
          Let&apos;s Connect
        </a>


        {/* SEARCH: opens the hidden command palette */}
        <button
          ref={searchButtonRef}
          className="palette-trigger"
          type="button"
          onClick={openPalette}
          aria-label="Open command palette"
          title="Search commands (Ctrl+K)"
        >
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
        </button>


        {/* FAR RIGHT: saved light/dark theme toggle */}
        <button
          className="theme-icon"
          type="button"
          onClick={toggleTheme}
          aria-label={
            isLightMode ? "Switch to dark mode" : "Switch to light mode"
          }
          aria-pressed={isLightMode}
          title={isLightMode ? "Switch to dark mode" : "Switch to light mode"}
        >
          {isLightMode ? (
            <svg
              key="moon"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.7"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
               <path d="M20.5 14.2A8.5 8.5 0 0 1 9.8 3.5a8.5 8.5 0 1 0 10.7 10.7Z" />

            </svg>
          ) : (
            <svg
              key="sun"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.7"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
               <circle cx="12" cy="12" r="3.5" />
                <path d="M12 2v2 M12 20v2 M4.93 4.93l1.42 1.42 M17.65 17.65l1.42 1.42 M2 12h2 M20 12h2 M4.93 19.07l1.42-1.42 M17.65 6.35l1.42-1.42" />
              </svg>
            )}
        </button>


        {/* MOBILE: dropdown navigation */}
        <nav
          className={`mobile-nav ${isMenuOpen ? "is-open" : ""}`}
          id="mobile-navigation"
          aria-label="Mobile navigation"
          aria-hidden={!isMenuOpen}
        >
          {navigationLinks.map((link) => (
            <a
              key={link.href}
              className={`mobile-nav-link ${
                activeSection === link.href.slice(1) ? "active" : ""
              }`}
              href={link.href}
              aria-current={
                activeSection === link.href.slice(1)
                  ? "location"
                  : undefined
              }
              tabIndex={isMenuOpen ? 0 : -1}
              onClick={closeMenu}
            >
              {link.label}
            </a>
          ))}
        </nav>
      </header>


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

          <h1 id="hero-title">
            Hi, I’m <span className="hero-name">Calmey Crown</span>
          </h1>

          <p className="hero-description">
            I explore ideas, build solutions, create stories and chase
            opportunities across tech, media, space and beyond.
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
      
      {/* MISSION 04: ABOUT ME + SKILLS & INTERESTS */}


      <section className="about-skills-section" id="about">
        {/* LEFT PANEL: ABOUT ME */}
        <div className="about-panel">
          <div className="about-copy">
            <p className="section-eyebrow">ABOUT ME</p>

            <h2>At a Glance</h2>

            <p>
              I&apos;m a Kenyan multipotentialite with a curious mind and a
              deep love for technology, storytelling, and innovation. I enjoy
              building, learning, and creating — from writing and filmmaking
              to coding and cybersecurity.
            </p>

            <p>
              I believe in the power of ideas, the value of skills, and the
              impact of telling African stories that matter.
            </p>

            <div className="about-traits">
              <span><span aria-hidden="true">📍</span> Kenyan</span>
              <span><span aria-hidden="true">✦</span> Creative</span>
              <span><span aria-hidden="true">⚙</span> Problem Solver</span>
              <span><span aria-hidden="true">♜</span> Lifelong Learner</span>
            </div>

            <div className="about-signature" aria-label="Calmey Crown">
              <svg
                className="about-crown"
                viewBox="0 0 48 40"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                aria-hidden="true"
              >
                <path
                  d="M5 11L14 19L23 5L33 19L43 11L39 32H9L5 11Z"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinejoin="round"
                />
                <path
                  d="M10 36H38"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                />
              </svg>
              <span>Calmey Crown</span>
            </div>
          </div>

          
          <div className="about-portrait-column">
            <div className="about-portrait-placeholder">
              <img
                className="about-portrait-image"
                src="/images/calmey-about.jpg"
                alt="Calmey Crown"
              />
            </div>

            <p className="about-portrait-caption">
              The future belongs to those who build it.
            </p>
          </div>
        </div>

        {/* RIGHT PANEL : SKILLS & INTERESTS */}
        <div className="skills-panel" id="skills">
          <div className="skills-heading">
            <p className="section-eyebrow">WHAT I DO</p>
            <h2>Skills &amp; Interests</h2>
            <p>
              I&apos;m not just one thing. I&apos;m a blend of skills,
              interests and passions — and I&apos;m always expanding.
            </p>
          </div>

          <div className="skills-grid">
            <article className="skill-card">
             <SkillIcon name="python" className="skill-icon" />              
             <h3>Python</h3>
              <p>Programming</p>
            </article>

            <article className="skill-card">
            <SkillIcon name="cybersecurity" className="skill-icon" />
              <h3>Cybersecurity</h3>
              <p>&amp; Ethical Hacking</p>
            </article>

            <article className="skill-card">
              <SkillIcon name="web" className="skill-icon" />
              <h3>Web Development</h3>
              <p>Frontend &amp; Backend</p>
            </article>

            <article className="skill-card">
              <SkillIcon name="filmmaking" className="skill-icon" />
              <h3>Filmmaking</h3>
              <p>&amp; Video Editing</p>
            </article>

            <article className="skill-card">
              <SkillIcon name="audio" className="skill-icon" />
              <h3>Voice Work</h3>
              <p>&amp; Audio Production</p>
            </article>

            <article className="skill-card">
              <SkillIcon name="music" className="skill-icon" />
              <h3>Music &amp; Arts</h3>
              <p>Music Talent &amp; Visual Arts</p>
            </article>

            <article className="skill-card">
              <SkillIcon name="space" className="skill-icon" />
              <h3>Space &amp; Astronomy</h3>
            </article>

            <article className="skill-card">
              <SkillIcon name="writing" className="skill-icon" />
              <h3>Writing</h3>
              <p>&amp; Storytelling</p>
            </article>
          </div>
        </div>
      </section>


      {/* ==========================================
          MISSION 05: FEATURED PROJECTS
          ========================================== */}



      <section
        className="projects-section"
        id="projects"
        aria-labelledby="projects-title"
      >
        <div className="projects-intro">
          <p className="section-eyebrow">FEATURED PROJECTS</p>

          <h2 id="projects-title">Things I’ve Built</h2>

          <p>
            From coding experiments to creative productions, here are a few
            things I’m proud of.
          </p>

          <a className="projects-all-link" href="#contact">
            View All Projects <span aria-hidden="true">→</span>
          </a>
        </div>

        <div className="projects-grid">
          <article className="project-card">
            <div className="project-image-wrap">
              <img
                className="project-image"
                src="/images/project-summer.png"
                alt="Summer, the debut novel by Calmey Crown"
                loading="lazy"
              />
            </div>
            <div className="project-card-content">
              <h3>SUMMER (MY DEBUT NOVEL)</h3>
              <p className="project-tags">Writing · Creativity</p>
              <a
                className="project-link"
                href="https://www.kobo.com/ww/en/ebook/summer-257"
                target="_blank"
                rel="noreferrer"
              >
                View SUMMER <span aria-hidden="true">→</span>
              </a>
            </div>
          </article>


          <article className="project-card">
            <div className="project-image-wrap">
              <img
                className="project-image"
                src="/images/project-crown-narratives.jpg"
                alt="Studio microphone ready for recording"
                loading="lazy"
              />
            </div>
            <div className="project-card-content">
              <h3>CROWN NARRATIVES</h3>
              <p className="project-tags">Filmmaking · Voice · Storytelling</p>
              <a className="project-link" href="https://www.youtube.com/@crowncalmey" 
              target="_blank" 
              rel="noreferrer">
                View Crown Narratives <span aria-hidden="true">→</span>
              </a>
            </div>
          </article>


          <article className="project-card">
            <div className="project-image-wrap">
              <img
                className="project-image"
                src="/images/project-odundo.avif"
                alt="Cybersecurity workstation displaying code"
                loading="lazy"
              />
            </div>
            <div className="project-card-content">
              <h3>ODUNDO SECURITY SYSTEM</h3>
              <p className="project-tags">Python · Cybersecurity</p>
              <a className="project-link" href="#contact">
                View Project <span aria-hidden="true">→</span>
              </a>
            </div>
          </article>

          <article className="project-card">
            <div className="project-image-wrap">
              <img
                className="project-image"
                src="/images/project-space.jfif"
                alt="Satellite orbiting above Earth"
                loading="lazy"
              />
            </div>
            <div className="project-card-content">
              <h3>CROWN SPACE SHUTTLE / PROBE</h3>
              <p className="project-tags">Python · Space · STEM</p>
              <a className="project-link" href="#contact">
                View Project <span aria-hidden="true">→</span>
              </a>
            </div>
          </article>
          
        </div>
      </section>
      

      
      {/* ==========================================
          MISSION 06: JOURNEY + FOCUS + CONTACT
         ========================================== */}

      <section
        className="mission-hub"
        aria-label="Journey, journey focus and contact"
      >
        {/* PANEL 1: MY JOURNEY */}
        <div className="journey-panel" id="journey">
          <div className="journey-copy">
            <p className="section-eyebrow">MY JOURNEY</p>
            <h2>The Bigger Picture</h2>

            <p className="journey-description">
              I’m building a future where technology, creativity and
              education create real opportunities — for me, and for
              others, especially young people in Africa.
            </p>

            <a className="journey-cta" href="#about">
              Learn More About My Journey
              <span aria-hidden="true">→</span>
            </a>
          </div>
        </div>

        {/* PANEL 2: JOURNEY FOCUS */}
        <div className="journey-focus-panel">
          <p className="section-eyebrow">WHAT DRIVES ME</p>
          <h2>My Focus</h2>

          <ul className="journey-focus-list">
            <li>
              <span className="journey-icon" aria-hidden="true">
                <svg viewBox="0 0 24 24" fill="none">
                  <path d="M8 8H5V5M5 5L10 10M16 16H19V19M19 19L14 14M14 5H19V10M19 5L14 10M10 14L5 19M5 19V14" />
                </svg>
              </span>
              <span>Coding &amp; Automation</span>
            </li>

            <li>
              <span className="journey-icon" aria-hidden="true">
                <svg viewBox="0 0 24 24" fill="none">
                  <rect x="3" y="6" width="18" height="12" rx="2" />
                  <path d="M7 6L12 11L17 6M12 11V18" />
                </svg>
              </span>
              <span>Creative Media &amp; Filmmaking</span>
            </li>

            <li>
              <span className="journey-icon" aria-hidden="true">
                <svg viewBox="0 0 24 24" fill="none">
                  <path d="M12 3L20 6V11C20 16 16.5 19.5 12 21C7.5 19.5 4 16 4 11V6L12 3Z" />
                  <path d="M9 12L11 14L15 9" />
                </svg>
              </span>
              <span>Cybersecurity &amp; Hacking</span>
            </li>

            <li>
              <span className="journey-icon" aria-hidden="true">
                <svg viewBox="0 0 24 24" fill="none">
                  <circle cx="12" cy="12" r="8" />
                  <ellipse cx="12" cy="12" rx="3.5" ry="8" />
                  <path d="M4.5 8H19.5M4.5 16H19.5" />
                </svg>
              </span>
              <span>Space &amp; Exploration</span>
            </li>

            <li>
              <span className="journey-icon" aria-hidden="true">
                <svg viewBox="0 0 24 24" fill="none">
                  <path d="M3 9L12 4L21 9L12 14L3 9Z" />
                  <path d="M6 11V16L12 20L18 16V11" />
                </svg>
              </span>
              <span>Education &amp; Mentorship</span>
            </li>

            <li>
              <span className="journey-icon" aria-hidden="true">
                <svg viewBox="0 0 24 24" fill="none">
                  <path d="M10 18V5L20 3V16" />
                  <circle cx="7" cy="18" r="3" />
                  <circle cx="17" cy="16" r="3" />
                </svg>
              </span>
              <span>Music &amp; Arts</span>
            </li>
          </ul>
        </div>

        {/* PANEL 3: CONTACT */}
        <div className="contact-panel" id="contact">
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

      <footer className="site-footer">
        <a className="footer-brand" href="#home" aria-label="Calmey Crown home">
          <svg viewBox="0 0 48 40" fill="none" aria-hidden="true">
            <path d="M5 10L15 22L24 3L33 22L43 10L38 34H10L5 10Z" />
            <path d="M10 37H38" />
          </svg>
          <span>CALMEY CROWN</span>
        </a>

        <div className="footer-signature">
          <span>Space</span>
          <span aria-hidden="true">•</span>
          <span>Cybersecurity</span>
          <span aria-hidden="true">•</span>
          <span>STEM</span>
        </div>

        <nav className="footer-nav" aria-label="Footer navigation">
          <a href="#home">Home</a>
          <a href="#about">About</a>
          <a href="#skills">Skills</a>
          <a href="#projects">Projects</a>
          <a href="#blog">Blog</a>
          <a href="#contact">Contact</a>
        </nav>

        <p className="footer-copyright">
          © 2026 Calmey Crown. All Rights Reserved.
        </p>
      </footer>

    </main>
  );
}