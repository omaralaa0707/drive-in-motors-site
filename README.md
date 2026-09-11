# Drive In Motors — site 31 of 46

A concept site built entirely from this dealership's own published material.
**Not affiliated with Drive In Motors, and not an official site.**

- **Live:** https://drive-in-motors-site.vercel.app
- **Repo:** [drive-in-motors-site](https://github.com/omaralaa0707/drive-in-motors-site)

## What this page is about

Every site in this series is built around something true and checkable about
the dealer's own account — a pattern in what they publish, a contradiction
between two of their channels, or a fact about their showroom — rather than
around a generic template. The palette, type, 3D piece and motion below were
all chosen to serve that finding.

## Design record

**Palette**
: Their own night forecourt, sampled from the kerbside frames they now shoot everything on: a **cool** graphite ground #131A20 rather than a warm charcoal, night-2 #1B242C for raised surfaces and night-3 #2C3941 for rules and hairlines only — never text — under ice #EAF0F6 and steel #98A7B4. It carries exactly two lights, as the photographs do: their sign's amber #F0A32A, and beam #C9DDFA, the ice-white of a 2026 daytime running lamp, which is spent only on what is new and on nothing else. The first page in the set whose text is a cool white on a cool dark ground: 14's night is gold-only, 12's black carries warm stone text, and 08's cool palette sits on a light dusk sky

**Type pairing**
: Antonio + Commissioner / Alyamama + Estedad (AR)

**3D / signature technique**
: **The lenticular**: an actual lenticular print rather than a picture of one. Three of their kerbside photographs are interleaved in strips beneath an array of cylindrical lenslets, and each lenslet magnifies **one** strip — the index chosen from the viewing angle plus a gradient across the panel, so the change sweeps across the surface the way a real print does instead of cross-fading. Chromatic fringing at the hand-over, lenslet ridges visible in the glass. Sourced: three of their cars were photographed from nearly the same spot on the same kerb, which is the one condition a lenticular needs

**Motion language**
: The angle — content starts rotated away from the reader on the Y axis under a 1400px perspective and swings round to face them, hinged on the reading edge so the block opens like a page rather than spinning in place; the transform-origin flips to the right edge under RTL

## Sources

Everything on the page was sourced from:

- Instagram: https://www.instagram.com/drivein.motors/
- Facebook: https://www.facebook.com/DriveInMotors1/
- Google Maps: https://www.google.com/maps/place/Drive+In+Motors/data=!4m2!3m1!1s0x0:0xd458eaef95b283f2

Photography belongs to the dealership (or, where their frames are watermarked
by an outside studio, to that studio) and is used here only to document their
own published material. No figure on the page is invented: anything the dealer
did not publish is marked as unpublished rather than estimated.

## Running it

```bash
pnpm install
pnpm dev      # http://localhost:3000
pnpm build    # production build — must pass before shipping
pnpm lint     # eslint, zero warnings
```

Requires `node-linker=hoisted` in `.npmrc` (already present) or three.js peer
deps fail to resolve.

## Structure

```
src/content/media.ts      verified facts and figures — the data layer
src/content/en.ts|ar.ts   all copy, both locales, identical shapes
src/content/schema-ext.ts the page-specific content contract
src/components/webgl/     the 3D piece
src/components/site/      the page composition
src/app/globals.css       palette tokens, type, RTL overrides, motion
```

Arabic/English toggle with full RTL. All CSS direction overrides key off
`[dir="rtl"]` (never `[lang]`) and live outside `@layer`. Every Latin or
numeric fragment inside Arabic copy is wrapped in `.latin` for correct bidi.

---

Part of a 46-site series. See the [top-level README](../README.md) for the full
index and [`TRACKING.md`](../TRACKING.md) for the differentiation log.
