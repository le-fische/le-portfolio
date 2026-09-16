import Link from "next/link";

export default function NotFound() {
  return (
    <main className="flex h-svh flex-col items-center justify-center gap-6 px-gutter text-center">
      <p className="font-display text-h1 italic">Nothing up this sleeve.</p>
      <Link
        href="/"
        className="label rounded-full border border-line px-5 py-2.5 text-muted transition-colors hover:border-ink hover:text-ink"
      >
        Back to the start
      </Link>
    </main>
  );
}
