import { notFound } from "next/navigation";
import NavBar from "@/components/NavBar";
import BlogPostView from "@/components/BlogPostView";
import { getAllPosts, getPostBySlug } from "@/lib/posts";

export async function generateStaticParams() {
  const posts = await getAllPosts();
  return posts.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}) {
  const post = await getPostBySlug(params.slug);
  if (!post) return {};
  return {
    title: `${post.title} — Saksham Arora`,
    description: post.summary,
    openGraph: {
      title: post.title,
      description: post.summary,
      type: "article",
      images: post.cover ? [post.cover] : undefined,
    },
  };
}

export default async function BlogPostPage({
  params,
}: {
  params: { slug: string };
}) {
  const post = await getPostBySlug(params.slug);
  if (!post) notFound();

  return (
    <>
      <NavBar />
      <main className="pt-32 pb-24 md:pt-40 md:pb-32">
        <BlogPostView post={post} />
      </main>
    </>
  );
}
