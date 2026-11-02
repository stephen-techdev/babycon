"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { ArrowRight, Search, TrendingUp, X } from "lucide-react";
import { formatINR } from "@/lib/money";

type Result = {
  id: number;
  handle: string;
  title: string;
  price: number;
  compareAtPrice: number | null;
  image: string;
  category: string;
};

const POPULAR = ["Muslin", "Newborn", "Frock", "Blanket", "Combo set", "Socks"];

export function SearchDialog({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Result[]>([]);
  const [loading, setLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  useEffect(() => {
    if (!open) return;
    const timer = setTimeout(() => inputRef.current?.focus(), 80);
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => {
      clearTimeout(timer);
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [open, onClose]);

  useEffect(() => {
    if (!open) return;
    if (!query.trim()) {
      setResults([]);
      return;
    }
    setLoading(true);
    const controller = new AbortController();
    const timer = setTimeout(async () => {
      try {
        const res = await fetch(`/api/products?q=${encodeURIComponent(query)}&limit=6`, {
          signal: controller.signal,
        });
        const data = await res.json();
        setResults(data.products || []);
      } catch {
        // ignore
      } finally {
        setLoading(false);
      }
    }, 250);
    return () => {
      clearTimeout(timer);
      controller.abort();
    };
  }, [query, open]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[90] flex justify-center">
      <div className="absolute inset-0 bg-ink/45 backdrop-blur-[3px]" onClick={onClose} />
      <div className="relative mt-0 w-full animate-fade-in overflow-y-auto bg-cream p-6 shadow-soft sm:mt-[9vh] sm:max-w-2xl sm:p-10">
        <div className="flex items-center justify-between">
          <p className="eyebrow text-clay">Search the collection</p>
          <button
            onClick={onClose}
            aria-label="Close search"
            className="flex h-9 w-9 items-center justify-center border border-line transition-colors hover:border-ink"
          >
            <X size={15} strokeWidth={1.5} />
          </button>
        </div>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (!query.trim()) return;
            onClose();
            router.push(`/search?q=${encodeURIComponent(query.trim())}`);
          }}
          className="mt-6 flex items-center gap-3 border-b border-ink/25 pb-3"
        >
          <Search size={20} strokeWidth={1.4} className="text-muted" />
          <input
            ref={inputRef}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="What are you looking for?"
            className="h-11 flex-1 bg-transparent font-serif text-[22px] font-light text-ink outline-none placeholder:text-muted/40 sm:text-[26px]"
          />
          {query && (
            <button type="button" onClick={() => setQuery("")} aria-label="Clear">
              <X size={16} className="text-muted" />
            </button>
          )}
        </form>

        {!query && (
          <div className="mt-8">
            <p className="flex items-center gap-2 text-[10px] font-medium uppercase tracking-[0.2em] text-muted">
              <TrendingUp size={13} /> Most searched
            </p>
            <div className="mt-4 flex flex-wrap gap-2">
              {POPULAR.map((term) => (
                <button
                  key={term}
                  onClick={() => setQuery(term)}
                  className="border border-line px-4 py-2 text-[11px] tracking-wide text-ink transition-colors hover:border-ink"
                >
                  {term}
                </button>
              ))}
            </div>
          </div>
        )}

        {query && (
          <div className="mt-6 min-h-[160px]">
            {loading && (
              <div className="space-y-3">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="flex animate-pulse items-center gap-4">
                    <div className="h-16 w-14 bg-sand" />
                    <div className="flex-1 space-y-2">
                      <div className="h-3 w-1/2 bg-sand" />
                      <div className="h-3 w-1/4 bg-sand" />
                    </div>
                  </div>
                ))}
              </div>
            )}
            {!loading && results.length === 0 && (
              <p className="py-10 text-center text-[13px] text-muted">
                No matches for “{query}”. Try a softer search.
              </p>
            )}
            {!loading && results.length > 0 && (
              <ul className="divide-y divide-line">
                {results.map((r) => (
                  <li key={r.id}>
                    <Link
                      href={`/products/${r.handle}`}
                      onClick={onClose}
                      className="group flex items-center gap-4 py-3"
                    >
                      <div className="relative h-16 w-14 overflow-hidden bg-sand">
                        {r.image && (
                          <Image
                            src={r.image}
                            alt={r.title}
                            fill
                            sizes="56px"
                            className="object-cover transition-transform duration-500 group-hover:scale-105"
                          />
                        )}
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="truncate font-serif text-[16px] text-ink">{r.title}</p>
                        <p className="mt-0.5 text-[10px] uppercase tracking-[0.15em] text-muted">
                          {r.category}
                        </p>
                      </div>
                      <span className="text-[13px]">{formatINR(r.price)}</span>
                      <ArrowRight size={15} className="text-muted transition-transform group-hover:translate-x-1" />
                    </Link>
                  </li>
                ))}
              </ul>
            )}
            {!loading && results.length > 0 && (
              <button
                onClick={() => {
                  onClose();
                  router.push(`/search?q=${encodeURIComponent(query.trim())}`);
                }}
                className="link-line mt-5 text-clay"
              >
                See all results <ArrowRight size={13} />
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
