import { getAllPosts } from "@/lib/posts";

// Small search index generated at build time as out/search-index.json.
// The search page downloads it once and searches in the browser.
export const dynamic = "force-static";

export function GET() {
  const index = getAllPosts().map((p) => ({
    slug: p.slug,
    title: p.title,
    excerpt: p.excerpt,
    date: p.publishedAt,
    category: p.category?.name ?? "",
    tags: p.tags.map((t) => t.name),
    text: p.searchText.slice(0, 20000),
  }));
  return Response.json(index);
}
