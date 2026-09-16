# Houze Guo — Portfolio

A cinematic intro that hands off to a conventional, fast portfolio.

The intro is a single pinned GSAP timeline: the name shatters, a manifesto
assembles out of the debris, a 3D tuck box drops in, opens, and fires a fan of
cards across the screen. When the fan clears, the pin releases and the site
becomes a normal scrolling page. The deck is a set piece, not navigation.

## Stack

- **Next.js 16** (App Router, Turbopack), React 19, TypeScript
- **GSAP + ScrollTrigger** for all motion (one animation library, not two)
- **Lenis** for smooth scrolling, driven from the GSAP ticker so ScrollTrigger
  never reads a stale scroll position
- **Tailwind CSS v4** with the design system defined as `@theme` tokens

## Structure

```
src/
  app/
    page.tsx                  intro + work index + about + contact
    work/[slug]/page.tsx      case study
    globals.css               the entire design system
  components/
    Intro.tsx                 the pinned sequence
    TuckBox.tsx  PlayingCard.tsx
    ProjectMedia.tsx          image block rendering
    Reveal.tsx                the one shared scroll reveal
  content/projects.ts         the entire content layer
```

## Adding a project

Everything lives in `src/content/projects.ts`. Nothing else hardcodes a
project. Add an entry, drop assets in `/public`, remove `draft: true`.

Each project carries one or more `categories`. There are four, each owning a
suit, and those same four are dealt as the aces in the intro:

| Category    | Suit |
| ----------- | ---- |
| Software    | club |
| Embedded    | spade |
| Electronics | diamond |
| Mechanical  | heart |

The four suits are spoken for, which is why About and Contact are marked with
jokers instead: no glyph on the page means two different things.

`source` is where the project came from, and `href` is optional, so a repo
(`{ label: "GitHub", href: "..." }`), a team (`{ label: "UBC AeroDesign" }`) and
a course (`{ label: "APSC 101" }`) are all valid.

Blocks are either `text` or `image`. Video, iframe embeds (Spline, Sketchfab,
a live deployment) and in-page `.glb` models were built and then removed in the
commit after `689e6ea`; restore them from there rather than rewriting them.

Remote images need their host added to `images.remotePatterns` in
`next.config.ts`. Local files under `/public` need nothing.

## Design system

All tokens are in `src/app/globals.css`. Three font families with defined jobs
(Geist structural, Geist Mono for labels and metadata, Instrument Serif for the
two quote moments), a fluid type scale, one gutter, one section gap, two
neutrals, one accent.

Font variables are declared with `@theme inline` so they resolve to the
`next/font` values rather than colliding with them. Do not hardcode font family
names in `@theme` — that shadows the loaded webfont and silently falls back.

## Motion rules

- `prefers-reduced-motion` disables Lenis, the pin, and every reveal. The intro
  falls back to a static stacked hero.
- Never tween `opacity` on an element carrying `transform-style: preserve-3d`.
  Opacity below 1 forces `transform-style: flat`, which collapses the tuck box's
  3D context and paints its back face over its front, mirrored. Use
  `visibility` plus motion instead.
- The intro's ScrollTrigger sets `refreshPriority: 1` because its pin adds
  ~340vh of spacer that moves every trigger below it.

## Development

```bash
npm run dev
npm run build
npx eslint src
npx tsc --noEmit
```
