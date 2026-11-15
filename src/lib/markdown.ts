import { unified } from "unified";
import remarkParse from "remark-parse";
import remarkGfm from "remark-gfm";
import remarkRehype from "remark-rehype";
import rehypeHighlight from "rehype-highlight";
import rehypeStringify from "rehype-stringify";
import { visit, SKIP } from "unist-util-visit";
import type { Root, Paragraph, Code, Image, Link, Text } from "mdast";
import type { Root as HastRoot, Element } from "hast";
import { parseYouTubeId } from "./utils";
import { withBase } from "./site";

/**
 * Markdown → HTML at build time.
 *
 * Extras on top of normal Markdown (+ GitHub tables, task lists, strikethrough):
 *   ```prompt title="Summarize an article"   → copyable prompt box
 *   a line that is only a YouTube URL          → responsive youtube-nocookie embed
 *   ![alt](/images/x.webp "Caption")           → <figure> with caption
 *   ```python                                  → syntax highlighting
 * Raw HTML inside Markdown is NOT rendered (safer, and keeps posts portable).
 */

const el = (tagName: string, properties: Record<string, unknown>, children: unknown[] = []) => ({
  type: "element",
  tagName,
  properties,
  children,
});
const txt = (value: string) => ({ type: "text", value });

function remarkBlogBlocks() {
  return (tree: Root) => {
    visit(tree, (node, index, parent) => {
      if (!parent || index === undefined) return;

      // ```prompt title="..."  → prompt box
      if (node.type === "code" && (node as Code).lang === "prompt") {
        const code = node as Code;
        const title = code.meta?.match(/title=(?:"([^"]*)"|'([^']*)'|(\S+))/);
        const label = title ? (title[1] ?? title[2] ?? title[3]) : "Prompt";
        parent.children[index] = {
          type: "paragraph",
          children: [],
          data: {
            hName: "div",
            hProperties: { className: ["prompt-block"] },
            hChildren: [
              el("div", { className: ["prompt-head"] }, [
                el("span", { className: ["prompt-title"] }, [txt(label)]),
                el("button", { type: "button", className: ["prompt-copy"] }, [txt("Copy")]),
              ]),
              el("pre", { className: ["prompt-text"] }, [txt(code.value)]),
            ],
          },
        } as unknown as Paragraph;
        return SKIP;
      }

      if (node.type !== "paragraph") return;
      const p = node as Paragraph;
      const only = p.children.filter((c) => !(c.type === "text" && !c.value.trim()));
      if (only.length !== 1) return;
      const child = only[0];

      // A paragraph that is only a YouTube link → embed
      const url =
        child.type === "link" ? (child as Link).url : child.type === "text" ? (child as Text).value.trim() : "";
      const id = url && /youtu\.?be/.test(url) ? parseYouTubeId(url) : null;
      if (id) {
        p.data = {
          hName: "div",
          hProperties: { className: ["video-embed"] },
          hChildren: [
            el("iframe", {
              src: `https://www.youtube-nocookie.com/embed/${id}`,
              title: "YouTube video",
              loading: "lazy",
              allow: "accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share",
              allowFullScreen: true,
              referrerPolicy: "strict-origin-when-cross-origin",
            }),
          ],
        } as Paragraph["data"];
        return SKIP;
      }

      // A paragraph that is only an image → <figure> (title becomes the caption)
      if (child.type === "image") {
        const img = child as Image;
        p.data = {
          hName: "figure",
          hProperties: { className: ["post-figure"] },
          hChildren: [
            el("img", { src: img.url, alt: img.alt ?? "", loading: "lazy" }), // base path added in rehypeLinks
            ...(img.title ? [el("figcaption", {}, [txt(img.title)])] : []),
          ],
        } as Paragraph["data"];
        return SKIP;
      }
    });
  };
}

/** Prefix site-relative links/images with the base path and open external links in a new tab. */
function rehypeLinks() {
  return (tree: HastRoot) => {
    visit(tree, "element", (node: Element) => {
      if (node.tagName === "img" && typeof node.properties.src === "string") {
        node.properties.src = withBase(node.properties.src);
        node.properties.loading ??= "lazy";
      }
      if (node.tagName === "a" && typeof node.properties.href === "string") {
        const href = node.properties.href;
        if (/^https?:\/\//.test(href)) {
          node.properties.target = "_blank";
          node.properties.rel = ["noopener", "noreferrer"];
        } else {
          node.properties.href = withBase(href);
        }
      }
      // Wrap tables so they scroll horizontally on phones
      if (node.tagName === "table" && !(node.data as { wrapped?: boolean } | undefined)?.wrapped) {
        const table: Element = { ...node, data: { wrapped: true } as Element["data"] };
        node.tagName = "div";
        node.properties = { className: ["table-wrap"] };
        node.children = [table];
      }
    });
  };
}

const processor = unified()
  .use(remarkParse)
  .use(remarkGfm)
  .use(remarkBlogBlocks)
  .use(remarkRehype) // raw HTML in Markdown is dropped
  .use(rehypeHighlight, { detect: false })
  .use(rehypeLinks)
  .use(rehypeStringify);

export function markdownToHtml(markdown: string): string {
  return String(processor.processSync(markdown));
}

/** Text for the search index: like markdownToText but keeps code and prompt contents. */
export function markdownToSearchText(markdown: string): string {
  return markdown
    .replace(/^```.*$/gm, " ")
    .replace(/!\[([^\]]*)\]\([^)]*\)/g, "$1")
    .replace(/\[([^\]]*)\]\([^)]*\)/g, "$1")
    .replace(/https?:\/\/\S+/g, " ")
    .replace(/[#>*_`~|]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

/** Plain text (for word count, excerpts and search fallbacks). */
export function markdownToText(markdown: string): string {
  return markdown
    .replace(/```[\s\S]*?```/g, " ")
    .replace(/!\[[^\]]*\]\([^)]*\)/g, " ")
    .replace(/\[([^\]]*)\]\([^)]*\)/g, "$1")
    .replace(/https?:\/\/\S+/g, " ")
    .replace(/[#>*_`~|-]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}
