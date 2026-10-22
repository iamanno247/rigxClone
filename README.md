# RIGX — local site

A local, self-contained copy of the RIGX website (gaming creator partnerships, India).
Runs entirely from your machine — no internet connection needed to render the page.

## Requirements

- [Node.js](https://nodejs.org/) 18 or newer (uses only built-in modules — nothing to install)

## Run it

```bash
cd site
node server.js
```

Then open **http://localhost:3000** in your browser.

Press `Ctrl-C` to stop the server.

## What this is

RIGX is a single-page marketing site for an agency that connects gaming brands with
gaming creators in India. It was rebuilt locally by downloading the site's public
client-side files (HTML, CSS, JS, fonts, images, video, and the WebGL globe data) so
the whole thing runs offline.

The original is hand-written vanilla HTML/CSS/JS — no framework, no build step. All
the polish comes from bespoke CSS and scroll-driven JavaScript.

## Site structure (top to bottom)

- **Floating pill nav** — stays pinned, darkens over dark sections
- **Hero** — a 200vh sticky section with an interactive three.js WebGL globe (brand
  HQs pinned around the world, great-circle arcs into an India hub, drag to spin)
- **Clients** — brand list with radial-mask hover-invert, animated stat count-up, and
  a scroll word-reveal manifesto
- **For creators / For brands** — two split video/text panels
- **Process** — five steps with corner brackets and a canvas particle field on hover
- **Network** — infinite draggable creator carousel with filter chips and hover-expand
  cards
- **Work** — sticky stacked case cards (cover-on-scroll, mouse glow + sheen) under a
  marquee logo strip
- **Why** — pinned scroll-story "campaign desk" dealt like a deck of cards, driven by
  scroll with tab jumps
- **Contact** — tabbed brand/creator forms with validation and a honeypot
- **Footer** — accent-colored, with a parallax giant wordmark

## Tech stack

- Vanilla HTML/CSS/JS (no framework, no build step)
- Self-hosted fonts: Archivo (display), Geist (body), Geist Mono, Geist Pixel
- three.js + three-globe for the hero globe, topojson world-atlas (110m) for the map
- Lenis for smooth scrolling (desktop only)
- `content-visibility: auto` with intrinsic sizing for lazy section rendering
- IntersectionObserver-gated video loading (720p on desktop, 360p on mobile)

## The form

The contact forms are wired with client-side validation and a honeypot, but the
backend is disabled (`api:false` in `config.js`). Submitting shows a friendly "email
us" message instead of posting anywhere. To make the form actually work you'd need to
wire `/api/inquiry/*` to your own backend and set a Cloudflare Turnstile site key.

## File layout

```
site/
├── server.js              # tiny local server (serves local files, proxies the rest upstream)
├── config.js              # site config (api flag, turnstile key)
├── index.html             # the page, with all CSS inlined
├── privacy.html           # privacy page
├── css/
│   └── country-pop.css    # styles for the country click-through popup
├── js/
│   ├── main.js            # interactivity: nav, carousel, scroll story, forms
│   ├── globe.js           # three.js WebGL globe
│   ├── data.js            # brands, creators, games, case studies
│   ├── validate.js        # form validation
│   ├── india.js           # India map data
│   ├── country-pop.js     # country population/click data
│   └── vendor/            # libraries: three.globe, lenis, topojson-client
└── assets/
    ├── fonts/             # 7 woff2 files
    ├── logos/             # 18 brand SVG/PNG logos
    ├── creators/          # 7 creator photos (webp)
    ├── clips/             # 2 background videos (720p + 360p each)
    └── geo/               # world map topojson: countries-110m (globe), countries-50m (country-pop)
```

## Notes

- The original site is hosted at `rigx.onrender.com`. This local copy was made by
  downloading the browser-facing files — the server-side code was never accessible and
  is not included.
- Everything renders offline. The only outbound link is the "Profile" button on
  creator cards, which opens Instagram in a new tab.
