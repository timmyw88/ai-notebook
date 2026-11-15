import type { PostSummary } from "@/lib/posts";
import PostGrid from "./PostGrid";
import Pagination from "./Pagination";

/** Shared layout for category and tag lists. */
export default function ArchivePage({
  eyebrow,
  title,
  description,
  posts,
  page,
  totalPages,
  base,
}: {
  eyebrow: string;
  title: string;
  description?: string;
  posts: PostSummary[];
  page: number;
  totalPages: number;
  base: string;
}) {
  return (
    <>
      <header className="paper mb-8 px-6 py-10 text-center sm:px-12">
        <p className="caps text-[11px] font-bold text-accent">{eyebrow}</p>
        <h1 className="mt-2 text-3xl font-bold break-words text-ink-strong">{title}</h1>
        {description && <p className="mx-auto mt-3 max-w-xl text-muted">{description}</p>}
      </header>
      {posts.length === 0 ? (
        <p className="paper px-6 py-12 text-center text-muted">No posts here yet.</p>
      ) : (
        <PostGrid posts={posts} />
      )}
      <Pagination page={page} totalPages={totalPages} base={base} />
    </>
  );
}
