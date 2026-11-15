import Link from "next/link";

/** Paperleaf-style quiet pagination. Page 1 is `base`, page n is `base/page/n/`. */
export function pageHref(base: string, n: number) {
  const b = base.endsWith("/") ? base : `${base}/`;
  return n <= 1 ? b : `${b}page/${n}/`;
}

export default function Pagination({ page, totalPages, base }: { page: number; totalPages: number; base: string }) {
  if (totalPages <= 1) return null;
  return (
    <nav className="mt-10 flex items-center justify-between text-xs" aria-label="Pagination">
      <div className="w-1/3">
        {page > 1 && (
          <Link href={pageHref(base, page - 1)} rel="prev" className="caps link-accent">← Newer</Link>
        )}
      </div>
      <span className="w-1/3 text-center text-muted">Page {page} of {totalPages}</span>
      <div className="w-1/3 text-right">
        {page < totalPages && (
          <Link href={pageHref(base, page + 1)} rel="next" className="caps link-accent">Older →</Link>
        )}
      </div>
    </nav>
  );
}
