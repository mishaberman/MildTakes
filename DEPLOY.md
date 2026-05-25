# Local Five Live Setup

## 1. Current static deploy

This repo is still a static site. Vercel can deploy it with no install command, build command, or output directory.

Current production URL:

`https://project-hfa4f.vercel.app`

## 2. Configure public settings

Edit `config.js`:

```js
window.LOCAL_FIVE_CONFIG = {
  ownerEmail: "mishaberman@gmail.com",
  supabaseUrl: "https://szzfjelpvuzttmtoftvx.supabase.co",
  supabaseAnonKey: "YOUR_PUBLIC_ANON_KEY",
  gaMeasurementId: "G-SM2093RTRP",
  metaPixelId: "1507406784184424",
  siteUrl: "https://project-hfa4f.vercel.app/"
};

window.MILD_TAKES_CONFIG = window.LOCAL_FIVE_CONFIG;
```

The public anon key can be used in browser code. Never put a Supabase secret key in `config.js`, HTML, or client-side JavaScript.

## 3. Optional owner queue mode

Open:

`https://project-hfa4f.vercel.app/?owner=1`

That reveals the owner queue button for this browser. It is only a local beta control until Supabase auth is connected again for the new product.

## 4. Supabase next step

Run `supabase/schema.sql` in the Supabase SQL editor when you want persistent storage for:

- creator lists
- list picks
- submitted source links
- lightweight events

Then wire `app.js` to fetch approved lists from Supabase and insert submitted links into `source_submissions`.

## 5. Recommended launch checklist

- Replace starter sample links with real creator post URLs.
- Add 25 to 50 Seattle lists before paid ads.
- Create SEO pages for one city/category pair at a time.
- Confirm Google Analytics and Meta Pixel are firing.
- Test share links on iPhone and desktop.
- Connect the Vercel GitHub app to `mishaberman/MildTakes` for automatic deploys from `main`.
- Add a small local sponsor slot only after the main list view is useful.
