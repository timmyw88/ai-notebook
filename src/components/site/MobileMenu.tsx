"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";

export default function MobileMenu({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [state, setState] = useState({ open: false, path: pathname });
  // Close the menu whenever the route changes.
  if (state.path !== pathname) setState({ open: false, path: pathname });
  const open = state.open;

  return (
    <>
      <button
        type="button"
        className="shrink-0 p-1 text-ink-strong"
        aria-expanded={open}
        aria-controls="mobile-menu"
        aria-label={open ? "Close menu" : "Open menu"}
        onClick={() => setState((s) => ({ ...s, open: !s.open }))}
      >
        {open ? <X size={24} /> : <Menu size={24} />}
      </button>
      <div
        id="mobile-menu"
        hidden={!open}
        className="absolute inset-x-0 top-full max-h-[calc(100vh-64px)] overflow-y-auto border-t border-line bg-white px-5 pt-4 pb-8 shadow-paper"
      >
        <div className="mx-auto max-w-3xl">{children}</div>
      </div>
    </>
  );
}
