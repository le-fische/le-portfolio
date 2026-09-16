import Link from "next/link";

import type { Project } from "@/content/projects";
import { ProjectMedia } from "./ProjectMedia";

export function ProjectCard({ project, index }: { project: Project; index: number }) {
  return (
    <Link href={`/work/${project.slug}`} className="group block">
      <div className="relative aspect-[4/3] overflow-hidden border border-line bg-ink/[0.02]">
        {project.cover ? (
          <div className="h-full w-full transition-transform duration-700 ease-[var(--ease-out-expo)] group-hover:scale-[1.03]">
            <ProjectMedia block={project.cover} fill />
          </div>
        ) : (
          /* No cover yet: a deliberate typographic tile rather than a broken image. */
          <div className="flex h-full w-full items-center justify-center p-8">
            <span className="text-center font-display text-h2 text-muted/45">
              {project.discipline}
            </span>
          </div>
        )}

        {project.draft && (
          <span className="label absolute top-3 left-3 bg-canvas px-2 py-1 text-muted">
            Placeholder
          </span>
        )}
      </div>

      <div className="mt-5 flex items-baseline justify-between gap-6">
        <div className="flex items-baseline gap-4">
          <span className="label text-muted">{String(index + 1).padStart(2, "0")}</span>
          <h3 className="text-h3 font-medium decoration-accent decoration-1 underline-offset-[6px] group-hover:underline">
            {project.title}
          </h3>
        </div>
        <span className="label shrink-0 text-muted">{project.year}</span>
      </div>

      <p className="mt-2 max-w-md text-small text-muted">
        {project.summary}
      </p>
    </Link>
  );
}
