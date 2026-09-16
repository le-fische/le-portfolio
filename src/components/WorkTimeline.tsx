"use client";

import Link from "next/link";
import Image from "next/image";
import { useRef, useState } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import { CATEGORY_SUIT, isRedCategory, type Project } from "@/content/projects";
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

const PREVIEW_H = 240; // px, must match the w-44 aspect-[3/4] card below

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
    const x = gsap.utils.clamp(12, window.innerWidth - 188, e.clientX + 28);
    xTo.current?.(x);
    yTo.current?.(y);
  };

  const lead = active?.categories[0];

  return (
    <div ref={rootRef} className="relative" onMouseMove={track}>
      <ol className="relative">
        {/* One continuous spine, masked at both ends so it fades in and out
            instead of stopping dead above the first node. */}
        <span
          aria-hidden
          className={cn(
            "absolute inset-y-0 w-px bg-line [mask-image:linear-gradient(to_bottom,transparent,black_10%,black_90%,transparent)]",
            RAIL,
          )}
        />

        {projects.map((project, i) => {
          const showYear = i === 0 || projects[i - 1].year !== project.year;

          return (
            <li key={project.slug} className="timeline-row border-b border-line">
              <Link
                href={`/work/${project.slug}`}
                onMouseEnter={() => setActive(project)}
                onMouseLeave={() => setActive(null)}
                onFocus={() => setActive(project)}
                onBlur={() => setActive(null)}
                className="group flex items-center gap-4 py-6 md:gap-8"
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
                  <span className="h-1.5 w-1.5 rounded-full bg-muted transition-all duration-300 group-hover:h-2.5 group-hover:w-2.5 group-hover:bg-accent" />
                </span>

                <span className="flex flex-1 items-baseline gap-3 transition-transform duration-300 ease-[var(--ease-out-expo)] group-hover:translate-x-1.5">
                  <SuitPips categories={project.categories} className="text-sm" />
                  <span className="text-h3">
                    {project.title}
                    {project.draft && <span className="label ml-3 text-muted/70">Placeholder</span>}
                  </span>
                </span>

                <span className="label hidden shrink-0 text-muted transition-colors duration-300 group-hover:text-ink md:block">
                  {project.categories.join(" / ")}
                </span>

                <span
                  aria-hidden
                  className="label shrink-0 text-muted opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                >
                  &rarr;
                </span>
              </Link>
            </li>
          );
        })}
      </ol>

      {/* Floating preview. Positioned by GSAP, never by React state. */}
      <div
        ref={previewRef}
        aria-hidden
        className="cursor-preview pointer-events-none fixed top-0 left-0 z-40 w-44"
      >
        <div
          className={cn(
            "relative aspect-[3/4] overflow-hidden rounded-xl border border-line bg-canvas shadow-[0_24px_60px_-20px_rgba(20,18,15,0.45)] transition-all duration-300 ease-[var(--ease-out-expo)]",
            active ? "scale-100 opacity-100" : "scale-90 opacity-0",
          )}
        >
          {active?.cover?.src ? (
            <Image src={active.cover.src} alt="" fill sizes="176px" className="object-cover" />
          ) : (
            /* No cover yet: a card face rather than an empty box. */
            <div className="flex h-full w-full flex-col items-center justify-center gap-3 p-4">
              <span
                className={cn(
                  "text-4xl leading-none",
                  lead && isRedCategory(lead) ? "text-accent" : "text-ink",
                )}
              >
                {lead ? CATEGORY_SUIT[lead] : ""}
              </span>
              <span className="label text-center text-muted">
                {active?.categories.join(" / ")}
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
