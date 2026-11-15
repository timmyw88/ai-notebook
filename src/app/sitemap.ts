import type { MetadataRoute } from "next";
import { getAllPosts, getCategories, getTags } from "@/lib/posts";
import { absoluteUrl } from "@/lib/site";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  const posts = getAllPosts();
  return [
    { url: absoluteUrl("/"), lastModified: posts[0]?.updatedAt, changeFrequency: "weekly", priority: 1 },
    { url: absoluteUrl("/about/"), changeFrequency: "monthly", priority: 0.5 },
    ...posts.map((p) => ({ url: absoluteUrl(`/${p.slug}/`), lastModified: p.updatedAt, priority: 0.8 })),
    ...getCategories().map((c) => ({ url: absoluteUrl(`/category/${c.slug}/`), priority: 0.5 })),
    ...getTags().map((t) => ({ url: absoluteUrl(`/tag/${t.slug}/`), priority: 0.3 })),
  ];
}
