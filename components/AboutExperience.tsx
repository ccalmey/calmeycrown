"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import { useTheme } from "@/components/ThemeProvider";

export default function AboutExperience() {
  const { isLightMode } = useTheme();
  const [typedTitle, setTypedTitle] = useState("");
  const [isTitleTyped, setIsTitleTyped] = useState(false);
  const [typedLede, setTypedLede] = useState("");
  const [isLedeTyped, setIsLedeTyped] = useState(false);

  useEffect(() => {
    const title = "Many interests.One curious mind.";
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const characterDelay = reduceMotion ? 80 : 105;
    let position = 0;
    let timeoutId = 0;

    const typeNextCharacter = () => {
      position += 1;
      setTypedTitle(title.slice(0, position));

      if (position < title.length) {
        timeoutId = window.setTimeout(typeNextCharacter, characterDelay);
      } else {
        setIsTitleTyped(true);
      }
    };

    timeoutId = window.setTimeout(typeNextCharacter, reduceMotion ? 100 : 300);
    return () => window.clearTimeout(timeoutId);
  }, []);

  useEffect(() => {
    if (!isTitleTyped) return;

    const lede =
      "I’m Calmey Crown, a Kenyan multipotentialite drawn to the places where art, technology, storytelling and curiosity meet.";
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const characterDelay = reduceMotion ? 20 : 30;
    let position = 0;
    let timeoutId = 0;

    const typeNextCharacter = () => {
      position += 1;
      setTypedLede(lede.slice(0, position));

      if (position < lede.length) {
        timeoutId = window.setTimeout(typeNextCharacter, characterDelay);
      } else {
        setIsLedeTyped(true);
      }
    };

    timeoutId = window.setTimeout(typeNextCharacter, 180);
    return () => window.clearTimeout(timeoutId);
  }, [isTitleTyped]);

  useEffect(() => {
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduceMotion || !("IntersectionObserver" in window)) return;

    const revealElements = document.querySelectorAll<HTMLElement>(".about-reveal");
    if (revealElements.length === 0) return;

    document.documentElement.classList.add("about-motion-ready");
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.14, rootMargin: "0px 0px -44px 0px" }
    );

    revealElements.forEach((element) => observer.observe(element));

    return () => {
      observer.disconnect();
      document.documentElement.classList.remove("about-motion-ready");
    };
  }, []);

  return (
    <main id="about-main" className={`site-shell about-shell ${isLightMode ? "theme-light" : "theme-dark"}`}>
      <a className="about-skip-link" href="#about-content">Skip to content</a>
      <SiteHeader activePage="about" />

      <section id="about-content" className="about-page-hero" aria-labelledby="about-title">
        <div className="about-page-hero-copy">
          <p className="section-eyebrow">A LITTLE ABOUT ME</p>
          <h1 id="about-title" aria-label="Many interests. One curious mind.">
            <span aria-hidden="true">{typedTitle.slice(0, 15)}</span>
            {!isTitleTyped && typedTitle.length < 15 && (
              <span className="typing-caret" aria-hidden="true" />
            )}
            <br />
            <span className="about-title-accent" aria-hidden="true">{typedTitle.slice(15)}</span>
            {!isTitleTyped && typedTitle.length >= 15 && (
              <span className="typing-caret typing-caret-accent" aria-hidden="true" />
            )}
          </h1>
          <p className="about-page-lede">
            <span className="sr-only">I’m Calmey Crown, a Kenyan multipotentialite drawn to the places where art, technology, storytelling and curiosity meet.</span>
            <span aria-hidden="true">
              {typedLede}
              {!isLedeTyped && isTitleTyped && (
                <span className="typing-caret typing-caret-accent" />
              )}
            </span>
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
          <article className="about-discipline-card about-reveal">
            <span className="about-card-number">01</span>
            <span className="about-card-symbol" aria-hidden="true">⌘</span>
            <h3>Technology &amp; problem solving</h3>
            <p>From Python and web development to cybersecurity, I enjoy understanding how systems work and finding thoughtful ways to make them better.</p>
            <a href="/skills">Explore my skills <span aria-hidden="true">↗</span></a>
          </article>
          <article className="about-discipline-card about-reveal">
            <span className="about-card-number">02</span>
            <span className="about-card-symbol" aria-hidden="true">✳</span>
            <h3>Stories &amp; creative work</h3>
            <p>Writing, filmmaking, voice work, music and visual art let me shape ideas into experiences that can be felt, shared and remembered.</p>
            <a href="/projects">See selected projects <span aria-hidden="true">↗</span></a>
          </article>
          <article className="about-discipline-card about-reveal">
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
          <article className="about-reveal"><span>01</span><h3>Stay curious</h3><p>Ask better questions and remain open to learning from people and disciplines beyond my own.</p></article>
          <article className="about-reveal"><span>02</span><h3>Make something</h3><p>Turn ideas into projects, stories and experiments — and learn from the process.</p></article>
          <article className="about-reveal"><span>03</span><h3>Connect what I learn</h3><p>Look for useful connections between technology, creativity and the needs around me.</p></article>
          <article className="about-reveal"><span>04</span><h3>Share the possibility</h3><p>Help make knowledge, creativity and opportunity feel more accessible to others.</p></article>
        </div>
      </section>

      <section className="about-page-cta" aria-labelledby="about-cta-title">
        <p className="section-eyebrow">THE STORY IS STILL UNFOLDING</p>
        <h2 id="about-cta-title">There&apos;s always another idea worth exploring.</h2>
        <p>If something here resonates, I&apos;d be glad to hear what you&apos;re working on.</p>
        <div className="about-cta-actions">
          <a className="hero-cta" href="/#contact">Let&apos;s Connect <span aria-hidden="true">→</span></a>
          <a className="about-text-link" href="/projects">Explore my projects <span aria-hidden="true">↗</span></a>
        </div>
      </section>

      <SiteFooter />
    </main>
  );
}
