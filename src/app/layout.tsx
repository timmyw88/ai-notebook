import type { Metadata, Viewport } from "next";
import { site, siteUrl, withBase } from "@/lib/site";
import { getCategories } from "@/lib/posts";
import Sidebar from "@/components/site/Sidebar";
import "./globals.css";

export const metadata: Metadata = {
  // metadataBase must end with "/" so relative URLs keep the GitHub Pages sub-path.
  metadataBase: new URL(`${siteUrl}/`),
  title: { default: site.tagline ? `${site.title} – ${site.tagline}` : site.title, template: `%s | ${site.title}` },
  description: site.tagline,
  applicationName: site.title,
  icons: { icon: withBase(site.favicon || "/favicon.svg") },
  alternates: { types: { "application/rss+xml": [{ url: withBase("/rss.xml"), title: `${site.title} RSS` }] } },
  openGraph: { siteName: site.title, type: "website", locale: "en_US" },
  twitter: { card: "summary_large_image" },
};

export const viewport: Viewport = { themeColor: "#f5f4f2" };

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const nav = [
    { href: "/", label: "Home" },
    ...getCategories().slice(0, 8).map((c) => ({ href: `/category/${c.slug}/`, label: c.name })),
    { href: "/about/", label: "About" },
  ];
  return (
    <html lang="en">
      <body className="min-h-screen">
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-50 focus:bg-white focus:px-3 focus:py-2"
        >
          Skip to content
        </a>
        <Sidebar nav={nav} />
        <div className="lg:pl-[320px]">
          <main id="main" className="mx-auto w-full max-w-[1040px] px-4 py-8 sm:px-8 lg:px-12 lg:py-16">
            {children}
          </main>
          <footer className="pb-10 text-center text-xs text-muted lg:hidden">
            {site.title} © {new Date().getFullYear()}
          </footer>
        </div>
      </body>
    </html>
  );
}
