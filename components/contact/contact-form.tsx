"use client";

import { useState } from "react";
import { Check, Loader2, Send } from "lucide-react";

const SUBJECTS = [
  "General enquiry",
  "Sizing help",
  "Order follow-up",
  "Returns & exchanges",
  "Bulk & gifting",
  "Wholesale",
];

export function ContactForm() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    subject: SUBJECTS[0],
    message: "",
  });
  const [state, setState] = useState<"idle" | "loading" | "done" | "error">("idle");
  const [feedback, setFeedback] = useState("");

  function update(field: keyof typeof form, value: string) {
    setForm((f) => ({ ...f, [field]: value }));
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setState("loading");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (data.ok) {
        setState("done");
        setFeedback(data.message);
      } else {
        setState("error");
        setFeedback(data.message || "Could not send your message.");
      }
    } catch {
      setState("error");
      setFeedback("Something went wrong. Please try again.");
    }
  }

  if (state === "done") {
    return (
      <div className="flex flex-col items-center border border-sage/40 bg-sage/10 px-6 py-14 text-center">
        <span className="flex h-14 w-14 items-center justify-center rounded-full bg-sage/20 text-sage">
          <Check size={24} />
        </span>
        <h2 className="mt-5 font-serif text-[28px] font-light">Message received.</h2>
        <p className="mt-2 max-w-sm text-[12.5px] leading-relaxed text-muted">{feedback}</p>
        <p className="mt-4 text-[10.5px] text-muted">
          In the meantime, our{" "}
          <a href="/faq" className="text-clay underline underline-offset-2">FAQs</a> might have a
          quick answer.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={submit} className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="label" htmlFor="contact-name">Your name</label>
          <input id="contact-name" value={form.name} onChange={(e) => update("name", e.target.value)} required className="input" placeholder="Ananya Rao" autoComplete="name" />
        </div>
        <div>
          <label className="label" htmlFor="contact-email">Email</label>
          <input id="contact-email" type="email" value={form.email} onChange={(e) => update("email", e.target.value)} required className="input" placeholder="you@example.com" autoComplete="email" />
        </div>
        <div>
          <label className="label" htmlFor="contact-phone">Mobile (optional)</label>
          <input id="contact-phone" value={form.phone} onChange={(e) => update("phone", e.target.value.replace(/[^\d+ ]/g, ""))} className="input" placeholder="98765 43210" autoComplete="tel" />
        </div>
        <div>
          <label className="label" htmlFor="contact-subject">Subject</label>
          <select id="contact-subject" value={form.subject} onChange={(e) => update("subject", e.target.value)} className="select">
            {SUBJECTS.map((subject) => (
              <option key={subject} value={subject}>{subject}</option>
            ))}
          </select>
        </div>
      </div>
      <div>
        <label className="label" htmlFor="contact-message">How can we help?</label>
        <textarea id="contact-message" value={form.message} onChange={(e) => update("message", e.target.value)} required minLength={10} className="textarea min-h-[150px]" placeholder="Tell us a little about your question, order or little one..." />
      </div>

      {state === "error" && (
        <p className="border border-clay/30 bg-clay/5 px-3 py-2 text-[11.5px] text-clay">{feedback}</p>
      )}

      <div className="flex flex-wrap items-center gap-4">
        <button type="submit" disabled={state === "loading"} className="btn-dark">
          {state === "loading" ? (
            <><Loader2 size={14} className="animate-spin" /> Sending…</>
          ) : (
            <>Send message <Send size={13} /></>
          )}
        </button>
        <p className="text-[10px] leading-relaxed text-muted">
          We reply within one working day,
          <br className="hidden sm:block" /> Monday to Saturday.
        </p>
      </div>
    </form>
  );
}
