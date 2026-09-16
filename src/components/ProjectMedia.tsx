import Image from "next/image";

import type { ImageBlock } from "@/content/projects";
import { cn } from "@/lib/cn";

export function ProjectMedia({
  block,
  className,
  priority = false,
  /** Stretch to the parent instead of using the block's own aspect ratio. */
  fill = false,
}: {
  block: ImageBlock;
  className?: string;
  priority?: boolean;
  fill?: boolean;
}) {
  // Shown wherever a block exists but its source has not been filled in yet.
  if (!block.src) {
    return (
      <div
        className={cn(
          "flex w-full items-center justify-center border border-dashed border-line bg-ink/[0.02]",
          fill ? "h-full" : "aspect-[16/10]",
        )}
      >
        <span className="label text-muted">Image pending</span>
      </div>
    );
  }

  return (
    <div
      className={cn(
        "relative w-full overflow-hidden bg-ink/[0.03]",
        fill ? "h-full" : "aspect-[16/10]",
        className,
      )}
    >
      <Image
        src={block.src}
        alt={block.alt}
        fill
        priority={priority}
        sizes="(min-width: 1024px) 60vw, 100vw"
        className="object-cover"
      />
    </div>
  );
}
