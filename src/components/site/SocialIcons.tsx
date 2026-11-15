import { Globe, Rss } from "lucide-react";
import { withBase, type Social } from "@/lib/site";

/** Simple, original line icons in a circle (no third-party brand artwork). */
function Circle({ children }: { children: React.ReactNode }) {
  return (
    <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
      <circle cx="12" cy="12" r="10.5" />
      {children}
    </svg>
  );
}

const ICONS = {
  twitter: (
    <Circle>
      <path d="M8 7.5l8 9M16 7.5l-8 9" strokeLinecap="round" />
    </Circle>
  ),
  github: (
    <Circle>
      <path d="M9.5 9l-3 3 3 3M14.5 9l3 3-3 3" strokeLinecap="round" strokeLinejoin="round" />
    </Circle>
  ),
  linkedin: (
    <Circle>
      <path d="M8.5 10.5v5.5M8.5 7.8v.1M11.5 16v-5.5M11.5 12.8c0-1.5 1-2.3 2.2-2.3s2 .8 2 2.3V16" strokeLinecap="round" />
    </Circle>
  ),
  youtube: (
    <Circle>
      <path d="M10 8.8v6.4l5.3-3.2z" strokeLinejoin="round" />
    </Circle>
  ),
} as const;

const LABELS: Record<keyof Social, string> = {
  twitter: "X (Twitter)",
  github: "GitHub",
  linkedin: "LinkedIn",
  youtube: "YouTube",
  website: "Website",
};

export default function SocialIcons({ social, className = "" }: { social: Social; className?: string }) {
  const entries = (Object.keys(LABELS) as (keyof Social)[]).filter((k) => social[k]);
  return (
    <ul className={`flex flex-wrap items-center gap-3 ${className}`}>
      {entries.map((k) => (
        <li key={k}>
          <a href={social[k]} target="_blank" rel="noopener noreferrer me" aria-label={LABELS[k]} title={LABELS[k]} className="block text-ink-strong transition-colors hover:text-accent">
            {k === "website" ? <Globe size={22} strokeWidth={1.5} /> : ICONS[k]}
          </a>
        </li>
      ))}
      <li>
        <a href={withBase("/rss.xml")} aria-label="RSS feed" title="RSS feed" className="block text-ink-strong transition-colors hover:text-accent">
          <Rss size={20} strokeWidth={1.75} />
        </a>
      </li>
    </ul>
  );
}
