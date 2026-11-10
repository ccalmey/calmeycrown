"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { SITE_NAVIGATION } from "@/lib/site-navigation";
import type { SitePageId } from "@/lib/site-navigation";
import { useTheme } from "@/components/ThemeProvider";

type SiteHeaderProps = {
  activePage: SitePageId;
  activeSection?: string;
  onOpenCommandPalette?: () => void;
};

export default function SiteHeader({
  activePage,
  activeSection,
  onOpenCommandPalette,
}: SiteHeaderProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const { isLightMode, toggleTheme } = useTheme();

  useEffect(() => {
    function handleEscape(event: KeyboardEvent) {
      if (event.key === "Escape" && isMenuOpen) {
        setIsMenuOpen(false);
        menuButtonRef.current?.focus();
      }
    }

    window.addEventListener("keydown", handleEscape);
    return () => window.removeEventListener("keydown", handleEscape);
  }, [isMenuOpen]);

  function closeMenu() {
    setIsMenuOpen(false);
  }

  function isLinkActive(item: (typeof SITE_NAVIGATION)[number]) {
    if (item.id === activePage) return true;
    return activePage === "home" && item.homeSection === activeSection;
  }

  return (
    <header className={`site-header shared-site-header ${onOpenCommandPalette ? "has-command-search" : ""}`}>
      <Link className="brand" href="/#home" aria-label="Calmey Crown home" onClick={closeMenu}>
        <svg className="crown-logo" viewBox="0 0 48 40" fill="none" aria-hidden="true">
          <path d="M5 10L15 22L24 3L33 22L43 10L38 34H10L5 10Z" stroke="currentColor" strokeWidth="2.5" strokeLinejoin="round" />
          <path d="M10 28H38M13 37H35" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
        </svg>
        <span className="brand-name">CALMEY CROWN</span>
      </Link>

      <nav className="main-nav desktop-nav" aria-label="Main navigation">
        {SITE_NAVIGATION.map((item) => (
          <Link
            className={`nav-link ${isLinkActive(item) ? "active" : ""}`}
            href={item.href}
            aria-current={item.id === activePage ? "page" : isLinkActive(item) ? "location" : undefined}
            key={item.id}
            onClick={closeMenu}
          >
            {item.label}
          </Link>
        ))}
      </nav>

      <button
        ref={menuButtonRef}
        className="menu-toggle"
        type="button"
        onClick={() => setIsMenuOpen((open) => !open)}
        aria-label={isMenuOpen ? "Close navigation menu" : "Open navigation menu"}
        aria-expanded={isMenuOpen}
        aria-controls="site-mobile-navigation"
      >
        {isMenuOpen ? (
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" aria-hidden="true">
            <path d="M6 6L18 18M18 6L6 18" />
          </svg>
        ) : (
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" aria-hidden="true">
            <path d="M3 6H21M3 12H21M3 18H21" />
          </svg>
        )}
      </button>

      <Link className="connect-button" href="/#contact" onClick={closeMenu}>Let&apos;s Connect</Link>

      {onOpenCommandPalette && (
        <button
          id="site-command-trigger"
          className="palette-trigger"
          type="button"
          onClick={onOpenCommandPalette}
          aria-label="Open command palette"
          title="Search commands (Ctrl+K)"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" aria-hidden="true">
            <circle cx="10.8" cy="10.8" r="6.8" />
            <path d="m16 16 4.2 4.2" />
          </svg>
        </button>
      )}

      <button
        className="theme-icon"
        type="button"
        onClick={toggleTheme}
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
        id="site-mobile-navigation"
        className={`mobile-nav ${isMenuOpen ? "is-open" : ""}`}
        aria-label="Mobile navigation"
      >
        {SITE_NAVIGATION.map((item) => (
          <Link
            className={`mobile-nav-link ${isLinkActive(item) ? "active" : ""}`}
            href={item.href}
            aria-current={item.id === activePage ? "page" : isLinkActive(item) ? "location" : undefined}
            key={item.id}
            onClick={closeMenu}
          >
            {item.label}
          </Link>
        ))}
      </nav>
    </header>
  );
}
