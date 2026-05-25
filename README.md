# Local Five

Local Five is a mobile-first local Top 5 ranking game.

The current wedge is Seattle food. A visitor lands on a category prompt, makes a Top 5 list, sees how their ranking compares with the city consensus, and gets a shareable result page.

## Core Loop

1. Pick a city/category prompt, starting with Seattle Pizza.
2. Search and select exactly five places.
3. Reorder the list with drag, touch, or up/down buttons.
4. Submit the ranking without signing in.
5. See the city consensus, match score, boldest pick, and taste twin.
6. Share the ranking page.

## Built In This Static MVP

- Home page at `/`
- Seattle hub at `/seattle`
- Category routes like `/seattle/pizza`
- Local share pages like `/rank/:submissionId`
- Mock creator profiles like `/creator/sample-maya`
- Hidden owner data view at `/admin` after opening `?owner=1`
- Seattle food seed data for pizza, teriyaki, tacos, pho, burgers, coffee, brunch, bakery, ramen, and date night
- Borda count consensus algorithm
- LocalStorage submissions and suggested-place queue
- Google Analytics and Meta Pixel hooks through `config.js`

## Files

- `index.html` - static shell and metadata
- `styles.css` - responsive Local Five UI
- `app.js` - data, router, ranking editor, results, sharing, creator/admin views
- `config.js` - public analytics and site config
- `supabase/schema.sql` - next-step persistent data model
- `DEPLOY.md` - launch checklist

## Next Steps

- Replace sample seed data with a manually researched Seattle Pizza set.
- Add Supabase persistence for submissions, suggestions, places, and aggregate rankings.
- Add real creator opt-in before publishing creator-branded lists.
- Add generated OG images for `/rank/:submissionId`.
- Add Google Places lookup for missing-place suggestions.
