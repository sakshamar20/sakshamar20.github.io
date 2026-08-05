"use client";

import { motion } from "framer-motion";

const skillGroups = [
  {
    label: "Languages",
    items: ["Python", "R", "SQL", "C/C++", "MATLAB", "Bash", "Solidity"],
  },
  {
    label: "ML & Data",
    items: [
      "PyTorch",
      "TensorFlow",
      "Scikit-Learn",
      "XGBoost",
      "Pandas",
      "NumPy",
      "Prophet",
      "OpenCV",
      "DML",
    ],
  },
  {
    label: "Systems",
    items: [
      "Django",
      "Flask",
      "React.js",
      "Express.js",
      "PostgreSQL",
      "CUDA",
      "Hyperledger Fabric",
      "Git",
    ],
  },
];

export default function About() {
  return (
    <motion.section
      id="about"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="py-24 md:py-32"
    >
      <div className="mx-auto max-w-[900px] px-5 md:px-8 grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-14 items-start">
        <div>
          <p className="font-mono text-[11px] tracking-[0.12em] uppercase text-accent mb-6">
            About
          </p>
          <div className="space-y-4 text-[15px] leading-relaxed text-primary">
            <p>
              I&apos;m a data scientist who thinks in distributions and a
              photographer who thinks in light. At Flipkart I work on
              homepage personalization — A/B experimentation, Double Machine
              Learning for unbiased treatment effects, and a real-time
              XGBoost feed-refresh model that survives Big Billion Day
              traffic.
            </p>
            <p>
              Before that I researched debris-flow prediction at UBC under
              the Mitacs Globalink program, built a Mistral-7B knowledge
              graph for NCERT curriculum at IIT Kanpur, and wrote a CUDA
              particle simulator that pushes a million particles in real
              time. Two pursuits, same instinct: notice the signal, respect
              the noise, frame what matters.
            </p>
            <p>
              I studied Chemical Engineering at IIT Kanpur with minors in
              Machine Learning and Computer Systems, and am headed to Purdue
              for an MS in Statistics &amp; Computer Science.
            </p>
          </div>

          <div className="mt-8 border-l-2 border-accent pl-4 space-y-1.5">
            <p className="text-[14px] text-primary">
              <span className="font-mono text-[12px] text-secondary">
                Working on —{" "}
              </span>
              <span>
                A/B experimentation &amp; causal inference (DML) at Flipkart
              </span>
            </p>
            <p className="text-[14px] text-primary">
              <span className="font-mono text-[12px] text-secondary">
                Heading to —{" "}
              </span>
              <span>
                Purdue University, MS Statistics &amp; Computer Science · Aug
                2026
              </span>
            </p>
            <p className="text-[14px] text-primary">
              <span className="font-mono text-[12px] text-secondary">
                Interested in —{" "}
              </span>
              <span>
                Quantitative finance, causal inference, photography
              </span>
            </p>
            <p className="text-[14px] text-primary">
              <span className="font-mono text-[12px] text-secondary">
                Reading —{" "}
              </span>
              <span>The Elements of Statistical Learning</span>
            </p>
          </div>

          <div className="mt-10 space-y-3">
            {skillGroups.map((group, gi) => (
              <div key={group.label} className="flex flex-wrap items-center gap-1.5">
                <span className="font-mono text-[10px] tracking-[0.1em] uppercase text-tertiary w-[78px] shrink-0">
                  {group.label}
                </span>
                {group.items.map((t, ti) => (
                  <motion.span
                    key={t}
                    initial={{ opacity: 0, y: 4 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{
                      duration: 0.3,
                      delay: gi * 0.05 + ti * 0.02,
                    }}
                    className="font-mono text-[11px] px-2.5 py-1 rounded-full border border-border text-secondary hover:bg-accent-light hover:text-accent hover:border-accent/40 hover:-translate-y-0.5 transition-all cursor-default"
                  >
                    {t}
                  </motion.span>
                ))}
              </div>
            ))}
          </div>
        </div>

        <div className="md:pl-4">
          <div
            className="aspect-[4/5] w-full rounded-[4px] border border-border bg-surface flex items-center justify-center text-tertiary"
            aria-label="Portrait placeholder"
          >
            <span className="font-mono text-[11px] tracking-[0.15em] uppercase">
              portrait
            </span>
          </div>
        </div>
      </div>
    </motion.section>
  );
}
