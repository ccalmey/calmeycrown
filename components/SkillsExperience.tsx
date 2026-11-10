"use client";

// This client page can record deliberate clicks on public proof without collecting visitor details.
import Image from "next/image";
import Link from "next/link";
import { track } from "@vercel/analytics";
import ProgressiveIntro from "@/components/ProgressiveIntro";
import SiteFooter from "@/components/SiteFooter";
import SiteHeader from "@/components/SiteHeader";
import SkillIcon from "@/components/SkillIcon";
import { useTheme } from "@/components/ThemeProvider";
import { PENCIL_ARTWORKS, SKILLS } from "@/lib/portfolio-content";
import { useScrollReveal } from "@/components/useScrollReveal";

const skillIcons = {
  python: "python",
  cybersecurity: "cybersecurity",
  "web-development": "web",
  filmmaking: "filmmaking",
  "voice-work": "audio",
  music: "music",
  writing: "writing",
  "space-stem": "space",
} as const;

export default function SkillsExperience() {
  const { isLightMode } = useTheme();
  useScrollReveal();

  return (
    <main className={`site-shell portfolio-shell skills-shell ${isLightMode ? "theme-light" : "theme-dark"}`}>
      <a className="portfolio-skip-link" href="#skills-content">Skip to content</a>
      <SiteHeader activePage="skills" />

      <section id="skills-content" className="portfolio-page-hero skills-page-hero" aria-labelledby="skills-page-title">
        <ProgressiveIntro
          eyebrow="SKILLS · LEARNING · PRACTICE"
          titlePrefix="Skills shaped by "
          titleAccent="doing."
          description="A grounded look at what I’m learning, making and sharing right now—with real projects and creative work behind each interest."
          titleId="skills-page-title"
          descriptionId="skills-page-description"
        />
        <div className="portfolio-hero-footnote">
          <span className="portfolio-live-dot" aria-hidden="true" />
          <span>Proof over labels</span>
          <span aria-hidden="true">·</span>
          <span>Work in progress is marked honestly</span>
        </div>
      </section>

      <section className="pencil-feature-section" aria-labelledby="pencil-feature-title">
        <div className="pencil-feature-copy">
          <p className="section-eyebrow">CREATIVE PRACTICE · SINCE MAY 2025</p>
          <h2 id="pencil-feature-title">Pencil art is becoming part of my practice.</h2>
          <p>
            I started exploring pencil art in May 2025 and have been enjoying the process of
            developing it. Portraits, name art and landscapes give me room to study detail,
            patience and expression.
          </p>
          <div className="pencil-feature-note">
            <span>WHAT&apos;S HERE</span>
            <strong>Six original studies</strong>
            <span>More pieces and commission details can be added as the practice grows.</span>
          </div>
          <Link className="portfolio-text-link" href="/projects#pencil-art">
            View the pencil art collection <span aria-hidden="true">→</span>
          </Link>
        </div>
        <div className="pencil-feature-gallery" aria-label="Selected pencil art studies">
          {PENCIL_ARTWORKS.slice(0, 3).map((artwork) => (
            <figure key={artwork.src}>
              <Image
                src={artwork.src}
                alt={artwork.alt}
                width={720}
                height={960}
                sizes="(max-width: 700px) 28vw, 16vw"
              />
              <figcaption>{artwork.title}</figcaption>
            </figure>
          ))}
        </div>
      </section>

      <section className="skills-proof-section" aria-labelledby="skills-proof-title">
        <div className="portfolio-section-heading">
          <div>
            <p className="section-eyebrow">THE WORK BEHIND THE INTERESTS</p>
            <h2 id="skills-proof-title">A practice in progress.</h2>
          </div>
          <p>These highlights connect each skill to something I’ve made, published, recorded or am actively developing.</p>
        </div>

        <div className="skills-proof-grid">
          {SKILLS.filter((skill) => skill.id !== "pencil-art").map((skill, index) => {
            const icon = skillIcons[skill.id as keyof typeof skillIcons];
            const card = (
              <article className="skill-proof-card portfolio-reveal" id={skill.id} key={skill.id}>
                <div className="skill-proof-topline">
                  <span className="skill-proof-category">{skill.category}</span>
                  <span className="skill-proof-index">{String(index + 2).padStart(2, "0")}</span>
                </div>
                <SkillIcon name={icon} className="skill-proof-icon" aria-hidden="true" />
                <h3>{skill.title}</h3>
                <p>{skill.description}</p>
                {"collaborator" in skill && skill.collaborator ? (
                  <p className="skill-proof-collaborator">
                    Demo collaborator: <a href={skill.collaborator.href} target="_blank" rel="noreferrer" onClick={() => track("Collaborator Channel Opened", { collaborator: "reassess-teejay" })}>{skill.collaborator.name}</a>
                  </p>
                ) : null}
                <div className="skill-proof-footer">
                  <span>{skill.proof}</span>
                  {"external" in skill && skill.external ? (
                    <a
                      href={skill.href}
                      target="_blank"
                      rel="noreferrer"
                      onClick={() => track("Published Work Opened", { skill: skill.id })}
                    >
                      {skill.linkLabel} <span aria-hidden="true">↗</span>
                    </a>
                  ) : (
                    <Link href={skill.href}>{skill.linkLabel} <span aria-hidden="true">→</span></Link>
                  )}
                </div>
              </article>
            );

            return card;
          })}
        </div>
      </section>

      <section className="skills-next-step" aria-labelledby="skills-next-title">
        <div>
          <p className="section-eyebrow">MADE BY LEARNING IN PUBLIC</p>
          <h2 id="skills-next-title">The proof keeps growing.</h2>
          <p>Some work is published; some is still taking shape. I’ll add demos, build notes and new examples as they’re ready to share.</p>
        </div>
        <div className="skills-next-links">
          <Link className="hero-cta" href="/projects">Explore the projects <span aria-hidden="true">→</span></Link>
          <Link className="portfolio-text-link" href="/#contact">Get in touch <span aria-hidden="true">↗</span></Link>
        </div>
      </section>

      <SiteFooter />
    </main>
  );
}
