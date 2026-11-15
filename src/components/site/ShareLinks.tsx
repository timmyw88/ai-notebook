"use client";

import { useState } from "react";
import { Link2, Mail, Check } from "lucide-react";

export default function ShareLinks({ url, title }: { url: string; title: string }) {
  const [copied, setCopied] = useState(false);
  const u = encodeURIComponent(url);
  const t = encodeURIComponent(title);
  const links = [
    { label: "X", href: `https://x.com/intent/post?url=${u}&text=${t}` },
    { label: "LinkedIn", href: `https://www.linkedin.com/sharing/share-offsite/?url=${u}` },
    { label: "Facebook", href: `https://www.facebook.com/sharer/sharer.php?u=${u}` },
    { label: "Reddit", href: `https://www.reddit.com/submit?url=${u}&title=${t}` },
  ];
  return (
    <div className="flex flex-wrap items-center gap-2">
      <span className="caps mr-1 text-[11px] font-bold text-muted">Share</span>
      {links.map((l) => (
        <a
          key={l.label}
          href={l.href}
          target="_blank"
          rel="noopener noreferrer"
          className="border border-line px-3 py-1.5 text-xs text-ink-strong transition-colors hover:border-accent hover:text-accent"
        >
          {l.label}
        </a>
      ))}
      <a
        href={`mailto:?subject=${t}&body=${u}`}
        aria-label="Share by email"
        className="border border-line p-1.5 text-ink-strong transition-colors hover:border-accent hover:text-accent"
      >
        <Mail size={15} />
      </a>
      <button
        type="button"
        aria-label="Copy link"
        onClick={async () => {
          await navigator.clipboard.writeText(url);
          setCopied(true);
          setTimeout(() => setCopied(false), 1500);
        }}
        className="border border-line p-1.5 text-ink-strong transition-colors hover:border-accent hover:text-accent"
      >
        {copied ? <Check size={15} /> : <Link2 size={15} />}
      </button>
    </div>
  );
}
