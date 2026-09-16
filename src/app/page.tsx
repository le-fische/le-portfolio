import Link from "next/link";

import { Intro } from "@/components/Intro";
import { Preloader } from "@/components/Preloader";
import { Reveal } from "@/components/Reveal";
import { SiteHeader } from "@/components/SiteHeader";
import { WorkTimeline } from "@/components/WorkTimeline";
import { projects, projectsByYear } from "@/content/projects";
import { cn } from "@/lib/cn";

const CONTACT = [
  { label: "Email", href: "mailto:hzguo117@gmail.com", value: "hzguo117@gmail.com" },
  { label: "GitHub", href: "https://github.com/le-fische", value: "le-fische" },
  { label: "LinkedIn", href: "https://linkedin.com/in/houzeguo", value: "houzeguo" },
];

/**
 * Section headers each take one suit. Across the page they complete a set:
 * spades for work, hearts for about, diamonds for contact, clubs in the footer.
 */
function SectionLabel({
  suit,
  red = false,
  children,
  trailing,
}: {
  suit: string;
  red?: boolean;
  children: React.ReactNode;
  trailing?: React.ReactNode;
}) {
  return (
    <div className="flex items-baseline justify-between gap-6 border-b border-line pb-4">
      <h2 className="flex items-baseline gap-3">
        <span aria-hidden className={cn("text-sm leading-none", red ? "text-accent" : "text-ink")}>
          {suit}
        </span>
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
              suit="&#9824;"
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
            <SectionLabel suit="&#9829;" red>
              About
            </SectionLabel>
          </Reveal>

          <div className="mt-14 grid grid-cols-1 gap-x-gutter gap-y-12 lg:grid-cols-12">
            <Reveal className="lg:col-span-7">
              <p className="text-h2 max-w-2xl text-balance font-medium">
                I like problems that live on the seam between hardware and software, where the
                abstraction stops being reliable.
              </p>
              <div className="mt-8 max-w-xl space-y-5 text-body text-muted">
                <p>
                  I&rsquo;m a computer engineering student at UBC, class of 2029. Most of what I
                  build ends up involving a microcontroller, a mechanical constraint, and a deadline
                  that makes the elegant approach impossible.
                </p>
                <p>
                  Away from that I do close-up card magic, which turns out to be the same discipline:
                  a controlled system, a lot of hidden state, and one visible result.
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
                  <dd className="mt-2 text-body">UBC AeroDesign, ADV Fuselage</dd>
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
            <SectionLabel suit="&#9830;" red>
              Contact
            </SectionLabel>
          </Reveal>

          <Reveal>
            <p className="mt-14 max-w-3xl text-h1 font-medium text-balance">
              Building something at the edge of hardware and software? Tell me about it.
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
        <span className="flex items-baseline gap-3">
          <span aria-hidden className="text-sm leading-none text-ink">
            &#9827;
          </span>
          <span className="label text-muted">Houze Guo &copy; {new Date().getFullYear()}</span>
        </span>
        <Link href="#intro" className="label text-muted transition-colors hover:text-ink">
          Back to top
        </Link>
      </footer>
    </>
  );
}
