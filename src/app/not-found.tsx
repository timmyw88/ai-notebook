import Link from "next/link";
import SearchForm from "@/components/site/SearchForm";

// Exported as out/404.html, which GitHub Pages shows for unknown URLs.
export default function NotFound() {
  return (
    <div className="paper mx-auto max-w-xl px-6 py-16 text-center sm:px-12">
      <p className="text-6xl font-bold text-accent">404</p>
      <h1 className="mt-4 text-2xl font-bold text-ink-strong">Page not found</h1>
      <p className="mt-2 text-muted">The page you were looking for doesn’t exist or has moved.</p>
      <div className="mx-auto mt-8 max-w-sm">
        <SearchForm large />
      </div>
      <Link href="/" className="btn btn-primary mt-8">Back to home</Link>
    </div>
  );
}
