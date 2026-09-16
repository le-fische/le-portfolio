"use client";

import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import SplitType from "split-type";

import { PlayingCard, type Suit } from "./PlayingCard";
import { TuckBox } from "./TuckBox";
import { scrollToId } from "./SmoothScroller";

gsap.registerPlugin(ScrollTrigger, useGSAP);

const CARDS: Suit[] = ["spade", "heart", "joker-red", "joker-black", "diamond", "club"];

/** Fan geometry: an arc of six cards, tight on phones, wide on desktop. */
function fanLayout(index: number, count: number, isDesktop: boolean) {
  const t = count === 1 ? 0 : index / (count - 1) - 0.5; // -0.5 .. 0.5
  const spread = isDesktop ? 960 : 210;
  const lift = isDesktop ? 110 : 60;
  const tilt = isDesktop ? 24 : 34;
  return {
    x: t * spread,
    y: t * t * lift - (isDesktop ? 30 : 10),
    rotation: t * tilt,
  };
}

export function Intro() {
  const rootRef = useRef<HTMLElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const nameRef = useRef<HTMLHeadingElement>(null);
  const blurbRef = useRef<HTMLParagraphElement>(null);
  const quoteRef = useRef<HTMLParagraphElement>(null);

  useGSAP(
    () => {
      if (!nameRef.current || !blurbRef.current || !quoteRef.current) return;

      const splitName = new SplitType(nameRef.current, { types: "chars" });
      const splitBlurb = new SplitType(blurbRef.current, { types: "words" });
      const splitQuote = new SplitType(quoteRef.current, { types: "words,chars" });

      const nameChars = splitName.chars ?? [];
      const blurbWords = splitBlurb.words ?? [];
      const quoteChars = splitQuote.chars ?? [];
      const cards = gsap.utils.toArray<HTMLElement>(".deck-card");

      const mm = gsap.matchMedia();

      mm.add(
        {
          isDesktop: "(min-width: 768px)",
          isMobile: "(max-width: 767px)",
          reduced: "(prefers-reduced-motion: reduce)",
        },
        (context) => {
          const { isDesktop, reduced } = context.conditions as {
            isDesktop: boolean;
            isMobile: boolean;
            reduced: boolean;
          };

          // --- Reduced motion: a plain stacked hero, no pin, no 3D. ---------
          if (reduced) {
            gsap.set([...nameChars, ...blurbWords, ...quoteChars], {
              clearProps: "all",
              opacity: 1,
            });
            gsap.set(".intro-quote-layer", { position: "relative", opacity: 1, marginTop: "4rem" });
            gsap.set(".intro-name-layer", { position: "relative", opacity: 1 });
            gsap.set(".intro-deck, .intro-skip, .intro-cue", { display: "none" });
            gsap.set(stageRef.current, { height: "auto", paddingTop: "8rem", paddingBottom: "8rem" });
            return;
          }

          // --- Resting state -------------------------------------------------
          gsap.set([...nameChars, ...blurbWords], { opacity: 0, y: 24 });
          gsap.set(quoteChars, { opacity: 0, rotationX: -90 });
          // NOTE: opacity is deliberately never tweened on .tuckbox. An element
          // with opacity < 1 has its used `transform-style` forced to flat, which
          // collapses the box's 3D context mid-fade and paints the mirrored back
          // face over the front. Visibility is not a grouping property, so the
          // box appears and leaves on visibility plus motion instead.
          gsap.set(".tuckbox", {
            rotationX: 12,
            rotationY: -18,
            scale: 0.55,
            y: -60,
            visibility: "hidden",
            x: 0,
            rotationZ: 0,
          });
          gsap.set(".tuckbox-lid", { z: 30, rotationX: -90, transformOrigin: "top center" });
          gsap.set(cards, {
            top: "50%",
            left: "50%",
            xPercent: -50,
            yPercent: -50,
            x: 0,
            y: 0,
            rotationX: 0,
            rotationY: -180,
            rotationZ: 0,
            scale: 0.62,
            opacity: 0,
          });

          // --- Entrance (time-based, not scroll-bound) -----------------------
          gsap.to([...nameChars, ...blurbWords], {
            opacity: 1,
            y: 0,
            stagger: 0.015,
            duration: 0.9,
            ease: "power3.out",
            delay: 0.35,
          });
          gsap.to(".intro-cue", { opacity: 1, duration: 0.8, delay: 1.4 });

          // The skip affordance retires once the sequence is behind you.
          gsap.to(".intro-skip", {
            opacity: 0,
            pointerEvents: "none",
            duration: 0.3,
            scrollTrigger: {
              trigger: rootRef.current,
              start: "bottom 90%",
              toggleActions: "play none none reverse",
            },
          });

          // --- The one pinned timeline. Hero and deck share it, which is what
          //     makes the handoff seamless: there is no second pin to cross. ---
          const tl = gsap.timeline({
            scrollTrigger: {
              trigger: rootRef.current,
              start: "top top",
              end: "+=340%",
              pin: stageRef.current,
              pinSpacing: true,
              scrub: 1,
              anticipatePin: 1,
              invalidateOnRefresh: true,
              // This pin adds ~340vh of spacer, which moves every trigger below
              // it. A higher refreshPriority makes ScrollTrigger recalculate
              // this one first, so the header and the section reveals measure
              // against the post-pin layout instead of caching stale offsets.
              refreshPriority: 1,
            },
          });

          const scatter = (range: number) => ({
            x: () => gsap.utils.random(-range, range),
            y: () => gsap.utils.random(-range, range),
            rotationZ: () => gsap.utils.random(-540, 540),
            opacity: 0,
            ease: "power2.inOut" as const,
          });

          // 1. The name shatters.
          tl.to([...nameChars, ...blurbWords], {
            ...scatter(isDesktop ? 900 : 420),
            stagger: 0.004,
            duration: 1.1,
          }, 0);
          tl.to(".intro-cue", { opacity: 0, duration: 0.3 }, 0);

          // 2. The manifesto assembles out of the debris.
          tl.to(quoteChars, {
            opacity: 1,
            rotationX: 0,
            stagger: 0.015,
            duration: 1.2,
            ease: "back.out(1.4)",
          }, 0.9);

          // 3. Hold, then scatter it away.
          tl.to(quoteChars, {
            ...scatter(isDesktop ? 900 : 420),
            stagger: 0.008,
            duration: 1.0,
          }, 3.0);

          // 4. The box drops into the scene.
          tl.set(".tuckbox", { visibility: "visible" }, 3.6);
          tl.to(".tuckbox", {
            scale: 1,
            y: 0,
            duration: 1.0,
            ease: "power3.out",
          }, 3.6);

          // 5. It turns to face the camera dead-on, back toward us.
          tl.to(".tuckbox", {
            rotationX: 0,
            rotationY: -180,
            duration: 1.0,
            ease: "power2.inOut",
          }, 4.6);

          // 6. The seal splits and the lid folds open.
          tl.to(".tuckbox-lid", {
            rotationX: -182,
            duration: 0.7,
            ease: "power2.inOut",
          }, 5.5);

          // 7. Cards become visible only once the box is square to the camera,
          //    so they never peek out during the rotation.
          tl.set(cards, { opacity: 1 }, 6.2);

          // 8. Vertical exit, clearing the box completely before anything spins.
          tl.to(cards, {
            y: isDesktop ? -320 : -230,
            scale: isDesktop ? 0.8 : 0.6,
            stagger: 0.04,
            duration: 0.7,
            ease: "power2.out",
          }, 6.3);

          // 9. The empty box is discarded clean off the canvas (no fade, see above).
          tl.to(".tuckbox", {
            x: isDesktop ? "-62vw" : "-78vw",
            y: "34vh",
            rotationZ: -14,
            rotationY: -158,
            scale: 0.6,
            duration: 0.9,
            ease: "power2.out",
          }, 7.0);
          tl.set(".tuckbox", { visibility: "hidden" }, 7.9);

          // 10. Barrel roll into the fan: rotationY -180 -> 0 flashes the backs.
          tl.to(cards, {
            x: (i) => fanLayout(i, CARDS.length, isDesktop).x,
            y: (i) => fanLayout(i, CARDS.length, isDesktop).y,
            rotationZ: (i) => fanLayout(i, CARDS.length, isDesktop).rotation,
            rotationY: 0,
            scale: 1,
            stagger: 0.03,
            duration: 1.0,
            ease: "power3.inOut",
          }, 7.0);

          // 11. Hold the fan for a beat and a half. This is the payoff of the
          //     whole sequence, so it gets roughly half a screen of scroll to
          //     sit still in rather than passing by.
          tl.to({}, { duration: 1.6 }, 8.0);

          // 12. Hand off: the fan rises and clears exactly as the pin releases,
          //     so the work index scrolls straight up behind it.
          tl.to(cards, {
            y: (i) => fanLayout(i, CARDS.length, isDesktop).y - 260,
            opacity: 0,
            scale: 0.92,
            stagger: 0.02,
            duration: 1.0,
            ease: "power2.in",
          }, 9.6);
        },
      );

      return () => {
        mm.revert();
        splitName.revert();
        splitBlurb.revert();
        splitQuote.revert();
      };
    },
    { scope: rootRef },
  );

  return (
    <section ref={rootRef} id="intro" className="relative">
      <div
        ref={stageRef}
        className="relative flex h-svh w-full flex-col items-center justify-center overflow-hidden px-gutter"
      >
        {/* Layer 1: identity */}
        <div className="intro-name-layer absolute inset-0 flex flex-col items-center justify-center px-gutter text-center">
          <h1 ref={nameRef} className="text-display font-medium">
            Houze Guo
          </h1>
          <p ref={blurbRef} className="text-lead mt-8 max-w-xl text-balance text-muted">
            Computer engineering student at UBC. I build things that sit between hardware and
            software, and I do card tricks.
          </p>
        </div>

        {/* Layer 2: the manifesto */}
        <div className="intro-quote-layer pointer-events-none absolute inset-0 flex items-center justify-center px-gutter [perspective:900px]">
          <p ref={quoteRef} className="max-w-3xl text-center font-display text-h1 italic">
            The closer you look, the less you see.
          </p>
        </div>

        {/* Layer 3: the deck */}
        <div className="intro-deck pointer-events-none absolute inset-0 flex items-center justify-center [perspective:1800px]">
          <div className="relative flex items-center justify-center [transform-style:preserve-3d]">
            {CARDS.map((suit, i) => (
              <div key={`${suit}-${i}`} className="deck-card absolute [transform-style:preserve-3d]">
                <PlayingCard suit={suit} />
              </div>
            ))}
            <TuckBox />
          </div>
        </div>

        <span className="intro-cue label absolute bottom-10 text-muted opacity-0">Scroll</span>
      </div>

      <button
        type="button"
        onClick={() => scrollToId("#work")}
        className="intro-skip label fixed right-gutter bottom-8 z-50 rounded-full border border-line bg-canvas/80 px-4 py-2.5 text-muted backdrop-blur transition-colors hover:border-ink hover:text-ink"
      >
        Skip intro
      </button>
    </section>
  );
}
