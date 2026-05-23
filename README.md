# Mild Takes

A daily social sorting game built as a static web app.

Players rank five tiny, relatable controversies along a prompt, lock their order, then get a spoiler-light share card showing how close they were to the crowd.

## Files

- `index.html` - app shell and metadata
- `styles.css` - responsive visual design
- `app.js` - daily puzzle selection, scoring, local stats, sharing, archive rounds
- `config.js` - Supabase, analytics, and owner config
- `supabase/schema.sql` - database tables, RLS policies, and leaderboard RPCs
- `DEPLOY.md` - production setup checklist

## Why this bet

The core viral loop is:

1. One daily puzzle that everyone can compare.
2. A result that is personal without revealing the answer.
3. Prompts that invite low-stakes disagreement.
4. No login or install wall.

The seeded crowd scores are placeholders. When you launch, replace `score` values in `app.js` with real aggregate vote/order data from your backend.

## Live features

- Supabase OAuth hook for Google sign-in
- Anonymous play tracking plus signed-in profiles
- Daily leaderboard and aggregate public stats
- Owner-only admin/reporting view for `mishaberman@gmail.com`
- Starter-round publishing from the admin panel
- Google Analytics and Meta Pixel hooks via `config.js`

## Revenue path

- Add one ad slot after the result reveal first, not before gameplay.
- Sell prompt sponsorships to local or consumer brands.
- Add archive packs once daily retention exists.
- Keep the daily game free and fast.
