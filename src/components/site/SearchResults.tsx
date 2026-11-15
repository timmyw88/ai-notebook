"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { withBase } from "@/lib/site";
import { formatDate } from "@/lib/utils";

type Entry = { slug: string; title: string; excerpt: string; date: string; category: string; tags: string[]; text: string };
type Hit = Entry & { score: number; snippet: { before: string; match: string; after: string } | null };

let indexPromise: Promise<Entry[]> | null = null;

/** Downloads out/search-index.json once (built from your posts). */
function loadIndex() {
  indexPromise ??= fetch(withBase("/search-index.json")).then((r) => {
    if (!r.ok) throw new Error("Search index not found");
    return r.json();
  });
  return indexPromise;
}

const norm = (s: string) => s.toLowerCase().normalize("NFKD").replace(/[̀-ͯ]/g, "");

/** Every word must appear somewhere; title and tag matches rank higher. */
function search(entries: Entry[], query: string): Hit[] {
  const words = norm(query).split(/\s+/).filter(Boolean);
  if (!words.length) return [];
  const hits: Hit[] = [];
  for (const e of entries) {
    const fields = {
      title: norm(e.title),
      meta: norm(`${e.category} ${e.tags.join(" ")}`),
      excerpt: norm(e.excerpt),
      text: norm(e.text),
    };
    let score = 0;
    let all = true;
    for (const w of words) {
      const s =
        (fields.title.includes(w) ? 10 : 0) +
        (fields.meta.includes(w) ? 5 : 0) +
        (fields.excerpt.includes(w) ? 3 : 0) +
        (fields.text.includes(w) ? 1 : 0);
      if (!s) {
        all = false;
        break;
      }
      score += s;
    }
    if (!all) continue;
    // Short piece of text around the first match in the body
    const i = fields.text.indexOf(words[0]);
    const snippet =
      i >= 0
        ? {
            before: (i > 80 ? "…" : "") + e.text.slice(Math.max(0, i - 80), i),
            match: e.text.slice(i, i + words[0].length),
            after: e.text.slice(i + words[0].length, i + words[0].length + 140) + "…",
          }
        : null;
    hits.push({ ...e, score, snippet });
  }
  return hits.sort((a, b) => b.score - a.score || b.date.localeCompare(a.date)).slice(0, 30);
}

type Status = "idle" | "loading" | "done" | "error";

export default function SearchResults() {
  const inputRef = useRef<HTMLInputElement>(null);
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const latest = useRef("");
  const [status, setStatus] = useState<Status>("idle");
  const [results, setResults] = useState<Hit[]>([]);

  const runSearch = async (raw: string) => {
    const q = raw.trim();
    latest.current = q;
    if (!q) {
      setResults([]);
      setStatus("idle");
      return;
    }
    setStatus("loading");
    try {
      const entries = await loadIndex();
      if (latest.current !== q) return; // a newer search started
      setResults(search(entries, q));
      setStatus("done");
    } catch {
      if (latest.current === q) setStatus("error");
    }
  };

  // Search for ?q= from the URL (the search box in the sidebar submits here).
  useEffect(() => {
    const q = new URLSearchParams(window.location.search).get("q") ?? "";
    if (!q || !inputRef.current) return;
    inputRef.current.value = q;
    const t = setTimeout(() => runSearch(q), 0);
    return () => clearTimeout(t);
  }, []);

  const onInput = (value: string) => {
    const url = new URL(window.location.href);
    if (value) url.searchParams.set("q", value);
    else url.searchParams.delete("q");
    window.history.replaceState(null, "", url);
    clearTimeout(timer.current);
    timer.current = setTimeout(() => runSearch(value), 150);
  };

  return (
    <>
      <header className="paper mb-8 px-6 py-10 text-center sm:px-12">
        <p className="caps text-[11px] font-bold text-accent">Search</p>
        <h1 className="mt-2 text-3xl font-bold text-ink-strong">Search the blog</h1>
        <div className="mx-auto mt-6 max-w-md">
          <label htmlFor="search-page" className="sr-only">Search</label>
          <input
            ref={inputRef}
            id="search-page"
            type="search"
            autoFocus
            onChange={(e) => onInput(e.target.value)}
            placeholder="Search articles, notes and prompts…"
            className="w-full border border-line bg-white px-3 py-3 text-lg text-ink outline-none placeholder:text-muted focus:border-accent"
            maxLength={100}
          />
        </div>
        {status === "done" && (
          <p className="mt-3 text-sm text-muted">
            {results.length} result{results.length === 1 ? "" : "s"}
          </p>
        )}
      </header>

      {status === "loading" && <p className="text-center text-muted">Searching…</p>}
      {status === "error" && (
        <p className="paper px-6 py-10 text-center text-muted">Search is not available right now. Please try again later.</p>
      )}
      {status === "done" && results.length === 0 && (
        <p className="paper px-6 py-10 text-center text-muted">Nothing matched your search. Try different words.</p>
      )}

      <ul className="space-y-6">
        {results.map((r) => (
          <li key={r.slug}>
            <Link href={`/${r.slug}/`} className="paper group block p-6 transition-shadow hover:shadow-lift">
              <h2 className="text-xl font-bold text-ink-strong group-hover:text-accent">{r.title}</h2>
              <p className="mt-2 text-sm leading-relaxed text-muted">
                {r.snippet ? (
                  <>
                    {r.snippet.before}
                    <mark className="bg-accent-soft text-ink">{r.snippet.match}</mark>
                    {r.snippet.after}
                  </>
                ) : (
                  r.excerpt
                )}
              </p>
              <p className="mt-3 text-xs text-muted">
                {formatDate(r.date)}
                {r.category && ` · ${r.category}`}
              </p>
            </Link>
          </li>
        ))}
      </ul>
    </>
  );
}
