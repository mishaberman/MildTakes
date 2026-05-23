# Mild Takes Live Setup

## 1. Create Supabase

1. Open the Supabase project `szzfjelpvuzttmtoftvx`.
2. Open SQL Editor and run `supabase/schema.sql`.
3. In Authentication > Providers, enable Google with your Google OAuth client ID and secret.
4. Add your final site URL to Authentication > URL Configuration.

## 2. Configure the app

Edit `config.js`:

```js
window.MILD_TAKES_CONFIG = {
  ownerEmail: "mishaberman@gmail.com",
  supabaseUrl: "https://szzfjelpvuzttmtoftvx.supabase.co",
  supabaseAnonKey: "sb_publishable_g2lzudi0pANEnkhBQw6LbQ_93IuECXg",
  gaMeasurementId: "G-SM2093RTRP",
  metaPixelId: "1507406784184424",
  siteUrl: "https://project-hfa4f.vercel.app/"
};
```

The Supabase anon key is intended to be public. The database policies in
`supabase/schema.sql` protect owner-only data.

Never put the Supabase secret key in `config.js`, HTML, or browser JavaScript.

## 3. Publish starter rounds

After login as `mishaberman@gmail.com`, open the Admin button and click
`Publish starter rounds`. This uploads the starter schedule into Supabase.

## 4. Recommended Permanent Free Deploy

Use Vercel for the first production deploy. This project is a static site, so
there is no build command.

Current production URL:

`https://project-hfa4f.vercel.app`

1. Push this project to GitHub.
2. In Vercel, connect the GitHub repository to `project-hfa4f`.
3. Deploy from the `main` branch.
4. Add the production URL to Supabase Authentication URL Configuration:
   - Site URL: `https://project-hfa4f.vercel.app`
   - Redirect URL allow list: `https://project-hfa4f.vercel.app/` and `https://project-hfa4f.vercel.app/*`

For API deployment, create a Vercel token and run:

```bash
VERCEL_TOKEN=YOUR_TOKEN node scripts/deploy-vercel-api.mjs
```

Good alternatives:

- Cloudflare Pages: upload the folder as static assets.
- Netlify: drag the project folder into Netlify Drop.
- GitHub Pages: free for static files from a public repo.

## Launch Checklist

- Supabase schema applied.
- Google OAuth redirect URLs match the deployed URL.
- Google Analytics and Meta Pixel IDs added.
- Admin login tested with `mishaberman@gmail.com`.
- Daily leaderboard shows a test play.
- First ad/sponsor placement added after the result reveal.
