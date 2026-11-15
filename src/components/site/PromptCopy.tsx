"use client";

import { useEffect, useRef } from "react";

/**
 * Wires up the "Copy" buttons rendered inside prompt blocks of server-rendered post HTML.
 * Uses one delegated click listener on the article.
 */
export default function PromptCopy({ children }: { children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = ref.current;
    if (!root) return;
    const timers = new Map<HTMLElement, ReturnType<typeof setTimeout>>();

    const onClick = async (e: MouseEvent) => {
      const button = (e.target as HTMLElement).closest<HTMLButtonElement>(".prompt-copy");
      if (!button || !root.contains(button)) return;
      const text = button.closest(".prompt-block")?.querySelector(".prompt-text")?.textContent ?? "";
      try {
        await navigator.clipboard.writeText(text);
      } catch {
        // Fallback for older browsers / non-secure contexts
        const ta = document.createElement("textarea");
        ta.value = text;
        ta.style.position = "fixed";
        ta.style.opacity = "0";
        document.body.appendChild(ta);
        ta.select();
        document.execCommand("copy");
        ta.remove();
      }
      button.textContent = "Copied!";
      button.dataset.copied = "true";
      clearTimeout(timers.get(button));
      timers.set(
        button,
        setTimeout(() => {
          button.textContent = "Copy";
          delete button.dataset.copied;
        }, 2000),
      );
    };

    root.addEventListener("click", onClick);
    return () => {
      root.removeEventListener("click", onClick);
      timers.forEach((t) => clearTimeout(t));
    };
  }, []);

  return <div ref={ref}>{children}</div>;
}
