"use client";

import { useEffect, useState } from "react";

type ProgressiveTextOptions = {
  enabled?: boolean;
  characterDelay?: number;
  reducedMotionDelay?: number;
  startDelay?: number;
  reducedMotionStartDelay?: number;
};

export function useProgressiveText(
  text: string,
  {
    enabled = true,
    characterDelay = 105,
    reducedMotionDelay = 80,
    startDelay = 300,
    reducedMotionStartDelay = 100,
  }: ProgressiveTextOptions = {}
) {
  const [visibleText, setVisibleText] = useState("");
  const [isComplete, setIsComplete] = useState(false);

  useEffect(() => {
    if (!enabled) return;

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const delay = reduceMotion ? reducedMotionDelay : characterDelay;
    const initialDelay = reduceMotion ? reducedMotionStartDelay : startDelay;
    let position = 0;
    let timeoutId = 0;

    const typeNextCharacter = () => {
      position += 1;
      setVisibleText(text.slice(0, position));

      if (position < text.length) {
        timeoutId = window.setTimeout(typeNextCharacter, delay);
      } else {
        setIsComplete(true);
      }
    };

    if (text.length === 0) {
      setIsComplete(true);
      return;
    }

    timeoutId = window.setTimeout(typeNextCharacter, initialDelay);
    return () => window.clearTimeout(timeoutId);
  }, [characterDelay, enabled, reducedMotionDelay, reducedMotionStartDelay, startDelay, text]);

  return { visibleText, isComplete };
}
