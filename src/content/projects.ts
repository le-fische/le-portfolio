/**
 * The entire content layer.
 *
 * Replacing the placeholders below is the only edit needed to publish real
 * work: nothing else in the app hardcodes a project. Drop images and .glb files
 * into /public and reference them with a leading slash.
 *
 * Media kinds:
 *   image  a still from /public or a remote URL configured in next.config.ts
 *   video  a self-hosted mp4/webm, muted and looping
 *   embed  any iframe: Spline, Sketchfab, YouTube, Onshape, a live deployment
 *   model  a .glb rendered in-page by <model-viewer>
 *
 * Any project whose blocks contain an `embed` or `model` also gets a
 * chromeless full-screen route at /work/<slug>/preview.
 */

export type Discipline = "Software" | "Hardware" | "Mechanical" | "3D Design";

export type ImageBlock = {
  kind: "image";
  src: string;
  alt: string;
  caption?: string;
  wide?: boolean;
};
export type VideoBlock = {
  kind: "video";
  src: string;
  poster?: string;
  caption?: string;
  wide?: boolean;
};
export type EmbedBlock = {
  kind: "embed";
  src: string;
  title: string;
  /** width / height. Defaults to 16/10. */
  ratio?: number;
  caption?: string;
  wide?: boolean;
};
export type ModelBlock = {
  kind: "model";
  src: string;
  alt: string;
  poster?: string;
  caption?: string;
  wide?: boolean;
};
export type TextBlock = { kind: "text"; heading?: string; body: string[] };

export type MediaBlock = ImageBlock | VideoBlock | EmbedBlock | ModelBlock;
export type Block = TextBlock | MediaBlock;

export type Project = {
  slug: string;
  title: string;
  summary: string;
  year: string;
  discipline: Discipline;
  role?: string;
  stack?: string[];
  /** Tile media for the index. Omit for a typographic tile. */
  cover?: MediaBlock;
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
          "Keep it to two short paragraphs. The media carries the rest.",
        ],
      },
      { kind: "image", src: "", alt: "Placeholder", caption: "Drop a photo in /public", wide: true },
    ],
  },
  {
    slug: "placeholder-3d",
    title: "3D Environment",
    summary: "A project whose point is the geometry. Rendered live, not screenshotted.",
    year: "2026",
    discipline: "3D Design",
    role: "Modelling, rendering",
    stack: ["Fusion 360", "Blender", "glTF"],
    draft: true,
    blocks: [
      {
        kind: "text",
        body: ["Demonstrates an in-page .glb. Swap the src for your own export."],
      },
      {
        kind: "model",
        // A stable public sample so the viewer is verifiable before real assets land.
        src: "https://modelviewer.dev/shared-assets/models/Astronaut.glb",
        alt: "Sample model rendered with model-viewer",
        caption: "Drag to orbit. Replace with your own .glb export.",
        wide: true,
      },
    ],
  },
  {
    slug: "placeholder-software",
    title: "Software Project",
    summary: "Something with a live deployment worth linking rather than describing.",
    year: "2025",
    discipline: "Software",
    role: "Full stack",
    stack: ["TypeScript", "Next.js", "Postgres"],
    draft: true,
    blocks: [
      { kind: "text", body: ["Use an embed block to inline a live deployment or a Spline scene."] },
      { kind: "embed", src: "", title: "Live deployment", ratio: 16 / 10, wide: true },
    ],
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

/** The block a /preview route renders full-bleed, if the project has one. */
export function getPreviewBlock(project: Project): EmbedBlock | ModelBlock | undefined {
  return project.blocks.find(
    (b): b is EmbedBlock | ModelBlock => b.kind === "embed" || b.kind === "model",
  );
}
