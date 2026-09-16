import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { ProjectMedia } from "@/components/ProjectMedia";
import { Reveal } from "@/components/Reveal";
import { SiteHeader } from "@/components/SiteHeader";
import { getPreviewBlock, getProject, projects, type Block } from "@/content/projects";
import { cn } from "@/lib/cn";

type Params = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return projects.map((project) => ({ slug: project.slug }));
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project) return {};
  return { title: project.title, description: project.summary };
}

function BlockView({ block, index }: { block: Block; index: number }) {
  if (block.kind === "text") {
    return (
      <Reveal className="w-full max-w-2xl">
        {block.heading && <h2 className="text-h2 mb-6 font-medium">{block.heading}</h2>}
        <div className="space-y-5 text-body text-muted">
          {block.body.map((paragraph, i) => (
            <p key={i}>{paragraph}</p>
          ))}
        </div>
      </Reveal>
    );
  }

  return (
    <Reveal className={cn("w-full", block.wide ? "max-w-5xl" : "max-w-2xl")}>
      <figure>
        <ProjectMedia block={block} priority={index === 0} />
        {block.caption && (
          <figcaption className="mt-3 text-small text-muted">{block.caption}</figcaption>
        )}
      </figure>
    </Reveal>
  );
}

export default async function ProjectPage({ params }: Params) {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project) notFound();

  const preview = getPreviewBlock(project);
  const position = projects.findIndex((p) => p.slug === project.slug);
  const next = projects[(position + 1) % projects.length];

  return (
    <>
      <SiteHeader alwaysVisible />

      <main className="px-gutter pt-40 pb-section">
        <header className="mx-auto max-w-5xl">
          <Reveal>
            <div className="flex items-center gap-3">
              <span className="label text-accent">{project.discipline}</span>
              <span className="label text-muted">/ {project.year}</span>
              {project.draft && <span className="label text-muted">/ Placeholder</span>}
            </div>
            <h1 className="text-h1 mt-6 max-w-3xl font-medium text-balance">{project.title}</h1>
            <p className="text-lead mt-6 max-w-2xl text-muted">{project.summary}</p>
          </Reveal>

          <Reveal delay={0.08}>
            <dl className="mt-14 grid grid-cols-2 gap-x-gutter gap-y-8 border-t border-line pt-8 md:grid-cols-4">
              {project.role && (
                <div>
                  <dt className="label text-muted">Role</dt>
                  <dd className="mt-2 text-small">{project.role}</dd>
                </div>
              )}
              {project.stack && project.stack.length > 0 && (
                <div>
                  <dt className="label text-muted">Stack</dt>
                  <dd className="mt-2 text-small">{project.stack.join(", ")}</dd>
                </div>
              )}
              {project.links?.map((link) => (
                <div key={link.href}>
                  <dt className="label text-muted">{link.label}</dt>
                  <dd className="mt-2 text-small">
                    <a
                      href={link.href}
                      target="_blank"
                      rel="noreferrer"
                      className="underline decoration-line underline-offset-4 transition-colors hover:text-accent hover:decoration-accent"
                    >
                      Open
                    </a>
                  </dd>
                </div>
              ))}
              {preview && (
                <div>
                  <dt className="label text-muted">Interactive</dt>
                  <dd className="mt-2 text-small">
                    <Link
                      href={`/work/${project.slug}/preview`}
                      className="underline decoration-line underline-offset-4 transition-colors hover:text-accent hover:decoration-accent"
                    >
                      Full screen
                    </Link>
                  </dd>
                </div>
              )}
            </dl>
          </Reveal>
        </header>

        {/* One content column, one left edge: wide media spans it, prose sits
            in a narrower measure against the same axis. */}
        <div className="mx-auto mt-24 max-w-5xl space-y-20">
          {project.blocks.map((block, i) => (
            <BlockView key={i} block={block} index={i} />
          ))}
        </div>
      </main>

      <nav className="border-t border-line px-gutter py-10">
        <div className="mx-auto flex max-w-5xl items-baseline justify-between gap-6">
          <Link href="/#work" className="label text-muted transition-colors hover:text-ink">
            All work
          </Link>
          <Link href={`/work/${next.slug}`} className="group text-right">
            <span className="label block text-muted">Next</span>
            <span className="text-h3 decoration-accent decoration-1 underline-offset-[6px] group-hover:underline">
              {next.title}
            </span>
          </Link>
        </div>
      </nav>
    </>
  );
}
