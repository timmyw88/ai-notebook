// Creates a new draft post:  npm run new-post "My post title"
import { existsSync, mkdirSync, writeFileSync } from "node:fs";

const title = process.argv.slice(2).join(" ").trim();
if (!title) {
  console.error('Usage: npm run new-post "My post title"');
  process.exit(1);
}

const slug = title
  .toLowerCase()
  .normalize("NFKD")
  .replace(/[̀-ͯ]/g, "")
  .replace(/[^a-z0-9\s-]/g, "")
  .trim()
  .replace(/[\s_-]+/g, "-")
  .slice(0, 80);

mkdirSync("content/posts", { recursive: true });
const file = `content/posts/${slug}.md`;
if (existsSync(file)) {
  console.error(`${file} already exists.`);
  process.exit(1);
}

const now = new Date().toISOString().slice(0, 16) + ":00Z";
writeFileSync(
  file,
  `---
title: ${JSON.stringify(title)}
date: ${now}
excerpt: ""
category: Notes
tags: []
featured: false
image: ""
imageAlt: ""
draft: true
---

Start writing here.

\`\`\`prompt title="My prompt"
Write your prompt here.
\`\`\`
`,
);
console.log(`Created ${file} (draft: true — set it to false to publish).`);
