"use client";

import { Printer } from "lucide-react";

export function PrintButton({ label = "Print invoice" }: { label?: string }) {
  return (
    <button
      type="button"
      onClick={() => window.print()}
      className="no-print inline-flex h-10 items-center gap-2 border border-line px-4 text-[10px] font-medium uppercase tracking-[0.14em] text-muted transition-colors hover:border-ink hover:text-ink"
    >
      <Printer size={13} /> {label}
    </button>
  );
}
