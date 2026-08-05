"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import TagPill from "@/components/TagPill";
import type { Post } from "@/lib/posts";

const BLOG_FONTS = [
  { id: "teachers", label: "Teachers", stack: "Teachers, system-ui, sans-serif" },
  { id: "playfair", label: "Playfair", stack: "var(--font-playfair), serif" },
  { id: "instrument", label: "Instrument", stack: "var(--font-instrument), serif" },
  { id: "poppins", label: "Poppins", stack: "var(--font-poppins), sans-serif" },
  { id: "jetbrains", label: "JetBrains", stack: "var(--font-jetbrains), ui-monospace, monospace" },
] as const;

type FontId = (typeof BLOG_FONTS)[number]["id"];

const STORAGE_KEY = "blog-font";

export default function BlogPostView({ post }: { post: Post }) {
  const [fontId, setFontId] = useState<FontId>("teachers");
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved && BLOG_FONTS.some((f) => f.id === saved)) {
      setFontId(saved as FontId);
    }
  }, []);

  useEffect(() => {
    if (!open) return;
    const onPointerDown = (e: PointerEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("pointerdown", onPointerDown);
    return () => document.removeEventListener("pointerdown", onPointerDown);
  }, [open]);

  const font = BLOG_FONTS.find((f) => f.id === fontId) ?? BLOG_FONTS[0];

  const pick = (id: FontId) => {
    setFontId(id);
    localStorage.setItem(STORAGE_KEY, id);
    setOpen(false);
  };

  return (
    <article
      id="post-content"
      className="blog-article mx-auto max-w-3xl px-5 md:px-8"
      style={{ fontFamily: font.stack }}
    >
      <div className="flex items-center justify-between gap-4">
        <Link
          href="/blog"
          className="font-mono text-[11px] tracking-[0.12em] uppercase text-secondary hover:text-accent transition-colors"
        >
          ← Blog
        </Link>

        <div ref={menuRef} className="relative shrink-0">
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            className="font-mono text-[11px] tracking-[0.1em] uppercase px-3 py-1.5 rounded-full border border-border text-secondary hover:text-primary hover:border-accent/40 transition-colors"
            aria-expanded={open}
            aria-haspopup="listbox"
          >
            {font.label}
          </button>
          {open && (
            <ul
              role="listbox"
              className="absolute right-0 top-full z-50 mt-1.5 min-w-[9rem] rounded-lg border border-border bg-surface py-1 shadow-card"
            >
              {BLOG_FONTS.map((f) => (
                <li key={f.id} role="option" aria-selected={f.id === fontId}>
                  <button
                    type="button"
                    onClick={() => pick(f.id)}
                    style={{ fontFamily: f.stack }}
                    className={`block w-full px-3 py-2 text-left text-[14px] transition-colors ${
                      f.id === fontId
                        ? "text-accent bg-accent-light/60"
                        : "text-primary hover:bg-accent-light/40"
                    }`}
                  >
                    {f.label}
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      <p className="mt-6 font-mono text-[11px] tracking-[0.1em] uppercase text-secondary">
        {post.date && (
          <time dateTime={post.date}>
            {new Date(post.date).toLocaleDateString("en-US", {
              year: "numeric",
              month: "short",
              day: "numeric",
            })}
          </time>
        )}
        {post.date && <span className="mx-2 text-tertiary">·</span>}
        <span>{post.readingTime}</span>
      </p>

      <h1 className="mt-3 text-primary text-[30px] md:text-[42px] leading-[1.1]">
        {post.title}
      </h1>

      {post.summary && (
        <p className="mt-4 text-[15px] text-secondary italic">
          {post.summary}
        </p>
      )}

      {post.tags && post.tags.length > 0 && (
        <div className="mt-5 flex flex-wrap gap-1.5">
          {post.tags.map((t) => (
            <TagPill key={t} tag={t} />
          ))}
        </div>
      )}

      {post.cover && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={post.cover}
          alt=""
          className="mt-8 w-full rounded-lg border border-border object-cover"
        />
      )}

      <div
        className="prose-post mt-10"
        dangerouslySetInnerHTML={{ __html: post.contentHtml }}
      />
    </article>
  );
}
