import { CATEGORY_SUIT, isRedCategory, type Category } from "@/content/projects";
import { cn } from "@/lib/cn";

/**
 * A project's categories as suits. Red suits render in the accent, black in
 * ink, exactly as they do on the aces in the intro. Decorative: the category
 * names are always present as text nearby, so this carries no meaning alone.
 */
export function SuitPips({
  categories,
  className,
}: {
  categories: Category[];
  className?: string;
}) {
  return (
    <span aria-hidden className={cn("inline-flex items-center gap-1 leading-none", className)}>
      {categories.map((category) => (
        <span key={category} className={isRedCategory(category) ? "text-accent" : "text-ink"}>
          {CATEGORY_SUIT[category]}
        </span>
      ))}
    </span>
  );
}
