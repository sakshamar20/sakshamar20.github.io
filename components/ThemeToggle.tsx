"use client";

import { useEffect, useState } from "react";
import { useTheme } from "next-themes";

export default function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  const isDark = mounted && resolvedTheme === "dark";
  const toggleTheme = () => {
    document.documentElement.classList.add("theme-transitioning");
    setTheme(isDark ? "light" : "dark");
    window.setTimeout(
      () => document.documentElement.classList.remove("theme-transitioning"),
      300
    );
  };

  return (
    <button
      type="button"
      aria-label="Toggle theme"
      onClick={toggleTheme}
      className="relative w-9 h-9 grid place-items-center rounded-full border border-border text-primary hover:border-accent hover:text-accent transition-colors"
    >
      <svg
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
        className={`absolute transition-opacity duration-300 ${
          isDark ? "opacity-100" : "opacity-0"
        }`}
        aria-hidden
      >
        <circle cx="12" cy="12" r="4" stroke="currentColor" strokeWidth="1.5" />
        <path
          d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
      </svg>
      <svg
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
        className={`absolute transition-opacity duration-300 ${
          isDark ? "opacity-0" : "opacity-100"
        }`}
        aria-hidden
      >
        <path
          d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinejoin="round"
        />
      </svg>
    </button>
  );
}
