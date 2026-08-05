"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import BlogTagFilter from "@/components/BlogTagFilter";
import TagPill from "@/components/TagPill";
import { tagSlug } from "@/lib/tagSlug";
import type { PostMeta } from "@/lib/posts";

export default function BlogList({
  posts,
  tags,
}: {
  posts: PostMeta[];
  tags: string[];
}) {
  const searchParams = useSearchParams();
  const tagParam = searchParams.get("tag") ?? undefined;
  const activeTag = tagParam
    ? tags.find((t) => tagSlug(t) === tagParam)
    : undefined;
  const filteredPosts = activeTag
    ? posts.filter((p) => p.tags?.includes(activeTag))
    : posts;

  return (
    <>
      <BlogTagFilter tags={tags} activeTag={activeTag} />

      {activeTag && (
        <p className="mb-6 text-[14px] text-secondary">
          Showing posts tagged{" "}
          <span className="text-primary font-medium">{activeTag}</span>
        </p>
      )}

      {filteredPosts.length === 0 ? (
        <p className="text-[14px] text-secondary">
          {activeTag
            ? `No posts tagged "${activeTag}" yet.`
            : "No posts yet. Check back soon."}
        </p>
      ) : (
        <ul className="divide-y divide-border border-y border-border">
          {filteredPosts.map((post) => (
            <li key={post.slug} className="py-6">
              <Link
                href={`/blog/${post.slug}`}
                className="group block transition-colors"
              >
                <p className="font-mono text-[11px] text-secondary tracking-[0.1em] uppercase">
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
                <h2 className="mt-2 font-medium text-[18px] text-primary group-hover:text-accent transition-colors">
                  {post.title}
                </h2>
                {post.summary && (
                  <p className="mt-2 text-[14px] text-secondary leading-snug">
                    {post.summary}
                  </p>
                )}
              </Link>
              {post.tags && post.tags.length > 0 && (
                <div className="mt-3 flex flex-wrap gap-1.5">
                  {post.tags.map((t) => (
                    <TagPill key={t} tag={t} active={t === activeTag} />
                  ))}
                </div>
              )}
            </li>
          ))}
        </ul>
      )}
    </>
  );
}
