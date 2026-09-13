# Arc Mindless

WL site for Arc Mindless — 5555 mindless souls on ARC. Next.js (App Router) + Neon Postgres.

## Pages

- `/` — hero (eyebrow tag, glow title, tagline, ENTER WHITELIST button)
- `/sneak-peek` — preview gallery of generated NFT art
- `/roadmap` — phased roadmap, ending in `$MINDLESS | CA: TBA`
- `/whitelist` — the funnel: identity + 3 missions (follow/retweet/like, at least 2
  required) → whitelisted → confirm spot (quote-tweet link) → confirmed (+ share-on-X popup)

## Setup

```bash
npm install
```

Create a [Neon](https://neon.com) project, copy its connection string, and put it in
`.env.local` (already gitignored):

```
DATABASE_URL=postgresql://user:password@ep-xxxx.neon.tech/dbname?sslmode=require
```

Then run everything with:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). The `whitelist_entries` table is
created automatically on first request that touches the database.

## Structure

- `src/app/page.js`, `sneak-peek/`, `roadmap/`, `whitelist/` — the four routes
- `src/components/` — Navbar, Hero, SneakPeek, Roadmap, WhitelistForm, Whitelisted,
  ConfirmSpot, Confirmed, ShareModal
- `src/lib/config.js` — project constants (handle, announcement tweet URL, roadmap
  copy, sneak-peek image list — edit these)
- `src/lib/db.js` — Neon client, server-only
- `src/app/api/whitelist/` — route handlers (submit / confirm / lookup)
- `scripts/` — Python NFT trait extraction + generation from the master PSD (see below)

## NFT generation scripts

`scripts/extract_traits.py` and `scripts/generate.py` pull trait layers out of the master
PSD (path is hardcoded near the top of each file — update if it moves) and composite
randomized editions + metadata. Run with a real Python install, e.g.:

```bash
python scripts/extract_traits.py   # once, or whenever traits change in the PSD
python scripts/generate.py --count 100 --seed 42
```
