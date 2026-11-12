# Lawnquistadors spec site

Single-page marketing site for Lawnquistadors (Levi, Lincoln, NE), built by T3KDesigns as an unsolicited spec/demo for a pitch. The preview runs at lawnquistadors.t3kdesigns.app. **Merging to `main` auto-deploys it (Netlify), so a merge is a ship. Nothing goes live as Levi's real site without Levi's OK.**

## Run it

Open `index.html` in a browser. There's no build step and nothing to install. (To test from a phone on the same Wi-Fi: `python -m http.server 8080` in this folder.)

## What's here

| File | Purpose |
|---|---|
| `index.html` | All content. Copy is verbatim from lawnquistadors.com |
| `styles.css` | Layout, plus palette from Levi's logo and live site (see below) |
| `script.js` | Mobile menu, story "read more" on phones, front-end-only quote form |
| `sound.js` | The sword slash on buttons and cards, and its mute toggle (muted by default) |
| `assets/sounds/sword-slash.mp3`, `sword-slash-2.mp3` | The signature sword slash, two takes (CC0, see Sounds below) |
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

## Sound (sound.js)

- **One sound: the sword slash.** It's muted by default behind one visible toggle above the hero eyebrow (it floats bottom-left on screens 1300px and wider). No music. Nothing loads or plays until the visitor turns sound on.
- **Slash targets:** CTA pills (`.btn`, incl. the hero quote, Call and the quote submit), the $10-off offer card, the mobile bar and the three service cards (mowing, string trimming, blade edging).
  - Click/tap plays it at full level (files peak at -12 dBFS).
  - Hover plays it at half level: mouse/pen pointer-enter only, at most once per 400 ms per button, never again while the pointer stays on it, and a 120 ms gap across buttons so a fast sweep gives one slash. Touch has no hover: a tap is a click.
- **Everything else is silent:** review cards, the logo, utility buttons, plain links, nav and body text. Keyboard focus never makes a sound.
- **Randomized per play** (hover and click alike):
  - It picks one of the two takes at random.
  - `playbackRate` is 0.94 to 1.06, with pitch shifting too, and it is never within 0.02 of the previous play, so two plays in a row are never identical.
  - Gain is 0.9 to 1.0 times the level, so the jitter only makes it quieter, never louder than -12 dBFS.
- The slash plays through `<audio>` elements routed into Web Audio for gain, so the CSP keeps `connect-src 'none'`.
- **On hold:** Levi says the slash doesn't sound right yet, and Brandon has asked him for an example of the sound he has in mind. The files will be swapped once that arrives.
- **Removed Nov 12 2026 (Levi isn't a fan of the "confetti"):** the grass-blade bursts (intro wave, logo tap, button/card taps), the swaying fringe, the "Tap the logo — watch it grow!" hint and the grass pop sound.

## Privacy / security posture

- No third-party scripts, fonts, analytics, cookies or storage. System fonts only.
- A CSP `<meta>` restricts everything to same-origin and sets `connect-src 'none'` and `form-action 'none'`.
- **The quote form sends nothing (spec).**
  - `script.js` validates it, shows a personalised confirmation, then clears the values.
  - Both the form and the confirmation carry a visible "Preview site: nothing is sent" note with Levi's phone number, so a real visitor isn't misled.
  - Commit `41beea6` on `main` has a working Netlify Forms version. Restore it (and loosen the CSP to `'self'`) once Levi signs off.
- Facebook is a plain outbound link (`rel="noopener noreferrer"`), not an embed.

## Sounds

| Local file | Source | License | Retrieved |
|---|---|---|---|
| `assets/sounds/sword-slash.mp3` | "Knife slice" by NeoSpica, Freesound sound #504610: https://freesound.org/people/NeoSpica/sounds/504610/ (public HQ preview, https://cdn.freesound.org/previews/504/504610_7704891-hq.mp3) | Creative Commons 0 (public domain dedication; commercial use allowed, no attribution required) | Nov 12 2026 |
| `assets/sounds/sword-slash-2.mp3` | "Swing.mp3" by XxChr0nosxX, Freesound sound #268227: https://freesound.org/people/XxChr0nosxX/sounds/268227/ (public HQ preview, https://cdn.freesound.org/previews/268/268227_5078136-hq.mp3) | Creative Commons 0 | Nov 12 2026 |

- **Processing (`sword-slash.mp3`):** mixed to mono and trimmed to the whoosh + slice (0.165 to 0.63 s of the source). Then a 4 ms fade-in, a 50 ms fade-out, peak normalized to -12 dBFS, and re-encoded as 96 kbps mp3 (5.9 KB, 0.47 s).
- **Why this one:** Brandon's reference is the Fruit Ninja slash. That game audio is Halfbrick's and is not used or copied here; the reference was only a guide for the kind of sound. Of the CC0 sword/whoosh effects compared, this was the only one with both an airy whoosh and a bright metallic slice (energy around 4 to 5.5 kHz). The plain whooshes were all low and dull (under ~2 kHz).
- The uploader describes it as "made by mixing a few CC0 sounds", so the whole chain is CC0.
- **Processing (`sword-slash-2.mp3`):**
  - Mixed to mono, with a 180 Hz high-pass to remove a low hum floor before the swing.
  - Trimmed to the swing (0.365 to 0.66 s of the source), with the same fades as the first take.
  - Loudness matched to the first take, within 0.5 dB on the loud part, and capped at -12 dBFS peak.
  - 96 kbps mp3: 4.1 KB, 0.30 s.
- **Why it's the second take:** of the other CC0 candidates, it is the closest match to the first take: a single whoosh into a bright edge, with a similar low/high balance. The darker "samurai" and RPG slashes centered around 2 kHz. The other bright swishes were either mostly hiss above 8 kHz or thin with no body.

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
