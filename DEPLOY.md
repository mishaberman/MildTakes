# Local Five Live Setup

## Current Deployment

Production URL:

`https://project-hfa4f.vercel.app`

The app is a static single-page application. Vercel rewrites clean paths like `/seattle/pizza` and `/rank/:submissionId` to `index.html`.

## Public Config

`config.js` exposes only browser-safe values:

```js
window.LOCAL_FIVE_CONFIG = {
  ownerEmail: "mishaberman@gmail.com",
  supabaseUrl: "https://szzfjelpvuzttmtoftvx.supabase.co",
  supabaseAnonKey: "YOUR_PUBLIC_ANON_KEY",
  gaMeasurementId: "G-SM2093RTRP",
  metaPixelId: "1507406784184424",
  siteUrl: "https://project-hfa4f.vercel.app/"
};
```

Never put a Supabase secret key, Vercel token, or OAuth secret in browser JavaScript.

## Owner View

Open:

`https://project-hfa4f.vercel.app/?owner=1`

That reveals the `Admin` link in this browser. The static admin view is only for local seed-data inspection until Supabase auth is wired back in.

## Supabase Next Step

Run `supabase/schema.sql` when ready to persist:

- cities
- categories
- places
- creators
- rank submissions
- rank items
- place suggestions
- events

Then wire the app to:

- read active categories and places
- insert anonymous submissions
- insert place suggestions
- fetch aggregate rankings
- show owner-only admin data for `mishaberman@gmail.com`

## Launch Checklist

- Polish Seattle Pizza first.
- Seed 50 pizza places and 10 admin lists.
- Ask 10 people to complete the ranking on mobile.
- Watch the completion rate from first place added to submitted Top 5.
- Replace mock creator profiles only after opt-in.
- Confirm GA and Meta Pixel events fire.
- Grant the Vercel GitHub app access to `mishaberman/MildTakes` so pushes auto-deploy.
