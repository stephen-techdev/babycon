import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

export function SectionHeading({
  eyebrow,
  title,
  description,
  link,
  linkLabel = "View all",
  align = "left",
  className,
}: {
  eyebrow?: string;
  title: React.ReactNode;
  description?: string;
  link?: string;
  linkLabel?: string;
  align?: "left" | "center";
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between",
        align === "center" && "sm:flex-col sm:items-center",
        className
      )}
    >
      <div className={cn("max-w-2xl", align === "center" && "text-center")}>
        {eyebrow && (
          <p className="eyebrow mb-4 flex items-center gap-3 text-clay">
            {align === "left" && <span className="h-px w-8 bg-clay/60" />}
            {eyebrow}
          </p>
        )}
        <h2 className="display text-[36px] sm:text-[44px] lg:text-[50px]">{title}</h2>
        {description && (
          <p className="mt-4 max-w-xl text-[14px] leading-relaxed text-muted sm:text-[15px]">
            {description}
          </p>
        )}
      </div>
      {link && (
        <Link
          href={link}
          className="hidden shrink-0 items-center gap-2 border-b border-ink/30 pb-1 text-[10.5px] font-medium uppercase tracking-[0.18em] transition-colors hover:border-clay hover:text-clay sm:inline-flex"
        >
          {linkLabel}
          <ArrowRight size={13} strokeWidth={1.5} />
        </Link>
      )}
    </div>
  );
}
