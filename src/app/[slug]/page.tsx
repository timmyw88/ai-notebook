import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getAdjacentPosts, getAllPosts, getPost, getRelatedPosts } from "@/lib/posts";
import { absoluteUrl, site } from "@/lib/site";
import { truncate } from "@/lib/utils";
import PostArticle from "@/components/site/PostArticle";
import ShareLinks from "@/components/site/ShareLinks";
import PostCard from "@/components/site/PostCard";

type Props = { params: Promise<{ slug: string }> };

export const dynamicParams = false;

export function generateStaticParams() {
  return getAllPosts().map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const post = getPost((await params).slug);
  if (!post) return { title: "Not found" };
  const title = post.seo.metaTitle || post.title;
  const description = post.seo.metaDescription || post.excerpt || truncate(post.contentText, 160);
  const image = post.seo.ogImage || post.featuredImage.url;
  const imageUrl = image ? absoluteUrl(image) : undefined;
  return {
    // A custom meta title is used as-is; otherwise "Post title | Site title".
    title: post.seo.metaTitle ? { absolute: post.seo.metaTitle } : post.title,
    description,
    alternates: { canonical: absoluteUrl(`/${post.slug}/`) },
    openGraph: {
      type: "article",
      title,
      description,
      url: absoluteUrl(`/${post.slug}/`),
      publishedTime: post.publishedAt,
      modifiedTime: post.updatedAt,
      section: post.category?.name,
      tags: post.tags.map((t) => t.name),
      images: imageUrl ? [{ url: imageUrl, alt: post.featuredImage.alt || post.title }] : undefined,
    },
    twitter: {
      card: imageUrl ? "summary_large_image" : "summary",
      title,
      description,
      images: imageUrl ? [imageUrl] : undefined,
    },
  };
}

export default async function PostPage({ params }: Props) {
  const post = getPost((await params).slug);
  if (!post) notFound();

  const adjacent = getAdjacentPosts(post.slug);
  const related = getRelatedPosts(post);
  const url = absoluteUrl(`/${post.slug}/`);
  const image = post.seo.ogImage || post.featuredImage.url;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description: post.seo.metaDescription || post.excerpt,
    image: image ? absoluteUrl(image) : undefined,
    datePublished: post.publishedAt,
    dateModified: post.updatedAt,
    wordCount: post.wordCount,
    articleSection: post.category?.name,
    keywords: post.tags.map((t) => t.name).join(", ") || undefined,
    mainEntityOfPage: { "@type": "WebPage", "@id": url },
    url,
    author: { "@type": "Person", name: site.author, url: absoluteUrl("/about/") },
    publisher: { "@type": "Organization", name: site.title },
  };

  return (
    <>
      <script
        type="application/ld+json"
        // Escape "<" so post text can never close the script tag.
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }}
      />

      <PostArticle post={post} footer={<ShareLinks url={url} title={post.title} />} />

      {(adjacent.prev || adjacent.next) && (
        <nav className="mt-8 grid gap-4 sm:grid-cols-2" aria-label="More posts">
          {adjacent.prev ? (
            <Link href={`/${adjacent.prev.slug}/`} rel="prev" className="paper group block p-6 transition-shadow hover:shadow-lift">
              <span className="caps text-[10px] text-muted">← Previous post</span>
              <span className="mt-2 block font-bold text-ink-strong group-hover:text-accent">{adjacent.prev.title}</span>
            </Link>
          ) : <span className="hidden sm:block" />}
          {adjacent.next && (
            <Link href={`/${adjacent.next.slug}/`} rel="next" className="paper group block p-6 text-right transition-shadow hover:shadow-lift">
              <span className="caps text-[10px] text-muted">Next post →</span>
              <span className="mt-2 block font-bold text-ink-strong group-hover:text-accent">{adjacent.next.title}</span>
            </Link>
          )}
        </nav>
      )}

      {related.length > 0 && (
        <section className="mt-12" aria-labelledby="related-title">
          <h2 id="related-title" className="caps mb-6 border-b border-line pb-3 text-xs font-bold text-muted">You might also like</h2>
          <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
            {related.map((p) => <PostCard key={p.slug} post={p} variant="compact" />)}
          </div>
        </section>
      )}
    </>
  );
}
