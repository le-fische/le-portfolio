import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { ProjectMedia } from "@/components/ProjectMedia";
import { getPreviewBlock, getProject, projects } from "@/content/projects";

type Params = { params: Promise<{ slug: string }> };

/** Only projects that actually carry an embed or a model get a preview route. */
export function generateStaticParams() {
  return projects
    .filter((project) => getPreviewBlock(project))
    .map((project) => ({ slug: project.slug }));
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project) return {};
  return { title: `${project.title} — Preview`, robots: { index: false } };
}

export default async function PreviewPage({ params }: Params) {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project) notFound();

  const block = getPreviewBlock(project);
  if (!block) notFound();

  return (
    <div className="relative h-svh w-full bg-canvas">
      <ProjectMedia block={block} fill className="h-full" />

      <div className="pointer-events-none absolute inset-x-0 top-0 flex items-start justify-between gap-4 p-gutter">
        <div className="pointer-events-auto rounded-full border border-line bg-canvas/85 px-4 py-2 backdrop-blur">
          <span className="label text-ink">{project.title}</span>
        </div>
        <Link
          href={`/work/${project.slug}`}
          className="label pointer-events-auto rounded-full border border-line bg-canvas/85 px-4 py-2.5 text-muted backdrop-blur transition-colors hover:border-ink hover:text-ink"
        >
          Close
        </Link>
      </div>
    </div>
  );
}
