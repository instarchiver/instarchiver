# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

@AGENTS.md

## Commands

```bash
npm run dev       # Start development server (localhost:3000)
npm run build     # Production build
npm run start     # Run production server
npm run lint      # Run ESLint
```

No test runner is configured.

## Stack

- **Next.js 16.2.4** with App Router (`/app` directory)
- **React 19** — server components by default; add `"use client"` only when needed
- **Tailwind CSS 4** — configured via PostCSS (`@tailwindcss/postcss`), no `tailwind.config.*` file
- **TypeScript** — strict mode, path alias `@/*` resolves to project root
- **Material Icons** — loaded via CDN in root layout

## Architecture

### Route layout

```text
app/
├── page.tsx                 # "/" → redirects to /login
├── layout.tsx               # Root: ThemeProvider, fonts
├── globals.css              # CSS variables + Tailwind base
├── (auth)/                  # Route group: /login, /register
├── dashboard/               # /dashboard (layout has sidebar/topbar shell)
├── components/              # Shared UI components
│   └── auth/                # Auth-page-specific components
├── lib/config.ts            # Static nav links, team members, user profile
└── providers/ThemeProvider.tsx  # Theme context + useTheme hook
```

### Responsive layout strategy

The dashboard uses three distinct layouts controlled by Tailwind breakpoints:

| Breakpoint | Layout |
| --- | --- |
| mobile (default) | `MobileNavBar` (top) + `MobileTabBar` (bottom) |
| `lg:` (1024px) | `SidebarCompact` (78px, icon-only) + `TopBar` |
| `xl:` (1280px) | `Sidebar` (300px, full) + `TopBar` + `Footer` |

### Theme system

`ThemeProvider` wraps the root layout. It reads/writes `localStorage` (`theme` key) and falls back to `prefers-color-scheme`. Theme-aware styles are defined as CSS variables in `globals.css` (`--color-surface`, `--color-on-surface`, etc.) and exposed as Tailwind utilities (`bg-surface`, `text-on-surface`, `border-outline`, etc.).

### Styling conventions

- All icons use Material Icons (`<span className="material-icons">icon_name</span>`)
- Custom shadow utilities are defined in `globals.css`: `shadow-hard-sm`, `shadow-hard-md`, `shadow-hard-lg`
- Safe-area insets: `pt-safe`, `pb-safe`, `pl-safe`, `pr-safe` for notch devices
- Brand primary color: `#AE7AFF` (purple), exposed as `--color-primary`

### Current state

Auth forms (`/login`, `/register`) are UI-only — no API routes or authentication logic exist. The `/dashboard` page returns `null`. No database is configured.
