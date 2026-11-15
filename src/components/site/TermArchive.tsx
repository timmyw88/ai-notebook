import type { Metadata } from "next";
import { notFound } from "next/navigation";
import {
  extraPages, getCategories, getPostsByCategory, getPostsByTag, getTags, paginate,
} from "@/lib/posts";
import { absoluteUrl } from "@/lib/site";
import ArchivePage from "./ArchivePage";

/** Shared logic for /category/... and /tag/... pages (page 1 and /page/N/). */
type Kind = "category" | "tag";

const terms = (kind: Kind) => (kind === "category" ? getCategories() : getTags());
const postsFor = (kind: Kind, slug: string) => (kind === "category" ? getPostsByCategory(slug) : getPostsByTag(slug));

export function termParams(kind: Kind) {
  const list = terms(kind).map((t) => ({ slug: t.slug }));
  // Static export needs at least one page per route; "none" renders the 404 page.
  return list.length ? list : [{ slug: "none" }];
}

export function termPageParams(kind: Kind) {
  const all = terms(kind);
  const list = all.flatMap((t) => extraPages(t.count).map((n) => ({ slug: t.slug, n })));
  // Static export needs at least one page per route; page 1 is a copy of the archive.
  return list.length ? list : [{ slug: all[0]?.slug ?? "none", n: "1" }];
}

export function termMetadata(kind: Kind, slug: string, page: number): Metadata {
  const term = terms(kind).find((t) => t.slug === slug);
  if (!term) return { title: "Not found" };
  const label = kind === "tag" ? `#${term.name}` : term.name;
  const base = `/${kind}/${slug}/`;
  return {
    title: page > 1 ? `${label} – Page ${page}` : label,
    description: term.description || `Posts ${kind === "tag" ? "tagged" : "in"} ${term.name}`,
    alternates: { canonical: absoluteUrl(page > 1 ? `${base}page/${page}/` : base) },  };
}

export default function TermArchive({ kind, slug, page }: { kind: Kind; slug: string; page: number }) {
  const term = terms(kind).find((t) => t.slug === slug);
  if (!term || !Number.isInteger(page) || page < 1) notFound();
  const { items, totalPages } = paginate(postsFor(kind, slug), page);
  if (page > totalPages) notFound();
  return (
    <ArchivePage
      eyebrow={kind === "category" ? "Category" : "Tag"}
      title={kind === "tag" ? `#${term.name}` : term.name}
      description={term.description}
      posts={items}
      page={page}
      totalPages={totalPages}
      base={`/${kind}/${slug}/`}
    />
  );
}
