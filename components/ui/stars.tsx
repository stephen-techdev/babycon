import { Star } from "lucide-react";
import { cn } from "@/lib/utils";

export function Stars({
  rating = 5,
  size = 12,
  className,
  showValue = false,
}: {
  rating?: number;
  size?: number;
  className?: string;
  showValue?: boolean;
}) {
  return (
    <span className={cn("inline-flex items-center gap-1", className)}>
      <span className="flex items-center gap-[1px]">
        {[1, 2, 3, 4, 5].map((i) => (
          <Star
            key={i}
            width={size}
            height={size}
            className={
              i <= Math.round(rating)
                ? "fill-clay text-clay"
                : "fill-transparent text-ink/20"
            }
            strokeWidth={1.5}
          />
        ))}
      </span>
      {showValue && (
        <span className="ml-1 text-[11px] font-medium text-ink">
          {rating.toFixed(1)}
        </span>
      )}
    </span>
  );
}
