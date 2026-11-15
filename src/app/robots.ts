import type { MetadataRoute } from "next";
import { absoluteUrl } from "@/lib/site";

export const dynamic = "force-static";

// Note: on a GitHub Pages project site (user.github.io/repo) search engines only read
// robots.txt at the domain root, so this file matters once you use a custom domain.
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [{ userAgent: "*", allow: "/", disallow: ["/search/"] }],
    sitemap: absoluteUrl("/sitemap.xml"),
  };
}
