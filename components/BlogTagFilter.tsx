import Link from "next/link";
import { tagSlug } from "@/lib/tagSlug";

export default function BlogTagFilter({
  tags,
  activeTag,
}: {
  tags: string[];
  activeTag?: string;
}) {
  if (tags.length === 0) return null;

  return (
    <div className="mb-8 flex flex-wrap items-center gap-2">
      <span className="font-mono text-[11px] tracking-[0.1em] uppercase text-secondary mr-1">
        Topics
      </span>
      <Link
        href="/blog"
        className={`font-mono text-[11px] px-2 py-0.5 rounded-full transition-colors ${
          !activeTag
            ? "bg-accent text-white"
            : "bg-surface text-secondary hover:text-accent border border-border"
        }`}
      >
        All
      </Link>
      {tags.map((tag) => (
        <Link
          key={tag}
          href={`/blog?tag=${tagSlug(tag)}`}
          className={`font-mono text-[11px] px-2 py-0.5 rounded-full transition-colors ${
            activeTag === tag
              ? "bg-accent text-white"
              : "bg-surface text-secondary hover:text-accent border border-border"
          }`}
        >
          {tag}
        </Link>
      ))}
    </div>
  );
}
