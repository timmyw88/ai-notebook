import type { PostSummary } from "@/lib/posts";
import PostCard from "./PostCard";

/** One column on phones/tablets, a two-column masonry on wide screens. */
export default function PostGrid({ posts, priorityFirst = false }: { posts: PostSummary[]; priorityFirst?: boolean }) {
  return (
    <div className="gap-8 xl:columns-2">
      {posts.map((post, i) => (
        <div key={post.id} className="mb-8 break-inside-avoid">
          <PostCard post={post} priority={priorityFirst && i === 0} />
        </div>
      ))}
    </div>
  );
}
