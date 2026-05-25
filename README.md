# Local Five

Local Five is a mobile-first local Top 5 food ranking game.

The current wedge is Seattle food. A visitor lands on a category prompt, makes a Top 5 list, gets a playful taste verdict, sees how their ranking compares with the city and reference creator lists, and gets places to try next.

## Core Loop

1. Pick a city/category prompt, starting with Seattle Pizza.
2. Search and select exactly five places.
3. Reorder the list with drag, touch, or up/down buttons.
4. Sign in with Google if you want the profile view, or keep playing anonymously.
5. See a taste verdict, city consensus, match score, boldest pick, taste twin, and recommendations.
6. Share the ranking page.

## Built In This Static MVP

- Home page at `/`
- Seattle hub at `/seattle`
- Category routes like `/seattle/pizza`
- Place detail routes like `/places/seattle-sunny-hill`
- Local share pages like `/rank/:submissionId`
- Verification-pending reference profiles like `/creator/matthew-norman` and `/creator/nick-rizzo`
- Hidden owner data view at `/admin` after opening `?owner=1`
- Imported Seattle place seed data under `data/seed/`
- Seattle launch prompts for pizza, teriyaki, tacos, BBQ, burgers, coffee, bakery, brunch, pho, ramen/noodles, date night, sandwiches, donuts, fried chicken, chicken sandwiches, cookies, and bagels
- Borda count consensus algorithm
- Playful safe roast/taste verdicts with tone controls
- Attribute-based recommendation cards
- Reference creator comparison data with unverified creator attribution hidden by default
- Google-only Supabase auth with an account page for drafts and submitted rankings
- LocalStorage submissions and suggested-place queue
- Google Analytics and Meta Pixel hooks through `config.js`

## Files

- `index.html` - static shell and metadata
- `styles.css` - responsive Local Five UI
- `app.js` - data, router, ranking editor, results, sharing, creator/admin views
- `config.js` - public analytics and site config
- `data/seed/` - imported Seattle place/source/creator seed data
- `supabase/schema.sql` - next-step persistent data model
- `DEPLOY.md` - launch checklist

## Next Steps

- Verify imported place rows with Google Places/manual review before marketing them as current facts.
- Add Supabase persistence for submissions, suggestions, places, and aggregate rankings.
- Add real creator opt-in before publishing creator-branded lists.
- Add generated OG images for `/rank/:submissionId`.
- Add Google Places lookup for missing-place suggestions.
