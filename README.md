# InstArchiver

An Instagram archiver, because apparently the world needed one more. Next.js frontend for browsing users, posts, and stories that a Django backend hoards on your behalf so you don't have to.

## It does

- Infinite-scrolling grids of archived users/posts/stories, virtualized so it doesn't eat your RAM. It used to. We fixed it. Mostly.
- Search + sort, synced to the URL, debounced like it's not 2009.
- "Similar Posts/Stories," courtesy of `pgvector` embeddings the backend swears by. Vibes-based, but it works.
- SSR titles, so link previews don't all just say "InstArchiver" forever.
- Dark mode. A footer with an actual email in it. We have standards, occasionally.

## Stack

Next.js 16 (App Router, newer than you think — check `node_modules/next/dist/docs/` before assuming anything), React 19, Tailwind v4, TanStack Query + Virtual, TypeScript strict. No tests. Don't ask.

## Run it

```bash
npm install
cp .env.example .env.local   # NEXT_PUBLIC_API_URL, point it at a backend
npm run dev
```

`build`, `start`, `lint` also exist and do the obvious thing.

## The backend

`instarchiver-backend`, sibling repo: Django + Postgres/pgvector + Celery + Stripe + Firebase + more observability tooling than its one-person `CONTRIBUTORS.txt` deserves. It doesn't scrape Instagram itself — that's outsourced to an internal service that keeps its own secrets. Its README tells you to open `/admin/` and "pretend you're in charge." Hard to top.

## Receipts

Bugs this thing actually shipped with, briefly: a grid stuck at 2 columns because a `ResizeObserver` watched a skeleton that vanished before real content mounted; rows glued together because "row height" ≠ "row height + gap"; scroll position surviving navigation because Next's `<Link>` decided your new page counted as "still visible." All fixed. Probably.

## License

None on file. It's provided as-is, by someone who will judge you for the copy-paste.
