"use client";

import { Check, Copy, Download } from "lucide-react";
import { useState } from "react";

const buttonClass =
  "inline-flex h-9 items-center gap-2 border border-line bg-white px-3 text-[9px] font-medium uppercase tracking-[0.12em] text-muted transition-colors hover:border-ink hover:text-ink";

export function SubscriberTools({ emails }: { emails: string[] }) {
  const [copied, setCopied] = useState(false);

  async function copyAll() {
    try {
      await navigator.clipboard.writeText(emails.join(", "));
      setCopied(true);
      setTimeout(() => setCopied(false), 2200);
    } catch {
      setCopied(false);
    }
  }

  function download() {
    const header = "Email,Source,Joined\n";
    const rows = emails.map((email) => `${email},Demo store,`).join("\n");
    const blob = new Blob([header + rows], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = `babycon-subscribers-${new Date().toISOString().slice(0, 10)}.csv`;
    anchor.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div className="flex flex-wrap gap-2">
      <button type="button" onClick={copyAll} className={buttonClass} disabled={!emails.length}>
        {copied ? <Check size={12} className="text-sage" /> : <Copy size={12} />}
        {copied ? "Copied" : "Copy all emails"}
      </button>
      <button type="button" onClick={download} className={buttonClass} disabled={!emails.length}>
        <Download size={12} /> Download CSV
      </button>
    </div>
  );
}
