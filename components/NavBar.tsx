"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import ThemeToggle from "./ThemeToggle";

const items = [
  { label: "Home", href: "/", id: "home" },
  { label: "Work", href: "/work", id: "work" },
  { label: "Photography", href: "/#photography", id: "photography" },
  { label: "Blog", href: "/blog", id: "blog" },
  { label: "Contact", href: "/contact", id: "contact" },
];

const GITHUB_URL = "https://github.com/sakshamar20";
const LINKEDIN_URL = "https://www.linkedin.com/in/saksham-arora15";
const INSTAGRAM_URL = "https://www.instagram.com/highhonshots";

function GitHubIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 22 22" fill="none">
      <path
        d="M11 2.5C6.3 2.5 2.5 6.3 2.5 11c0 3.7 2.4 6.9 5.8 8 .4.1.6-.2.6-.4v-1.5c-2.4.5-2.9-1-2.9-1-.4-.9-1-1.2-1-1.2-.8-.5.1-.5.1-.5.9.1 1.3.9 1.3.9.8 1.3 2 1 2.5.7.1-.6.3-1 .6-1.2-1.9-.2-3.9-1-3.9-4.2 0-.9.3-1.7.9-2.3-.1-.2-.4-1.1.1-2.3 0 0 .7-.2 2.3.9.7-.2 1.4-.3 2.1-.3.7 0 1.4.1 2.1.3 1.6-1.1 2.3-.9 2.3-.9.5 1.2.2 2.1.1 2.3.6.6.9 1.4.9 2.3 0 3.3-2 4-3.9 4.2.3.3.6.8.6 1.6v2.4c0 .2.2.5.6.4 3.4-1.1 5.8-4.3 5.8-8 0-4.7-3.8-8.5-8.5-8.5z"
        stroke="currentColor"
        strokeWidth="1.25"
        fill="none"
      />
    </svg>
  );
}

function LinkedInIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 22 22" fill="none">
      <rect
        x="2.5"
        y="2.5"
        width="17"
        height="17"
        rx="2"
        stroke="currentColor"
        strokeWidth="1.25"
      />
      <path
        d="M7 9.5v6M7 7v.01M10.5 15.5v-6M10.5 12c0-1.4 1-2.5 2.25-2.5S15 10.6 15 12v3.5"
        stroke="currentColor"
        strokeWidth="1.25"
        strokeLinecap="round"
      />
    </svg>
  );
}

function InstagramIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 22 22" fill="none">
      <rect
        x="2.5"
        y="2.5"
        width="17"
        height="17"
        rx="5"
        stroke="currentColor"
        strokeWidth="1.25"
      />
      <circle cx="11" cy="11" r="4.25" stroke="currentColor" strokeWidth="1.25" />
      <circle cx="15.75" cy="6.25" r="0.9" fill="currentColor" />
    </svg>
  );
}

export default function NavBar() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [homeSection, setHomeSection] = useState<"home" | "photography">(
    "home"
  );

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // The home page ("/") hosts both the hero and the photography section, so
  // toggle between those two tabs based on scroll position there.
  useEffect(() => {
    if (pathname !== "/") return;

    const sections = ["hero", "photography"]
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => !!el);
    const visible = new Map<string, number>();

    const observer = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            visible.set(e.target.id, e.intersectionRatio);
          } else {
            visible.delete(e.target.id);
          }
        }
        let bestId = "";
        let bestRatio = 0;
        for (const [id, ratio] of visible) {
          if (ratio > bestRatio) {
            bestRatio = ratio;
            bestId = id;
          }
        }
        if (bestId === "photography") setHomeSection("photography");
        else if (bestId === "hero") setHomeSection("home");
      },
      { threshold: [0.25, 0.5, 0.75] }
    );

    sections.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [pathname]);

  const active =
    pathname === "/"
      ? homeSection
      : pathname.startsWith("/work")
      ? "work"
      : pathname.startsWith("/blog")
      ? "blog"
      : pathname.startsWith("/contact")
      ? "contact"
      : "";

  return (
    <header
      className={[
        "fixed top-0 left-0 right-0 z-50 transition-[background-color,backdrop-filter,border-color] duration-300",
        scrolled
          ? "bg-background/70 backdrop-blur-md border-b border-border/70"
          : "bg-transparent border-b border-transparent",
      ].join(" ")}
    >
      <div className="mx-auto max-w-6xl px-5 md:px-8 h-14 flex items-center justify-between">
        <a
          href="/"
          className="font-mono text-[11px] tracking-[0.16em] uppercase text-secondary hover:text-primary transition-colors"
        >
          <span className="text-primary">Saksham Arora</span>
          {/* <span className="mx-2 text-tertiary">/</span> */}
          {/* <span>Data Scientist</span> */}
        </a>

        <nav className="hidden md:flex items-center gap-7">
          {items.map((it) => {
            const isActive = active === it.id;
            return (
              <a
                key={it.href}
                href={it.href}
                aria-current={isActive ? "true" : undefined}
                className={[
                  "relative font-mono text-[11px] tracking-[0.16em] uppercase transition-colors",
                  isActive ? "text-accent" : "text-secondary hover:text-primary",
                  "after:content-[''] after:absolute after:bottom-[-6px] after:left-0 after:h-px after:bg-accent after:transition-[width] after:duration-300",
                  isActive ? "after:w-full" : "after:w-0 hover:after:w-full",
                ].join(" ")}
              >
                {it.label}
              </a>
            );
          })}
        </nav>

        <div className="hidden md:flex items-center gap-4">
          <a
            href={GITHUB_URL}
            target="_blank"
            rel="noreferrer noopener"
            aria-label="GitHub"
            className="text-secondary hover:text-primary transition-colors"
          >
            <GitHubIcon />
          </a>
          <a
            href={LINKEDIN_URL}
            target="_blank"
            rel="noreferrer noopener"
            aria-label="LinkedIn"
            className="text-secondary hover:text-primary transition-colors"
          >
            <LinkedInIcon />
          </a>
          <a
            href={INSTAGRAM_URL}
            target="_blank"
            rel="noreferrer noopener"
            aria-label="Instagram"
            className="text-secondary hover:text-primary transition-colors"
          >
            <InstagramIcon />
          </a>
          <span className="h-4 w-px bg-border" aria-hidden />
          <ThemeToggle />
        </div>

        <button
          aria-label="Menu"
          aria-expanded={open}
          className="md:hidden flex flex-col gap-[5px] p-2"
          onClick={() => setOpen((v) => !v)}
        >
          <span
            className={`block w-5 h-px bg-primary transition-transform ${
              open ? "translate-y-[6px] rotate-45" : ""
            }`}
          />
          <span
            className={`block w-5 h-px bg-primary transition-opacity ${
              open ? "opacity-0" : "opacity-100"
            }`}
          />
          <span
            className={`block w-5 h-px bg-primary transition-transform ${
              open ? "-translate-y-[6px] -rotate-45" : ""
            }`}
          />
        </button>
      </div>

      {open && (
        <div className="md:hidden border-t border-border bg-background/95 backdrop-blur-md">
          <nav className="px-6 py-4 flex flex-col gap-4">
            {items.map((it) => (
              <a
                key={it.href}
                href={it.href}
                onClick={() => setOpen(false)}
                className={`font-mono text-[12px] tracking-[0.16em] uppercase ${
                  active === it.id ? "text-accent" : "text-primary"
                }`}
              >
                {it.label}
              </a>
            ))}
            <div className="pt-2 flex items-center gap-4">
              <a
                href={GITHUB_URL}
                target="_blank"
                rel="noreferrer noopener"
                aria-label="GitHub"
                className="text-secondary"
              >
                <GitHubIcon />
              </a>
              <a
                href={LINKEDIN_URL}
                target="_blank"
                rel="noreferrer noopener"
                aria-label="LinkedIn"
                className="text-secondary"
              >
                <LinkedInIcon />
              </a>
              <a
                href={INSTAGRAM_URL}
                target="_blank"
                rel="noreferrer noopener"
                aria-label="Instagram"
                className="text-secondary"
              >
                <InstagramIcon />
              </a>
              <ThemeToggle />
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
