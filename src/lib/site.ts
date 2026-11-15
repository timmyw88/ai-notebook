import siteJson from "../../content/site.json";

/**
 * Site settings live in content/site.json (edit it like any other content file).
 * The only build-time environment variables are:
 *   SITE_URL               full public URL, e.g. https://you.github.io/ai-knowledge-blog
 *   NEXT_PUBLIC_BASE_PATH  sub-path on GitHub Pages, e.g. /ai-knowledge-blog ("" for a custom domain)
 * The GitHub Actions workflow sets both automatically.
 */

export type Social = { twitter: string; github: string; linkedin: string; youtube: string; website: string };
export type SiteConfig = {
  title: string;
  tagline: string;
  author: string;
  logo: string;
  favicon: string;
  postsPerPage: number;
  social: Social;
  categories: Record<string, { name: string; description?: string }>;
};

export const site: SiteConfig = siteJson as SiteConfig;

export const basePath = (process.env.NEXT_PUBLIC_BASE_PATH || "").replace(/\/$/, "");
export const siteUrl = (process.env.SITE_URL || "http://localhost:3000").replace(/\/$/, "");

/** Prefix a root-relative path ("/images/x.webp") with the base path. Leaves full URLs alone. */
export function withBase(path: string) {
  if (!path || !path.startsWith("/") || path.startsWith("//")) return path;
  return `${basePath}${path}`;
}

/** Full URL for SEO tags, sitemap and RSS. SITE_URL already includes the base path. */
export function absoluteUrl(path = "/") {
  if (/^https?:\/\//.test(path)) return path;
  return `${siteUrl}${path.startsWith("/") ? path : `/${path}`}`;
}
