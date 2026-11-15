import { getAllPosts, getFeaturedPosts, paginate } from "@/lib/posts";
import { site } from "@/lib/site";
import PostCard from "./PostCard";
import PostGrid from "./PostGrid";
import Pagination from "./Pagination";

/** Home page list. Page 1 shows featured posts on top. */
export default function HomeView({ page }: { page: number }) {
  const all = getAllPosts();
  const featured = page === 1 ? getFeaturedPosts(3) : [];
  const { items, totalPages } = paginate(all, page);
  // Featured posts are shown at the top of page 1 and not repeated just below.
  const featuredSlugs = new Set(featured.map((p) => p.slug));
  const posts = items.filter((p) => !featuredSlugs.has(p.slug));

  if (all.length === 0) {
    return (
      <div className="paper mx-auto max-w-xl p-10 text-center">
        <h1 className="text-2xl font-bold text-ink-strong">Nothing here yet</h1>
        <p className="mt-2 text-muted">Add a Markdown file to content/posts to publish your first post.</p>
      </div>
    );
  }

  return (
    <>
      <h1 className="sr-only">{site.title}</h1>
      {featured.length > 0 && (
        <section aria-label="Featured posts" className="mb-8">
          <div className="mb-8">
            <PostCard post={featured[0]} variant="featured" priority />
          </div>
          {featured.length > 1 && (
            <div className="grid gap-8 md:grid-cols-2">
              {featured.slice(1).map((p) => (
                <PostCard key={p.slug} post={p} variant="featured" />
              ))}
            </div>
          )}
        </section>
      )}

      {featured.length > 0 && posts.length > 0 && (
        <h2 className="caps mb-6 border-b border-line pb-3 text-xs font-bold text-muted">Latest</h2>
      )}
      <PostGrid posts={posts} priorityFirst={featured.length === 0} />
      <Pagination page={page} totalPages={totalPages} base="/" />
    </>
  );
}
