// @lovable.dev/vite-tanstack-config already includes TanStack devtools, tanstackStart,
// viteReact, tailwindcss, tsConfigPaths, the @ path alias, and React/TanStack dedupe.
// Do NOT add those manually or the app will break with duplicate plugins.
import { defineConfig } from "@lovable.dev/vite-tanstack-config";

export default defineConfig({
  // This repository is named 22stevenwu.github.io, so GitHub Pages serves it
  // from the domain root rather than from a project subdirectory.
  vite: {
    base: "/",
  },
  // This site is fully static (no server functions, no dynamic data), so it's
  // deployed as prerendered HTML to GitHub Pages rather than through Nitro/a
  // Node server. `crawlLinks` walks every route reachable from `/` at build time.
  nitro: false,
  tanstackStart: {
    prerender: {
      enabled: true,
      crawlLinks: true,
    },
  },
});
