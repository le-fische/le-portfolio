import { cn } from "@/lib/cn";

export type Suit = "spade" | "heart" | "diamond" | "club" | "joker-red" | "joker-black";

const PIP: Record<Exclude<Suit, "joker-red" | "joker-black">, string> = {
  spade: "♠",
  heart: "♥",
  diamond: "♦",
  club: "♣",
};

const JokerHat = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 100 100" className={className} fill="currentColor" aria-hidden>
    <path d="M 38 72 C 15 70, 10 50, 18 42 C 25 35, 35 48, 38 60 Z" />
    <circle cx="16" cy="38" r="5" />
    <path d="M 62 72 C 85 70, 90 50, 82 42 C 75 35, 65 48, 62 60 Z" />
    <circle cx="84" cy="38" r="5" />
    <path d="M 35 68 C 45 50, 35 30, 50 20 C 65 30, 55 50, 65 68 C 55 72, 45 72, 35 68 Z" />
    <circle cx="50" cy="13" r="5" />
    <path d="M 32 75 C 40 82, 60 82, 68 75 L 63 85 C 55 90, 45 90, 37 85 Z" />
  </svg>
);

/**
 * Stage dressing for the intro sequence. Deliberately non-interactive: the deck
 * is a set piece, not navigation, so it carries no click affordance.
 */
export function PlayingCard({ suit, className }: { suit: Suit; className?: string }) {
  const isJoker = suit === "joker-red" || suit === "joker-black";
  const isRed = suit === "heart" || suit === "diamond" || suit === "joker-red";
  const tone = isRed ? "text-accent" : "text-ink";

  return (
    <div
      aria-hidden
      className={cn(
        "relative h-64 w-44 rounded-xl shadow-[0_24px_60px_-20px_rgba(20,18,15,0.45)] [transform-style:preserve-3d]",
        className,
      )}
    >
      {/* Face */}
      <div className="absolute inset-0 flex flex-col justify-between rounded-xl border border-line bg-canvas p-4 [backface-visibility:hidden]">
        <div className="pointer-events-none absolute inset-2 rounded-lg border border-line/70" />

        {isJoker ? (
          <div className="relative flex h-full w-full flex-col items-center justify-center">
            <JokerHat className={cn("mb-3 h-16 w-16", tone)} />
            <span className={cn("label", tone)}>Joker</span>
          </div>
        ) : (
          <>
            <div className={cn("font-display text-2xl leading-none", tone)}>
              A<span className="mt-0.5 block text-xl">{PIP[suit]}</span>
            </div>
            <div className={cn("self-center text-5xl leading-none opacity-90", tone)}>
              {PIP[suit]}
            </div>
            <div className={cn("rotate-180 self-end font-display text-2xl leading-none", tone)}>
              A<span className="mt-0.5 block text-xl">{PIP[suit]}</span>
            </div>
          </>
        )}
      </div>

      {/* Back */}
      <div className="absolute inset-0 overflow-hidden rounded-xl bg-stage [backface-visibility:hidden] [transform:rotateY(180deg)]">
        <div className="absolute inset-0 opacity-50 [background:repeating-linear-gradient(45deg,transparent_0_10px,#242220_10px_11px)]" />
        <div className="pointer-events-none absolute inset-2 rounded-lg border border-white/10" />
        <div className="absolute bottom-6 left-6 h-1.5 w-8 bg-canvas/70" />
        <div className="absolute top-6 right-6 h-1.5 w-8 bg-accent" />
        <div className="absolute inset-0 flex items-center justify-center font-mono text-2xl font-bold tracking-[0.3em] text-canvas/20">
          XO
        </div>
      </div>
    </div>
  );
}
