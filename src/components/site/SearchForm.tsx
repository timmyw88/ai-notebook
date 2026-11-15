import { withBase } from "@/lib/site";

export default function SearchForm({ defaultValue = "", large = false }: { defaultValue?: string; large?: boolean }) {
  return (
    <form action={withBase("/search/")} method="get" role="search">
      <label htmlFor={large ? "search-page" : undefined} className="sr-only">Search</label>
      <input
        id={large ? "search-page" : undefined}
        type="search"
        name="q"
        defaultValue={defaultValue}
        placeholder="Search …"
        className={`w-full border border-line bg-white px-3 text-ink outline-none transition-colors placeholder:text-muted focus:border-accent ${
          large ? "py-3 text-lg" : "py-1.5 text-left text-[15px] lg:text-right"
        }`}
        maxLength={100}
      />
    </form>
  );
}
