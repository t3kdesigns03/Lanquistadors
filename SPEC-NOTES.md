# Lawnquistadors spec site

Single-page marketing site for Lawnquistadors (Levi, Lincoln, NE), built by T3KDesigns as an unsolicited spec/demo for a pitch. The preview runs at lawnquistadors.t3kdesigns.app. **Brandon deploys the preview himself. Nothing goes live as Levi's real site without Levi's OK.**

## Run it

Open `index.html` in a browser. There's no build step and nothing to install. (To test from a phone on the same Wi-Fi: `python -m http.server 8080` in this folder.)

## What's here

| File | Purpose |
|---|---|
| `index.html` | All content. Copy is verbatim from lawnquistadors.com |
| `styles.css` | Layout, plus palette from Levi's logo and live site (see below) |
| `script.js` | Mobile menu, story "read more" on phones, front-end-only quote form |
| `grass.js` | Grass-pop animation (intro burst, logo/tap bursts, muted pop sound) |
| `img/` | Levi's own logo, photos and section backgrounds from his current Squarespace site |

## Look and feel (matched to lawnquistadors.com, computed styles, Nov 11 2026)

- **Backgrounds:** Levi's own two Squarespace section images.
  - `bg-map.jpg` (caravel/old-map) sits behind Hero + Services under a `#facf9f` overlay at 0.6. The base color is `#f2c892`.
  - `bg-parchment.jpg` sits behind Story, Reviews, Quote and Footer under `#facf9f` at 0.5.
  - No dark-green or cream panels.
- **CTA pill:** `#ff6123` (the live site's `safeDarkAccent`), white uppercase label, 300px radius.
  - The brief estimated ~`#ce6047`, but the live site's computed `background-color` is `rgb(255, 97, 35)`.
  - White on `#ff6123` is **3.0:1** contrast. That passes WCAG AA only for large text, so CTA labels are at least 18.7px bold everywhere.
  - If Brandon would rather pass AA at any size, `#e04e12` (4.0:1) is a close darker option.

## Grass pop (grass.js)

- **Logo:** the logo image is never transformed or masked. Blades live in separate layers.
- **Physics:** blades always launch upward (within ±35° of vertical), then arc and drift down.
- **Lifecycle:** each blade lives at most 3.4s of wall-clock time and is then removed from the DOM. A safety sweep also removes blades if animation frames stall.
- **Scoping:** each section has its own clipped layer, so bursts can't drift into another section. Header and bottom-bar taps use a fixed viewport layer.
- **Triggers:**
  - Intro: one wave along the hero's bottom edge per page open.
  - Logo tap: 14 blades.
  - Button or card tap: 7–11 blades from the tap point.
  - Idle: a CSS grass fringe sways along the hero's bottom edge.
- **Sound:** a single synthesized pop/rustle, muted by default, with a toggle next to the hint. No music.
- **Reduced motion:** `prefers-reduced-motion` turns all of it off, including the fringe sway, the hint and the toggle.
- **Colors:** blade greens are sampled from the grass tuft in `logo.png`.

## Privacy / security posture

- No third-party scripts, fonts, analytics, cookies or storage. System fonts only.
- A CSP `<meta>` restricts everything to same-origin and sets `connect-src 'none'` and `form-action 'none'`.
- **The quote form sends nothing (spec).**
  - `script.js` validates it, shows a personalised confirmation, then clears the values.
  - Both the form and the confirmation carry a visible "Preview site: nothing is sent" note with Levi's phone number, so a real visitor isn't misled.
  - Commit `41beea6` on `main` has a working Netlify Forms version. Restore it (and loosen the CSP to `'self'`) once Levi signs off.
- Facebook is a plain outbound link (`rel="noopener noreferrer"`), not an embed.

## Images

All images are Levi's own, pulled from his live site (images.squarespace-cdn.com, site id `6aa732c3c1dbb87ff3170c4d`). No stock or AI-generated images.

| Local file | Source URL |
|---|---|
| `img/logo.png` | https://images.squarespace-cdn.com/content/v1/6aa732c3c1dbb87ff3170c4d/08a6a15b-42f2-49e4-951c-75bea966808f/D7AA1234-4654-4B0C-AF19-5495318E94F2+%281%29.PNG?format=1500w |
| `img/lawn-stripes.jpg` | https://images.squarespace-cdn.com/content/v1/6aa732c3c1dbb87ff3170c4d/2070fe20-98c2-4930-aa67-306afb4f7aec/43FF7BF8-7541-43ED-BED9-13FA516DB1BA.png?format=1000w |
| `img/fence-trim.jpg` | https://images.squarespace-cdn.com/content/v1/6aa732c3c1dbb87ff3170c4d/d62d72b7-0e0a-438d-8180-8bef8471b88a/IMG_5882.png?format=1000w (**no longer used**: birdhouse/fence shot, replaced by a marked placeholder) |
| `img/sidewalk-edge.jpg` | https://images.squarespace-cdn.com/content/v1/6aa732c3c1dbb87ff3170c4d/65585ab5-b32b-448b-81fc-a62db3d0564b/IMG_6290.jpg?format=1000w |
| `img/levi.jpg` | https://images.squarespace-cdn.com/content/v1/6aa732c3c1dbb87ff3170c4d/56cfefbf-1096-4cc9-8200-950ec9e2a413/IMG_7863.png?format=1000w |
| `img/bg-map.jpg` | https://images.squarespace-cdn.com/content/v1/6aa732c3c1dbb87ff3170c4d/5fe7e49b-dca7-48d6-8172-c5bc34bc75b8/F1EF8BD2-91D6-4C4F-A00F-C14CC6A6D7ED.png (819×1024 original, JPEG q72) |
| `img/bg-parchment.jpg` | https://images.squarespace-cdn.com/content/v1/6aa732c3c1dbb87ff3170c4d/1da9ef80-0ae0-46c8-b585-7394b834c8b3/18DBBD45-D61E-47F1-905A-E748E4E792D3.PNG (resized to 1200w, JPEG q62) |

### Photos to request from Levi

1. **String-trimming card (placeholder now):** a close-up of a freshly string-trimmed edge along a fence line or bed, ideally with Levi and the trimmer in frame. Shoot it landscape at roughly 4:3.
2. **Hero:** Levi mowing a striped lawn, mower and stripes both visible, square-ish crop.
3. **Mowing card:** the mower in action mid-pass, 4:3.
4. **Edging card:** a close-up of a fresh blade-edged line along a sidewalk or driveway, 4:3.

The hero, mowing and edging photos are still the existing generic lawn shots from his site, because no real work photos exist on the live site or in this repo.

## Open questions for Levi (do not fill in without him)

- **Email:** none is published (the live site only has a Squarespace template placeholder), so the contact section shows phone only. Does he want one listed?
- **Recurring service:** does he offer weekly or bi-weekly mowing plans? Not mentioned anywhere, so it's left out.
- **FAQ:** none was added. If he wants one, the answers have to come from him.
- **Service area:** only "Lincoln, NE" is published. Are there neighborhoods or limits he wants listed?
- **Response time:** none is published, so the form only says Levi will get back to you with a free estimate.
- **Footer logo:** it now sits directly on parchment (the transparent PNG), so the "sticker" card is gone. No inverted or alternate logo exists. Ask him for an SVG or alternate if he has one.
- **"Since 2026" tagline:** kept as-is (it's part of his logo), but it makes the business read as brand-new. Brandon should confirm that's intentional before the pitch.
