import Link from "next/link";
import type { PostSummary } from "@/lib/posts";
import { formatDate } from "@/lib/utils";
import PostImage from "./PostImage";

/** White "paper" card: image on top, title, short excerpt and a quiet meta line. */
export default function PostCard({
  post,
  variant = "default",
  priority = false,
}: {
  post: PostSummary;
  variant?: "default" | "featured" | "compact";
  priority?: boolean;
}) {
  const href = `/${post.slug}/`;
  const featured = variant === "featured";
  const compact = variant === "compact";

  return (
    <article className="paper group flex h-full flex-col transition-shadow duration-300 hover:shadow-lift">
      {post.featuredImage.url && (
        <Link
          href={href}
          className={`relative block overflow-hidden bg-canvas ${featured ? "aspect-[16/9]" : compact ? "aspect-[16/10]" : "aspect-[10/7]"}`}
          tabIndex={-1}
          aria-hidden="true"
        >
          <PostImage
            src={post.featuredImage.url}
            alt={post.featuredImage.alt || post.title}
            priority={priority}
            sizes={compact ? "(min-width: 1024px) 260px, 100vw" : "(min-width: 1280px) 800px, (min-width: 1024px) 640px, 100vw"}
            className="transition-transform duration-500 group-hover:scale-[1.03]"
          />
          {featured && (
            <span className="caps absolute top-4 left-4 bg-accent px-2 py-1 text-[10px] font-bold text-white">Featured</span>
          )}
        </Link>
      )}
      <div className={`flex flex-1 flex-col ${compact ? "p-4" : "p-6 sm:p-7"}`}>
        {!post.featuredImage.url && featured && (
          <span className="caps mb-3 self-start bg-accent px-2 py-1 text-[10px] font-bold text-white">Featured</span>
        )}
        <h2
          className={`font-bold break-words text-ink-strong transition-colors group-hover:text-accent ${
            featured ? "text-2xl leading-tight sm:text-[28px]" : compact ? "text-base leading-snug" : "text-2xl leading-tight"
          }`}
        >
          <Link href={href}>{post.title}</Link>
        </h2>
        {!compact && post.excerpt && (
          <p className="mt-3 text-sm leading-relaxed text-muted">
            {post.excerpt}{" "}
            <Link href={href} className="link-accent whitespace-nowrap" aria-label={`Read ${post.title}`}>»</Link>
          </p>
        )}
        <div className={`mt-auto flex flex-wrap items-center gap-x-2 text-xs text-muted ${compact ? "pt-2" : "pt-5"}`}>
          <time dateTime={post.publishedAt}>{formatDate(post.publishedAt)}</time>
          {post.category && !compact && (
            <>
              <span aria-hidden="true">·</span>
              <span>
                on <Link href={`/category/${post.category.slug}/`} className="link-accent">{post.category.name}</Link>
              </span>
            </>
          )}
          {!compact && (
            <>
              <span aria-hidden="true">·</span>
              <span>{post.readingTime} min read</span>
            </>
          )}
        </div>
      </div>
    </article>
  );
}
