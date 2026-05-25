# Local Five

Local Five is a city discovery app for creator-ranked top-five lists.

The first version is focused on the behavior people already have: finding local influencer lists for pizza, tacos, chicken, pho, BBQ, hiking trails, toddler parks, date nights, coffee, and other specific plans. Instead of hunting through TikTok, Instagram, blogs, and group chats, users can compare multiple lists and see which places keep showing up.

## What is built

- City and category search
- Trending local searches
- Creator list cards with five ranked picks
- Detail view with neighborhoods and notes
- Consensus ranking across matching lists
- Saved lists in local storage
- Share sheet with copy, phone share, X, Facebook, and WhatsApp links
- Submit-a-source queue for influencer posts
- Owner queue mode at `?owner=1`
- Google Analytics and Meta Pixel hooks via `config.js`

## Files

- `index.html` - static app shell and metadata
- `styles.css` - responsive product UI
- `app.js` - seeded lists, filtering, consensus, saving, sharing, and local queue
- `config.js` - analytics, owner, and public environment config
- `supabase/schema.sql` - next-step database schema for persistent lists and submissions
- `DEPLOY.md` - launch and deploy checklist

## Product bet

Local creators already produce high-intent local recommendations, but their lists are scattered and hard to compare. The wedge is simple: aggregate top-five lists by city and category, show the consensus, and make the result easy to share.

Useful next bets:

1. Add real source URLs from Seattle creators first.
2. Turn submitted links into a Supabase review queue.
3. Add pages for high-intent search terms like `best pizza seattle` and `parks for toddlers seattle`.
4. Let creators claim profiles and embed their lists.
5. Add local sponsorship placements once there is steady search traffic.
