import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { ProjectMedia } from "@/components/ProjectMedia";
import { Reveal } from "@/components/Reveal";
import { SiteHeader } from "@/components/SiteHeader";
import { SuitPips } from "@/components/SuitPips";
import { getProject, projects, type Block } from "@/content/projects";
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
    // A note is the closing reflection: same measure, quieter, set against a rule.
    return (
      <Reveal className={cn("w-full max-w-2xl", block.note && "border-l border-line pl-6")}>
        {block.heading && <h2 className="text-h2 mb-6 font-medium">{block.heading}</h2>}
        <div className={cn("space-y-5 text-body text-muted", block.note && "italic")}>
          {block.body.map((paragraph, i) => (
            <p key={i}>{paragraph}</p>
          ))}
        </div>
      </Reveal>
    );
  }

  if (block.kind === "list") {
    return (
      <Reveal className="w-full max-w-2xl">
        {block.heading && <h2 className="text-h2 mb-6 font-medium">{block.heading}</h2>}
        <ul className="space-y-4">
          {block.items.map((item, i) => (
            <li key={i} className="flex gap-4 text-body">
              <span aria-hidden className="mt-[0.7em] h-px w-4 shrink-0 bg-line" />
              <span className="text-muted">
                {item.term && <span className="font-medium text-ink">{item.term} </span>}
                {item.detail}
              </span>
            </li>
          ))}
        </ul>
      </Reveal>
    );
  }

  if (block.kind === "specs") {
    return (
      <Reveal className="w-full max-w-2xl">
        {block.heading && <h2 className="text-h2 mb-6 font-medium">{block.heading}</h2>}
        <dl className="border-t border-line">
          {block.rows.map((row) => (
            <div
              key={row.label}
              className="flex items-baseline justify-between gap-6 border-b border-line py-3"
            >
              <dt className="label text-muted">{row.label}</dt>
              <dd className="text-small text-right">{row.value}</dd>
            </div>
          ))}
        </dl>
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

  const position = projects.findIndex((p) => p.slug === project.slug);
  const next = projects[(position + 1) % projects.length];

  return (
    <>
      <SiteHeader alwaysVisible />

      <main className="px-gutter pt-32 pb-section">
        <div className="mx-auto max-w-5xl">
          {/* Same pill as the intro's skip control, so "get me out of here"
              looks the same wherever it appears. */}
          <Link
            href="/#work"
            className="label group inline-flex items-center gap-2 rounded-full border border-line px-4 py-2.5 text-muted transition-colors hover:border-ink hover:text-ink"
          >
            <span aria-hidden className="transition-transform duration-300 group-hover:-translate-x-0.5">
              &larr;
            </span>
            All work
          </Link>
        </div>

        <header className="mx-auto mt-12 max-w-5xl">
          <Reveal>
            <div className="flex flex-wrap items-center gap-3">
              <SuitPips categories={project.categories} className="text-base" />
              <span className="label text-muted">{project.categories.join(" / ")}</span>
              <span className="label text-muted">/ {project.date ?? project.year}</span>
              {project.draft && <span className="label text-muted">/ Placeholder</span>}
            </div>
            <h1 className="text-h1 mt-6 max-w-3xl font-medium text-balance">{project.title}</h1>
            <p className="text-lead mt-6 max-w-2xl text-muted">{project.summary}</p>
          </Reveal>

          <Reveal delay={0.08}>
            <dl className="mt-14 grid grid-cols-2 gap-x-gutter gap-y-8 border-t border-line pt-8 md:grid-cols-3">
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
              {project.source && (
                <div>
                  <dt className="label text-muted">Source</dt>
                  <dd className="mt-2 text-small">
                    {/* A repo gets a link; a team or a course is just a name. */}
                    {project.source.href ? (
                      <a
                        href={project.source.href}
                        target="_blank"
                        rel="noreferrer"
                        className="underline decoration-line underline-offset-4 transition-colors hover:text-accent hover:decoration-accent"
                      >
                        {project.source.label}
                      </a>
                    ) : (
                      project.source.label
                    )}
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
            &larr; All work
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
