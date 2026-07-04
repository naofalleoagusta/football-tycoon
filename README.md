# Football Tycoon

Offline-first football club management tycoon. See [PLAN.md](./PLAN.md) for
the full design and phased build plan.

Client-only app: no backend, no server DB. Save data lives in the browser's
IndexedDB (via Dexie); saves can be exported/imported as JSON files.

## Stack

- Vite + React + TypeScript, installable as a PWA (works offline)
- Dexie (IndexedDB) for local persistence
- Zustand for app state
- Tailwind CSS

## Develop

```bash
pnpm install
pnpm dev
```

## Build

```bash
pnpm build
```
