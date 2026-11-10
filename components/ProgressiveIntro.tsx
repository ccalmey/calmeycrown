"use client";

import { useProgressiveText } from "@/components/useProgressiveText";

type ProgressiveIntroProps = {
  eyebrow: string;
  titlePrefix: string;
  titleAccent: string;
  description: string;
  titleId: string;
  descriptionId: string;
  titleDelay?: number;
  descriptionDelay?: number;
};

export default function ProgressiveIntro({
  eyebrow,
  titlePrefix,
  titleAccent,
  description,
  titleId,
  descriptionId,
  titleDelay = 105,
  descriptionDelay = 30,
}: ProgressiveIntroProps) {
  const fullTitle = `${titlePrefix}${titleAccent}`;
  const title = useProgressiveText(fullTitle, { characterDelay: titleDelay });
  const lede = useProgressiveText(description, {
    enabled: title.isComplete,
    characterDelay: descriptionDelay,
    reducedMotionDelay: Math.min(descriptionDelay, 20),
    startDelay: 180,
    reducedMotionStartDelay: 80,
  });

  return (
    <header className="progressive-page-intro">
      <p className="section-eyebrow">{eyebrow}</p>
      <h1 id={titleId} aria-label={fullTitle}>
        <span aria-hidden="true">{title.visibleText.slice(0, titlePrefix.length)}</span>
        {!title.isComplete && title.visibleText.length < titlePrefix.length && (
          <span className="typing-caret" aria-hidden="true" />
        )}
        <span className="progressive-title-accent" aria-hidden="true">
          {title.visibleText.slice(titlePrefix.length)}
        </span>
        {!title.isComplete && title.visibleText.length >= titlePrefix.length && (
          <span className="typing-caret typing-caret-accent" aria-hidden="true" />
        )}
      </h1>
      <p id={descriptionId} className="progressive-page-description">
        <span className="sr-only">{description}</span>
        <span aria-hidden="true">
          {lede.visibleText}
          {!lede.isComplete && title.isComplete && (
            <span className="typing-caret typing-caret-accent" />
          )}
        </span>
      </p>
    </header>
  );
}
