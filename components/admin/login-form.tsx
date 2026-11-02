"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { ArrowRight, Eye, EyeOff, Loader2, LockKeyhole } from "lucide-react";

export function AdminLoginForm() {
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
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok || !data.ok) {
        setError(data.message || "Invalid admin credentials.");
        setLoading(false);
        return;
      }
      router.push(data.redirect || "/admin");
      router.refresh();
    } catch {
      setError("Something went wrong. Please try again.");
      setLoading(false);
    }
  }

  return (
    <form onSubmit={submit} className="space-y-4">
      <div>
        <label className="mb-1.5 block text-[9px] font-medium uppercase tracking-[0.16em] text-cream/50">
          Admin email
        </label>
        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="admin@babycon.in"
          autoComplete="email"
          className="h-11 w-full border border-cream/15 bg-cream/5 px-3 text-[13px] text-cream outline-none transition-colors placeholder:text-cream/25 focus:border-clay"
        />
      </div>
      <div>
        <label className="mb-1.5 block text-[9px] font-medium uppercase tracking-[0.16em] text-cream/50">
          Password
        </label>
        <div className="relative">
          <input
            type={show ? "text" : "password"}
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Your password"
            autoComplete="current-password"
            className="h-11 w-full border border-cream/15 bg-cream/5 px-3 pr-11 text-[13px] text-cream outline-none transition-colors placeholder:text-cream/25 focus:border-clay"
          />
          <button
            type="button"
            onClick={() => setShow((v) => !v)}
            aria-label={show ? "Hide password" : "Show password"}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-cream/40 hover:text-cream"
          >
            {show ? <EyeOff size={15} /> : <Eye size={15} />}
          </button>
        </div>
      </div>

      {error && (
        <p className="border border-clay/40 bg-clay/10 px-3 py-2 text-[11.5px] text-blush">{error}</p>
      )}

      <button
        type="submit"
        disabled={loading}
        className="flex h-11 w-full items-center justify-center gap-2 bg-clay text-[10px] font-medium uppercase tracking-[0.18em] text-white transition-colors hover:bg-terracotta disabled:opacity-60"
      >
        {loading ? (
          <><Loader2 size={14} className="animate-spin" /> Signing in…</>
        ) : (
          <><LockKeyhole size={13} /> Enter the studio</>
        )}
      </button>

      <button
        type="button"
        onClick={() => {
          setEmail("admin@babycon.in");
          setPassword("Admin@12345");
        }}
        className="flex w-full items-center justify-between border border-cream/10 px-3 py-2.5 text-[10.5px] text-cream/55 transition-colors hover:border-cream/30 hover:text-cream"
      >
        <span>Demo: admin@babycon.in · Admin@12345</span>
        <ArrowRight size={12} />
      </button>
    </form>
  );
}
