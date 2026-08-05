import { Suspense } from "react";
import NavBar from "@/components/NavBar";
import BlogList from "@/components/BlogList";
import { getAllPosts, getAllTags } from "@/lib/posts";

export const metadata = {
  title: "Blog — Saksham Arora",
  description: "Occasional writing from Saksham Arora.",
};

export default async function BlogIndexPage() {
  const posts = await getAllPosts();
  const allTags = await getAllTags();

  return (
    <>
      <NavBar />
      <main className="pt-32 pb-24 md:pt-40 md:pb-32">
        <div className="mx-auto max-w-3xl px-5 md:px-8">
          <p className="font-mono text-[11px] tracking-[0.12em] uppercase text-accent mb-6">
            Blog
          </p>
          <h1 className="font-display text-primary text-[28px] md:text-[36px] mb-10">
            Writing.
          </h1>

          <Suspense fallback={null}>
            <BlogList posts={posts} tags={allTags} />
          </Suspense>
        </div>
      </main>
    </>
  );
}
