# AGENTS.md — Quote Generator App

## Commands

| Command | What it runs |
|---------|-------------|
| `npm run dev` | `next dev` (dev server on :3000) |
| `npm run build` | `next build` |
| `npm run lint` | `eslint` (flat config in `eslint.config.mjs`) |

No test or typecheck scripts exist. To typecheck manually: `npx tsc --noEmit`.

## Stack

- **Next.js 16** (App Router), **React 19**, **TypeScript 5**
- **Tailwind CSS 4** — uses `@tailwindcss/postcss` plugin (not the v3 `tailwindcss` plugin). No `tailwind.config.*` file.
- **ESLint 9 flat config** — `eslint.config.mjs` with `eslint-config-next/core-web-vitals` + `eslint-config-next/typescript`

## Conventions

- Path alias `@/*` → `./src/*`
- Font: Geist via CSS vars `--font-geist-sans`, `--font-geist-mono`
- Single-page app (no routes beyond `/`)
- Runtime dependency: [quotle.io API](https://api.quotable.io/random) with local fallback quotes on failure
- Prefer `"use client"` for interactive components (no server components used yet)

## Files

- `CLAUDE.md` delegates to this file via `@AGENTS.md`
- No CI, no tests, no pre-commit hooks
