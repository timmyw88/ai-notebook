import { getAllPosts } from "@/lib/posts";
import { absoluteUrl, site } from "@/lib/site";
import { escapeHtml } from "@/lib/utils";

// Generated once at build time as out/rss.xml
export const dynamic = "force-static";

export function GET() {
  const items = getAllPosts()
    .slice(0, 30)
    .map((p) => {
      const url = absoluteUrl(`/${p.slug}/`);
      return `    <item>
      <title>${escapeHtml(p.title)}</title>
      <link>${url}</link>
      <guid isPermaLink="true">${url}</guid>
      <pubDate>${new Date(p.publishedAt).toUTCString()}</pubDate>
      <description>${escapeHtml(p.excerpt)}</description>${
        p.category ? `\n      <category>${escapeHtml(p.category.name)}</category>` : ""
      }
    </item>`;
    })
    .join("\n");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${escapeHtml(site.title)}</title>
    <link>${absoluteUrl("/")}</link>
    <description>${escapeHtml(site.tagline)}</description>
    <language>en</language>
    <atom:link href="${absoluteUrl("/rss.xml")}" rel="self" type="application/rss+xml" />
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
${items}
  </channel>
</rss>`;

  return new Response(xml, { headers: { "Content-Type": "application/rss+xml; charset=utf-8" } });
}
