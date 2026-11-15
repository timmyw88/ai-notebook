import Link from "next/link";
import { site, withBase } from "@/lib/site";
import SocialIcons from "./SocialIcons";
import SearchForm from "./SearchForm";
import NavLinks from "./NavLinks";
import MobileMenu from "./MobileMenu";

type NavItem = { href: string; label: string };

function Brand({ align }: { align: "left" | "right" }) {
  return (
    <Link href="/" className="block" aria-label={`${site.title} home`}>
      {site.logo ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={withBase(site.logo)} alt={site.title} className={`max-h-14 w-auto ${align === "right" ? "ml-auto" : ""}`} />
      ) : (
        <span className="text-[28px] leading-tight font-bold text-ink-strong">{site.title}</span>
      )}
    </Link>
  );
}

/**
 * Fixed white sidebar on large screens (right-aligned title, tagline and
 * letter-spaced navigation); a compact top bar with a slide-down menu on smaller screens.
 */
export default function Sidebar({ nav }: { nav: NavItem[] }) {
  const year = new Date().getFullYear();
  return (
    <>
      {/* Desktop */}
      <aside className="paper fixed inset-y-0 left-0 z-20 hidden w-[320px] overflow-y-auto lg:block">
        <div className="flex min-h-full flex-col px-8 py-16 text-right">
          <Brand align="right" />
          {site.tagline && <p className="mt-3 text-xl leading-snug text-muted">{site.tagline}</p>}

          <nav className="mt-8" aria-label="Main">
            <NavLinks items={nav} />
          </nav>

          <div className="mt-8">
            <SearchForm />
          </div>

          <SocialIcons social={site.social} className="mt-8 justify-end" />

          <footer className="mt-auto pt-12 text-xs leading-relaxed text-muted">
            <Link href="/" className="link-accent">{site.title}</Link> © {year}
          </footer>
        </div>
      </aside>

      {/* Mobile & tablet */}
      <header className="paper sticky top-0 z-30 lg:hidden">
        <div className="mx-auto flex max-w-3xl items-center justify-between gap-4 px-5 py-4">
          <div className="min-w-0">
            <Brand align="left" />
          </div>
          <MobileMenu>
            <nav aria-label="Main">
              <NavLinks items={nav} align="left" />
            </nav>
            <div className="mt-6">
              <SearchForm />
            </div>
            <SocialIcons social={site.social} className="mt-6" />
          </MobileMenu>
        </div>
      </header>
    </>
  );
}
