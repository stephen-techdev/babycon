"use client";

import { useState } from "react";
import { Check, Star } from "lucide-react";

export function ReviewForm({ handle }: { handle: string }) {
  const [open, setOpen] = useState(false);
  const [rating, setRating] = useState(5);
  const [name, setName] = useState("");
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [state, setState] = useState<"idle" | "loading" | "done" | "error">("idle");
  const [message, setMessage] = useState("");

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setState("loading");
    try {
      const res = await fetch("/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ handle, rating, name, title, body }),
      });
      const data = await res.json();
      if (data.ok) {
        setState("done");
        setMessage(data.message);
      } else {
        setState("error");
        setMessage(data.message || "Could not submit your review.");
      }
    } catch {
      setState("error");
      setMessage("Something went wrong. Please try again.");
    }
  }

  if (state === "done") {
    return (
      <div className="flex items-start gap-3 border border-sage/40 bg-sage/10 p-5 text-[12.5px] text-ink">
        <Check size={16} className="mt-0.5 shrink-0 text-sage" />
        <div>
          <p className="font-medium">Thank you for sharing.</p>
          <p className="mt-1 text-muted">{message}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="border border-line bg-white/40 p-5 sm:p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-[10px] font-medium uppercase tracking-[0.18em] text-muted">
            Bought this piece?
          </p>
          <h3 className="mt-1 font-serif text-[20px]">Write a little review</h3>
        </div>
        <button
          onClick={() => setOpen((v) => !v)}
          className="text-[10px] uppercase tracking-[0.14em] text-clay underline underline-offset-4"
        >
          {open ? "Close" : "Write one"}
        </button>
      </div>

      {open && (
        <form onSubmit={submit} className="mt-5 space-y-4">
          <div>
            <p className="label">Your rating</p>
            <div className="flex items-center gap-1">
              {[1, 2, 3, 4, 5].map((n) => (
                <button
                  key={n}
                  type="button"
                  onClick={() => setRating(n)}
                  aria-label={`${n} stars`}
                >
                  <Star
                    size={22}
                    className={n <= rating ? "fill-clay text-clay" : "text-ink/20"}
                    strokeWidth={1.3}
                  />
                </button>
              ))}
            </div>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label htmlFor="review-name" className="label">Name</label>
              <input
                id="review-name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="input"
                placeholder="Your name"
              />
            </div>
            <div>
              <label htmlFor="review-title" className="label">Title</label>
              <input
                id="review-title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="input"
                placeholder="Softest thing ever"
              />
            </div>
          </div>
          <div>
            <label htmlFor="review-body" className="label">Your review</label>
            <textarea
              id="review-body"
              value={body}
              onChange={(e) => setBody(e.target.value)}
              required
              minLength={10}
              className="textarea"
              placeholder="How did it fit, feel and wash?"
            />
          </div>
          {state === "error" && <p className="text-[11px] text-clay">{message}</p>}
          <div className="flex items-center gap-3">
            <button type="submit" disabled={state === "loading"} className="btn-dark btn-sm">
              {state === "loading" ? "Submitting..." : "Submit review"}
            </button>
            <p className="text-[10px] text-muted">Reviews appear after approval.</p>
          </div>
        </form>
      )}
    </div>
  );
}
