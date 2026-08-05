"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect } from "react";
import type { Project } from "@/lib/projects";

type Props = {
  project: Project | null;
  onClose: () => void;
};

export default function ProjectDialog({ project, onClose }: Props) {
  const open = project !== null;

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [open, onClose]);

  return (
    <AnimatePresence>
      {open && project && (
        <motion.div
          key="project-dialog"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-[110] flex items-end sm:items-center justify-center bg-black/55 backdrop-blur-sm"
          onClick={onClose}
          role="dialog"
          aria-modal="true"
          aria-labelledby={`project-title-${project.slug}`}
        >
          <motion.div
            key={`panel-${project.slug}`}
            initial={{ opacity: 0, scale: 0.96, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 12 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            onClick={(e) => e.stopPropagation()}
            className="relative w-full sm:max-w-2xl max-h-[92vh] overflow-y-auto bg-surface text-primary border border-border rounded-t-2xl sm:rounded-lg shadow-card"
          >
            <button
              type="button"
              onClick={onClose}
              aria-label="Close"
              className="absolute top-4 right-4 grid place-items-center w-9 h-9 rounded-full text-secondary hover:text-primary hover:bg-background transition-colors"
            >
              <svg width="18" height="18" viewBox="0 0 22 22" fill="none">
                <path
                  d="M5 5l12 12M17 5L5 17"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                />
              </svg>
            </button>

            <div className="px-6 sm:px-8 py-7 sm:py-9">
              <p className="font-mono text-[11px] tracking-[0.14em] uppercase text-secondary">
                {project.period}
                <span className="mx-2 text-tertiary">·</span>
                {project.affiliation}
              </p>

              <h3
                id={`project-title-${project.slug}`}
                className="mt-3 font-display text-primary text-[26px] sm:text-[32px] leading-[1.1]"
              >
                {project.name}
              </h3>

              <p className="mt-3 text-[14px] text-secondary italic">
                {project.oneLiner}
              </p>

              <div className="mt-6 space-y-3 text-[14.5px] leading-[1.65] text-primary">
                {project.summary.map((para, i) => (
                  <p key={i}>{para}</p>
                ))}
              </div>

              <div className="mt-7">
                <p className="font-mono text-[11px] uppercase tracking-[0.12em] text-accent mb-3">
                  Contributions
                </p>
                <ul className="space-y-2">
                  {project.contributions.map((c) => (
                    <li
                      key={c}
                      className="flex gap-3 text-[14px] leading-[1.6] text-primary"
                    >
                      <span
                        aria-hidden
                        className="mt-2 inline-block w-1.5 h-1.5 shrink-0 rounded-full bg-accent"
                      />
                      <span>{c}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {project.outcomes && project.outcomes.length > 0 && (
                <div className="mt-7">
                  <p className="font-mono text-[11px] uppercase tracking-[0.12em] text-accent mb-3">
                    Outcomes
                  </p>
                  <div className="flex flex-wrap gap-x-5 gap-y-2">
                    {project.outcomes.map((o) => (
                      <span
                        key={o}
                        className="font-mono text-[12px] text-primary"
                      >
                        {o}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              <div className="mt-7 flex flex-wrap gap-1.5">
                {project.tags.map((t) => (
                  <span
                    key={t}
                    className="font-mono text-[11px] px-2 py-0.5 rounded-full bg-accent-light text-accent"
                  >
                    {t}
                  </span>
                ))}
              </div>

              {project.externalLinks && project.externalLinks.length > 0 && (
                <div className="mt-7 flex flex-wrap gap-x-5 gap-y-2">
                  {project.externalLinks.map((l) => (
                    <a
                      key={l.href}
                      href={l.href}
                      target="_blank"
                      rel="noreferrer noopener"
                      className="text-[14px] text-accent border-b border-accent/40 hover:border-accent transition-colors"
                    >
                      → {l.label}
                    </a>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
