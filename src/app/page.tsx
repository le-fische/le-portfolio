import Link from "next/link";

import { Intro } from "@/components/Intro";
import { Preloader } from "@/components/Preloader";
import { Reveal } from "@/components/Reveal";
import { SiteHeader } from "@/components/SiteHeader";
import { WorkTimeline } from "@/components/WorkTimeline";
import { JokerHat } from "@/components/PlayingCard";
import {
  CATEGORIES,
  CATEGORY_SUIT,
  isRedCategory,
  projects,
  projectsByYear,
} from "@/content/projects";

const CONTACT = [
  { label: "Email", href: "mailto:hzguo117@gmail.com", value: "hzguo117@gmail.com" },
  { label: "GitHub", href: "https://github.com/le-fische", value: "le-fische" },
  { label: "LinkedIn", href: "https://linkedin.com/in/houzeguo", value: "houzeguo" },
];

/**
 * All four suits, in the order the aces are dealt. Work is the whole deck, so
 * it takes the whole deck rather than borrowing one category's suit.
 */
function FullSuit() {
  return (
    <span aria-hidden className="inline-flex items-center gap-1 text-sm leading-none">
      {CATEGORIES.map((category) => (
        <span key={category} className={isRedCategory(category) ? "text-accent" : "text-ink"}>
          {CATEGORY_SUIT[category]}
        </span>
      ))}
    </span>
  );
}

/**
 * Section headers each take an icon. The four suits belong to the four
 * categories, so About and Contact take the jokers instead: no glyph on this
 * page means two different things.
 */
function SectionLabel({
  icon,
  children,
  trailing,
}: {
  icon: React.ReactNode;
  children: React.ReactNode;
  trailing?: React.ReactNode;
}) {
  return (
    <div className="flex items-baseline justify-between gap-6 border-b border-line pb-4">
      <h2 className="flex items-center gap-3">
        {icon}
        <span className="label text-muted">{children}</span>
      </h2>
      {trailing}
    </div>
  );
}

export default function Home() {
  const timeline = projectsByYear();

  return (
    <>
      <Preloader />
      <SiteHeader />
      <Intro />

      <main>
        {/* ---------------------------------------------------------------- */}
        <section id="work" className="scroll-mt-20 px-gutter py-section">
          <Reveal>
            <SectionLabel
              icon={<FullSuit />}
              trailing={
                <span className="label text-muted">
                  {String(projects.length).padStart(2, "0")}
                </span>
              }
            >
              Selected Work
            </SectionLabel>
          </Reveal>

          <div className="mt-10">
            <WorkTimeline projects={timeline} />
          </div>
        </section>

        {/* ---------------------------------------------------------------- */}
        <section id="about" className="scroll-mt-20 px-gutter py-section">
          <Reveal>
            <SectionLabel icon={<JokerHat className="h-4 w-4 text-accent" />}>
              About
            </SectionLabel>
          </Reveal>

          <div className="mt-14 grid grid-cols-1 gap-x-gutter gap-y-12 lg:grid-cols-12">
            <Reveal className="lg:col-span-7">
              <p className="text-h2 max-w-2xl text-balance font-medium">
                The fastest path to a working design runs through visible failure.
              </p>
              <div className="mt-8 max-w-xl space-y-5 text-body text-muted">
                <p>
                  The same thing keeps happening. Round 1 of the cardboard chair gave us six
                  concepts and one survived screening, which really meant we had scoped the problem
                  badly. The H-channel joined two DLZ panels perfectly and left a ridge across the
                  landing surface. The chess engine&rsquo;s numbers were off by a factor of 3.7
                  until the measurement protocol caught it.
                </p>
                <p>
                  None of that was visible on paper. It showed up because something got built and
                  then tested. That is most of what I look for in a team: build early, measure
                  honestly, and treat the iteration count as learning rather than waste.
                </p>
              </div>
            </Reveal>

            <Reveal className="lg:col-span-4 lg:col-start-9" delay={0.1}>
              <dl className="space-y-6">
                <div className="border-t border-line pt-4">
                  <dt className="label text-muted">Currently</dt>
                  <dd className="mt-2 text-body">UBC Applied Science, Computer Engineering</dd>
                </div>
                <div className="border-t border-line pt-4">
                  <dt className="label text-muted">Team</dt>
                  <dd className="mt-2 text-body">UBC AeroDesign, Advanced Class Fuselage Team
                  </dd>
                </div>
                <div className="border-t border-line pt-4">
                  <dt className="label text-muted">Works on</dt>
                  <dd className="mt-2 text-body">
                    Mechanism design, MCU firmware, full-stack software
                  </dd>
                </div>
                <div className="border-t border-line pt-4">
                  <dt className="label text-muted">Based in</dt>
                  <dd className="mt-2 text-body">Vancouver, BC</dd>
                </div>
                <div className="border-t border-line pt-4">
                  <dt className="label text-muted">Open to</dt>
                  <dd className="mt-2 text-body">Winter 2027 co-op</dd>
                </div>
              </dl>
            </Reveal>
          </div>
        </section>

        {/* ---------------------------------------------------------------- */}
        <section id="contact" className="scroll-mt-20 px-gutter py-section">
          <Reveal>
            <SectionLabel icon={<JokerHat className="h-4 w-4 text-ink" />}>
              Contact
            </SectionLabel>
          </Reveal>

          <Reveal>
            <p className="mt-14 max-w-3xl text-h1 font-medium text-balance">
              I&rsquo;m looking for a Winter 2027 co-op. Email is the fastest way to reach me.
            </p>
          </Reveal>

          <Reveal delay={0.1}>
            <ul className="mt-16 max-w-3xl">
              {CONTACT.map((item) => (
                <li key={item.label} className="border-t border-line last:border-b">
                  <a
                    href={item.href}
                    target={item.href.startsWith("mailto") ? undefined : "_blank"}
                    rel="noreferrer"
                    className="group flex items-baseline justify-between gap-6 py-5 transition-colors hover:text-accent"
                  >
                    <span className="label text-muted transition-colors group-hover:text-accent">
                      {item.label}
                    </span>
                    <span className="text-h3">{item.value}</span>
                  </a>
                </li>
              ))}
            </ul>
          </Reveal>
        </section>
      </main>

      <footer className="flex flex-col gap-3 border-t border-line px-gutter py-8 sm:flex-row sm:items-center sm:justify-between">
        <span className="flex items-center gap-3">
          <FullSuit />
          <span className="label text-muted">Houze Guo &copy; {new Date().getFullYear()}</span>
        </span>
        <Link href="#intro" className="label text-muted transition-colors hover:text-ink">
          Back to top
        </Link>
      </footer>
    </>
  );
}
