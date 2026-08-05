import Link from "next/link";
import { tagSlug } from "@/lib/tagSlug";

export default function TagPill({
  tag,
  active,
}: {
  tag: string;
  active?: boolean;
}) {
  return (
    <Link
      href={`/blog?tag=${tagSlug(tag)}`}
      className={`font-mono text-[11px] px-2 py-0.5 rounded-full transition-colors ${
        active
          ? "bg-accent text-white"
          : "bg-accent-light text-accent hover:bg-accent/20"
      }`}
    >
      {tag}
    </Link>
  );
}
