"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import {
  CATEGORIES,
  CATEGORY_SUIT,
  isRedCategory,
  type Category,
  type Project,
} from "@/content/projects";
import { SuitPips } from "./SuitPips";
import { cn } from "@/lib/cn";

gsap.registerPlugin(ScrollTrigger, useGSAP);

type QuickTo = ReturnType<typeof gsap.quickTo>;

/* The spine sits on the node centres. Both are derived from the same three
 * numbers so they cannot drift: year column + row gap + half a node.
 *   mobile   2.5rem + 1rem + 0.875rem
 *   desktop  3.5rem + 2rem + 0.875rem
 * Drawing it once for the whole list, rather than one segment per row, keeps it
 * independent of how flex resolves each row's height. */
const RAIL = "left-[calc(2.5rem+1rem+0.875rem)] md:left-[calc(3.5rem+2rem+0.875rem)]";

// Must match the card below: w-[19rem] plus the image and text block it holds.
const PREVIEW_W = 304;
const PREVIEW_H = 330;

/**
 * The project index as a dealt hand: one row per project on a single spine,
 * newest first. Rows land from above on the same easing the intro deals its
 * aces on, so the two motions read as one.
 *
 * The spine node stays a fixed-width neutral dot so the rail offset above holds
 * whatever a project's category count is; the suits live beside the title.
 *
 * Hovering floats a card-shaped preview near the cursor. That preview is hidden
 * outright on coarse pointers (see .cursor-preview in globals.css) rather than
 * branched on in JS.
 */
export function WorkTimeline({ projects }: { projects: Project[] }) {
  const rootRef = useRef<HTMLDivElement>(null);
  const previewRef = useRef<HTMLDivElement>(null);
  const xTo = useRef<QuickTo | null>(null);
  const yTo = useRef<QuickTo | null>(null);
  const [active, setActive] = useState<Project | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);

  const filtered = selectedCategory
    ? projects.filter((p) => p.categories.includes(selectedCategory))
    : projects;

  useEffect(() => {
    const onSelectCategory = (e: Event) => {
      const custom = e as CustomEvent<Category>;
      if (custom.detail) {
        setSelectedCategory(custom.detail);
      }
    };
    window.addEventListener("select-category", onSelectCategory);
    return () => window.removeEventListener("select-category", onSelectCategory);
  }, []);

  useEffect(() => {
    const id = requestAnimationFrame(() => ScrollTrigger.refresh());
    return () => cancelAnimationFrame(id);
  }, [selectedCategory]);

  useGSAP(
    () => {
      if (previewRef.current) {
        xTo.current = gsap.quickTo(previewRef.current, "x", { duration: 0.5, ease: "power3" });
        yTo.current = gsap.quickTo(previewRef.current, "y", { duration: 0.5, ease: "power3" });
      }

      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

      gsap.from(".timeline-row", {
        y: -26,
        rotateZ: -1.2,
        opacity: 0,
        transformOrigin: "left center",
        duration: 0.7,
        ease: "power3.out",
        stagger: 0.07,
        scrollTrigger: { trigger: rootRef.current, start: "top 82%", once: true },
      });
    },
    { scope: rootRef },
  );

  const track = (e: React.MouseEvent) => {
    // Clamped so the card never runs off the top or bottom of the viewport.
    const y = gsap.utils.clamp(12, window.innerHeight - PREVIEW_H - 12, e.clientY - PREVIEW_H / 2);
    const x = gsap.utils.clamp(12, window.innerWidth - PREVIEW_W - 12, e.clientX + 28);
    xTo.current?.(x);
    yTo.current?.(y);
  };

  const lead = active?.categories[0];

  return (
    <div ref={rootRef} className="relative" onMouseMove={track}>
      {/* Suit / discipline filter bar */}
      <div
        role="group"
        aria-label="Filter projects by discipline"
        className="mb-6 flex flex-wrap items-center gap-2"
      >
        <button
          type="button"
          aria-pressed={selectedCategory === null}
          onClick={() => setSelectedCategory(null)}
          className={cn(
            "label inline-flex min-h-8 cursor-pointer items-center gap-2 rounded-full border px-3.5 py-1.5 transition-[color,border-color,background-color,transform] duration-150 active:scale-[0.97]",
            selectedCategory === null
              ? "border-ink bg-ink text-canvas"
              : "border-line bg-canvas text-muted hover:border-ink hover:text-ink",
          )}
        >
          <span>All</span>
          <span className={selectedCategory === null ? "text-canvas/70" : "text-muted/70"}>
            {String(projects.length).padStart(2, "0")}
          </span>
        </button>

        {CATEGORIES.map((category) => {
          const isSelected = selectedCategory === category;
          const count = projects.filter((p) => p.categories.includes(category)).length;
          return (
            <button
              key={category}
              type="button"
              aria-pressed={isSelected}
              onClick={() => setSelectedCategory(isSelected ? null : category)}
              className={cn(
                "label inline-flex min-h-8 cursor-pointer items-center gap-2 rounded-full border px-3.5 py-1.5 transition-[color,border-color,background-color,transform] duration-150 active:scale-[0.97]",
                isSelected
                  ? "border-ink bg-ink text-canvas"
                  : "border-line bg-canvas text-muted hover:border-ink hover:text-ink",
              )}
            >
              <span
                aria-hidden
                className={cn(
                  "text-xs leading-none",
                  isSelected
                    ? isRedCategory(category)
                      ? "text-[#ff6b6b]"
                      : "text-canvas"
                    : isRedCategory(category)
                      ? "text-accent"
                      : "text-ink",
                )}
              >
                {CATEGORY_SUIT[category]}
              </span>
              <span>{category}</span>
              <span className={isSelected ? "text-canvas/70" : "text-muted/70"}>
                {String(count).padStart(2, "0")}
              </span>
            </button>
          );
        })}
      </div>

      <p role="status" aria-live="polite" className="visually-hidden">
        {selectedCategory
          ? `Showing ${filtered.length} of ${projects.length} projects in ${selectedCategory}`
          : `Showing all ${projects.length} projects`}
      </p>

      <ol role="list" className="relative">
        {/* One continuous spine, masked at both ends so it fades in and out
            instead of stopping dead above the first node. */}
        <span
          aria-hidden
          className={cn(
            "absolute inset-y-0 w-px bg-line [mask-image:linear-gradient(to_bottom,transparent,black_10%,black_90%,transparent)]",
            RAIL,
          )}
        />

        {filtered.map((project, i) => {
          const showYear = i === 0 || filtered[i - 1].year !== project.year;

          return (
            <li key={project.slug} className="timeline-row border-b border-line">
              <Link
                href={`/work/${project.slug}`}
                onMouseEnter={() => setActive(project)}
                onMouseLeave={() => setActive(null)}
                onFocus={() => setActive(project)}
                onBlur={() => setActive(null)}
                className="group flex items-center gap-4 py-6 transition-transform duration-150 active:scale-[0.995] md:gap-8"
              >
                {/* Year, shown once per group so the spine reads as a timeline. */}
                <span className="label w-10 shrink-0 text-muted md:w-14">
                  {showYear ? project.year : ""}
                </span>

                {/* Timeline node. Its disc masks the spine running behind it. */}
                <span
                  aria-hidden
                  className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-canvas"
                >
                  <span className="h-1.5 w-1.5 rounded-full bg-muted transition-all duration-300 group-hover:h-2.5 group-hover:w-2.5 group-hover:bg-accent group-focus-visible:h-2.5 group-focus-visible:w-2.5 group-focus-visible:bg-accent" />
                </span>

                <span className="flex flex-1 flex-col gap-1 transition-transform duration-300 ease-[var(--ease-out-expo)] group-hover:translate-x-1.5 group-focus-visible:translate-x-1.5">
                  <span className="flex items-baseline gap-3">
                    <SuitPips categories={project.categories} className="text-sm" />
                    <span className="text-h3">
                      {project.title}
                      {project.draft && <span className="label ml-3 text-muted/70">Placeholder</span>}
                    </span>
                  </span>
                  <span className="label text-muted md:hidden">
                    {project.categories.join(" / ")}
                  </span>
                </span>

                <span className="label hidden shrink-0 text-muted transition-colors duration-300 group-hover:text-ink group-focus-visible:text-ink md:block">
                  {project.categories.join(" / ")}
                </span>

                <span
                  aria-hidden
                  className="label shrink-0 text-muted opacity-0 transition-opacity duration-300 group-hover:opacity-100 group-focus-visible:opacity-100 [@media(hover:none)]:opacity-60"
                >
                  &rarr;
                </span>
              </Link>
            </li>
          );
        })}
      </ol>

      {/* Floating preview: a small overview card, not a cropped thumbnail.
          Images are contained rather than cover-cropped, because these are CAD
          renders and charts where the edges carry the content. Positioned by
          GSAP, never by React state. */}
      <div
        ref={previewRef}
        aria-hidden
        className="cursor-preview pointer-events-none fixed top-0 left-0 z-40 w-[19rem]"
      >
        <div
          className={cn(
            "overflow-hidden rounded-xl border border-line bg-canvas shadow-[0_24px_60px_-20px_rgba(20,18,15,0.45)] transition-all duration-300 ease-[var(--ease-out-expo)]",
            active ? "scale-100 opacity-100" : "scale-95 opacity-0",
          )}
        >
          <div className="relative aspect-[16/10] w-full border-b border-line bg-ink/[0.03]">
            {active?.cover?.src ? (
              <Image
                src={active.cover.src}
                alt=""
                fill
                sizes="304px"
                className="object-contain p-2"
              />
            ) : (
              /* No cover: a card face rather than an empty box. */
              <div className="flex h-full w-full items-center justify-center">
                <span
                  className={cn(
                    "text-4xl leading-none",
                    lead && isRedCategory(lead) ? "text-accent" : "text-ink",
                  )}
                >
                  {lead ? CATEGORY_SUIT[lead] : ""}
                </span>
              </div>
            )}
          </div>

          <div className="p-4">
            <div className="flex items-baseline justify-between gap-3">
              <span className="label truncate text-muted">
                {active?.categories.join(" / ")}
              </span>
              <span className="label shrink-0 text-muted">{active?.year}</span>
            </div>
            <p className="text-h3 mt-2 font-medium">{active?.title}</p>
            <p className="mt-2 line-clamp-3 text-small text-muted">{active?.summary}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
