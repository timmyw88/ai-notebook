import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import { z } from "zod";
import { markdownToHtml, markdownToSearchText, markdownToText } from "./markdown";
import { site } from "./site";
import { slugify, truncate, countWords, readingTime, RESERVED_SLUGS } from "./utils";

/**
 * Posts are Markdown files in content/posts/. The file name is the URL:
 *   content/posts/my-first-post.md  →  /my-first-post/
 * Everything is read once at build time.
 */

const POSTS_DIR = path.join(process.cwd(), "content", "posts");

// Front matter at the top of each post. Unknown keys are ignored.
const frontmatterSchema = z.object({
  title: z.string().min(1),
  date: z.coerce.date(),
  updated: z.coerce.date().optional(),
  excerpt: z.string().optional().default(""),
  category: z.string().optional().default(""),
  tags: z.array(z.coerce.string()).optional().default([]),
  featured: z.boolean().optional().default(false),
  image: z.string().optional().default(""),
  imageAlt: z.string().optional().default(""),
  draft: z.boolean().optional().default(false),
  metaTitle: z.string().optional().default(""),
  metaDescription: z.string().optional().default(""),
  ogImage: z.string().optional().default(""),
});

export type TermRef = { id: string; name: string; slug: string };
export type PostSummary = {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  featuredImage: { url: string; alt: string };
  category: TermRef | null;
  tags: TermRef[];
  publishedAt: string;
  updatedAt: string;
  readingTime: number;
  featured: boolean;
};
export type PostFull = PostSummary & {
  html: string;
  contentText: string;
  wordCount: number;
  seo: { metaTitle: string; metaDescription: string; ogImage: string };
  searchText: string;
};
export type Term = TermRef & { description: string; count: number };

function categoryRef(name: string): TermRef | null {
  if (!name.trim()) return null;
  const slug = slugify(name);
  const configured = site.categories[slug];
  return { id: slug, slug, name: configured?.name ?? name.trim() };
}

function tagRef(name: string): TermRef {
  const slug = slugify(name);
  return { id: slug, slug, name: name.trim() };
}

function loadPost(file: string): PostFull & { draft: boolean } {
  const raw = fs.readFileSync(path.join(POSTS_DIR, file), "utf8");
  const { data, content } = matter(raw);
  const parsed = frontmatterSchema.safeParse(data);
  if (!parsed.success) {
    const issue = parsed.error.issues[0];
    throw new Error(`content/posts/${file}: front matter "${issue.path.join(".")}" ${issue.message}`);
  }
  const fm = parsed.data;
  const slug = slugify(file.replace(/\.mdx?$/, ""));
  if (RESERVED_SLUGS.includes(slug)) throw new Error(`content/posts/${file}: "${slug}" is a reserved URL, rename the file.`);

  const contentText = markdownToText(content);
  const wordCount = countWords(contentText);
  return {
    id: slug,
    slug,
    title: fm.title,
    excerpt: fm.excerpt || truncate(contentText, 200),
    featuredImage: { url: fm.image, alt: fm.imageAlt },
    category: categoryRef(fm.category),
    tags: fm.tags.map(tagRef).filter((t) => t.slug),
    publishedAt: fm.date.toISOString(),
    updatedAt: (fm.updated ?? fm.date).toISOString(),
    readingTime: readingTime(wordCount),
    featured: fm.featured,
    html: markdownToHtml(content),
    contentText,
    searchText: markdownToSearchText(content),
    wordCount,
    seo: { metaTitle: fm.metaTitle, metaDescription: fm.metaDescription, ogImage: fm.ogImage },
    draft: fm.draft,
  };
}

let cache: PostFull[] | null = null;

/** All visible posts, newest first. Drafts and future-dated posts are shown only in `npm run dev`. */
export function getAllPosts(): PostFull[] {
  if (cache && process.env.NODE_ENV === "production") return cache;
  const files = fs.existsSync(POSTS_DIR) ? fs.readdirSync(POSTS_DIR).filter((f) => /\.mdx?$/.test(f)) : [];
  const isDev = process.env.NODE_ENV !== "production";
  const now = Date.now();
  const posts = files
    .map(loadPost)
    .filter((p) => isDev || (!p.draft && new Date(p.publishedAt).getTime() <= now))
    .sort((a, b) => b.publishedAt.localeCompare(a.publishedAt));
  const seen = new Set<string>();
  for (const p of posts) {
    if (seen.has(p.slug)) throw new Error(`Two posts have the same URL: /${p.slug}/`);
    seen.add(p.slug);
  }
  cache = posts;
  return posts;
}

export function getPost(slug: string) {
  return getAllPosts().find((p) => p.slug === slug) ?? null;
}

export function getFeaturedPosts(limit = 3) {
  return getAllPosts().filter((p) => p.featured).slice(0, limit);
}

export function paginate<T>(items: T[], page: number, perPage = site.postsPerPage) {
  const totalPages = Math.max(1, Math.ceil(items.length / perPage));
  return { items: items.slice((page - 1) * perPage, page * perPage), totalPages };
}

/** Page numbers 2..N for generateStaticParams (page 1 is the base URL). */
export function extraPages(count: number) {
  const total = Math.ceil(count / site.postsPerPage);
  return Array.from({ length: Math.max(0, total - 1) }, (_, i) => String(i + 2));
}

export function getCategories(): Term[] {
  const map = new Map<string, Term>();
  for (const p of getAllPosts()) {
    if (!p.category) continue;
    const t = map.get(p.category.slug) ?? {
      ...p.category,
      description: site.categories[p.category.slug]?.description ?? "",
      count: 0,
    };
    t.count++;
    map.set(t.slug, t);
  }
  return [...map.values()].sort((a, b) => a.name.localeCompare(b.name));
}

export function getTags(): Term[] {
  const map = new Map<string, Term>();
  for (const p of getAllPosts()) {
    for (const tag of p.tags) {
      const t = map.get(tag.slug) ?? { ...tag, description: "", count: 0 };
      t.count++;
      map.set(t.slug, t);
    }
  }
  return [...map.values()].sort((a, b) => a.name.localeCompare(b.name));
}

export function getPostsByCategory(slug: string) {
  return getAllPosts().filter((p) => p.category?.slug === slug);
}

export function getPostsByTag(slug: string) {
  return getAllPosts().filter((p) => p.tags.some((t) => t.slug === slug));
}

export function getAdjacentPosts(slug: string) {
  const posts = getAllPosts();
  const i = posts.findIndex((p) => p.slug === slug);
  return { next: i > 0 ? posts[i - 1] : null, prev: i >= 0 && i < posts.length - 1 ? posts[i + 1] : null };
}

/** Up to 3 posts sharing tags or the category, best matches first. */
export function getRelatedPosts(post: PostSummary, limit = 3) {
  const tagSlugs = new Set(post.tags.map((t) => t.slug));
  return getAllPosts()
    .filter((p) => p.slug !== post.slug)
    .map((p) => ({
      p,
      score:
        p.tags.filter((t) => tagSlugs.has(t.slug)).length * 2 +
        (post.category && p.category?.slug === post.category.slug ? 1 : 0),
    }))
    .filter((x) => x.score > 0)
    .sort((a, b) => b.score - a.score || b.p.publishedAt.localeCompare(a.p.publishedAt))
    .slice(0, limit)
    .map((x) => x.p);
}

export function getAboutHtml() {
  const file = path.join(process.cwd(), "content", "about.md");
  return fs.existsSync(file) ? markdownToHtml(fs.readFileSync(file, "utf8")) : "";
}
