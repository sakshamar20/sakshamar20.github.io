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

type OrgLogo = {
  /** Shown in light mode (and in dark mode too, if darkSrc is omitted). */
  src: string;
  /** Light/inverted variant shown in dark mode. */
  darkSrc?: string;
};

type TimelineEntry = {
  year: string;
  org: string;
  role: string;
  bullets: string[];
  badge?: string;
  logo?: OrgLogo;
};

const timeline: TimelineEntry[] = [
  {
    year: "Aug 2026 - Present",
    org: "Purdue University",
    role: "MS Statistics & Computer Science",
    bullets: [
      "Working with Prof. Vaneet Aggarwal on implementation of Bilevel RL in Circular Economy.",
      "Focus on taking coursework in Statistical Learning, Causal Inference, and ML systems etc.",
    ],
    logo: { src: "/logo/purdue.png" },
  },
  {
    year: "Jul 2024 – Aug 2026",
    org: "Flipkart, Bengaluru",
    role: "Business Analyst · Principal Homepage Analyst",
    bullets: [
      "Built A/B + DML causal-inference framework for homepage personalization.",
      "Led a low-propensity homepage launch: +3% page views, +5% homepage revenue.",
      "Real-time XGBoost feed-refresh model; Kafka streaming pipelines for Big Billion Days.",
    ],
    logo: { src: "/logo/flipkart.png" },
  },
  {
    year: "May 2025 – Aug 2025",
    org: "CFA Institute",
    role: "CFA Level 1 — Passed",
    bullets: [
      "Portfolio management: risk/return, CAPM, efficient frontier, and performance attribution.",
      "Fixed income: duration, convexity, yield curves, and credit spread analysis.",
      "Derivatives: forwards, futures, options pricing, and hedging strategies.",
      "Also covered equity valuation, alternatives, economics, and quantitative methods.",
    ],
    logo: { src: "/logo/cfa.png", darkSrc: "/logo/cfa-light.png" },
  },
  {
    year: "Summer 2023",
    org: "University of British Columbia",
    role: "Mitacs Globalink Research Intern",
    bullets: [
      "ML pipeline predicting post-wildfire debris-flow volumes.",
      "Flask + React deployment used to site protective barriers.",
    ],
    logo: { src: "/logo/ubc.png", darkSrc: "/logo/ubc-light.png" },
  },
  {
    year: "2020 – 2024",
    org: "IIT Kanpur",
    role: "B.Tech, Chemical Engineering · Minors in ML & Computer Systems",
    bullets: [
      "GPA 8.7 / 10. National top 1% in JEE Advanced.",
      "Club Head, Photography Club — 30+ members, INR 1L budget.",
    ],
   
    logo: { src: "/logo/iitk.png", darkSrc: "/logo/iitk-light.png" },
  },
];

const recognition: { year: string; label: string }[] = [
  { year: "2025", label: "Kool and the Gang Award, Flipkart" },
  // {
  //   year: "2023",
  //   label: "Gold Medal, Street Photography · Inter-IIT Cultural Meeting",
  // },
  { year: "2023", label: "Mitacs Globalink Research Award" },
  { year: "2024", label: "CFA Level 1 — Passed" },
  { year: "2020", label: "JEE Advanced — National top 1%" },
];

const skillsCols: { title: string; items: string[] }[] = [
  {
    title: "Languages & tools",
    items: [
      "Python",
      "C / C++",
      "R",
      "SQL",
      "MATLAB",
      "Bash",
      "Solidity",
      "Git",
      "Selenium",
    ],
  },
  {
    title: "ML & stats",
    items: [
      "PyTorch",
      "TensorFlow",
      "Scikit-Learn",
      "XGBoost",
      "OpenCV",
      "Pandas",
      "NumPy",
      "Prophet",
      "DML",
    ],
  },
  {
    title: "Systems",
    items: [
      "Django",
      "Flask",
      "React.js",
      "Express.js",
      "PostgreSQL",
      "CUDA",
      "Hyperledger Fabric",
    ],
  },
];

const TRIANGLE_PATTERN = (opacity: number) =>
  encodeURIComponent(
    `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 200 200'>
    <g fill='none' stroke='rgb(204,138,61)' stroke-opacity='${opacity}' stroke-width='1'>
      <polygon points='10,40 60,15 70,75' />
      <polygon points='60,15 130,30 70,75' />
      <polygon points='130,30 180,50 140,90' />
      <polygon points='70,75 140,90 90,140' />
      <polygon points='10,40 70,75 30,130' />
      <polygon points='30,130 90,140 50,185' />
      <polygon points='90,140 160,150 140,190' />
      <polygon points='140,90 180,50 185,135' />
    </g>
  </svg>`
  );

function ProjectCard({
  p,
  i,
  onOpen,
}: {
  p: Project;
  i: number;
  onOpen: (slug: string) => void;
}) {
  const reduceMotion = useReducedMotion();
  const pointerX = useMotionValue(220);
  const pointerY = useMotionValue(120);
  const rotateX = useMotionValue(0);
  const rotateY = useMotionValue(0);
  const smoothX = useSpring(pointerX, { stiffness: 260, damping: 28 });
  const smoothY = useSpring(pointerY, { stiffness: 260, damping: 28 });
  const smoothRotateX = useSpring(rotateX, { stiffness: 220, damping: 24 });
  const smoothRotateY = useSpring(rotateY, { stiffness: 220, damping: 24 });
  const contentX = useTransform(smoothRotateY, [-4, 4], [-3, 3]);
  const contentY = useTransform(smoothRotateX, [-3, 3], [3, -3]);
  const patternX = useTransform(smoothRotateY, [-4, 4], [-10, 10]);
  const patternY = useTransform(smoothRotateX, [-3, 3], [10, -10]);
  const glow = useMotionTemplate`radial-gradient(240px circle at ${smoothX}px ${smoothY}px, rgb(var(--accent) / 0.22), transparent 72%)`;

  const updateTilt = (event: PointerEvent<HTMLButtonElement>) => {
    if (reduceMotion || event.pointerType === "touch") return;

    const bounds = event.currentTarget.getBoundingClientRect();
    const x = event.clientX - bounds.left;
    const y = event.clientY - bounds.top;
    const normalizedX = x / bounds.width - 0.5;
    const normalizedY = y / bounds.height - 0.5;

    pointerX.set(x);
    pointerY.set(y);
    rotateX.set(normalizedY * -6);
    rotateY.set(normalizedX * 8);
  };

  const resetTilt = () => {
    rotateX.set(0);
    rotateY.set(0);
  };

  return (
    <motion.button
      type="button"
      onClick={() => onOpen(p.slug)}
      onPointerMove={updateTilt}
      onPointerLeave={resetTilt}
      onPointerCancel={resetTilt}
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      whileHover={reduceMotion ? undefined : { y: -7, scale: 1.018 }}
      whileTap={reduceMotion ? undefined : { scale: 0.985 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.4, delay: i * 0.07, ease: "easeOut" }}
      aria-label={`Open ${p.name} details`}
      className="group relative block overflow-hidden rounded-lg border border-border bg-surface p-6 text-left shadow-card transition-[border-color,box-shadow] duration-300 hover:border-accent hover:shadow-[0_20px_45px_rgb(0_0_0_/_0.22)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-background"
      style={{
        rotateX: reduceMotion ? 0 : smoothRotateX,
        rotateY: reduceMotion ? 0 : smoothRotateY,
        transformPerspective: 900,
        transformStyle: "preserve-3d",
      }}
    >
      <motion.span
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        style={{ background: glow }}
      />
      <motion.span
        aria-hidden
        className="pointer-events-none absolute -bottom-10 -right-8 h-[260px] w-[260px] bg-[length:260px_260px] bg-no-repeat opacity-40 transition-opacity duration-500 group-hover:opacity-100"
        style={{
          x: reduceMotion ? 0 : patternX,
          y: reduceMotion ? 0 : patternY,
          backgroundImage: `url("data:image/svg+xml;utf8,${TRIANGLE_PATTERN(0.12)}")`,
        }}
      />
      <span
        aria-hidden
        className="pointer-events-none absolute bottom-0 left-1/2 h-[2px] w-0 -translate-x-1/2 bg-accent transition-all duration-500 ease-out group-hover:w-full"
      />
      <motion.div
        className="relative z-10"
        style={{ x: reduceMotion ? 0 : contentX, y: reduceMotion ? 0 : contentY }}
      >
        <p className="font-mono text-[10.5px] tracking-[0.12em] uppercase text-secondary">
          {p.affiliation}
        </p>
        <h3 className="mt-2 font-medium text-[16px] text-primary leading-snug transition-colors duration-300 group-hover:text-accent">
          {p.name}
        </h3>
        <p className="mt-2 text-[14px] text-secondary leading-snug">
          {p.oneLiner}
        </p>
        <div className="mt-5 flex flex-wrap gap-1.5">
          {p.tags.slice(0, 3).map((t) => (
            <span
              key={t}
              className="rounded-full bg-accent-light px-2 py-0.5 font-mono text-[11px] text-accent transition-transform duration-300 group-hover:-translate-y-px"
            >
              {t}
            </span>
          ))}
          {p.tags.length > 3 && (
            <span className="rounded-full px-2 py-0.5 font-mono text-[11px] text-secondary">
              +{p.tags.length - 3}
            </span>
          )}
        </div>
        <div className="mt-6 flex justify-end text-[13px] text-secondary transition-colors duration-300 group-hover:text-accent">
          <span className="inline-flex items-center gap-1 transition-transform duration-300 group-hover:translate-x-1">
            View <span className="transition-transform duration-300 group-hover:-rotate-12">→</span>
          </span>
        </div>
      </motion.div>
    </motion.button>
  );
}

function OrgLogo({ logo, alt }: { logo?: OrgLogo; alt: string }) {
  if (!logo) return null;
  return (
    <span className="relative w-9 h-9 shrink-0 mt-0.5">
      <Image
        src={logo.src}
        alt={`${alt} logo`}
        fill
        sizes="36px"
        className={`object-contain ${logo.darkSrc ? "dark:hidden" : ""}`}
      />
      {logo.darkSrc && (
        <Image
          src={logo.darkSrc}
          alt=""
          aria-hidden
          fill
          sizes="36px"
          className="object-contain hidden dark:block"
        />
      )}
    </span>
  );
}

function TimelineNode({ entry, i }: { entry: TimelineEntry; i: number }) {
  const [hover, setHover] = useState(false);
  return (
    <motion.li
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.35, delay: i * 0.05 }}
      className="relative pl-7 md:pl-8 pb-10 last:pb-0"
    >
      <span
        aria-hidden
        className="absolute left-0 top-1.5 w-2.5 h-2.5 rounded-full bg-accent"
      />
      {hover && (
        <motion.span
          aria-hidden
          key={`pulse-${i}-${hover}`}
          initial={{ scale: 1, opacity: 0.4 }}
          animate={{ scale: 2, opacity: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="absolute left-0 top-1.5 w-2.5 h-2.5 rounded-full bg-accent"
          style={{ transformOrigin: "center" }}
        />
      )}
      <div
        className="flex items-start gap-3 transition-transform duration-300"
        style={{ transform: hover ? "translateX(4px)" : "translateX(0)" }}
      >
        <OrgLogo logo={entry.logo} alt={entry.org} />
        <div className="min-w-0 flex-1">
          <p className="font-mono text-[12px] text-secondary">{entry.year}</p>
          <p className="mt-1 text-[15px] font-medium text-primary">{entry.org}</p>
          <p className="text-[14px] text-secondary">{entry.role}</p>
          <ul className="mt-2 space-y-1 text-[13px] text-primary">
            {entry.bullets.map((b) => (
              <li key={b} className="flex gap-2">
                <span
                  aria-hidden
                  className="mt-2 inline-block h-px w-2 bg-secondary shrink-0"
                />
                <span>{b}</span>
              </li>
            ))}
          </ul>
          {entry.badge && (
            <span className="mt-3 inline-block font-mono text-[11px] px-2 py-1 rounded-md border border-accent/40 text-accent bg-accent-light/60">
              {entry.badge}
            </span>
          )}
        </div>
      </div>
    </motion.li>
  );
}

function CVButton() {
  const [hover, setHover] = useState(false);
  return (
    <a
      href="/resume.pdf"
      target="_blank"
      rel="noopener noreferrer"
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      className="inline-flex items-center gap-2 px-4 py-2 text-[13px] border border-accent text-accent rounded-md hover:bg-accent hover:text-white transition-colors"
    >
      <span>Download CV</span>
      <motion.span
        animate={hover ? { y: [0, 3, 0] } : { y: 0 }}
        transition={{ duration: 0.4, ease: "easeInOut" }}
        className="inline-block"
      >
        ↓
      </motion.span>
    </a>
  );
}

export default function Work() {
  const [openSlug, setOpenSlug] = useState<string | null>(null);
  const openProject = openSlug
    ? projects.find((p) => p.slug === openSlug) ?? null
    : null;

  return (
    <section id="work" className="py-24 md:py-32">
      <div className="mx-auto max-w-6xl px-5 md:px-8">
        <p className="font-mono text-[11px] tracking-[0.12em] uppercase text-accent mb-6">
          Work
        </p>
        <h2 className="font-display text-primary text-[28px] md:text-[36px] mb-10">
          projects.
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {projects.map((p, i) => (
            <ProjectCard key={p.slug} p={p} i={i} onOpen={setOpenSlug} />
          ))}
        </div>

        <div className="mt-20">
          <p className="font-mono text-[11px] tracking-[0.12em] uppercase text-accent mb-6">
            Timeline
          </p>
          <ol className="relative md:pl-6">
            <span
              aria-hidden
              className="absolute left-[5px] md:left-[7px] top-1.5 bottom-1.5 w-px bg-border"
            />
            {timeline.map((entry, i) => (
              <TimelineNode
                key={`${entry.year}-${entry.org}`}
                entry={entry}
                i={i}
              />
            ))}
          </ol>
        </div>

        <div className="mt-16">
          <p className="font-mono text-[11px] tracking-[0.12em] uppercase text-accent mb-4">
            Recognition
          </p>
          <ul className="divide-y divide-border border-y border-border">
            {recognition.map((r, i) => (
              <motion.li
                key={`${r.year}-${r.label}`}
                initial={{ opacity: 0, x: -8 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ duration: 0.3, delay: i * 0.04 }}
                className="flex items-baseline gap-5 py-3"
              >
                <span className="font-mono text-[12px] text-secondary tabular-nums w-12 shrink-0">
                  {r.year}
                </span>
                <span className="text-[14px] text-primary">{r.label}</span>
              </motion.li>
            ))}
          </ul>
        </div>

        <div className="mt-16">
          <p className="font-mono text-[11px] tracking-[0.12em] uppercase text-accent mb-4">
            Skills snapshot
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {skillsCols.map((col, ci) => (
              <motion.div
                key={col.title}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ duration: 0.35, delay: ci * 0.08 }}
              >
                <p className="font-mono text-[10.5px] uppercase tracking-[0.12em] text-secondary mb-3">
                  {col.title}
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {col.items.map((s, si) => (
                    <motion.span
                      key={s}
                      initial={{ opacity: 0, scale: 0.9 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      viewport={{ once: true, margin: "-40px" }}
                      transition={{
                        duration: 0.25,
                        delay: ci * 0.08 + si * 0.025,
                      }}
                      className="font-mono text-[11.5px] px-2.5 py-1 rounded-full border border-border text-primary hover:bg-accent hover:text-white hover:border-accent transition-colors duration-200 cursor-default"
                    >
                      {s}
                    </motion.span>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        <div className="mt-12">
          <CVButton />
        </div>
      </div>

      <ProjectDialog project={openProject} onClose={() => setOpenSlug(null)} />
    </section>
  );
}
