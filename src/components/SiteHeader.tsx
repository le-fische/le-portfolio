"use client";

import Link from "next/link";
import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger, useGSAP);

const NAV = [
  { label: "Work", href: "/#work" },
  { label: "About", href: "/#about" },
  { label: "Contact", href: "/#contact" },
];

/**
 * Hidden during the intro so the set piece stays uncluttered, then pinned to
 * the top for the rest of the page.
 *
 * `alwaysVisible` is for routes that have no intro (case studies).
 */
export function SiteHeader({ alwaysVisible = false }: { alwaysVisible?: boolean }) {
  const ref = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      if (alwaysVisible) return;
      // useGSAP scopes selector strings to `ref`, so the trigger has to be
      // resolved against the document explicitly.
      const trigger = document.querySelector("#work");
      if (!trigger) return;
      gsap.set(ref.current, { yPercent: -100, opacity: 0 });
      gsap.to(ref.current, {
        yPercent: 0,
        opacity: 1,
        duration: 0.5,
        ease: "power3.out",
        scrollTrigger: {
          trigger,
          start: "top 85%",
          toggleActions: "play none none reverse",
        },
      });
    },
    { scope: ref, dependencies: [alwaysVisible] },
  );

  return (
    <header
      ref={ref}
      className="fixed inset-x-0 top-0 z-50 border-b border-line/60 bg-canvas/75 backdrop-blur-md"
    >
      <div className="flex items-center justify-between px-gutter py-4">
        <Link href="/" className="label text-ink transition-colors hover:text-accent">
          Houze Guo
        </Link>
        <nav className="flex items-center gap-6">
          {NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="label text-muted transition-colors hover:text-ink"
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
