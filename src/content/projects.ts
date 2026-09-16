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
  caption?: string;
  /** Span the full content column instead of the prose measure. */
  wide?: boolean;
};

export type TextBlock = { kind: "text"; heading?: string; body: string[] };

export type Block = TextBlock | ImageBlock;

export type Project = {
  slug: string;
  title: string;
  summary: string;
  year: string;
  /** One or more. The first is the primary and leads everywhere it is listed. */
  categories: Category[];
  role?: string;
  stack?: string[];
  /**
   * Where the project came from: a repo, a team, or a course. `href` is
   * optional, so "UBC AeroDesign" and "APSC 101" are as valid as a GitHub link.
   */
  source?: { label: string; href?: string };
  /** Tile image for the hover preview. Omit for a typographic card face. */
  cover?: ImageBlock;
  blocks: Block[];
  /** Marks unfinished entries so an unpopulated site never reads as shipped. */
  draft?: boolean;
};

export const projects: Project[] = [
  {
    slug: "placeholder-embedded",
    title: "Embedded Project",
    summary:
      "One sentence on what it does and why it was hard. Replace this entry with real work.",
    year: "2026",
    categories: ["Embedded", "Electronics"],
    role: "Firmware, PCB",
    stack: ["C", "STM32", "KiCad"],
    source: { label: "GitHub", href: "https://github.com/le-fische" },
    draft: true,
    blocks: [
      {
        kind: "text",
        heading: "Context",
        body: [
          "What the problem was, who it was for, and the constraint that made the obvious approach fail.",
          "Keep it to two short paragraphs. The images carry the rest.",
        ],
      },
      { kind: "image", src: "", alt: "Placeholder", caption: "Drop a photo in /public", wide: true },
    ],
  },
  {
    slug: "placeholder-fuselage",
    title: "Fuselage Project",
    summary: "A team build with a physical result. Show the CAD and the finished part.",
    year: "2026",
    categories: ["Mechanical"],
    role: "Design, layup",
    stack: ["Onshape", "Composites"],
    source: { label: "UBC AeroDesign" },
    draft: true,
    blocks: [
      { kind: "text", body: ["Placeholder."] },
      { kind: "image", src: "", alt: "Placeholder", wide: true },
    ],
  },
  {
    slug: "placeholder-software",
    title: "Software Project",
    summary: "Something with a live deployment worth linking.",
    year: "2025",
    categories: ["Software"],
    role: "Full stack",
    stack: ["TypeScript", "Next.js", "Postgres"],
    source: { label: "GitHub", href: "https://github.com/le-fische" },
    draft: true,
    blocks: [{ kind: "text", body: ["Placeholder."] }],
  },
  {
    slug: "placeholder-coursework",
    title: "Coursework Project",
    summary: "A course deliverable worth showing. Name the course as the source.",
    year: "2025",
    categories: ["Mechanical", "Software"],
    role: "Team of four",
    stack: ["SolidWorks", "Python"],
    source: { label: "APSC 101" },
    draft: true,
    blocks: [{ kind: "text", body: ["Placeholder."] }],
  },
  {
    slug: "placeholder-five",
    title: "Project Five",
    summary: "Placeholder.",
    year: "2025",
    categories: ["Electronics"],
    draft: true,
    blocks: [{ kind: "text", body: ["Placeholder."] }],
  },
  {
    slug: "placeholder-six",
    title: "Project Six",
    summary: "Placeholder.",
    year: "2024",
    categories: ["Software", "Embedded"],
    draft: true,
    blocks: [{ kind: "text", body: ["Placeholder."] }],
  },
];

export function getProject(slug: string) {
  return projects.find((p) => p.slug === slug);
}

/** Newest first, which is the order the timeline deals them. */
export function projectsByYear() {
  return [...projects].sort((a, b) => Number(b.year) - Number(a.year));
}
