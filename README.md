# Steven Wu — Portfolio

Built with [TanStack Start](https://tanstack.com/start) (file-based routing, React 19) and Tailwind CSS v4. The whole site is prerendered to static HTML at build time — no server required at runtime.

## Available Scripts

### `npm run dev`

Runs the app in development mode at [http://localhost:3000](http://localhost:3000).

### `npm run build`

Builds and prerenders every route to static HTML/CSS/JS in `dist/client`.

### `npm run preview`

Serves the production build locally to sanity-check it before deploying.

### `npm run deploy`

Builds the site and publishes `dist/client` to the `gh-pages` branch via the `gh-pages` package.

## Structure

- `src/routes/` — one file per page (`index.tsx` = Home, `about.tsx`, `contact.tsx`), each exporting its own route metadata (`<title>`, meta tags).
- `src/data/timeline.ts` — the single source of truth for the About page's experience/project timeline.
- `src/components/site-nav.tsx` — shared nav + page shell used by every route.
- `src/styles.css` — design tokens (colors, fonts) and Tailwind v4 setup.
