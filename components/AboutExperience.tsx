"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

const THEME_STORAGE_KEY = "calmey-crown-theme";

const pageLinks = [
  { label: "Home", href: "/#home" },
  { label: "About", href: "/about" },
  { label: "Skills", href: "/#skills" },
  { label: "Projects", href: "/#projects" },
  { label: "Journey", href: "/#journey" },
  { label: "Contact", href: "/#contact" },
];

export default function AboutExperience() {
  const [isLightMode, setIsLightMode] = useState(true);
  const [hasLoadedTheme, setHasLoadedTheme] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    try {
      setIsLightMode(localStorage.getItem(THEME_STORAGE_KEY) !== "dark");
    } catch {
      // Keep the default dark theme when storage is unavailable.
    } finally {
      setHasLoadedTheme(true);
    }
  }, []);

  useEffect(() => {
    if (!hasLoadedTheme) return;

    try {
      localStorage.setItem(THEME_STORAGE_KEY, isLightMode ? "light" : "dark");
    } catch {
      // The theme toggle still works for this visit.
    }
  }, [hasLoadedTheme, isLightMode]);

  function closeMenu() {
    setIsMenuOpen(false);
  }

  return (
    <main className={`site-shell about-shell ${isLightMode ? "theme-light" : "theme-dark"}`}>
      <header className="site-header subpage-header">
        <a className="brand" href="/#home" aria-label="Calmey Crown home" onClick={closeMenu}>
          <svg className="crown-logo" viewBox="0 0 48 40" fill="none" aria-hidden="true">
            <path d="M5 10L15 22L24 3L33 22L43 10L38 34H10L5 10Z" stroke="currentColor" strokeWidth="2.5" strokeLinejoin="round" />
            <path d="M10 28H38M13 37H35" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
          </svg>
          <span className="brand-name">CALMEY CROWN</span>
        </a>

        <nav className="main-nav desktop-nav" aria-label="Main navigation">
          {pageLinks.map((link) => (
            <a
              className={`nav-link ${link.href === "/about" ? "active" : ""}`}
              href={link.href}
              aria-current={link.href === "/about" ? "page" : undefined}
              key={link.href}
            >
              {link.label}
            </a>
          ))}
        </nav>

        <button
          className="menu-toggle"
          type="button"
          onClick={() => setIsMenuOpen((open) => !open)}
          aria-label={isMenuOpen ? "Close navigation menu" : "Open navigation menu"}
          aria-expanded={isMenuOpen}
          aria-controls="about-mobile-navigation"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" aria-hidden="true">
            {isMenuOpen ? <path d="M6 6L18 18M18 6L6 18" /> : <path d="M3 6H21M3 12H21M3 18H21" />}
          </svg>
        </button>

        <a className="connect-button" href="/#contact" onClick={closeMenu}>Let&apos;s Connect</a>

        <button
          className="theme-icon"
          type="button"
          onClick={() => setIsLightMode((light) => !light)}
          aria-label={isLightMode ? "Switch to dark mode" : "Switch to light mode"}
          title={isLightMode ? "Switch to dark mode" : "Switch to light mode"}
        >
          {isLightMode ? (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" aria-hidden="true">
              <path d="M20.2 15.4A8.4 8.4 0 0 1 8.6 3.8 8.5 8.5 0 1 0 20.2 15.4Z" />
            </svg>
          ) : (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" aria-hidden="true">
              <circle cx="12" cy="12" r="4" />
              <path d="M12 2V4M12 20V22M4.93 4.93L6.34 6.34M17.66 17.66L19.07 19.07M2 12H4M20 12H22M4.93 19.07L6.34 17.66M17.66 6.34L19.07 4.93" />
            </svg>
          )}
        </button>

        <nav
          id="about-mobile-navigation"
          className={`mobile-nav ${isMenuOpen ? "is-open" : ""}`}
          aria-label="Mobile navigation"
        >
          {pageLinks.map((link) => (
            <a
              className={`mobile-nav-link ${link.href === "/about" ? "active" : ""}`}
              href={link.href}
              aria-current={link.href === "/about" ? "page" : undefined}
              key={link.href}
              onClick={closeMenu}
            >
              {link.label}
            </a>
          ))}
        </nav>
      </header>

      <section className="about-page-hero" aria-labelledby="about-title">
        <div className="about-page-hero-copy">
          <p className="section-eyebrow">A LITTLE ABOUT ME</p>
          <h1 id="about-title">Many interests.<br /><span>One curious mind.</span></h1>
          <p className="about-page-lede">
            I&apos;m Calmey Crown, a Kenyan multipotentialite drawn to the places where art, technology,
            storytelling and curiosity meet.
          </p>
          <div className="about-page-meta" aria-label="Based in Nairobi, Kenya">
            <span className="about-meta-dot" aria-hidden="true" />
            <span>Based in Nairobi, Kenya</span>
            <span className="about-meta-divider" aria-hidden="true">/</span>
            <span>Always learning</span>
          </div>
        </div>

        <figure className="about-page-portrait">
          <Image
            src="/images/calmey-about.jpg"
            alt="Calmey Crown"
            width={720}
            height={960}
            priority
            sizes="(max-width: 760px) 84vw, 38vw"
          />
          <figcaption><span>Curiosity in motion</span><span>01 / 04</span></figcaption>
        </figure>
        <span className="about-hero-index" aria-hidden="true">ABOUT&nbsp; / &nbsp;01</span>
      </section>

      <section className="about-page-intro" aria-labelledby="multipotentialite-title">
        <div className="about-intro-heading">
          <p className="section-eyebrow">NOT ONE LANE</p>
          <h2 id="multipotentialite-title">I&apos;m at my best when I can <span>connect the dots.</span></h2>
        </div>
        <div className="about-intro-copy">
          <p>
            Multipotentiality is the freedom to follow more than one meaningful interest. For me,
            it means moving between code, stories, creative media and big questions about the
            universe — then letting each field sharpen how I see the others.
          </p>
          <p>
            I don&apos;t think of these interests as competing paths. They&apos;re different ways of
            understanding people, solving problems and making ideas real. The common thread is
            curiosity, and the desire to keep learning by doing.
          </p>
        </div>
      </section>

      <section className="about-page-disciplines" aria-labelledby="disciplines-title">
        <div className="about-section-heading">
          <div>
            <p className="section-eyebrow">A FEW OF MY WORLDS</p>
            <h2 id="disciplines-title">Different disciplines, shared curiosity.</h2>
          </div>
          <p>Each interest gives me another way to learn, create and contribute.</p>
        </div>

        <div className="about-discipline-grid">
          <article className="about-discipline-card">
            <span className="about-card-number">01</span>
            <span className="about-card-symbol" aria-hidden="true">⌘</span>
            <h3>Technology &amp; problem solving</h3>
            <p>From Python and web development to cybersecurity, I enjoy understanding how systems work and finding thoughtful ways to make them better.</p>
            <a href="/#skills">Explore my skills <span aria-hidden="true">↗</span></a>
          </article>
          <article className="about-discipline-card">
            <span className="about-card-number">02</span>
            <span className="about-card-symbol" aria-hidden="true">✳</span>
            <h3>Stories &amp; creative work</h3>
            <p>Writing, filmmaking, voice work, music and visual art let me shape ideas into experiences that can be felt, shared and remembered.</p>
            <a href="/#projects">See selected projects <span aria-hidden="true">↗</span></a>
          </article>
          <article className="about-discipline-card">
            <span className="about-card-number">03</span>
            <span className="about-card-symbol" aria-hidden="true">✧</span>
            <h3>Space, STEM &amp; possibility</h3>
            <p>I&apos;m drawn to exploration and the questions that stretch our sense of what is possible — and to making those ideas welcoming to more people.</p>
            <a href="/#journey">What drives me <span aria-hidden="true">↗</span></a>
          </article>
        </div>
      </section>

      <section className="about-page-perspective" aria-labelledby="perspective-title">
        <div className="about-perspective-mark" aria-hidden="true">✳</div>
        <div className="about-perspective-copy">
          <p className="section-eyebrow">ROOTED HERE, LOOKING OUTWARD</p>
          <h2 id="perspective-title">The stories we tell shape the futures we can imagine.</h2>
          <p>
            I&apos;m proud to be Kenyan, and I care about telling African stories with imagination
            and depth. I&apos;m interested in how technology, creativity and education can open
            meaningful opportunities — especially for young people across Africa.
          </p>
          <a className="about-text-link" href="/#contact">Let&apos;s start a conversation <span aria-hidden="true">→</span></a>
        </div>
        <div className="about-perspective-note">
          <span>MY NORTH STAR</span>
          <p>Build with curiosity.<br />Create with purpose.<br />Keep the door open.</p>
        </div>
      </section>

      <section className="about-page-practice" aria-labelledby="practice-title">
        <div className="about-section-heading">
          <div>
            <p className="section-eyebrow">HOW I APPROACH THE WORK</p>
            <h2 id="practice-title">Curiosity becomes useful when you put it to work.</h2>
          </div>
        </div>
        <div className="about-practice-list">
          <article><span>01</span><h3>Stay curious</h3><p>Ask better questions and remain open to learning from people and disciplines beyond my own.</p></article>
          <article><span>02</span><h3>Make something</h3><p>Turn ideas into projects, stories and experiments — and learn from the process.</p></article>
          <article><span>03</span><h3>Connect what I learn</h3><p>Look for useful connections between technology, creativity and the needs around me.</p></article>
          <article><span>04</span><h3>Share the possibility</h3><p>Help make knowledge, creativity and opportunity feel more accessible to others.</p></article>
        </div>
      </section>

      <section className="about-page-cta" aria-labelledby="about-cta-title">
        <p className="section-eyebrow">THE STORY IS STILL UNFOLDING</p>
        <h2 id="about-cta-title">There&apos;s always another idea worth exploring.</h2>
        <p>If something here resonates, I&apos;d be glad to hear what you&apos;re working on.</p>
        <div className="about-cta-actions">
          <a className="hero-cta" href="/#contact">Let&apos;s Connect <span aria-hidden="true">→</span></a>
          <a className="about-text-link" href="/#projects">Explore my projects <span aria-hidden="true">↗</span></a>
        </div>
      </section>

      <footer className="site-footer about-site-footer">
        <a className="footer-brand" href="/#home" aria-label="Calmey Crown home">
          <svg viewBox="0 0 48 40" fill="none" aria-hidden="true">
            <path d="M5 10L15 22L24 3L33 22L43 10L38 34H10L5 10Z" />
            <path d="M10 37H38" />
          </svg>
          <span>CALMEY CROWN</span>
        </a>
        <p>Space <span aria-hidden="true">·</span> Cybersecurity <span aria-hidden="true">·</span> STEM</p>
        <a href="/#home">Back to home <span aria-hidden="true">↑</span></a>
        <small>© 2026 Calmey Crown</small>
      </footer>
    </main>
  );
}
