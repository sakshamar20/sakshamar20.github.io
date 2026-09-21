"use client";

import {
  motion,
  useMotionTemplate,
  useMotionValue,
  useReducedMotion,
  useSpring,
  useTransform,
} from "framer-motion";
import Image from "next/image";
import { useState, type PointerEvent } from "react";
import { projects, type Project } from "@/lib/projects";
import ProjectDialog from "./ProjectDialog";

const timeline = [
  {
    period: "Aug 2026 – Present",
    organization: "Purdue University",
    role: "MS Statistics & Computer Science",
    href: "https://www.purdue.edu/",
    logo: "/logo/purdue.png",
  },
  {
    period: "Jul 2024 – Aug 2026",
    organization: "Flipkart, Bengaluru",
    role: "Business Analyst · Principal Homepage Analyst",
    href: "https://www.flipkart.com/",
    logo: "/logo/flipkart.png",
  },
  {
    period: "May 2025 – Aug 2025",
    organization: "CFA Institute",
    role: "CFA Level 1 — Passed",
    href: "https://www.cfainstitute.org/",
    logo: "/logo/cfa.png",
    darkLogo: "/logo/cfa-light.png",
  },
  {
    period: "Summer 2023",
    organization: "University of British Columbia",
    role: "Mitacs Globalink Research Intern",
    href: "https://www.ubc.ca/",
    logo: "/logo/ubc.png",
    darkLogo: "/logo/ubc-light.png",
  },
  {
    period: "2020 – 2024",
    organization: "IIT Kanpur",
    role: "B.Tech, Chemical Engineering · Minors in ML & Computer Systems",
    href: "https://www.iitk.ac.in/",
    logo: "/logo/iitk.png",
    darkLogo: "/logo/iitk-light.png",
  },
];

const recognition = [
  ["2025", "Kool and the Gang Award, Flipkart"],
  ["2023", "Mitacs Globalink Research Award"],
  ["2024", "CFA Level 1 — Passed"],
  ["2020", "JEE Advanced — National top 1%"],
] as const;

const skills = [
  {
    label: "Languages & tools",
    items: ["Python", "C / C++", "R", "SQL", "MATLAB", "Bash", "Solidity", "Git", "Selenium"],
  },
  {
    label: "ML & stats",
    items: ["PyTorch", "TensorFlow", "Scikit-Learn", "XGBoost", "OpenCV", "Pandas", "NumPy", "Prophet", "DML"],
  },
  {
    label: "Systems",
    items: ["Django", "Flask", "React.js", "Express.js", "PostgreSQL", "CUDA", "Hyperledger Fabric"],
  },
];

function ProjectPreviewCard({
  project,
  index,
  onOpen,
}: {
  project: Project;
  index: number;
  onOpen: (slug: string) => void;
}) {
  const reduceMotion = useReducedMotion();
  const pointerX = useMotionValue(160);
  const pointerY = useMotionValue(54);
  const rotateX = useMotionValue(0);
  const rotateY = useMotionValue(0);
  const smoothX = useSpring(pointerX, { stiffness: 260, damping: 28 });
  const smoothY = useSpring(pointerY, { stiffness: 260, damping: 28 });
  const smoothRotateX = useSpring(rotateX, { stiffness: 220, damping: 24 });
  const smoothRotateY = useSpring(rotateY, { stiffness: 220, damping: 24 });
  const contentX = useTransform(smoothRotateY, [-5, 5], [-2, 2]);
  const contentY = useTransform(smoothRotateX, [-4, 4], [2, -2]);
  const glow = useMotionTemplate`radial-gradient(180px circle at ${smoothX}px ${smoothY}px, rgb(var(--accent) / 0.2), transparent 72%)`;

  const updateTilt = (event: PointerEvent<HTMLButtonElement>) => {
    if (reduceMotion || event.pointerType === "touch") return;

    const bounds = event.currentTarget.getBoundingClientRect();
    const x = event.clientX - bounds.left;
    const y = event.clientY - bounds.top;
    const normalizedX = x / bounds.width - 0.5;
    const normalizedY = y / bounds.height - 0.5;

    pointerX.set(x);
    pointerY.set(y);
    rotateX.set(normalizedY * -8);
    rotateY.set(normalizedX * 10);
  };

  const resetTilt = () => {
    rotateX.set(0);
    rotateY.set(0);
  };

  return (
    <motion.button
      type="button"
      onClick={() => onOpen(project.slug)}
      onPointerMove={updateTilt}
      onPointerLeave={resetTilt}
      onPointerCancel={resetTilt}
      initial={{ opacity: 0, y: 8 }}
      whileInView={{ opacity: 1, y: 0 }}
      whileHover={reduceMotion ? undefined : { y: -5, scale: 1.018 }}
      whileTap={reduceMotion ? undefined : { scale: 0.985 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.3, delay: index * 0.035 }}
      style={{
        rotateX: reduceMotion ? 0 : smoothRotateX,
        rotateY: reduceMotion ? 0 : smoothRotateY,
        transformPerspective: 850,
        transformStyle: "preserve-3d",
      }}
      className="group relative min-h-[108px] overflow-hidden rounded-md border border-border bg-surface p-3.5 text-left shadow-[0_1px_0_rgb(var(--primary)_/_0.03)] transition-[border-color,box-shadow] duration-300 ease-out hover:border-accent hover:shadow-[0_16px_38px_rgb(0_0_0_/_0.22)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-background"
      aria-label={`Open ${project.name} details`}
    >
      <motion.span
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        style={{ background: glow }}
      />
      <span
        aria-hidden
        className="pointer-events-none absolute -bottom-7 -right-5 h-20 w-20 rounded-full border border-accent/20 transition-all duration-500 ease-out group-hover:-translate-x-2 group-hover:-translate-y-2 group-hover:scale-125 group-hover:border-accent/40"
      />
      <span
        aria-hidden
        className="pointer-events-none absolute bottom-0 left-0 h-[2px] w-0 bg-accent transition-all duration-500 ease-out group-hover:w-full"
      />
      <span
        aria-hidden
        className="absolute right-3 top-2.5 translate-x-1 -rotate-12 text-[14px] text-accent opacity-0 transition-all duration-300 group-hover:translate-x-0 group-hover:rotate-0 group-hover:opacity-100"
      >
        ↗
      </span>
      <motion.div
        className="relative z-10"
        style={{ x: reduceMotion ? 0 : contentX, y: reduceMotion ? 0 : contentY }}
      >
        <p className="pr-5 font-mono text-[9px] tracking-[0.1em] uppercase text-tertiary line-clamp-1">
          {project.affiliation}
        </p>
        <h3 className="mt-1.5 text-[14px] leading-snug text-primary transition-colors duration-300 group-hover:text-accent">
          {project.name}
        </h3>
        <div className="mt-3 flex flex-wrap gap-1 transition-transform duration-300 group-hover:translate-x-0.5">
          {project.tags.slice(0, 2).map((tag) => (
            <span
              key={tag}
              className="font-mono text-[9px] rounded-full bg-accent-light px-1.5 py-0.5 text-accent transition-transform duration-300 group-hover:-translate-y-px"
            >
              {tag}
            </span>
          ))}
          {project.tags.length > 2 && (
            <span className="font-mono text-[9px] px-1 py-0.5 text-tertiary">
              +{project.tags.length - 2}
            </span>
          )}
        </div>
      </motion.div>
    </motion.button>
  );
}

export default function HomeExperience() {
  const [openSlug, setOpenSlug] = useState<string | null>(null);
  const openProject = openSlug
    ? projects.find((project) => project.slug === openSlug) ?? null
    : null;

  return (
    <section id="experience" className="py-20 md:py-24">
      <div className="mx-auto max-w-6xl px-5 md:px-8">
        <div className="mb-8 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="font-mono text-[11px] tracking-[0.12em] uppercase text-accent mb-3">
              Work
            </p>
            <h2 className="font-display text-primary text-[28px] md:text-[36px]">
              projects &amp; experience.
            </h2>
          </div>
          <a
            href="/work"
            className="w-fit text-[13px] text-accent border-b border-accent/40 hover:border-accent transition-colors"
          >
            Know more →
          </a>
        </div>

        <div className="grid grid-cols-1 min-[700px]:grid-cols-2 gap-8 lg:gap-10 items-start">
          <div>
            <p className="mb-3 font-mono text-[10px] tracking-[0.13em] uppercase text-secondary">
              Projects
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {projects.map((project, index) => (
                <ProjectPreviewCard
                  key={project.slug}
                  project={project}
                  index={index}
                  onOpen={setOpenSlug}
                />
              ))}
            </div>
          </div>

          <div>
            <p className="mb-3 font-mono text-[10px] tracking-[0.13em] uppercase text-secondary">
              Timeline
            </p>
            <ol className="relative border-l border-border">
              {timeline.map((entry, index) => (
                <motion.li
                  key={`${entry.period}-${entry.organization}`}
                  initial={{ opacity: 0, x: 8 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, margin: "-40px" }}
                  transition={{ duration: 0.3, delay: index * 0.04 }}
                  className="relative ml-5 border-b border-border/70 py-3 first:pt-1 last:border-b-0 last:pb-0"
                >
                  <span
                    aria-hidden
                    className="absolute -left-[25px] top-[18px] h-2 w-2 rounded-full bg-accent"
                  />
                  <div className="flex items-start gap-2.5">
                    <a
                      href={entry.href}
                      target="_blank"
                      rel="noreferrer noopener"
                      aria-label={`${entry.organization} website`}
                      className="relative mt-0.5 block h-5 w-5 shrink-0 transition-transform duration-200 hover:scale-110"
                    >
                      <Image
                        src={entry.logo}
                        alt=""
                        fill
                        sizes="20px"
                        className={`object-contain ${entry.darkLogo ? "dark:hidden" : ""}`}
                      />
                      {entry.darkLogo && (
                        <Image
                          src={entry.darkLogo}
                          alt=""
                          aria-hidden
                          fill
                          sizes="20px"
                          className="hidden object-contain dark:block"
                        />
                      )}
                    </a>
                    <div className="flex min-w-0 flex-1 flex-col gap-1 sm:flex-row sm:items-baseline sm:justify-between sm:gap-4">
                      <div className="min-w-0">
                        <h3 className="text-[14px] text-primary">
                          <a
                            href={entry.href}
                            target="_blank"
                            rel="noreferrer noopener"
                            className="transition-colors hover:text-accent"
                          >
                            {entry.organization}
                          </a>
                        </h3>
                        <p className="text-[12px] leading-snug text-secondary">
                          {entry.role}
                        </p>
                      </div>
                      <p className="shrink-0 font-mono text-[10px] text-tertiary sm:text-right">
                        {entry.period}
                      </p>
                    </div>
                  </div>
                </motion.li>
              ))}
            </ol>

            <div className="mt-7">
              <p className="mb-2 font-mono text-[10px] tracking-[0.13em] uppercase text-secondary">
                Recognition
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4">
                {recognition.map(([year, label]) => (
                  <p
                    key={`${year}-${label}`}
                    className="flex gap-2 border-t border-border/70 py-2 text-[11px] leading-snug text-primary"
                  >
                    <span className="font-mono text-tertiary">{year}</span>
                    <span>{label}</span>
                  </p>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 border-t border-border pt-6">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-start">
            <p className="shrink-0 font-mono text-[10px] tracking-[0.13em] uppercase text-secondary lg:w-28">
              Skills
            </p>
            <div className="grid flex-1 grid-cols-1 gap-4 md:grid-cols-3">
              {skills.map((group) => (
                <div key={group.label}>
                  <p className="mb-1.5 font-mono text-[9px] tracking-[0.1em] uppercase text-tertiary">
                    {group.label}
                  </p>
                  <p className="text-[11px] leading-relaxed text-secondary">
                    {group.items.join(" · ")}
                  </p>
                </div>
              ))}
            </div>
            <a
              href="/resume.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className="shrink-0 self-start rounded-md border border-accent px-3 py-1.5 text-[12px] text-accent transition-colors hover:bg-accent hover:text-white"
            >
              Download CV ↓
            </a>
          </div>
        </div>
      </div>

      <ProjectDialog project={openProject} onClose={() => setOpenSlug(null)} />
    </section>
  );
}
