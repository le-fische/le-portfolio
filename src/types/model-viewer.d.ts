import type { DetailedHTMLProps, HTMLAttributes } from "react";

/**
 * <model-viewer> is a custom element loaded from a CDN at runtime, so TypeScript
 * needs the intrinsic element declared. React 19 reads JSX types from the
 * "react" module namespace rather than the old global JSX namespace.
 */
declare module "react" {
  namespace JSX {
    interface IntrinsicElements {
      "model-viewer": DetailedHTMLProps<HTMLAttributes<HTMLElement>, HTMLElement> & {
        src?: string;
        alt?: string;
        poster?: string;
        "camera-controls"?: boolean | "";
        "auto-rotate"?: boolean | "";
        "touch-action"?: string;
        "shadow-intensity"?: string;
        "environment-image"?: string;
        exposure?: string;
        ar?: boolean | "";
        loading?: "auto" | "lazy" | "eager";
        reveal?: "auto" | "manual";
      };
    }
  }
}
