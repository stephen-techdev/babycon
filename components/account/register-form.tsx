"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { ArrowRight, Eye, EyeOff, Loader2, UserPlus } from "lucide-react";

export function CustomerRegisterForm() {
  const router = useRouter();
  const [form, setForm] = useState({ name: "", email: "", phone: "", password: "" });
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  function update(field: keyof typeof form, value: string) {
    setForm((f) => ({ ...f, [field]: value }));
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    if (form.password.length < 8) {
      setError("Use at least 8 characters for your password.");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok || !data.ok) {
        setError(data.message || "Could not create your account.");
        setLoading(false);
        return;
      }
      router.push(data.redirect || "/account");
      router.refresh();
    } catch {
      setError("Something went wrong. Please try again.");
      setLoading(false);
    }
  }

  return (
    <form onSubmit={submit} className="space-y-4">
      <div>
        <label className="label" htmlFor="register-name">Full name</label>
        <input id="register-name" value={form.name} onChange={(e) => update("name", e.target.value)} required className="input" placeholder="Ananya Rao" autoComplete="name" />
      </div>
      <div>
        <label className="label" htmlFor="register-email">Email address</label>
        <input id="register-email" type="email" value={form.email} onChange={(e) => update("email", e.target.value)} required className="input" placeholder="you@example.com" autoComplete="email" />
      </div>
      <div>
        <label className="label" htmlFor="register-phone">Mobile number</label>
        <input id="register-phone" value={form.phone} onChange={(e) => update("phone", e.target.value.replace(/[^\d+ ]/g, ""))} className="input" placeholder="98765 43210" autoComplete="tel" />
      </div>
      <div>
        <label className="label" htmlFor="register-password">Password</label>
        <div className="relative">
          <input
            id="register-password"
            type={show ? "text" : "password"}
            value={form.password}
            onChange={(e) => update("password", e.target.value)}
            required
            minLength={8}
            className="input pr-11"
            placeholder="At least 8 characters"
            autoComplete="new-password"
          />
          <button type="button" onClick={() => setShow((v) => !v)} aria-label={show ? "Hide password" : "Show password"} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted hover:text-ink">
            {show ? <EyeOff size={15} /> : <Eye size={15} />}
          </button>
        </div>
        <p className="mt-1.5 text-[10.5px] text-muted">Use 8+ characters with a mix of letters and numbers.</p>
      </div>

      {error && <p className="border border-clay/30 bg-clay/5 px-3 py-2 text-[11.5px] text-clay">{error}</p>}

      <button type="submit" disabled={loading} className="btn-dark w-full">
        {loading ? <><Loader2 size={14} className="animate-spin" /> Creating your account…</> : <><UserPlus size={14} /> Create account</>}
      </button>

      <p className="text-center text-[11.5px] text-muted">
        Already have an account?{" "}
        <Link href="/account/login" className="text-clay underline underline-offset-2">Sign in</Link>
      </p>

      <p className="border-t border-line pt-4 text-[10px] leading-relaxed text-muted">
        By creating an account you agree to our{" "}
        <Link href="/pages/terms" className="text-ink underline underline-offset-2">terms</Link> and{" "}
        <Link href="/pages/privacy" className="text-ink underline underline-offset-2">privacy policy</Link>.
      </p>
    </form>
  );
}
