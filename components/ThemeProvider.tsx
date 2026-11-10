"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";
import type { ReactNode } from "react";

const THEME_STORAGE_KEY = "calmey-crown-theme";

type ThemeContextValue = {
  isLightMode: boolean;
  toggleTheme: () => void;
};

const ThemeContext = createContext<ThemeContextValue | null>(null);

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [isLightMode, setIsLightMode] = useState(true);
  const [hasLoadedTheme, setHasLoadedTheme] = useState(false);

  useEffect(() => {
    try {
      setIsLightMode(localStorage.getItem(THEME_STORAGE_KEY) !== "dark");
    } catch {
      setIsLightMode(true);
    } finally {
      setHasLoadedTheme(true);
    }
  }, []);

  useEffect(() => {
    if (!hasLoadedTheme) return;

    try {
      localStorage.setItem(THEME_STORAGE_KEY, isLightMode ? "light" : "dark");
    } catch {
      // The selected theme still applies for the current visit.
    }
  }, [hasLoadedTheme, isLightMode]);

  const value = useMemo(
    () => ({
      isLightMode,
      toggleTheme: () => setIsLightMode((current) => !current),
    }),
    [isLightMode]
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) throw new Error("useTheme must be used inside ThemeProvider");
  return context;
}
