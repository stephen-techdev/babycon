import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import {
  ActiveFilterChips,
  CatalogFilters,
  Pagination,
  parsePriceRange,
  type CatalogParams,
} from "@/components/shop/catalog";
import { ProductGrid } from "@/components/product/product-grid";
import { getAllSizes, getSettings, listCollections, listProducts } from "@/lib/db";
import { formatINR } from "@/lib/money";
import { storeConfigFromSettings } from "@/lib/store-config";

export const metadata: Metadata = {
  title: "Shop all — The full Babycon collection",
  description:
    "Explore every Babycon piece: premium muslin essentials, rompers, frocks, blankets, combo sets and thoughtful gifts for your little one.",
  alternates: { canonical: "/shop" },
};

export const revalidate = 300;

const PAGE_SIZE = 24;

type SearchParams = Promise<Record<string, string | string[] | undefined>>;

export default async function ShopPage({ searchParams }: { searchParams: SearchParams }) {
  const raw = await searchParams;
  const get = (key: string) => (Array.isArray(raw[key]) ? raw[key]?.[0] : raw[key]);
  const params: CatalogParams = {
    q: get("q") || undefined,
    sort: get("sort") || undefined,
    size: get("size") || undefined,
    price: get("price") || undefined,
    collection: get("collection") || undefined,
  };
  const page = Math.max(1, Number(get("page") || 1));
  const { min, max } = parsePriceRange(params.price);
  const storeConfig = storeConfigFromSettings(getSettings());

  let products = listProducts({
    q: params.q,
    collection: params.collection,
    size: params.size,
    sort: (params.sort as any) || "featured",
  });
  if (min != null) products = products.filter((p) => p.price >= min);
  if (max != null) products = products.filter((p) => p.price <= max);

  const total = products.length;
  const pageCount = Math.max(1, Math.ceil(total / PAGE_SIZE));
  const pageProducts = products.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);
  const sizes = getAllSizes();
  const collections = listCollections();

  return (
    <>
      <section className="border-b border-line bg-sand/50">
        <div className="container-x py-12 sm:py-16 lg:py-20">
          <nav className="flex items-center gap-2 text-[9.5px] uppercase tracking-[0.16em] text-muted">
            <Link href="/" className="hover:text-ink">Home</Link>
            <span>/</span>
            <span className="text-ink">Shop all</span>
          </nav>
          <div className="mt-6 flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
            <div>
              <p className="eyebrow flex items-center gap-3 text-clay">
                <span className="h-px w-8 bg-clay/60" /> The collection
              </p>
              <h1 className="display mt-4 max-w-2xl text-[42px] sm:text-[56px] lg:text-[64px]">
                Everyday softness,
                <br />
                <em className="italic text-clay">beautifully made.</em>
              </h1>
            </div>
            <p className="max-w-xs pb-2 text-[12.5px] leading-relaxed text-muted">
              {total} considered pieces in premium muslin, gentle cotton and heirloom
              finishes. Free shipping over {formatINR(storeConfig.freeShippingThreshold)}.
            </p>
          </div>

          <div className="mt-8 flex gap-2 overflow-x-auto no-scrollbar">
            <Link
              href="/shop"
              className="shrink-0 border border-ink bg-ink px-4 py-2 text-[10px] uppercase tracking-[0.14em] text-cream"
            >
              All
            </Link>
            {collections.map((collection) => (
              <Link
                key={collection.handle}
                href={`/collections/${collection.handle}`}
                className="shrink-0 border border-line bg-cream px-4 py-2 text-[10px] uppercase tracking-[0.14em] text-muted transition-colors hover:border-ink hover:text-ink"
              >
                {collection.title}
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="container-x py-10 sm:py-14">
        <div className="grid gap-8 lg:grid-cols-[220px_1fr] lg:gap-12">
          <CatalogFilters
            basePath="/shop"
            params={params}
            sizes={sizes}
            collections={collections}
            total={total}
          />
          <div>
            <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
              <p className="text-[11px] text-muted">
                Showing{" "}
                <span className="text-ink">
                  {total === 0 ? 0 : (page - 1) * PAGE_SIZE + 1}–
                  {Math.min(page * PAGE_SIZE, total)}
                </span>{" "}
                of {total} pieces
              </p>
              <span className="hidden items-center gap-2 text-[10px] uppercase tracking-[0.14em] text-muted lg:flex">
                Free shipping over {formatINR(storeConfig.freeShippingThreshold)}
                <ArrowRight size={11} />
              </span>
            </div>
            <ActiveFilterChips basePath="/shop" params={params} />
            {pageProducts.length > 0 ? (
              <>
                <div className="mt-6">
                  <ProductGrid products={pageProducts} />
                </div>
                <Pagination basePath="/shop" params={params} page={page} pageCount={pageCount} />
              </>
            ) : (
              <div className="flex min-h-[320px] flex-col items-center justify-center border border-dashed border-line px-6 text-center">
                <p className="font-serif text-[26px]">Nothing matches — yet.</p>
                <p className="mt-2 max-w-sm text-[13px] text-muted">
                  Try loosening a filter, or explore the full collection.
                </p>
                <Link href="/shop" className="btn-outline btn-sm mt-6">
                  Clear filters
                </Link>
              </div>
            )}
          </div>
        </div>
      </section>
    </>
  );
}
