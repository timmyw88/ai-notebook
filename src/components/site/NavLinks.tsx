"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function NavLinks({
  items,
  align = "right",
}: {
  items: { href: string; label: string }[];
  align?: "left" | "right";
}) {
  const pathname = usePathname();
  return (
    <ul className="border-t border-line">
      {items.map((item) => {
        const active = item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);
        return (
          <li key={item.href} className="border-b border-line">
            <Link
              href={item.href}
              className={`caps block py-2 text-[15px] transition-colors hover:text-accent ${
                align === "right" ? "text-right" : "text-left"
              } text-ink-strong ${active ? "font-bold" : ""}`}
              aria-current={active ? "page" : undefined}
            >
              {item.label}
            </Link>
          </li>
        );
      })}
    </ul>
  );
}
