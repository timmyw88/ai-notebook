import type { NextConfig } from "next";

// GitHub Pages serves a project site from https://<user>.github.io/<repo>/,
// so every URL needs the "/<repo>" prefix. The workflow sets NEXT_PUBLIC_BASE_PATH;
// it is empty locally and when you use a custom domain.
const basePath = (process.env.NEXT_PUBLIC_BASE_PATH || "").replace(/\/$/, "");

const nextConfig: NextConfig = {
  // Build plain HTML/CSS/JS files into ./out (no server needed).
  output: "export",
  // /my-post/ → out/my-post/index.html, which GitHub Pages serves without extra config.
  trailingSlash: true,
  basePath,
  // Image optimisation needs a server; images are served as-is.
  images: { unoptimized: true },
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
