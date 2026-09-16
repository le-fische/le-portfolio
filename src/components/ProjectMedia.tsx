"use client";

import { useEffect } from "react";
import Image from "next/image";

import type { MediaBlock } from "@/content/projects";
import { cn } from "@/lib/cn";

const MODEL_VIEWER_SRC =
  "https://ajax.googleapis.com/ajax/libs/model-viewer/4.3.1/model-viewer.min.js";

/** Loads the <model-viewer> custom element once, on demand. */
function useModelViewer(enabled: boolean) {
  useEffect(() => {
    if (!enabled || customElements.get("model-viewer")) return;
    const script = document.createElement("script");
    script.type = "module";
    script.src = MODEL_VIEWER_SRC;
    document.head.appendChild(script);
  }, [enabled]);
}

/** Shown wherever a block exists but its source has not been filled in yet. */
function Empty({ label }: { label: string }) {
  return (
    <div className="flex aspect-[16/10] w-full items-center justify-center border border-dashed border-line bg-ink/[0.02]">
      <span className="label text-muted">{label}</span>
    </div>
  );
}

export function ProjectMedia({
  block,
  className,
  priority = false,
  fill = false,
}: {
  block: MediaBlock;
  className?: string;
  /** Eager-load the first image on a page. */
  priority?: boolean;
  /** Stretch to the parent instead of using the block's own aspect ratio. */
  fill?: boolean;
}) {
  useModelViewer(block.kind === "model");

  const frame = cn("w-full overflow-hidden bg-ink/[0.03]", fill && "h-full", className);

  if (block.kind === "image") {
    if (!block.src) return <Empty label="Image pending" />;
    return (
      <div className={cn(frame, !fill && "relative aspect-[16/10]", fill && "relative")}>
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

  if (block.kind === "video") {
    if (!block.src) return <Empty label="Video pending" />;
    return (
      <video
        className={cn(frame, !fill && "aspect-[16/10]", "object-cover")}
        src={block.src}
        poster={block.poster}
        autoPlay
        muted
        loop
        playsInline
      />
    );
  }

  if (block.kind === "embed") {
    if (!block.src) return <Empty label="Embed pending" />;
    return (
      <div
        className={frame}
        style={fill ? undefined : { aspectRatio: String(block.ratio ?? 16 / 10) }}
      >
        <iframe
          src={block.src}
          title={block.title}
          loading="lazy"
          allow="autoplay; fullscreen; xr-spatial-tracking; accelerometer; gyroscope"
          allowFullScreen
          className="h-full w-full border-0"
        />
      </div>
    );
  }

  // model
  if (!block.src) return <Empty label="Model pending" />;
  return (
    <div className={cn(frame, !fill && "aspect-[16/10]")}>
      {/* Attributes are passed straight through to the custom element. */}
      <model-viewer
        src={block.src}
        alt={block.alt}
        poster={block.poster}
        camera-controls=""
        auto-rotate=""
        touch-action="pan-y"
        shadow-intensity="1"
        exposure="1"
        loading="lazy"
        style={{ width: "100%", height: "100%", backgroundColor: "transparent" }}
      />
    </div>
  );
}
