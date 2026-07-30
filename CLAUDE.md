# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

@AGENTS.md

## Project state

This is a freshly bootstrapped `create-next-app` project (Next.js 16.2.12, React 19.2.4) — the `app/` directory still contains only the default scaffold (`layout.tsx`, `page.tsx`, `globals.css`). No custom routes, components, or backend logic exist yet. Treat any architectural description here as a starting point that will grow as real features are added, not as a fixed structure to preserve.

## Commands

```bash
npm run dev      # start dev server (http://localhost:3000)
npm run build    # production build
npm run start    # run production build
npm run lint     # eslint (flat config, eslint-config-next)
```

There is no test runner configured yet.

## Architecture

- **App Router** (`app/`): all routing, layouts, and pages live here. `app/layout.tsx` is the root layout (loads Geist fonts, sets global HTML/body structure); `app/page.tsx` is the root page.
- **Styling**: Tailwind CSS v4 via `@tailwindcss/postcss` (see `postcss.config.mjs`). No `tailwind.config.*` file — v4 configures via CSS (`app/globals.css`) rather than a JS config.
- **Path alias**: `@/*` maps to the repo root (`tsconfig.json`).
- **TypeScript**: `strict` mode is on.

## Working with ambiguity

Don't assume when a request or requirement is unclear. Ask the user for clarification before proceeding, rather than guessing their intent.

## Critical: this Next.js version is not the one you trained on

AGENTS.md flags that this Next.js release has breaking changes vs. training data. Local docs are vendored at `node_modules/next/dist/docs/` — read the relevant page there (e.g. `01-app/01-getting-started/` for routing/data-fetching/caching basics, `01-app/03-api-reference/` for API specifics) before writing App Router code, especially anything touching caching, data fetching, or route handlers, since those are the areas most likely to have changed.
