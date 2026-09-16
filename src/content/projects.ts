/**
 * The entire content layer.
 *
 * Replacing the placeholders below is the only edit needed to publish real
 * work: nothing else in the app hardcodes a project. Drop images into /public
 * and reference them with a leading slash.
 *
 * Only `image` media is supported for now. Video, iframe embeds (Spline,
 * Sketchfab, a live deployment) and in-page .glb models were built and then
 * removed in the commit after 689e6ea; restore them from there when needed
 * rather than rewriting them.
 */

export type Discipline = "Software" | "Hardware" | "Mechanical" | "3D Design";

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
  discipline: Discipline;
  role?: string;
  stack?: string[];
  /** Tile image for the index. Omit for a typographic tile. */
  cover?: ImageBlock;
  links?: { label: string; href: string }[];
  blocks: Block[];
  /** Marks unfinished entries so an unpopulated site never reads as shipped. */
  draft?: boolean;
};

export const DISCIPLINES: Discipline[] = ["Software", "Hardware", "Mechanical", "3D Design"];

export const projects: Project[] = [
  {
    slug: "placeholder-embedded",
    title: "Embedded Project",
    summary:
      "One sentence on what it does and why it was hard. Replace this entry with real work.",
    year: "2026",
    discipline: "Hardware",
    role: "Firmware, PCB",
    stack: ["C", "STM32", "KiCad"],
    draft: true,
    links: [{ label: "Source", href: "https://github.com/le-fische" }],
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
    slug: "placeholder-3d",
    title: "3D Environment",
    summary: "A project whose point is the geometry. Renders and exploded views.",
    year: "2026",
    discipline: "3D Design",
    role: "Modelling, rendering",
    stack: ["Fusion 360", "Blender"],
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
    discipline: "Software",
    role: "Full stack",
    stack: ["TypeScript", "Next.js", "Postgres"],
    draft: true,
    blocks: [{ kind: "text", body: ["Placeholder."] }],
  },
  {
    slug: "placeholder-mechanical",
    title: "Mechanical Project",
    summary: "A build with a physical result. Show the CAD and the finished part.",
    year: "2025",
    discipline: "Mechanical",
    role: "Design, fabrication",
    stack: ["Onshape", "CNC", "Composites"],
    draft: true,
    blocks: [{ kind: "text", body: ["Placeholder."] }],
  },
  {
    slug: "placeholder-five",
    title: "Project Five",
    summary: "Placeholder.",
    year: "2025",
    discipline: "Software",
    draft: true,
    blocks: [{ kind: "text", body: ["Placeholder."] }],
  },
  {
    slug: "placeholder-six",
    title: "Project Six",
    summary: "Placeholder.",
    year: "2024",
    discipline: "Hardware",
    draft: true,
    blocks: [{ kind: "text", body: ["Placeholder."] }],
  },
];

export function getProject(slug: string) {
  return projects.find((p) => p.slug === slug);
}
