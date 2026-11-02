import Link from "next/link";
import { cn } from "@/lib/utils";

export function Logo({
  className,
  inverted = false,
  compact = false,
}: {
  className?: string;
  inverted?: boolean;
  compact?: boolean;
}) {
  return (
    <Link
      href="/"
      aria-label="Babycon home"
      className={cn("group inline-flex flex-col items-center leading-none", className)}
    >
      <span
        className={cn(
          "relative font-serif tracking-[-0.03em]",
          compact ? "text-[26px]" : "text-[31px] sm:text-[34px]",
          inverted ? "text-cream" : "text-ink"
        )}
      >
        babycon
        <span className="absolute -right-[9px] top-[3px] h-[5px] w-[5px] rounded-full bg-clay transition-transform duration-300 group-hover:scale-125" />
      </span>
      {!compact && (
        <span
          className={cn(
            "mt-1.5 text-[7px] font-medium uppercase tracking-[0.42em]",
            inverted ? "text-cream/50" : "text-muted"
          )}
        >
          premium baby essentials
        </span>
      )}
    </Link>
  );
}
