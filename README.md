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
- **`<model-viewer>`** loaded on demand for in-page `.glb` rendering

## Structure

```
src/
  app/
    page.tsx                  intro + work index + about + contact
    work/[slug]/page.tsx      case study
    work/[slug]/preview/      chromeless full-screen 3D preview
    globals.css               the entire design system
  components/
    Intro.tsx                 the pinned sequence
    TuckBox.tsx  PlayingCard.tsx
    ProjectMedia.tsx          image | video | embed | model
    Reveal.tsx                the one shared scroll reveal
  content/projects.ts         the entire content layer
```

## Adding a project

Everything lives in `src/content/projects.ts`. Nothing else hardcodes a
project. Add an entry, drop assets in `/public`, remove `draft: true`.

Media block kinds:

| kind    | use                                                        |
| ------- | ---------------------------------------------------------- |
| `image` | a still, rendered through `next/image`                      |
| `video` | a self-hosted mp4/webm, muted and looping                   |
| `embed` | any iframe: Spline, Sketchfab, YouTube, a live deployment   |
| `model` | a `.glb`, orbit-controlled in the page                      |

Any project containing an `embed` or `model` block automatically gets a
full-screen route at `/work/<slug>/preview`, linked from its case study.

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
