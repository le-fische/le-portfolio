"use client";

import Link from "next/link";
import { useRef, useState } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { cn } from "@/lib/cn";

gsap.registerPlugin(ScrollTrigger, useGSAP);

const NAV = [
  { id: "work", label: "Work", href: "/#work" },
  { id: "about", label: "About", href: "/#about" },
  { id: "contact", label: "Contact", href: "/#contact" },
] as const;

/**
 * Hidden during the intro so the set piece stays uncluttered, then pinned to
 * the top for the rest of the page.
 *
 * `alwaysVisible` is for routes that have no intro (case studies).
 */
export function SiteHeader({ alwaysVisible = false }: { alwaysVisible?: boolean }) {
  const ref = useRef<HTMLElement>(null);
  const [activeId, setActiveId] = useState<string | null>(alwaysVisible ? "work" : null);

  useGSAP(
    () => {
      if (alwaysVisible) return;
      // useGSAP scopes selector strings to `ref`, so the trigger has to be
      // resolved against the document explicitly.
      const trigger = document.querySelector("#work");
      if (!trigger) return;

      // autoAlpha toggles visibility alongside opacity so off-screen links
      // cannot receive invisible keyboard focus during the intro sequence.
      gsap.set(ref.current, { yPercent: -100, autoAlpha: 0 });
      gsap.to(ref.current, {
        yPercent: 0,
        autoAlpha: 1,
        duration: 0.5,
        ease: "power3.out",
        scrollTrigger: {
          trigger,
          start: "top 85%",
          toggleActions: "play none none reverse",
        },
      });

      NAV.forEach(({ id }) => {
        const section = document.getElementById(id);
        if (!section) return;
        ScrollTrigger.create({
          trigger: section,
          start: "top 45%",
          end: "bottom 45%",
          onEnter: () => setActiveId(id),
          onEnterBack: () => setActiveId(id),
        });
      });
    },
    { scope: ref, dependencies: [alwaysVisible] },
  );

  return (
    <>
      <a
        href="#main-content"
        className="visually-hidden label fixed top-4 left-gutter z-[9500] rounded-full border border-ink bg-canvas px-4 py-2.5 text-ink shadow-sm"
      >
        Skip to main content
      </a>

      <header
        ref={ref}
        className="fixed inset-x-0 top-0 z-50 border-b border-line/60 bg-canvas/80 backdrop-blur-md"
      >
        <div className="flex items-center justify-between px-gutter py-3.5">
          <Link
            href="/"
            className="label inline-flex min-h-6 items-center py-1 text-ink transition-colors hover:text-accent"
          >
            Houze Guo
          </Link>
          <nav aria-label="Primary" className="flex items-center gap-6">
            {NAV.map((item) => {
              const isActive = activeId === item.id;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  aria-current={isActive ? "location" : undefined}
                  className={cn(
                    "label relative inline-flex min-h-6 items-center py-1 transition-colors hover:text-ink",
                    isActive ? "text-ink" : "text-muted",
                  )}
                >
                  {item.label}
                  <span
                    aria-hidden
                    className={cn(
                      "absolute inset-x-0 -bottom-0.5 h-px bg-accent transition-transform duration-300 ease-[var(--ease-out-expo)]",
                      isActive ? "scale-x-100" : "scale-x-0",
                    )}
                  />
                </Link>
              );
            })}
          </nav>
        </div>
      </header>
    </>
  );
}
