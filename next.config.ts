import type { NextConfig } from "next";

// GitHub Pages serves the site from https://<owner>.github.io/<repo>/,
// so production builds need that sub-path. Local `npm run dev` stays at "/".
const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

const nextConfig: NextConfig = {
  // static HTML/CSS/JS in ./out — no Node server needed
  output: "export",
  basePath,
  assetPrefix: basePath || undefined,
  // emit /sessions/who-am-i/index.html so static hosts resolve the URL
  trailingSlash: true,
  images: { unoptimized: true },
  // note: cacheComponents / partialPrefetching (PPR) need a server and can't be used with output: "export"
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
