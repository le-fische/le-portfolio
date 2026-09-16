import Image from "next/image";

import type { ImageBlock } from "@/content/projects";
import { cn } from "@/lib/cn";

export function ProjectMedia({
  block,
  className,
  priority = false,
  /** Stretch to the parent instead of using the image's own aspect ratio. */
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

  if (fill) {
    return (
      <div className={cn("relative h-full w-full overflow-hidden bg-ink/[0.03]", className)}>
        <Image src={block.src} alt={block.alt} fill sizes="320px" className="object-contain" />
      </div>
    );
  }

  // With intrinsic dimensions the image lays out at its true ratio, so nothing
  // is cropped. Without them, fall back to a contained 16/10 box rather than
  // cover-cropping, which would cut the edges off a chart or a drawing.
  if (block.width && block.height) {
    return (
      <Image
        src={block.src}
        alt={block.alt}
        width={block.width}
        height={block.height}
        priority={priority}
        sizes="(min-width: 1024px) 60vw, 100vw"
        className={cn("h-auto w-full bg-ink/[0.03]", className)}
      />
    );
  }

  return (
    <div className={cn("relative aspect-[16/10] w-full overflow-hidden bg-ink/[0.03]", className)}>
      <Image
        src={block.src}
        alt={block.alt}
        fill
        priority={priority}
        sizes="(min-width: 1024px) 60vw, 100vw"
        className="object-contain"
      />
    </div>
  );
}
