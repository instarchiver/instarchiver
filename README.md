# Instagram Archiver

Because Instagram still hasn't figured out how to let you save stories yourself. Revolutionary.

## What is this?

A web app to archive Instagram stories and user profiles. Uses Next.js 15, looks good with Neo Brutalism design, and React Query so we're not fetching the same data every 3 seconds like animals.

## Getting Started

```bash
# Install things
npm install

# Run it
npm run dev
```

Go to [http://localhost:3000](http://localhost:3000). If it errors, read again from the top.

## Environment

```bash
# Optional, already has a default
NEXT_PUBLIC_INSTAGRAM_API_BASE_URL=https://api.animemoe.us
```

## Commands

| Command              | What it does                            |
| -------------------- | --------------------------------------- |
| `npm run dev`        | Start dev server                        |
| `npm run build`      | Build for production                    |
| `npm run lint`       | Fix your messy code                     |
| `npm run type-check` | Check TypeScript, run before committing |

## Tech Stack

- **Next.js 15** - Framework
- **React Query** - Data fetching so you don't have to write `useEffect` + `fetch` like it's 2018
- **Tailwind CSS 4** - Styling
- **TypeScript** - So bugs show up before production, not during

## License

MIT. Use freely, but if it breaks, that's on you.
