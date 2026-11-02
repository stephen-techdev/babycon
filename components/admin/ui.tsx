import { cn } from "@/lib/utils";

export function AdminPageHeader({
  eyebrow,
  title,
  description,
  action,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="mb-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
      <div>
        {eyebrow && (
          <p className="text-[9px] font-medium uppercase tracking-[0.2em] text-clay">{eyebrow}</p>
        )}
        <h1 className="mt-1.5 font-serif text-[30px] font-light leading-tight text-ink sm:text-[36px]">
          {title}
        </h1>
        {description && (
          <p className="mt-1.5 max-w-2xl text-[12px] leading-relaxed text-muted">{description}</p>
        )}
      </div>
      {action && <div className="flex flex-wrap items-center gap-2">{action}</div>}
    </div>
  );
}

export function AdminCard({
  title,
  description,
  action,
  children,
  className,
  padded = true,
}: {
  title?: string;
  description?: string;
  action?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
  padded?: boolean;
}) {
  return (
    <section className={cn("border border-line bg-white", className)}>
      {(title || action) && (
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-line px-5 py-4">
          <div>
            {title && (
              <h2 className="text-[10px] font-semibold uppercase tracking-[0.16em] text-ink">
                {title}
              </h2>
            )}
            {description && <p className="mt-0.5 text-[10.5px] text-muted">{description}</p>}
          </div>
          {action}
        </div>
      )}
      <div className={padded ? "p-5" : ""}>{children}</div>
    </section>
  );
}

export function StatCard({
  label,
  value,
  note,
  icon: Icon,
  tone = "default",
}: {
  label: string;
  value: string;
  note?: string;
  icon: React.ComponentType<{ size?: number; strokeWidth?: number; className?: string }>;
  tone?: "default" | "clay" | "sage" | "forest";
}) {
  const tones = {
    default: "bg-sand text-ink",
    clay: "bg-clay/10 text-clay",
    sage: "bg-sage/15 text-sage",
    forest: "bg-forest text-cream",
  };
  return (
    <div className="border border-line bg-white p-4 sm:p-5">
      <div className="flex items-start justify-between">
        <p className="text-[9px] font-medium uppercase tracking-[0.16em] text-muted">{label}</p>
        <span className={cn("flex h-8 w-8 items-center justify-center rounded-full", tones[tone])}>
          <Icon size={14} strokeWidth={1.6} />
        </span>
      </div>
      <p className="mt-3 font-serif text-[28px] leading-none text-ink">{value}</p>
      {note && <p className="mt-2 text-[10px] text-muted">{note}</p>}
    </div>
  );
}

const STATUS_STYLES: Record<string, string> = {
  placed: "bg-sand text-ink/70",
  confirmed: "bg-butter text-ink/70",
  packed: "bg-butter text-ink/70",
  shipped: "bg-blue-50 text-blue-700",
  delivered: "bg-sage/15 text-sage",
  cancelled: "bg-clay/10 text-clay",
  returned: "bg-ink/10 text-ink",
  paid: "bg-sage/15 text-sage",
  pending: "bg-butter text-ink/70",
  failed: "bg-clay/10 text-clay",
  refunded: "bg-ink/10 text-ink",
  new: "bg-clay/10 text-clay",
  read: "bg-sand text-ink/70",
  replied: "bg-sage/15 text-sage",
  active: "bg-sage/15 text-sage",
  inactive: "bg-sand text-muted",
  approved: "bg-sage/15 text-sage",
  awaiting: "bg-butter text-ink/70",
};

export function StatusPill({ status, label }: { status: string; label?: string }) {
  return (
    <span
      className={cn(
        "inline-flex items-center px-2 py-0.5 text-[8.5px] font-medium uppercase tracking-[0.1em]",
        STATUS_STYLES[status] || "bg-sand text-ink/70"
      )}
    >
      {label || status.replace(/_/g, " ")}
    </span>
  );
}

export function AdminEmpty({
  title,
  description,
  action,
}: {
  title: string;
  description?: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="flex flex-col items-center border border-dashed border-line px-6 py-12 text-center">
      <p className="font-serif text-[22px] text-ink">{title}</p>
      {description && <p className="mt-2 max-w-sm text-[11.5px] text-muted">{description}</p>}
      {action && <div className="mt-5">{action}</div>}
    </div>
  );
}

export function Field({
  label,
  hint,
  children,
  className,
}: {
  label: string;
  hint?: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={className}>
      <label className="mb-1.5 block text-[9px] font-medium uppercase tracking-[0.14em] text-muted">
        {label}
      </label>
      {children}
      {hint && <p className="mt-1 text-[9.5px] text-muted/80">{hint}</p>}
    </div>
  );
}

export const adminInput =
  "h-10 w-full border border-line bg-white px-3 text-[12px] text-ink outline-none transition-colors placeholder:text-muted/50 focus:border-ink";
export const adminTextarea =
  "min-h-[100px] w-full resize-y border border-line bg-white px-3 py-2 text-[12px] text-ink outline-none transition-colors placeholder:text-muted/50 focus:border-ink";
export const adminSelect =
  "h-10 w-full appearance-none border border-line bg-white px-3 text-[12px] text-ink outline-none focus:border-ink";
export const adminButton =
  "inline-flex h-10 items-center justify-center gap-2 bg-ink px-4 text-[9.5px] font-medium uppercase tracking-[0.14em] text-cream transition-colors hover:bg-forest disabled:opacity-50";
export const adminButtonGhost =
  "inline-flex h-10 items-center justify-center gap-2 border border-line bg-white px-4 text-[9.5px] font-medium uppercase tracking-[0.14em] text-muted transition-colors hover:border-ink hover:text-ink";
