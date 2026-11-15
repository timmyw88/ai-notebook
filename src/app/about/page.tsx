import type { Metadata } from "next";
import { absoluteUrl, site } from "@/lib/site";
import { getAboutHtml } from "@/lib/posts";
import SocialIcons from "@/components/site/SocialIcons";

export const metadata: Metadata = {
  title: "About",
  description: `About ${site.title}`,
  alternates: { canonical: absoluteUrl("/about/") },
};

export default function AboutPage() {
  return (
    <article className="paper px-6 py-12 sm:px-12 sm:py-16 lg:px-16">
      <header className="text-center">
        <p className="caps text-[11px] font-bold text-accent">About</p>
        <h1 className="mt-3 text-3xl font-bold text-ink sm:text-[40px]">{site.title}</h1>
        {site.tagline && <p className="mt-3 text-lg text-muted">{site.tagline}</p>}
      </header>
      {/* Rendered from content/about.md at build time (raw HTML in Markdown is not allowed). */}
      <div className="post-content mx-auto mt-10 max-w-[680px]" dangerouslySetInnerHTML={{ __html: getAboutHtml() }} />
      <SocialIcons social={site.social} className="mx-auto mt-10 max-w-[680px] justify-center" />
    </article>
  );
}
