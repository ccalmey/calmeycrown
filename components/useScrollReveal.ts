"use client";

import { useEffect } from "react";

export function useScrollReveal(className = "portfolio-reveal", refreshKey?: string) {
  useEffect(() => {
    if (
      window.matchMedia("(prefers-reduced-motion: reduce)").matches ||
      !("IntersectionObserver" in window)
    ) {
      return;
    }

    const elements = document.querySelectorAll<HTMLElement>(`.${className}`);
    if (!elements.length) return;

    const rootClass = "portfolio-motion-ready";
    document.documentElement.classList.add(rootClass);
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
    );

    elements.forEach((element) => observer.observe(element));

    return () => {
      observer.disconnect();
      document.documentElement.classList.remove(rootClass);
    };
  }, [className, refreshKey]);
}
