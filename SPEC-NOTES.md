# Lawnquistadors spec site

Single-page marketing site for Lawnquistadors (Levi, Lincoln, NE), built by T3KDesigns as an unsolicited spec/demo for a pitch. **Not deployed, and not for deployment without Levi's OK.**

## Run it

Open `index.html` in a browser. There's no build step and nothing to install. (To test from a phone on the same Wi-Fi: `python -m http.server 8080` in this folder.)

## What's here

| File | Purpose |
|---|---|
| `index.html` | All content. Copy is verbatim from lawnquistadors.com |
| `styles.css` | Layout + palette sampled from Levi's logo (rust `#b84802`, green `#005308`, ink, parchment `#e8c888`) |
| `script.js` | Story "read more" on phones + front-end-only quote form |
| `img/` | Levi's own logo and lawn photos from his current Squarespace site |

## Privacy / security posture

- No third-party scripts, fonts, analytics, cookies or storage. System fonts only.
- A CSP `<meta>` restricts everything to same-origin. `connect-src` and `form-action` are `'self'` only, so the quote form can post back to this site and nowhere else.
- **The quote form uses Netlify Forms** (`name="quote"`, `data-netlify="true"`, honeypot `bot-field`). Fields: `name`, `phone`, `address`, `service`. `script.js` validates the form, then POSTs it to `/` with fetch and shows the thank-you state. If the POST fails, it shows an error with Levi's phone number. Without JS, the form posts normally and Netlify shows its default success page.
  - In Netlify: **Forms → enable form detection**, redeploy, then add an **email notification** for the `quote` form so Levi gets each lead.
  - Locally (`python -m http.server`) the POST fails on purpose, so you'll see the error message. That's expected.
- Facebook is a plain outbound link (`rel="noopener noreferrer"`), not an embed.

## Images

All images are Levi's own, pulled from his live site (images.squarespace-cdn.com, site id `6aa732c3c1dbb87ff3170c4d`). Photos were re-encoded as JPEG (max 1200px). The logo was cropped to its visible area and kept as a transparent PNG.

| Local file | Source URL |
|---|---|
| `img/logo.png` | https://images.squarespace-cdn.com/content/v1/6aa732c3c1dbb87ff3170c4d/08a6a15b-42f2-49e4-951c-75bea966808f/D7AA1234-4654-4B0C-AF19-5495318E94F2+%281%29.PNG?format=1500w |
| `img/lawn-stripes.jpg` | https://images.squarespace-cdn.com/content/v1/6aa732c3c1dbb87ff3170c4d/2070fe20-98c2-4930-aa67-306afb4f7aec/43FF7BF8-7541-43ED-BED9-13FA516DB1BA.png?format=1000w |
| `img/fence-trim.jpg` | https://images.squarespace-cdn.com/content/v1/6aa732c3c1dbb87ff3170c4d/d62d72b7-0e0a-438d-8180-8bef8471b88a/IMG_5882.png?format=1000w |
| `img/sidewalk-edge.jpg` | https://images.squarespace-cdn.com/content/v1/6aa732c3c1dbb87ff3170c4d/65585ab5-b32b-448b-81fc-a62db3d0564b/IMG_6290.jpg?format=1000w |
| `img/levi.jpg` | https://images.squarespace-cdn.com/content/v1/6aa732c3c1dbb87ff3170c4d/56cfefbf-1096-4cc9-8200-950ec9e2a413/IMG_7863.png?format=1000w |

No stock or AI-generated images were added. The parchment/ship backgrounds from the old site weren't used.

## Before launch (needs Levi)

- Confirm he's happy with every line of copy (all taken from his site) and with his photo being used in "Our story".
- Pick a form backend; then update the CSP.
- Decide on hosting/domain cut-over from Squarespace.
