import { formatINR } from "@/lib/money";
import { cn } from "@/lib/utils";

export function Price({
  price,
  compareAtPrice,
  className,
  size = "md",
}: {
  price: number;
  compareAtPrice?: number | null;
  className?: string;
  size?: "sm" | "md" | "lg";
}) {
  return (
    <span className={cn("inline-flex flex-wrap items-baseline gap-2", className)}>
      <span
        className={cn(
          "font-medium tracking-tight",
          size === "sm" && "text-[12.5px]",
          size === "md" && "text-[14px]",
          size === "lg" && "text-[20px]"
        )}
      >
        {formatINR(price)}
      </span>
      {compareAtPrice && compareAtPrice > price && (
        <span
          className={cn(
            "text-muted/70 line-through",
            size === "sm" && "text-[11px]",
            size === "md" && "text-[12px]",
            size === "lg" && "text-[14px]"
          )}
        >
          {formatINR(compareAtPrice)}
        </span>
      )}
    </span>
  );
}
