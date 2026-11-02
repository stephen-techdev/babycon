"use client";

import { useEffect, useState } from "react";
import { X } from "lucide-react";

export function AdminDrawer({
  label,
  title,
  description,
  children,
  variant = "primary",
  className,
}: {
  label: React.ReactNode;
  title: string;
  description?: string;
  children: React.ReactNode;
  variant?: "primary" | "ghost" | "plain";
  className?: string;
}) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    function onKey(event: KeyboardEvent) {
      if (event.key === "Escape") setOpen(false);
    }
    if (open) {
      document.addEventListener("keydown", onKey);
      document.body.style.overflow = "hidden";
    }
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open]);

  const triggerClass =
    variant === "primary"
      ? "inline-flex h-10 items-center gap-2 bg-ink px-4 text-[9.5px] font-medium uppercase tracking-[0.14em] text-cream transition-colors hover:bg-forest"
      : variant === "ghost"
        ? "inline-flex h-8 items-center gap-1.5 border border-line bg-white px-2.5 text-[9px] font-medium uppercase tracking-[0.1em] text-muted transition-colors hover:border-ink hover:text-ink"
        : "text-[10px] text-clay hover:underline";

  return (
    <>
      <button type="button" onClick={() => setOpen(true)} className={className || triggerClass}>
        {label}
      </button>

      <div
        className={`fixed inset-0 z-[80] ${open ? "pointer-events-auto" : "pointer-events-none"}`}
        aria-hidden={!open}
      >
        <div
          className={`absolute inset-0 bg-ink/45 transition-opacity ${open ? "opacity-100" : "opacity-0"}`}
          onClick={() => setOpen(false)}
        />
        <div
          className={`absolute inset-y-0 right-0 flex w-full max-w-lg flex-col bg-[#F4F1EB] shadow-2xl transition-transform duration-300 ${
            open ? "translate-x-0" : "translate-x-full"
          }`}
          role="dialog"
          aria-modal="true"
          aria-label={title}
        >
          <div className="flex items-start justify-between border-b border-line bg-white px-5 py-4">
            <div>
              <h2 className="font-serif text-[24px] font-light text-ink">{title}</h2>
              {description && <p className="mt-0.5 text-[10.5px] text-muted">{description}</p>}
            </div>
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="flex h-8 w-8 shrink-0 items-center justify-center border border-line text-muted transition-colors hover:border-ink hover:text-ink"
              aria-label="Close"
            >
              <X size={15} />
            </button>
          </div>
          <div className="flex-1 overflow-y-auto p-5">{children}</div>
        </div>
      </div>
    </>
  );
}
