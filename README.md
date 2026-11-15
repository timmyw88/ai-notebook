# AI Knowledge Blog

A simple, clean personal blog for recording what you learn about AI: articles, notes and prompts.
It is a **static site**: posts are Markdown files in this repository, and **GitHub Pages** hosts it for free.
There is no database, no server, no login and no comments.

- **Next.js 16** (static export) · TypeScript · **Tailwind CSS 4**
- Markdown posts with **prompt boxes** (Copy button), **YouTube embeds**, code highlighting, tables and image captions
- Home with featured posts, categories, tags, pagination, in-browser search, About page, 404
- SEO: per-page metadata, Open Graph / Twitter cards, canonical URLs, JSON-LD `Article`, `sitemap.xml`, `robots.txt`, `rss.xml`
- Deployed by **GitHub Actions** on every push, and rebuilt daily so scheduled posts appear on their date

---

## 1. Run it on your computer

You need **Node.js 22 LTS** (<https://nodejs.org>) and **Git**.

```bash
npm install
npm run dev
```

Open <http://localhost:3000>. The page reloads when you save a post.
In `npm run dev`, **drafts and future-dated posts are shown** so you can preview them.

Check the real build (exactly what GitHub Pages will serve):

```bash
npm run build      # writes the site to ./out
npm run preview    # serves ./out at http://localhost:3000
```

## 2. Write a post

Create a file in `content/posts/`. **The file name becomes the URL**:
`content/posts/my-first-post.md` → `/my-first-post/`.

Quick start:

```bash
npm run new-post "My first post"
```

A post looks like this:

````markdown
---
title: Getting Started with Prompt Engineering
date: 2026-11-14T09:00:00Z      # publish date; a future date = scheduled
excerpt: Short summary for cards and search results (optional)
category: Prompting
tags: [prompts, basics]
featured: true                   # show at the top of the home page
image: /images/my-cover.webp     # featured image (optional)
imageAlt: Describe the image
draft: false                     # true = not published
metaTitle: ""                    # optional SEO overrides
metaDescription: ""
ogImage: ""
---

Normal **Markdown** text, lists, [links](https://example.com), tables, > quotes…

```prompt title="Summarize an article"
You are a helpful editor.
Summarize the text below in 3 bullet points.
```

```python
print("Code blocks are highlighted")
```

![Alt text](/images/diagram.webp "This becomes the caption")

https://www.youtube.com/watch?v=VIDEO_ID
````

Rules for the special blocks:

| You write | You get |
|---|---|
| ` ```prompt title="My title" ` … ` ``` ` | A prompt box with a **Copy** button (line breaks are kept) |
| A YouTube link **alone on its own line** | A responsive 16:9 video (privacy-friendly youtube-nocookie.com) |
| `![alt](/images/x.webp "Caption")` alone on a line | Image with a caption underneath |
| ` ```js `, ` ```python `, ` ```bash `… | Syntax-highlighted code |

**Images:** put them in `public/images/` and use `/images/file-name.webp`. Keep them small: export as WebP or
JPEG, about 1600 px wide. Full image URLs (`https://…`) work too.

**Categories:** `category:` can be any name. To add a description, add it to `categories` in `content/site.json`.
The key is the lowercase, dash-separated name, e.g. `"prompting"` for `Prompting`.

**Scheduled posts:** give a post a future `date`. The daily rebuild publishes it on that day (06:00 UTC), or as
soon as you push anything after that date.

## 3. Site settings

Edit `content/site.json`: site title, tagline, author name, logo, favicon, posts per page, social links and
category descriptions. Edit the About page in `content/about.md`.

## 4. Put it on GitHub Pages

1. Create a repository on GitHub (e.g. `ai-knowledge-blog`). Public is required for free GitHub Pages
   (private works on paid plans).
2. Push this project:

   ```bash
   git add -A
   git commit -m "My AI blog"
   git branch -M main
   git remote add origin https://github.com/YOUR-USER/ai-knowledge-blog.git
   git push -u origin main
   ```

3. On GitHub: repository → **Settings → Pages** → **Build and deployment → Source: GitHub Actions**.
4. Open the **Actions** tab. The "Deploy to GitHub Pages" workflow builds and publishes the site (about 1–2 minutes).
5. Your blog is live at `https://YOUR-USER.github.io/ai-knowledge-blog/`.

From now on, **every push to `main` updates the site**. You can also edit or add posts directly on github.com
(open `content/posts`, then **Add file → Create new file**). Committing there triggers a deploy too.

> The workflow sets the site URL and the `/ai-knowledge-blog` sub-path automatically, so all links and images
> work under GitHub's sub-folder. If you name the repository `YOUR-USER.github.io`, the site lives at the root instead.

## 5. Use your own domain (optional)

1. Repository → **Settings → Pages → Custom domain** → enter e.g. `blog.example.com` → **Save**.
2. At your domain's DNS provider:
   - Subdomain (`blog.example.com`): add a **CNAME** record `blog` → `YOUR-USER.github.io`
   - Root domain (`example.com`): add **A** records for `@` pointing to `185.199.108.153`, `185.199.109.153`,
     `185.199.110.153`, `185.199.111.153`
3. Wait for the DNS check to pass, then tick **Enforce HTTPS**.
4. Re-run the workflow (**Actions → Deploy to GitHub Pages → Run workflow**) so links, sitemap and RSS use the new domain.

## 6. Write in the browser (optional)

`.pages.yml` configures [Pages CMS](https://pagescms.org), a free editor that signs in with GitHub and saves posts as
Markdown files in this repository. Open pagescms.org, sign in and pick the repository. The content field is plain
Markdown, so prompt blocks and YouTube links work the same way. (This config is a starting point and has not been
tested against your account; editing files on GitHub or in VS Code always works.)

## Project structure

```
content/
├─ posts/*.md            Your posts (file name = URL)
├─ about.md              About page
└─ site.json             Site settings
public/images/           Images for posts
src/
├─ app/                  Pages: home, [slug], category, tag, search, about, 404, sitemap, robots, rss, search index
├─ components/site/      Sidebar, cards, article, pagination, search, share links…
└─ lib/
   ├─ posts.ts           Reads and validates posts at build time
   ├─ markdown.ts        Markdown → HTML (prompt boxes, YouTube, figures, highlighting)
   └─ site.ts            Settings, base path and URL helpers
scripts/new-post.mjs     `npm run new-post "Title"`
.github/workflows/deploy.yml   Build + deploy to GitHub Pages
```

## Commands

| Command | What it does |
|---|---|
| `npm run dev` | Local preview with live reload (shows drafts) |
| `npm run new-post "Title"` | Creates a new draft post |
| `npm run build` | Builds the static site into `out/` |
| `npm run preview` | Serves `out/` locally |
| `npm run lint` / `npm run typecheck` | Code checks |

## Troubleshooting

| Problem | Fix |
|---|---|
| Build fails with `front matter "date"…` | Every post needs a `title` and a valid `date` (e.g. `2026-11-14` or `2026-11-14T09:00:00Z`). |
| A post doesn't show on the live site | Check `draft: false` and that `date` is not in the future. |
| Site has no styles / broken links on GitHub | Make sure Pages **Source** is "GitHub Actions" (not "Deploy from a branch"). |
| Image doesn't show | The file must be in `public/images/` and the path must start with `/images/`. File names are case-sensitive on GitHub. |
| Search finds nothing locally | Search uses `search-index.json`, which exists after `npm run build` (use `npm run preview`) and also works in `npm run dev`. |

## Security notes

- There is nothing to log in to and no database, so there is nothing to hack on the server side.
- Markdown is rendered at build time and **raw HTML in posts is ignored**, so a post can't inject scripts.
- Never commit secrets: this project doesn't need any.
