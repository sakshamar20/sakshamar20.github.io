import fs from "node:fs/promises";
import path from "node:path";
import matter from "gray-matter";
import { remark } from "remark";
import remarkGfm from "remark-gfm";
import html from "remark-html";
import readingTime from "reading-time";

export type PostMeta = {
  slug: string;
  title: string;
  date: string;
  summary: string;
  cover?: string;
  tags?: string[];
  readingTime: string;
};

export type Post = PostMeta & {
  contentHtml: string;
};

const POSTS_DIR = path.join(process.cwd(), "content", "posts");

export function tagSlug(tag: string): string {
  return tag.toLowerCase().replace(/\s+/g, "-");
}

export async function getAllTags(): Promise<string[]> {
  const posts = await getAllPosts();
  return [...new Set(posts.flatMap((p) => p.tags ?? []))].sort();
}

export async function getPostsByTagSlug(tagSlugParam: string): Promise<PostMeta[]> {
  const posts = await getAllPosts();
  const tag = [...new Set(posts.flatMap((p) => p.tags ?? []))].find(
    (t) => tagSlug(t) === tagSlugParam
  );
  if (!tag) return [];
  return posts.filter((p) => p.tags?.includes(tag));
}

async function readSlugs(): Promise<string[]> {
  let entries: string[] = [];
  try {
    entries = await fs.readdir(POSTS_DIR);
  } catch {
    return [];
  }
  return entries
    .filter((f) => f.endsWith(".md"))
    .map((f) => f.replace(/\.md$/, ""));
}

async function readPostFile(slug: string) {
  const filePath = path.join(POSTS_DIR, `${slug}.md`);
  const raw = await fs.readFile(filePath, "utf8");
  return matter(raw);
}

export async function getAllPosts(): Promise<PostMeta[]> {
  const slugs = await readSlugs();
  const posts = await Promise.all(
    slugs.map(async (slug) => {
      const { data, content } = await readPostFile(slug);
      return {
        slug,
        title: data.title ?? slug,
        date: data.date ?? "",
        summary: data.summary ?? "",
        cover: data.cover,
        tags: data.tags ?? [],
        readingTime: readingTime(content).text,
      } satisfies PostMeta;
    })
  );

  return posts.sort((a, b) => (a.date < b.date ? 1 : -1));
}

export async function getPostBySlug(slug: string): Promise<Post | null> {
  let data, content;
  try {
    ({ data, content } = await readPostFile(slug));
  } catch {
    return null;
  }

  const processed = await remark()
    .use(remarkGfm)
    .use(html, { sanitize: false })
    .process(content);

  return {
    slug,
    title: data.title ?? slug,
    date: data.date ?? "",
    summary: data.summary ?? "",
    cover: data.cover,
    tags: data.tags ?? [],
    readingTime: readingTime(content).text,
    contentHtml: processed.toString(),
  };
}
