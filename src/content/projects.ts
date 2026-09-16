/**
 * The entire content layer.
 *
 * Replacing the placeholders below is the only edit needed to publish real
 * work: nothing else in the app hardcodes a project. Drop images into /public
 * and reference them with a leading slash.
 *
 * Only `image` media is supported. Video, iframe embeds (Spline, Sketchfab, a
 * live deployment) and in-page .glb models were built and then removed in the
 * commit after 689e6ea; restore them from there rather than rewriting them.
 */

export type Category = "Software" | "Embedded" | "Electronics" | "Mechanical";

/**
 * Each category owns a suit, and the four suits are spoken for. That is why
 * About and Contact are marked with jokers instead: a glyph means exactly one
 * thing across the whole page.
 */
export const CATEGORY_SUIT = {
  Software: "♣",
  Embedded: "♠",
  Electronics: "♦",
  Mechanical: "♥",
} as const satisfies Record<Category, string>;

/** The order the aces are dealt, and the order categories read in anywhere. */
export const CATEGORIES: Category[] = ["Software", "Embedded", "Electronics", "Mechanical"];

export function isRedCategory(category: Category) {
  return category === "Electronics" || category === "Mechanical";
}

export type ImageBlock = {
  kind: "image";
  /** Path under /public, or a remote URL allowed in next.config.ts. */
  src: string;
  alt: string;
  /**
   * Intrinsic pixel size. Supplying it lets the image render at its true
   * aspect ratio instead of being cropped into a fixed box, which matters
   * because these are CAD renders and charts whose edges carry content.
   */
  width?: number;
  height?: number;
  caption?: string;
  /** Span the full content column instead of the prose measure. */
  wide?: boolean;
};

export type TextBlock = {
  kind: "text";
  heading?: string;
  body: string[];
  /** Renders quieter and set in italics, for a closing reflection. */
  note?: boolean;
};

/** Key decisions and protocols: a term, then why. */
export type ListBlock = {
  kind: "list";
  heading?: string;
  items: { term?: string; detail: string }[];
};

/** The numbers a project was actually held to. */
export type SpecBlock = {
  kind: "specs";
  heading?: string;
  rows: { label: string; value: string }[];
};

export type Block = TextBlock | ImageBlock | ListBlock | SpecBlock;

export type Project = {
  slug: string;
  title: string;
  summary: string;
  /** Drives timeline grouping and ordering. */
  year: string;
  /** Shown on the case study when the source is more precise than a year. */
  date?: string;
  /** One or more. The first is the primary and leads everywhere it is listed. */
  categories: Category[];
  role?: string;
  stack?: string[];
  /**
   * Where the project came from: a repo, a team, or a course. `href` is
   * optional, so "UBC AeroDesign" and "APSC 101" are as valid as a GitHub link.
   */
  source?: { label: string; href?: string };
  /** Anything public the project produced, where that is not the source itself. */
  links?: { label: string; href: string }[];
  /** Tile image for the hover preview. Omit for a typographic card face. */
  cover?: ImageBlock;
  blocks: Block[];
  /** Marks unfinished entries so an unpopulated site never reads as shipped. */
  draft?: boolean;
};

export const projects: Project[] = [
  {
    slug: "payload-test-stand",
    title: "Payload Capture & Release Test Stand",
    summary:
      "A test rig that lands a robotic payload at a random position and orientation on an 8x8 ft designated landing zone, so capture and release can be rehearsed without tying up the competition aircraft.",
    year: "2026",
    date: "Summer 2026",
    categories: ["Mechanical"],
    role: "Concept evaluation, structural and kinematic analysis",
    stack: ["SolidWorks", "Hand calculation"],
    source: { label: "UBC AeroDesign" },
    cover: {
      kind: "image",
      src: "/work/payload-test-stand-concept.jpg",
      width: 1005,
      height: 660,
      alt: "Concept assembly of the cable-driven test stand",
    },
    blocks: [
      {
        kind: "image",
        src: "/work/payload-test-stand-concept.jpg",
        width: 1005,
        height: 660,
        alt: "Four guyed masts around the 8x8 ft landing zone with a plane mockup suspended at centre",
        caption: "Concept assembly — four guyed masts around the DLZ, plane mockup suspended at centre",
        wide: true,
      },
      {
        kind: "text",
        heading: "Approach",
        body: [
          "Five architectures were each carried far enough to be scored on physics rather than intuition: an X-Y gantry, a 3/4-point cable-driven parallel robot, a propped-cantilever polar crane, an escapement, and a pre-tensioned cable grid. Each was analysed for the failure mode that would actually disqualify it — midspan beam deflection, cable sag and Jacobian spool synchronisation, Coriolis terms, tangential velocity at touchdown, per-string tension.",
          "The selected system is four mast assemblies at the corners of a square, each with a winch at its base and a fairlead at its top, and four cables converging on a shared end effector. Because cables can only pull, the usable workspace is strictly smaller than the anchor footprint: far-cable tension falls to zero at the boundary, so the working area is set by a minimum tension, not by the frame.",
        ],
      },
      {
        kind: "list",
        heading: "Key design decisions",
        items: [
          {
            term: "CDPR over the gantry",
            detail:
              "highest realism (9) and portability (9) of the five. Anchors and winches instead of heavy extrusions spanning the whole DLZ.",
          },
          {
            term: "Winches at the mast base, not the top",
            detail:
              "near-zero tip mass, heaviest component at ground level, motors reachable without a ladder.",
          },
          {
            term: "UHMWPE line over paracord",
            detail:
              "paracord's elongation and creep are uncommanded length changes the controller cannot see.",
          },
          {
            term: "Escapement rejected on physics, not cost",
            detail:
              "it retains tangential velocity at touchdown, so the mockup skids. That is not a VTOL landing.",
          },
        ],
      },
      {
        kind: "specs",
        heading: "Target specification",
        rows: [
          { label: "Positioning range", value: "8.0 x 8.0 ft" },
          { label: "Orientation", value: "0-360 degrees" },
          { label: "Load capacity", value: "10 lb" },
          { label: "Descent velocity", value: "1 m/s" },
          { label: "Reset time", value: "under 30 s" },
          { label: "Masts", value: "4 x guyed PVC" },
          { label: "Actuation", value: "4 x NEMA 17" },
          { label: "Line", value: "Braided UHMWPE" },
          { label: "Printed parts", value: "17" },
          { label: "Concepts scored", value: "5" },
          { label: "Winning score", value: "7.85 / 10" },
          { label: "Status", value: "Design documented, build pending" },
        ],
      },
      {
        kind: "image",
        src: "/work/payload-test-stand-masts.jpg",
        width: 1063,
        height: 711,
        alt: "Mast and base-stand arrangement with winches mounted at ground level",
        caption: "Mast and base-stand arrangement — winches mounted at ground level",
        wide: true,
      },
      {
        kind: "image",
        src: "/work/payload-test-stand-matrix.jpg",
        width: 1600,
        height: 958,
        alt: "Weighted decision matrix comparing five concepts across seven criteria",
        caption: "Weighted decision matrix — five architectures scored across seven criteria; CDPR wins at 7.85 / 10",
        wide: true,
      },
      {
        kind: "text",
        note: true,
        body: [
          "Shortening the masts looked like a free win on portability until the statics said otherwise. At 3 ft with a 10 lb payload, each mast head carries roughly 52 N horizontally, about three times what a 6 ft mast sees, because the cable angle gets shallower as the mast gets shorter. The trade I thought I was making was height for packability; it was really height for mast stiffness, and it moved the PVC selection two schedules up.",
        ],
      },
    ],
  },
  {
    slug: "portable-modular-dlz",
    title: "Portable Modular DLZ",
    summary:
      "A folding, modular 8x8 ft designated landing zone replacing a damaged one-piece coroplast board. Sized to fit a 2 ft storage shelf, deployable by one person in under 90 seconds, repairable one panel at a time.",
    year: "2026",
    date: "Summer 2026",
    categories: ["Mechanical"],
    role: "Full design ownership",
    stack: ["SolidWorks", "FDM printing"],
    source: { label: "UBC AeroDesign" },
    cover: {
      kind: "image",
      src: "/work/dlz-fold-open.jpg",
      width: 825,
      height: 721,
      alt: "Interleaved knuckle fold joint with panels open",
    },
    blocks: [
      {
        kind: "image",
        src: "/work/dlz-fold-open.jpg",
        width: 825,
        height: 721,
        alt: "Selected fold joint, interleaved knuckles on a continuous pin, panels open",
        caption: "Selected fold joint — interleaved knuckles on a continuous pin, panels open",
        wide: true,
      },
      {
        kind: "text",
        heading: "Approach",
        body: [
          "The existing DLZ was four 4x4 ft coroplast boards staked into the ground; after a season it was a set of non-uniform pieces with jagged edges and crushed internal flutes. A replacement had to survive repeated impacts from dropped hardware, stay flat under prop wash, and still fit in a car.",
          "The panel configuration study came first — 24 in strips, a grid of 24x24 in squares, or four 48x48 in panels. The grid won on packing flexibility and single-panel replacement, at the cost of four-panel junctions at every interior crossing. Staggering the seams eliminates those outright, collapsing the problem to one governing linkage: the two-panel fold joint. Seven joint concepts were evaluated, three kept deliberately after being ruled out, because documenting why the obvious answers fail is more convincing than omitting them.",
        ],
      },
      {
        kind: "list",
        heading: "Key design decisions",
        items: [
          {
            term: "24 x 24 in module",
            detail:
              "smallest panel that still packs flat, and the unit of repair when one section is destroyed.",
          },
          {
            term: "Staggered seams",
            detail: "removes the four-panel junction as a design problem rather than solving it.",
          },
          {
            term: "Flushness as the hard constraint",
            detail:
              "H- and U-channels sit proud of both faces, so a wheel catches. That pushed the search into flexure and thick-origami hinges.",
          },
          {
            term: "Non-structural perimeter caps",
            detail:
              "they cap exposed flutes against grit and give a wheel a ramp onto the mat instead of an edge.",
          },
        ],
      },
      {
        kind: "specs",
        heading: "Target specification",
        rows: [
          { label: "Deployed", value: "8.0 x 8.0 ft" },
          { label: "Packed (ideal)", value: "2.0 x 2.0 ft" },
          { label: "Deploy time", value: "under 1.5 min" },
          { label: "Crew", value: "1 person" },
          { label: "Impact resistance", value: "10 lb+" },
          { label: "Panel swap", value: "under 3 min" },
          { label: "Panel module", value: "24 x 24 in" },
          { label: "Linkage types", value: "3" },
          { label: "Concepts evaluated", value: "7" },
          { label: "Material", value: "Corrugated plastic" },
        ],
      },
      {
        kind: "image",
        src: "/work/dlz-fold-closed.jpg",
        width: 595,
        height: 719,
        alt: "The same joint folded through 180 degrees, knuckles nested",
        caption: "Same joint folded through 180 degrees — the knuckles nest, the pin stays below the surface",
        wide: true,
      },
      {
        kind: "image",
        src: "/work/dlz-u-channel.jpg",
        width: 942,
        height: 1242,
        alt: "U-channel joint concept",
        caption: "C1 — U-channel",
      },
      {
        kind: "image",
        src: "/work/dlz-h-channel.jpg",
        width: 1496,
        height: 1477,
        alt: "H-channel joint concept",
        caption: "C2 — H-channel, the prototype that exposed the flushness requirement",
      },
      {
        kind: "image",
        src: "/work/dlz-configuration-study.jpg",
        width: 1600,
        height: 652,
        alt: "Configuration study comparing three panel layouts",
        caption: "Configuration study A/B/C — strips, 24 in grid, and four 48 in panels",
        wide: true,
      },
      {
        kind: "text",
        note: true,
        body: [
          "The requirement that did the most work was flushness, and it was not on the original list. It only appeared once the H-channel prototype was in hand: the joint was strong, cheap and off-the-shelf, and it was also a ridge running across the landing surface. A ridge is not a structural failure, so nothing in the needs table caught it. It took a printed part on a table to turn “joins two panels” into “joins two panels flush.”",
        ],
      },
    ],
  },
  {
    slug: "ai-chessathon",
    title: "AI Chessathon Chess Engine",
    summary:
      "A chess engine written from scratch in Python over nine days for a 465-entrant competition. Negamax search compiled with Numba to 2.7M nodes/second, a tapered classical evaluation, and thirteen builds each gated on a match against a frozen snapshot. Finished 199th, peak rating 1835.",
    year: "2026",
    date: "Sept 2026, 9 days",
    categories: ["Software"],
    role: "Search, evaluation, benchmarking",
    stack: ["Python", "Numba", "PyTorch"],
    source: { label: "GitHub", href: "https://github.com/le-fische/AIChessathon" },
    cover: {
      kind: "image",
      src: "/work/chess-ladder.jpg",
      width: 1800,
      height: 1012,
      alt: "Rating across 108 rated games, peaking at 1835",
    },
    blocks: [
      {
        kind: "image",
        src: "/work/chess-architecture.jpg",
        width: 1800,
        height: 1136,
        alt: "Engine architecture: two search paths sharing one evaluation contract",
        caption: "Architecture — two search paths, one evaluation contract",
        wide: true,
      },
      {
        kind: "text",
        heading: "Engine",
        body: [
          "Search is negamax with alpha-beta over bitboards, with iterative deepening, transposition tables, MVV-LVA ordering with killer and history heuristics, quiescence, null-move pruning, late move reductions, aspiration windows and check extensions.",
          "Two implementations run that same algorithm: a Numba-JIT path that plays, and a pure-Python fallback that serves as the readable definition of correct. Both must agree exactly on evaluation, verified by random walk over 7,663 positions; that invariant caught two real divergences. The evaluation that shipped is tapered PeSTO with Syzygy probing to four pieces. A 768-256-1 NNUE was trained in PyTorch and reverted after scoring 1.7% over 60 games against it.",
        ],
      },
      {
        kind: "image",
        src: "/work/chess-ladder.jpg",
        width: 1800,
        height: 1012,
        alt: "Rating chart across 108 rated games showing a reverted clock regression and a peak of 1835",
        caption: "Rating across 108 rated games — 13 builds, one reverted regression",
        wide: true,
      },
      {
        kind: "list",
        heading: "Measurement protocol",
        items: [
          {
            term: "Every change gated on a 30-60 game match",
            detail: "at real time control against a SHA256-hashed frozen snapshot, never the working tree.",
          },
          {
            term: "Confidence intervals crossing 50%",
            detail: "make the change unmeasured, not neutral.",
          },
          {
            term: "Every run appended to the repository",
            detail: "regardless of outcome, so failed ideas stay on the record.",
          },
          {
            term: "A dual-evaluation invariant test",
            detail: "across the two search paths, which caught two real divergences.",
          },
        ],
      },
      {
        kind: "image",
        src: "/work/chess-gates.jpg",
        width: 1800,
        height: 1012,
        alt: "Gate results for six candidate changes, only one clearing its confidence interval",
        caption: "Gate results — one change in six cleared its interval",
        wide: true,
      },
      {
        kind: "image",
        src: "/work/chess-round103.jpg",
        width: 1800,
        height: 1125,
        alt: "Round 103 position with the played move and the correct move, and the evaluation gap between them",
        caption: "Round 103 — a won endgame drawn, reproduced and diagnosed",
        wide: true,
      },
      {
        kind: "specs",
        heading: "Result and engine",
        rows: [
          { label: "Entrants", value: "465" },
          { label: "Placement", value: "199th" },
          { label: "Peak / final", value: "1835 / 1749" },
          { label: "Rated games", value: "108" },
          { label: "Builds shipped", value: "13" },
          { label: "Search rate", value: "2.7M nodes/s" },
          { label: "Depth reached", value: "12.4 plies" },
          { label: "Licence", value: "MIT, public" },
        ],
      },
      {
        kind: "text",
        note: true,
        body: [
          "A 60-game gate resolves about 35 Elo and cost four to six hours, so nine days bought roughly thirty decisions, and every evaluation term worth 5-20 Elo was invisible to the process meant to judge it. One change in six cleared its gate. Meanwhile the branching factor sat at 3.23 against an ideal of 2.0-2.5, worth about three plies. We spent the week improving the thing we could not measure instead of the thing we could.",
        ],
      },
    ],
  },
  {
    slug: "yvr-tracker",
    title: "YVR Tracker",
    summary:
      "A live ADS-B tracker for Vancouver International that draws the airport as a 3D wireframe: runways, taxiways, terminal geometry, coastline and terrain, with aircraft trails and an operations panel that infers the active runway configuration from live traffic.",
    year: "2026",
    date: "Summer 2026",
    categories: ["Software"],
    role: "Sole contributor",
    stack: ["Next.js", "Three.js", "Python"],
    source: { label: "Live", href: "https://yvr-tracker.vercel.app" },
    cover: {
      kind: "image",
      src: "/work/yvr-tracker-global.jpg",
      width: 1600,
      height: 918,
      alt: "Wireframe 3D view of Vancouver International with live aircraft traffic",
    },
    blocks: [
      {
        kind: "image",
        src: "/work/yvr-tracker-global.jpg",
        width: 1600,
        height: 918,
        alt: "Global view showing wireframe runways, taxiways and terminal geometry over terrain, with live traffic and the airport operations panel",
        caption:
          "Global view — wireframe runways, taxiways and terminal geometry over DEM terrain, with live traffic, trails, and the Airport Ops panel reporting auto-inferred active runways",
        wide: true,
      },
      {
        kind: "text",
        heading: "Architecture",
        body: [
          "The front end is Next.js on Vercel, drawing a 3D scene from pre-processed geometry rather than map tiles, which is what lets the whole airport read as one continuous wireframe instead of a photograph with icons on top of it.",
          "That geometry comes from a Python preprocessing pipeline run offline: DEM elevation tiles fetched and meshed into the terrain band on the horizon, coastlines traced, cleaned and merged from raw vector sources, and OpenStreetMap Overpass queries pulling building footprints and taxiway centrelines. Each stage is filtered and verified against test fixtures before being baked into the scene.",
        ],
      },
      {
        kind: "list",
        heading: "Notable features",
        items: [
          {
            term: "Auto-inferred runway configuration",
            detail: "the ops panel reads live traffic and reports the active pair rather than being told which one is in use.",
          },
          { term: "Global and tower views", detail: "an orbital overview, and the field seen from the control tower's own position." },
          { term: "Per-aircraft trails", detail: "with callsign and type labels, toggleable." },
          { term: "Live weather", detail: "temperature and wind speed and direction alongside inbound and outbound lists." },
          { term: "Imperial / metric switch", detail: "throughout the interface." },
        ],
      },
      {
        kind: "specs",
        heading: "Project stats",
        rows: [
          { label: "Status", value: "Live" },
          { label: "Framework", value: "Next.js" },
          { label: "Rendering", value: "3D wireframe" },
          { label: "Telemetry", value: "ADS-B" },
          { label: "Geometry", value: "OSM / Overpass" },
          { label: "Terrain", value: "DEM tiles" },
          { label: "Pipeline", value: "Python" },
          { label: "Views", value: "Global / Tower" },
          { label: "Hosting", value: "Vercel" },
          { label: "Repo", value: "Public" },
        ],
      },
      {
        kind: "text",
        note: true,
        body: [
          "Most of the work was not the tracker, it was the map. ADS-B gives clean positions; what it does not give is a world to put them in, and building that world meant a long tail of small Python scripts to fetch, trace, clean, merge and verify coastline and elevation data that was never intended to be rendered at this scale. The visible part of the project sits on top of a preprocessing pipeline several times its size, which is not how I scoped it going in.",
        ],
      },
    ],
  },
  {
    slug: "pioneer-daycare",
    title: "Pioneer Daycare",
    summary:
      "End-to-end design, build and deployment of a trilingual website for a bilingual daycare operating in Richmond, BC since 1996, including an admin dashboard explicitly designed for a non-technical elderly operator.",
    year: "2026",
    date: "May 2026",
    categories: ["Software"],
    role: "Solo developer, freelance",
    stack: ["Next.js 15", "TypeScript", "Supabase"],
    source: { label: "pioneerdaycare.org", href: "https://pioneerdaycare.org" },
    cover: {
      kind: "image",
      src: "/work/pioneer-daycare-home.jpg",
      width: 1600,
      height: 1000,
      alt: "Pioneer Daycare production homepage",
    },
    blocks: [
      {
        kind: "image",
        src: "/work/pioneer-daycare-home.jpg",
        width: 1600,
        height: 1000,
        alt: "Production homepage with custom design and runtime language switcher",
        caption: "Production homepage — custom design, GSAP scroll animations, runtime i18n switcher",
        wide: true,
      },
      {
        kind: "text",
        heading: "Architecture",
        body: [
          "Next.js 15 (App Router) with React 18 and TypeScript on the frontend; Tailwind CSS for styling; GSAP for scroll-triggered animations and Framer Motion for page transitions. Backend uses Supabase (Postgres, storage, Row Level Security) with Next.js API routes handling contact submissions, admin auth, and content management. Transactional email via Resend.",
          "Deployed on Vercel with Cloudflare DNS, security headers (HSTS, X-Frame-Options, CSP), JSON-LD structured data, and PIPEDA/PIPA-compliant cookie consent gating analytics.",
        ],
      },
      {
        kind: "list",
        heading: "Notable engineering",
        items: [
          {
            term: "Business-hours-aware notifications",
            detail: "instant during open hours, morning digest cron via Vercel Cron for overnight inquiries.",
          },
          {
            term: "Trilingual content system",
            detail: "runtime i18n covering English, Simplified and Traditional Chinese audiences.",
          },
          {
            term: "Admin UX for non-technical users",
            detail: "inbox with inline email reply, content editor with live preview, large targets, confirmation dialogs.",
          },
          {
            term: "Supabase RLS policies",
            detail: "learned the hard way after silent data failures from misconfigured policies.",
          },
        ],
      },
      {
        kind: "specs",
        heading: "Project stats",
        rows: [
          { label: "Source LOC", value: "~8,200" },
          { label: "Source files", value: "65" },
          { label: "Public pages", value: "8" },
          { label: "Admin pages", value: "6" },
          { label: "Languages", value: "EN / ZH / ZH-TW" },
          { label: "Framework", value: "Next.js 15" },
          { label: "Database", value: "Supabase / Postgres" },
          { label: "Email", value: "Resend" },
          { label: "Hosting", value: "Vercel" },
          { label: "Status", value: "Live in production" },
        ],
      },
      {
        kind: "text",
        note: true,
        body: [
          "The hardest part wasn't the stack, it was the admin UX. Every admin decision was governed by one question: would the operator find this obvious without instruction? That constraint reshaped layout, copy and error states, and is the lesson I'd carry to any user-facing tool.",
        ],
      },
    ],
  },
  {
    slug: "rwh-simulator",
    title: "3D Rainwater Harvesting Simulator",
    summary:
      "An interactive 3D decision-support tool for a rainwater harvesting system design project, combining real historical rain data with hydraulic flow modelling, cost analysis, GHG emissions and reliability scoring, all recalculated in real time.",
    year: "2026",
    date: "Mar-Apr 2026",
    categories: ["Software"],
    role: "Sole contributor",
    stack: ["Three.js", "Vanilla JS"],
    source: { label: "UBC Engineering" },
    links: [
      { label: "Live", href: "https://le-fische.github.io/RWH-simulator" },
      { label: "Repo", href: "https://github.com/le-fische/RWH-simulator" },
    ],
    cover: {
      kind: "image",
      src: "/work/rwh-simulator-interface.jpg",
      width: 1600,
      height: 1000,
      alt: "Simulator interface with 3D terrain, configuration panel and results",
    },
    blocks: [
      {
        kind: "image",
        src: "/work/rwh-simulator-interface.jpg",
        width: 1600,
        height: 1000,
        alt: "Main interface: Three.js terrain rendered from CSV elevation data, configuration panel, real-time weighted performance score",
        caption:
          "Main interface — Three.js terrain rendered from CSV elevation data, configuration panel (left), real-time weighted performance score with radar profile (right)",
        wide: true,
      },
      {
        kind: "text",
        heading: "Simulation scope",
        body: [
          "Inputs: terrain CSV, historical rain CSVs (2013-2015), catchment area, tank volume, water tower config, pump model, filtration location, treatment type (chlorine against ozone), UV toggle, and power source (solar against diesel).",
          "Outputs: a composite performance score weighted across seven categories, plus a full data matrix with hydraulic physics, CapEx/OpEx breakdown, and environmental risk profile.",
        ],
      },
      {
        kind: "list",
        heading: "Notable features",
        items: [
          { term: "3D terrain from uploaded elevation CSV", detail: "with drag-and-drop component placement on the map." },
          { term: "Day/night toggle", detail: "and full light/dark theming via CSS variables." },
          { term: "Real-time recalculation", detail: "every slider movement updates the full simulation instantly." },
          { term: "Transparent data matrix", detail: "exposing every cost line, physics equation, and assumption." },
          {
            term: "No auto-solvers by design",
            detail: "academic integrity built in; students verify with hand calculations.",
          },
        ],
      },
      {
        kind: "specs",
        heading: "Project stats",
        rows: [
          { label: "Source size", value: "~137 KB" },
          { label: "JavaScript", value: "~99 KB" },
          { label: "Estimated LOC", value: "3,500-4,000" },
          { label: "3D engine", value: "Three.js" },
          { label: "Data", value: "CSV (terrain + rain)" },
          { label: "Years modelled", value: "2013-2015" },
          { label: "Score factors", value: "7 weighted" },
          { label: "Hosting", value: "GitHub Pages" },
        ],
      },
      {
        kind: "text",
        note: true,
        body: [
          "Rendering custom terrain from CSV in Three.js was the technical challenge; the harder one was information design, making a multi-variable simulation legible without overwhelming the user. The data matrix isn't a feature, it's a requirement: if students can't see the model, they can't trust it.",
        ],
      },
    ],
  },
  {
    slug: "retrieval-claw",
    title: "Autonomous Mechanical Retrieval Claw",
    summary:
      "A sheet-metal claw actuated by a single servo, controlled through an Arduino UNO and a sonar-aided joystick interface, designed to pick up objects at distance under strict time and material constraints.",
    year: "2026",
    date: "Feb 2026",
    categories: ["Embedded", "Electronics", "Mechanical"],
    role: "Software and hardware integration",
    stack: ["SolidWorks", "Arduino", "C++"],
    source: { label: "APSC 101" },
    cover: {
      kind: "image",
      src: "/work/claw-top-down.jpg",
      width: 1080,
      height: 797,
      alt: "Top-down view of the retrieval claw with electronics visible",
    },
    blocks: [
      {
        kind: "image",
        src: "/work/claw-top-down.jpg",
        width: 1080,
        height: 797,
        alt: "Top-down view, claw open, electronics visible",
        caption: "Top-down — claw open, electronics visible",
        wide: true,
      },
      {
        kind: "text",
        heading: "Approach",
        body: [
          "The mechanism uses a door-joint linkage driven by a single servo to convert rotational motion into a symmetric jaw closure. Sheet metal was a constraint, and it shaped the structural strategy: folded panels rather than welded brackets, to keep fabrication within the time budget.",
          "Control logic runs on an Arduino UNO in custom C++, reading ultrasonic (HC-SR04) distance and joystick inputs to drive the servo. My role spanned both firmware and hardware integration, including routing power to the servo without browning out the UNO, which required a separate battery feed.",
        ],
      },
      {
        kind: "list",
        heading: "Key design decisions",
        items: [
          { term: "Single-servo actuation over dual-motor", detail: "reduces weight, wiring and current draw." },
          { term: "Door-joint linkage geometry", detail: "tuned across iterations for grip strength against travel." },
          { term: "Sonar mounted forward of the claw", detail: "proximity feedback before contact." },
          { term: "Isolated power rail for the servo", detail: "keeps motor noise out of the logic supply." },
        ],
      },
      {
        kind: "specs",
        heading: "Technical specification",
        rows: [
          { label: "Length", value: "150 mm" },
          { label: "Width", value: "145 mm" },
          { label: "Height", value: "96 mm" },
          { label: "Actuator", value: "Servo motor" },
          { label: "Controller", value: "Arduino UNO" },
          { label: "Sensing", value: "HC-SR04 sonar" },
          { label: "Input", value: "Joystick" },
          { label: "Material", value: "Sheet metal" },
          { label: "Team", value: "Team E6, 7 members" },
        ],
      },
      {
        kind: "image",
        src: "/work/claw-plan.jpg",
        width: 1080,
        height: 1161,
        alt: "Plan view of the integrated assembly",
        caption: "Plan view — integrated assembly",
      },
      {
        kind: "image",
        src: "/work/claw-side.jpg",
        width: 1080,
        height: 820,
        alt: "Side elevation showing the cantilever extension arm",
        caption: "Side elevation — cantilever extension arm",
      },
      {
        kind: "image",
        src: "/work/claw-drawing.jpg",
        width: 1080,
        height: 985,
        alt: "Engineering drawing with three views and dimensions in millimetres",
        caption: "Engineering drawing — three views with dimensions (mm)",
        wide: true,
      },
      {
        kind: "text",
        note: true,
        body: [
          "The biggest lesson was the cost of underestimating integration time. Subsystems — mechanism, firmware, sensing — worked in isolation, but power routing and signal-integrity issues surfaced only at integration. Next iteration: prototype the full electrical loop on a breadboard before committing to the mechanical layout, so structure can be designed around clean wire paths.",
        ],
      },
    ],
  },
  {
    slug: "cardboard-chair",
    title: "Disaster Relief Cardboard Chair",
    summary:
      "A load-bearing chair built from a single 48x48 in sheet of corrugated cardboard with zero adhesives or fasteners, designed for children aged 4 to 6 in disaster relief shelters.",
    year: "2025",
    categories: ["Mechanical"],
    role: "Prototyping and load testing",
    stack: ["Iterative C-sketching", "Statics"],
    source: { label: "APSC 100/101" },
    cover: {
      kind: "image",
      src: "/work/cardboard-chair-final.jpg",
      width: 1600,
      height: 630,
      alt: "Final cardboard chair design, front and rear views with labelled features",
    },
    blocks: [
      {
        kind: "image",
        src: "/work/cardboard-chair-final.jpg",
        width: 1600,
        height: 630,
        alt: "Final design, front and rear views with labelled features",
        caption:
          "Final design — front and rear views with labelled features (backrest, seat, concaved base, handle, internal bracing, storage lid)",
        wide: true,
      },
      {
        kind: "text",
        heading: "Design process, two iteration cycles",
        body: [
          "Round 1 generated six concepts via C-sketching. After screening against the requirements — durability, storage, single-sheet constraint — only one of six passed, a clear signal that the team had under-defined the problem before generating solutions.",
          "We restarted: re-clarified stakeholder needs (children, parents, relief teams, NGOs), tightened the criteria, then ran a second C-sketching round. Round 2 produced three viable concepts; the top two were prototyped at half-scale and stress-tested. The winning design supported 300 lbs, 50% over the 200 lb target, using less material than the runner-up.",
        ],
      },
      {
        kind: "text",
        heading: "My contribution",
        body: [
          "Led physical prototyping and load testing: built the half-scale prototypes, ran the stress tests that identified the winning concept, and applied statics calculations to rationalize material distribution and joint placement without adhesives, relying only on slotted tabs, folds, and internal bracing.",
        ],
      },
      {
        kind: "specs",
        heading: "Final specification",
        rows: [
          { label: "Load capacity", value: "300 lbs" },
          { label: "Target", value: "200 lbs" },
          { label: "Overall height", value: "20 in" },
          { label: "Seat elevation", value: "10 in" },
          { label: "Seat dimensions", value: "14 x 14 in" },
          { label: "Base dimensions", value: "12 x 19 in" },
          { label: "Backrest", value: "16 degrees from vertical" },
          { label: "Storage", value: "900 cubic in" },
          { label: "Material used", value: "1632 square in" },
          { label: "Joinery", value: "Tabs and folds" },
        ],
      },
      {
        kind: "text",
        note: true,
        body: [
          "Round 1's failure rate was the most valuable feedback of the project: generating solutions before fully scoping the problem produces designs that look promising but collapse under criteria they were never built to meet. Re-iterating from the problem statement, rather than from the failed designs themselves, turned a frustrating cycle into a winning one, and that re-framing is now my first step on any constrained problem.",
        ],
      },
    ],
  },
  {
    slug: "kendoras-box",
    title: "Kendora's Box",
    summary:
      "An adaptive toothpaste dispenser for users with limited hand dexterity. Traditional squeeze tubes require simultaneous fine motor control and grip strength; this replaces the pinch-and-squeeze with a vertical push pad and an incremental-grooved track.",
    year: "2025",
    date: "Nov 2025",
    categories: ["Mechanical"],
    role: "CAD and mechanism design",
    stack: ["Fusion 360", "PLA 3D print"],
    source: { label: "APSC 100" },
    cover: {
      kind: "image",
      src: "/work/kendoras-box-operation.jpg",
      width: 1600,
      height: 902,
      alt: "Three-step operation diagram: unscrew, dock, dispense",
    },
    blocks: [
      {
        kind: "image",
        src: "/work/kendoras-box-operation.jpg",
        width: 1600,
        height: 902,
        alt: "Three-step operation: unscrew, dock, dispense",
        caption: "Three-step operation: unscrew, dock, dispense. Envelope 26 x 10 x 18.5 cm.",
        wide: true,
      },
      {
        kind: "text",
        heading: "Approach",
        body: [
          "Progressed from hand sketches to cardboard ergonomic mock-ups to a 3D-printed PLA prototype in Fusion 360. The cardboard models were essential for testing whether a user with limited grip could engage the push pad without slipping, a question CAD alone could not answer.",
        ],
      },
      {
        kind: "list",
        heading: "Key mechanical features",
        items: [
          {
            term: "Push pad",
            detail: "broad surface engaged with palm or forearm rather than fingertips, replacing the precision-pinch motion.",
          },
          {
            term: "Incremental grooves",
            detail: "vertical ratchet track locking dispensed volume in discrete steps, so partial presses still produce a clean dose.",
          },
          {
            term: "Rotating cap-unscrew slot",
            detail: "keyed hole lets the user remove the toothpaste cap by rotating the whole device, eliminating the two-handed twist-off.",
          },
        ],
      },
      {
        kind: "specs",
        heading: "Specification",
        rows: [
          { label: "Width", value: "26 cm" },
          { label: "Depth", value: "10 cm" },
          { label: "Height", value: "18.5 cm" },
          { label: "Frame", value: "PLA, 3D printed" },
          { label: "CAD", value: "Fusion 360" },
          { label: "Team", value: "Team B4" },
        ],
      },
      {
        kind: "image",
        src: "/work/kendoras-box-drawing.jpg",
        width: 1600,
        height: 925,
        alt: "Technical drawing with isometric and detail views",
        caption: "Technical drawing — isometric and detail views",
        wide: true,
      },
      {
        kind: "text",
        note: true,
        body: [
          "The cardboard-modelling stage caught an issue no CAD render would have flagged: the original push pad was too narrow, and users with reduced grip naturally rested their hand off-centre, causing the pad to bind. Widening it in CAD was trivial, but only because a physical prototype made the problem visible. Cardboard mock-ups are now a non-optional step for any user-facing mechanism.",
        ],
      },
    ],
  },
];

export function getProject(slug: string) {
  return projects.find((p) => p.slug === slug);
}

/** Newest first, which is the order the timeline deals them. */
export function projectsByYear() {
  return [...projects].sort((a, b) => Number(b.year) - Number(a.year));
}
