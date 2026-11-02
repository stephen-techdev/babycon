"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { ArrowRight, Eye, EyeOff, Loader2, LockKeyhole } from "lucide-react";

export function CustomerLoginForm({ next = "/account" }: { next?: string }) {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, next }),
      });
      const data = await res.json();
      if (!res.ok || !data.ok) {
        setError(data.message || "Those details don't match our records.");
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
        <label className="label" htmlFor="login-email">Email address</label>
        <input
          id="login-email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="input"
          placeholder="you@example.com"
          autoComplete="email"
        />
      </div>
      <div>
        <label className="label" htmlFor="login-password">Password</label>
        <div className="relative">
          <input
            id="login-password"
            type={show ? "text" : "password"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="input pr-11"
            placeholder="Your password"
            autoComplete="current-password"
          />
          <button
            type="button"
            onClick={() => setShow((v) => !v)}
            aria-label={show ? "Hide password" : "Show password"}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted hover:text-ink"
          >
            {show ? <EyeOff size={15} /> : <Eye size={15} />}
          </button>
        </div>
      </div>

      {error && (
        <p className="border border-clay/30 bg-clay/5 px-3 py-2 text-[11.5px] text-clay">{error}</p>
      )}

      <button type="submit" disabled={loading} className="btn-dark w-full">
        {loading ? (
          <><Loader2 size={14} className="animate-spin" /> Signing in…</>
        ) : (
          <><LockKeyhole size={14} /> Sign in</>
        )}
      </button>

      <p className="text-center text-[11.5px] text-muted">
        New to Babycon?{" "}
        <Link href="/account/register" className="text-clay underline underline-offset-2">
          Create an account
        </Link>
      </p>

      <div className="border-t border-line pt-4">
        <p className="text-[9.5px] uppercase tracking-[0.16em] text-muted">Demo customer</p>
        <button
          type="button"
          onClick={() => {
            setEmail("ananya@example.com");
            setPassword("Baby@12345");
          }}
          className="mt-2 flex w-full items-center justify-between border border-line px-3 py-2.5 text-[11px] text-ink transition-colors hover:border-ink"
        >
          <span>ananya@example.com · Baby@12345</span>
          <ArrowRight size={12} />
        </button>
      </div>
    </form>
  );
}
