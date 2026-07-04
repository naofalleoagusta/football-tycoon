# Football Tycoon — Build Plan

## Concept

Text/data-driven club management tycoon. Start broke, buy a real-world lower-division club (real names, generated squads), run finances, trade players/clubs, keep fans happy, maintain stadium. Not a match-engine sim first — economy/management sim first, match results simulated statistically.

## Tech Stack

Client-only, offline-first. No backend, no server DB.

- **Vite + React + TypeScript SPA**, installable as PWA (service worker + manifest) — works fully offline after first load.
- **Dexie.js (IndexedDB wrapper)** — local persistence for saves (clubs, players, ledger, fan mood, stadium, season state). Replaces server DB entirely; all reads/writes are local.
- **Zustand** — in-memory app state, synced to/from Dexie (load on boot, write-through or batched writes on mutation).
- **Save export/import** — dump save to JSON file + re-import, so users can back up or move a save between devices manually (no server sync).
- **Tailwind + shadcn/ui primitives** — themed hard, not left default (see Design Direction — avoid the templated shadcn-purple-gradient look).
- **Recharts or visx** — finance/attendance charts.
- Deterministic seeded RNG (e.g. `seedrandom`) for player gen + match sim, so saves are reproducible/debuggable, and multiple save slots stay independent.

## Design Direction (anti-slop guardrails)

Football management games (Football Manager, Out of the Park) read as *editorial and data-dense*, not "AI SaaS landing page." Concrete rules to keep this from looking templated:

- **No generic AI-slop tells**: no purple→blue gradient hero, no glassmorphism cards floating on blur blobs, no Inter-everywhere + rounded-2xl-everything, no emoji-as-icon, no stock "abstract shapes" background.
- **Palette**: pitch green (#15803D/#166534) + a competing accent (amber/gold #D97706 for money, or a club-specific primary once a club is bought) on a near-black slate background (#0F172A). Numbers use tabular figures.
- **Typography**: a grotesk for UI chrome (e.g. Inter/IBM Plex Sans is fine for body — the slop is in layout/color, not the font itself) + a condensed/sports-scoreboard display face for scores, prices, and the top nav wordmark, so it reads "sports broadcast" not "startup pricing page."
- **Density over whitespace**: tables, ledgers, squad lists are dense (8px rhythm, tabular nums), not spaced out like a marketing page. Dashboards should look like a spreadsheet + broadcast graphic hybrid, not a card grid.
- **Real identity, generated content clearly marked**: real club names/badges/leagues; generated players get a visibly "scouted" data sheet (attributes as bars/numbers) rather than fake photorealistic headshots — avoid AI-generated player face images, use initials/silhouette + nationality flag instead. This is a design choice, not a cop-out: photoreal AI faces for fake players is the single biggest "AI slop" tell for this genre.
- Full checklist from ui-ux-pro-max (contrast, touch targets, focus states, reduced motion) applies once real screens get built — run it per screen, not just once at the end.

## Core Systems

1. **Club ownership** — buy/sell real lower-division clubs (seed a dataset: name, country, league tier, starting finances/reputation/stadium). Valuation model based on finances + league tier + squad value.
2. **Players** — procedurally generated (name generator by nationality, age curve, position, attributes, potential, value formula). Transfer market: list/bid/negotiate, loans, contracts, wages.
3. **Club finance** — ledger (income: tickets, sponsorship, TV money, merchandising; expense: wages, transfers, stadium upkeep). Owner can inject personal money into club or withdraw club money to personal account (with fan/board reputation consequences for the latter).
4. **Fan relationship** — a "fan happiness" score driven by results, ticket prices, transfer activity, stadium condition, owner withdrawals. Decay/recovery model, protests/boosts at extremes.
5. **Stadium management** — capacity, ticket pricing tiers, facility quality, and **pitch/grass quality** (degrades with matches/weather, restored by groundskeeping spend; poor pitch hurts match quality + injury risk + fan mood).
6. **Match simulation** — lightweight statistical sim (not full engine) using squad ratings + tactics + pitch/fan/fatigue modifiers to produce results, feeding league tables and promotion/relegation.
7. **Progression** — league tiers with promotion/relegation, so buying a small club and rising is the core loop.

## Phases

### Phase 0 — Foundation
- Repo scaffold: Vite + React + TS + Tailwind + Dexie, PWA plugin wired (offline shell works from day one).
- Data model (TS types + Dexie schema/tables): Club, League, Player, Transfer, LedgerEntry, Stadium, FanMood, SaveGame.
- Seed dataset: top-flight + a couple lower tiers for **England, Spain, Italy, France, Portugal** (real club names, country, league tier, base reputation/finances) — curated JSON bundled with the app, expandable later.
- Local save system: create/load/delete save slots in IndexedDB, JSON export/import for backup.

### Phase 1 — Club Ownership Core
- Browse clubs by league tier, view finances/reputation/stadium snapshot.
- Buy a club with starting funds (small money → only lower-division clubs affordable).
- Sell/relinquish a club (valuation formula v1).
- Basic club dashboard: cash balance, league position placeholder.

### Phase 2 — Players & Transfer Market
- Player generator: name pool by nationality, position, age, attributes, potential, wage/value formula.
- Squad view per club (generated on club creation/purchase).
- Transfer market: list player for sale, bid on players, accept/reject, loan moves, contract length/wages.
- Player detail sheet (attribute bars, form, morale) — no AI face images (see Design Direction).

### Phase 3 — Finance & Fan Relationship
- Full ledger: recurring income (matchday, sponsorship, TV) + expenses (wages, upkeep, transfer fees).
- Owner ↔ club money transfers (donate to club / withdraw from club), each with fan/board reputation side effects.
- Fan happiness model: inputs (results, ticket price, transfer activity, honesty of ownership), decay/recovery curve, visible fan sentiment panel + events (protest, boost) at thresholds.

### Phase 4 — Stadium Management
- Stadium attributes: capacity, stand quality/tiers, ticket pricing, **pitch/grass quality**, floodlights, facilities.
- Upkeep spend allocation (groundskeeping budget) that maintains/improves pitch quality over time; neglect degrades it.
- Effects wired back into match sim (pitch quality → injury risk/match quality) and fan mood (facility quality → satisfaction).
- Stadium expansion/renovation as a capital project (cost, build time, capacity/reputation payoff).

### Phase 5 — Match Simulation & Competition
- Statistical match engine v1: squad rating + tactic setting + pitch/fatigue/fan-boost modifiers → score + key events.
- League table, fixture calendar, season cycle, promotion/relegation between tiers.
- Cup competition (optional stretch) for extra revenue events.

### Phase 6 — Progression, Polish & Anti-Slop Pass
- Multi-season save progression, milestones/achievements (first promotion, first trophy, first stadium expansion).
- Full UI pass against the ui-ux-pro-max checklist per screen (contrast, touch targets, focus states, dark-mode-only theme verified, no layout shift).
- Balance pass on economy numbers (starting money, wage inflation, transfer market liquidity) so early game (small club) and late game (big club) both feel earned, not grindy or trivial.

### Phase 7 — Stretch
- Multiplayer/shared leagues (compete against other owners in same league).
- Manager hiring/AI board objectives, sacking risk.
- Youth academy / scouting network as a player pipeline instead of pure market buys.

## Decisions Locked
- Persistence: client-only, IndexedDB (Dexie), offline-first PWA. No server/hosted DB.
- League scope: top 5 leagues — England, Spain, Italy, France, Portugal — top flight + a couple lower tiers each, for promotion/relegation and affordable starter clubs.
- Match sim depth: pure stat roll. Squad rating + tactic modifier + pitch/fatigue/fan modifiers → weighted random roll for score. No possession/event-by-event simulation.
