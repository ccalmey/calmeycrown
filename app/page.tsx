
"use client";

import { useEffect, useRef, useState } from "react";

import SkillIcon from "@/components/SkillIcon";

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
                src="/images/calmey-portrait.jpg"
                alt="Calmey Crown"
              />
            </div>

            <p className="about-portrait-caption">
              The future belongs to those who build it.
            </p>
          </div>
        </div>

        {/* RIGHT PANEL: SKILLS & INTERESTS */}
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

    </main>
  );
}
