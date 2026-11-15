import Link from "next/link";
import type { PostFull } from "@/lib/posts";
import { formatDate } from "@/lib/utils";
import PostImage from "./PostImage";
import PromptCopy from "./PromptCopy";

/** The white article "sheet": centred header, featured image, then the content. */
export default function PostArticle({ post, footer }: { post: PostFull; footer?: React.ReactNode }) {
  return (
    <article className="paper">
      <header className="px-6 pt-12 pb-10 text-center sm:px-12 sm:pt-16">
        {post.category && (
          <Link href={`/category/${post.category.slug}/`} className="caps text-[11px] font-bold text-accent hover:text-accent-dark">
            {post.category.name}
          </Link>
        )}
        <h1 className="mx-auto mt-3 max-w-2xl text-3xl leading-tight font-bold break-words text-ink sm:text-[40px] sm:leading-[1.2]">
          {post.title}
        </h1>
        <div className="mt-5 flex flex-wrap items-center justify-center gap-x-3 gap-y-1 text-sm text-muted">
          <time dateTime={post.publishedAt}>{formatDate(post.publishedAt)}</time>
          <span aria-hidden="true">·</span>
          <span>{post.readingTime} min read</span>
        </div>
      </header>

      {post.featuredImage.url && (
        <div className="relative aspect-[16/9] w-full bg-canvas">
          <PostImage
            src={post.featuredImage.url}
            alt={post.featuredImage.alt || post.title}
            priority
            sizes="(min-width: 1280px) 900px, (min-width: 1024px) 700px, 100vw"
          />
        </div>
      )}

      <div className={`px-6 sm:px-12 lg:px-16 ${post.featuredImage.url ? "py-10 sm:py-14" : "pt-0 pb-10 sm:pb-14"}`}>
        <PromptCopy>
          <div className="post-content mx-auto max-w-[680px]" dangerouslySetInnerHTML={{ __html: post.html }} />
        </PromptCopy>

        {post.tags.length > 0 && (
          <ul className="mx-auto mt-12 flex max-w-[680px] flex-wrap gap-2" aria-label="Tags">
            {post.tags.map((t) => (
              <li key={t.id}>
                <Link
                  href={`/tag/${t.slug}/`}
                  className="caps inline-block border border-line px-3 py-1.5 text-[11px] text-ink-strong transition-colors hover:border-accent hover:text-accent"
                >
                  {t.name}
                </Link>
              </li>
            ))}
          </ul>
        )}
        {footer && <div className="mx-auto mt-10 max-w-[680px] border-t border-line pt-6">{footer}</div>}
      </div>
    </article>
  );
}
