"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { ArrowRight, Loader2, PackageSearch } from "lucide-react";

export function TrackOrderForm({
  initialOrder = "",
  email = "",
}: {
  initialOrder?: string;
  email?: string;
}) {
  const router = useRouter();
  const [orderNumber, setOrderNumber] = useState(initialOrder);
  const [contact, setContact] = useState(email);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/orders/lookup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderNumber, contact }),
      });
      const data = await res.json();
      if (!res.ok || !data.ok) {
        setError(data.message || "We couldn't find that order.");
        setLoading(false);
        return;
      }
      router.push(`/order/${data.orderNumber}?token=${data.token}`);
    } catch {
      setError("Something went wrong. Please try again.");
      setLoading(false);
    }
  }

  return (
    <form onSubmit={submit} className="border border-line bg-white/50 p-6 sm:p-8">
      <div className="flex items-center gap-3">
        <span className="flex h-10 w-10 items-center justify-center rounded-full bg-sand text-clay">
          <PackageSearch size={19} strokeWidth={1.4} />
        </span>
        <div>
          <h2 className="font-serif text-[23px] font-light">Find your order</h2>
          <p className="text-[11px] text-muted">Use the details from your confirmation email.</p>
        </div>
      </div>

      <div className="mt-6 space-y-4">
        <div>
          <label className="label" htmlFor="track-order">Order number</label>
          <input
            id="track-order"
            value={orderNumber}
            onChange={(e) => setOrderNumber(e.target.value.toUpperCase())}
            required
            placeholder="BC-10020"
            className="input"
          />
        </div>
        <div>
          <label className="label" htmlFor="track-contact">Email or mobile number</label>
          <input
            id="track-contact"
            value={contact}
            onChange={(e) => setContact(e.target.value)}
            required
            placeholder="you@example.com or 98765 43210"
            className="input"
          />
        </div>
      </div>

      {error && <p className="mt-4 border border-clay/30 bg-clay/5 px-3 py-2 text-[11.5px] text-clay">{error}</p>}

      <button type="submit" disabled={loading} className="btn-dark mt-5 w-full">
        {loading ? (
          <><Loader2 size={14} className="animate-spin" /> Looking up your order…</>
        ) : (
          <>Track my order <ArrowRight size={14} /></>
        )}
      </button>

      <div className="mt-5 border-t border-line pt-4 text-[10.5px] leading-relaxed text-muted">
        <p className="font-medium uppercase tracking-[0.12em] text-ink/70">Testing the demo?</p>
        <p className="mt-1">
          Try order <button type="button" onClick={() => setOrderNumber("BC-10020")} className="text-clay underline underline-offset-2">BC-10020</button>{" "}
          with email{" "}
          <button type="button" onClick={() => setContact("ananya@example.com")} className="text-clay underline underline-offset-2">ananya@example.com</button>{" "}
          or phone <button type="button" onClick={() => setContact("9845012345")} className="text-clay underline underline-offset-2">9845012345</button>.
        </p>
      </div>
    </form>
  );
}
