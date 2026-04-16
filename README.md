# Stir One Another Up

A lifegroup reflection and prayer app built around Hebrews 10:24–25. Four parts: self-reflection (pick-a-card), group vision (Dream Bingo), prayer pass, and a kids' zone (mission cards + Draw-a-Friend).

## Quick start

### 1. Create an Upstash Redis database

The app uses Upstash Redis for shared storage — it has a free tier that comfortably covers a lifegroup and works natively with Vercel's edge runtime.

1. Go to [console.upstash.com](https://console.upstash.com) and sign up (free).
2. Click **Create Database**. Pick the region closest to your users — for Malaysia, **ap-southeast-1 (Singapore)** is ideal.
3. On the database page, scroll to **REST API** and copy:
   - `UPSTASH_REDIS_REST_URL`
   - `UPSTASH_REDIS_REST_TOKEN`

### 2. Run locally

```bash
# Install dependencies (using uv-style speed with npm — or swap in bun/pnpm)
npm install

# Create .env.local
cp .env.example .env.local
# Paste your Upstash URL + token into .env.local

# Dev server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### 3. Deploy to Vercel

```bash
# Install Vercel CLI if you don't have it
npm i -g vercel

# From the project root
vercel

# Add env vars (for production + preview + dev)
vercel env add UPSTASH_REDIS_REST_URL
vercel env add UPSTASH_REDIS_REST_TOKEN
vercel env add NEXT_PUBLIC_GROUP_ID

# Deploy to production
vercel --prod
```

Or link the repo in the Vercel dashboard and add env vars through the UI.

## Architecture

- **Framework**: Next.js 14 App Router, all API routes on edge runtime for low-latency reads/writes globally.
- **Storage**: Upstash Redis via `@upstash/redis`. All keys scoped under `stirup:{GROUP_ID}:{kind}:{id}`.
- **State**: Client-side React state during a session; Redis for anything shared across users. User ID is generated once per browser session and kept in `sessionStorage`.
- **Type safety**: TypeScript throughout. Payload types are co-located with their API routes.

### Data model

| Key pattern | Payload | Notes |
|---|---|---|
| `stirup:{group}:reflect:{userId}` | pick-a-card answers + optional prayer notes + per-answer `shareFlags` | One per user. Overwrites on re-submit. |
| `stirup:{group}:bingo:{userId}` | up to 7 tile picks + optional wildcard | One per user. |
| `stirup:{group}:prayer:{userId}` | prayer text + anonymous flag + `prayedCount` | One per user. Counter incremented via `/api/prayer/pray`. |
| `stirup:{group}:drawing:{userId}-{timestamp}` | JPEG data URL + recipient name | Multiple per user allowed. |

### Privacy

- The reflection API returns everyone's raw data; the **client filters by `shareFlags`** before displaying prayer notes. This is a trusted-group model — fine for a small lifegroup but not hardened against a determined user reading network responses. Worth knowing if the group is larger or mixed trust.
- The prayer pass supports anonymity per-request.
- No names or content is logged on the server beyond what's in Redis.

## Running multiple lifegroups

Set a different `NEXT_PUBLIC_GROUP_ID` per lifegroup (or per weekly meeting, to reset state):

- `NEXT_PUBLIC_GROUP_ID=bangi-tues` — Peter's Tuesday lifegroup
- `NEXT_PUBLIC_GROUP_ID=pj-thurs` — PJ Thursday lifegroup
- `NEXT_PUBLIC_GROUP_ID=2026-week-16` — reset every week

Changing this env var completely isolates data. Redeploy (or just restart dev) for it to take effect.

To reset a single group without changing the ID, you can flush its keys via the Upstash console or a quick script using the scan pattern `stirup:{group}:*`.

## Customizing content

All content is in **`lib/content.ts`**:

- `AREAS` — the five self-reflection areas and their 5 pick-a-card statements each. Change the card wording to match your group's vocabulary.
- `BINGO_TILES` — 24 tiles (the 24th is a write-in wildcard). Swap in tiles that fit your church context.
- `KID_MISSIONS` — 10 kindness missions drawn randomly.

Colour tokens live in `lib/content.ts` (`tokens`) and `app/globals.css` (CSS vars). Fonts: Fraunces (display) + Lora (body) from Google Fonts.

## Facilitator tips

- **Have everyone submit prayers before collecting.** The prayer pass needs ≥2 people who have submitted before anyone gets assigned someone else's. If you're first, the UI prompts you to "check again" — so the group flow is: (1) everyone writes their prayer, (2) then everyone taps to receive.
- **The bingo results update only on submit.** So after everyone casts their vote, have the last person's results screen projected — that's the "group consensus" moment.
- **The reflection results show aggregated bars from everyone** plus individually-shared prayer notes. Consider projecting this on a screen while individuals keep their phones face-down — it reinforces the "put the phone down and talk" rhythm.

## Costs

Upstash free tier: 500k commands/month, 256MB storage. A lifegroup of 15 running this weekly uses roughly 200–500 commands per meeting, so you're comfortably within free tier for life. Vercel's hobby tier handles the compute.

## Known limits / future ideas

- Results only refresh on explicit action (vote submit, page navigation). For a live "watch the bars move in real time" experience, add polling (every 3–5s) on result screens, or use [Upstash Redis pub/sub](https://upstash.com/docs/redis/features/pubsub) with a server-sent events endpoint.
- No admin/facilitator view yet. A `/admin` page with a simple passphrase could show all data + export buttons.
- Drawings persist indefinitely — consider a TTL via `redis.set(key, value, { ex: 60*60*24*30 })` (30 days) if Redis storage fills up.
- No authentication. Anyone with the URL and group ID can submit. For a church-wide deployment, add Clerk or a simple passphrase gate.

## Licence

Use freely for your church community. No warranty.
