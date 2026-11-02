"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { ArrowRight, Check } from "lucide-react";
import { cn } from "@/lib/utils";

export function NewsletterForm({
  inverted = false,
  compact = false,
}: {
  inverted?: boolean;
  compact?: boolean;
}) {
  const [email, setEmail] = useState("");
  const [state, setState] = useState<"idle" | "loading" | "done" | "error">("idle");
  const [message, setMessage] = useState("");

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!email) return;
    setState("loading");
    try {
      const res = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (data.ok) {
        setState("done");
        setMessage(data.message);
        setEmail("");
      } else {
        setState("error");
        setMessage(data.message || "Please check your email.");
      }
    } catch {
      setState("error");
      setMessage("Something went wrong. Please try again.");
    }
  }

  if (state === "done") {
    return (
      <div
        className={cn(
          "flex items-center gap-3 border px-5 py-4 text-[12.5px]",
          inverted ? "border-cream/20 text-cream" : "border-line text-ink"
        )}
      >
        <Check size={16} className="text-clay" />
        {message}
      </div>
    );
  }

  return (
    <form onSubmit={submit} className="w-full">
      <div
        className={cn(
          "flex items-center gap-2 border-b pb-1",
          inverted ? "border-cream/25" : "border-ink/25"
        )}
      >
        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Your email address"
          aria-label="Email address"
          className={cn(
            "h-11 flex-1 bg-transparent text-[13.5px] outline-none",
            inverted
              ? "text-cream placeholder:text-cream/40"
              : "text-ink placeholder:text-muted/60"
          )}
        />
        <button
          type="submit"
          disabled={state === "loading"}
          aria-label="Subscribe"
          className={cn(
            "flex h-10 w-10 items-center justify-center rounded-full border transition-all duration-300 disabled:opacity-50",
            inverted
              ? "border-cream/25 text-cream hover:border-clay hover:bg-clay"
              : "border-ink/20 text-ink hover:border-ink hover:bg-ink hover:text-cream"
          )}
        >
          <ArrowRight size={15} strokeWidth={1.6} />
        </button>
      </div>
      {state === "error" && (
        <p className="mt-2 text-[11px] text-clay">{message}</p>
      )}
      {!compact && (
        <p
          className={cn(
            "mt-3 text-[10.5px] leading-relaxed",
            inverted ? "text-cream/40" : "text-muted/70"
          )}
        >
          By subscribing you agree to our privacy policy. Unsubscribe anytime.
        </p>
      )}
    </form>
  );
}
