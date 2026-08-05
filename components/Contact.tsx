"use client";

import { motion } from "framer-motion";
import { useMemo } from "react";

const LINKEDIN_URL = "https://www.linkedin.com/in/saksham-arora15";
const GITHUB_URL = "https://github.com/sakshamar20";

function MailIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
      <rect
        x="2.5"
        y="4.5"
        width="17"
        height="13"
        rx="1.5"
        stroke="currentColor"
        strokeWidth="1.25"
      />
      <path
        d="M3 6l8 6 8-6"
        stroke="currentColor"
        strokeWidth="1.25"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function LinkedInIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
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

function GitHubIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
      <path
        d="M11 2.5C6.3 2.5 2.5 6.3 2.5 11c0 3.7 2.4 6.9 5.8 8 .4.1.6-.2.6-.4v-1.5c-2.4.5-2.9-1-2.9-1-.4-.9-1-1.2-1-1.2-.8-.5.1-.5.1-.5.9.1 1.3.9 1.3.9.8 1.3 2 1 2.5.7.1-.6.3-1 .6-1.2-1.9-.2-3.9-1-3.9-4.2 0-.9.3-1.7.9-2.3-.1-.2-.4-1.1.1-2.3 0 0 .7-.2 2.3.9.7-.2 1.4-.3 2.1-.3.7 0 1.4.1 2.1.3 1.6-1.1 2.3-.9 2.3-.9.5 1.2.2 2.1.1 2.3.6.6.9 1.4.9 2.3 0 3.3-2 4-3.9 4.2.3.3.6.8.6 1.6v2.4c0 .2.2.5.6.4 3.4-1.1 5.8-4.3 5.8-8 0-4.7-3.8-8.5-8.5-8.5z"
        stroke="currentColor"
        strokeWidth="1"
        fill="none"
      />
    </svg>
  );
}

export default function Contact() {
  const email = useMemo(() => {
    const user = ["sakshamarora", "2048"].join("");
    const domain = ["gmail", "com"].join(".");
    return `${user}@${domain}`;
  }, []);

  const obfuscated = useMemo(
    () => email.replace("@", " [at] ").replace(/\.([^.]+)$/, " [dot] $1"),
    [email]
  );

  const cards = [
    {
      label: "Email",
      value: obfuscated,
      href: `mailto:${email}`,
      Icon: MailIcon,
      external: false,
    },
    {
      label: "LinkedIn",
      value: "in/saksham-arora15",
      href: LINKEDIN_URL,
      Icon: LinkedInIcon,
      external: true,
    },
    {
      label: "GitHub",
      value: "@sakshamar20",
      href: GITHUB_URL,
      Icon: GitHubIcon,
      external: true,
    },
  ];

  return (
    <section id="contact" className="py-24 md:py-32">
      <div className="mx-auto max-w-3xl px-5 md:px-8 text-center">
        <p className="font-mono text-[11px] tracking-[0.12em] uppercase text-accent mb-6">
          Contact
        </p>
        <h2 className="font-display text-primary text-[40px] sm:text-[52px] leading-[1.05]">
          let&apos;s talk.
        </h2>
        <p className="mt-5 text-[15px] text-secondary max-w-md mx-auto">
          open to research collaborations and internships
        </p>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.4 }}
          className="mt-12 grid grid-cols-1 sm:grid-cols-3 gap-4"
        >
          {cards.map(({ label, value, href, Icon, external }) => (
            <a
              key={label}
              href={href}
              {...(external
                ? { target: "_blank", rel: "noreferrer noopener" }
                : {})}
              className="group rounded-lg border border-border bg-surface p-5 text-left transition-all duration-300 hover:border-accent hover:-translate-y-1 hover:shadow-card"
            >
              <div className="text-secondary group-hover:text-accent transition-colors">
                <Icon />
              </div>
              <p className="mt-4 font-mono text-[11px] uppercase tracking-[0.12em] text-secondary">
                {label}
              </p>
              <p className="mt-1 text-[14px] text-primary break-all">{value}</p>
            </a>
          ))}
        </motion.div>

        <div className="mt-16 mx-auto h-px w-full bg-border" />

        <p className="mt-6 font-mono text-[11px] text-tertiary">
          Saksham Arora · 2026
        </p>
      </div>
    </section>
  );
}
