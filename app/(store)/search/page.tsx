import type { Metadata } from "next";
import Link from "next/link";
import { Search, SlidersHorizontal } from "lucide-react";
import { ProductGrid } from "@/components/product/product-grid";
import { listProducts } from "@/lib/db";

export const metadata: Metadata = {
  title: "Search",
  description: "Search the Babycon collection for muslin, rompers, blankets and little gifts.",
  robots: { index: false },
};

type SearchParams = Promise<{ q?: string | string[] }>;

export default async function SearchPage({ searchParams }: { searchParams: SearchParams }) {
  const raw = await searchParams;
  const q = (Array.isArray(raw.q) ? raw.q[0] : raw.q) || "";
  const products = q ? listProducts({ q, limit: 60 }) : [];

  return (
    <section className="container-x py-12 sm:py-16">
      <nav className="flex items-center gap-2 text-[9.5px] uppercase tracking-[0.16em] text-muted">
        <Link href="/" className="hover:text-ink">Home</Link>
        <span>/</span>
        <span className="text-ink">Search</span>
      </nav>

      <div className="mt-6 max-w-3xl">
        <p className="eyebrow text-clay">Find something soft</p>
        <h1 className="display mt-4 text-[40px] sm:text-[54px]">
          What are you <em className="italic text-clay">looking for?</em>
        </h1>

        <form action="/search" method="get" className="mt-8 flex items-center gap-2 border-b border-ink/30 pb-2">
          <Search size={20} strokeWidth={1.4} className="text-muted" />
          <input
            name="q"
            defaultValue={q}
            placeholder="Search muslin, rompers, blankets..."
            className="h-11 flex-1 bg-transparent font-serif text-[22px] font-light outline-none placeholder:text-muted/40"
            aria-label="Search"
          />
          <button type="submit" className="btn-dark btn-sm">
            Search
          </button>
        </form>
      </div>

      <div className="mt-10">
        {q ? (
          <>
            <div className="mb-6 flex flex-wrap items-center justify-between gap-3 border-b border-line pb-4">
              <p className="text-[11px] text-muted">
                <span className="text-ink">{products.length}</span> results for “{q}”
              </p>
              <Link href="/shop" className="flex items-center gap-1.5 text-[10px] uppercase tracking-[0.14em] text-muted hover:text-ink">
                <SlidersHorizontal size={12} /> Browse all pieces
              </Link>
            </div>
            {products.length > 0 ? (
              <ProductGrid products={products} />
            ) : (
              <div className="flex min-h-[300px] flex-col items-center justify-center border border-dashed border-line text-center">
                <p className="font-serif text-[26px]">No matches for “{q}”.</p>
                <p className="mt-2 text-[13px] text-muted">Try a simpler word — muslin, frock, blanket, socks.</p>
                <Link href="/shop" className="btn-outline btn-sm mt-6">Shop all</Link>
              </div>
            )}
          </>
        ) : (
          <div className="border-t border-line pt-8">
            <p className="text-[10px] uppercase tracking-[0.18em] text-muted">Popular searches</p>
            <div className="mt-4 flex flex-wrap gap-2">
              {["Muslin", "Newborn", "Kimono romper", "Blanket", "Combo set", "Socks", "Frock", "Special offers"].map((term) => (
                <Link
                  key={term}
                  href={`/search?q=${encodeURIComponent(term)}`}
                  className="border border-line px-4 py-2 text-[11px] text-muted transition-colors hover:border-ink hover:text-ink"
                >
                  {term}
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
