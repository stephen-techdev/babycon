import Link from "next/link";
import { ChevronDown, SlidersHorizontal, X } from "lucide-react";
import type { Collection } from "@/lib/types";

export type CatalogParams = {
  q?: string;
  sort?: string;
  size?: string;
  price?: string;
  collection?: string;
};

export const PRICE_OPTIONS = [
  { value: "", label: "All prices" },
  { value: "0-499", label: "Under ₹500" },
  { value: "500-999", label: "₹500 – ₹999" },
  { value: "1000-1999", label: "₹1,000 – ₹1,999" },
  { value: "2000-", label: "₹2,000 & above" },
];

export const SORT_OPTIONS = [
  { value: "featured", label: "Featured" },
  { value: "newest", label: "Newest first" },
  { value: "price-asc", label: "Price: low to high" },
  { value: "price-desc", label: "Price: high to low" },
  { value: "rating", label: "Top rated" },
];

export function parsePriceRange(value?: string): { min?: number; max?: number } {
  if (!value) return {};
  const [min, max] = value.split("-");
  return {
    min: min ? Number(min) : undefined,
    max: max ? Number(max) : undefined,
  };
}

export function CatalogFilters({
  basePath,
  params,
  sizes,
  collections,
  total,
  hideCollection = false,
}: {
  basePath: string;
  params: CatalogParams;
  sizes: string[];
  collections: Collection[];
  total: number;
  hideCollection?: boolean;
}) {
  const activeCount = [params.size, params.price, params.q, !hideCollection && params.collection].filter(Boolean).length;

  const hasActive = activeCount > 0 || (params.sort && params.sort !== "featured");

  return (
    <div>
      {/* Mobile filter disclosure */}
      <details className="group border-y border-line lg:hidden">
        <summary className="flex items-center justify-between py-4">
          <span className="flex items-center gap-2 text-[10px] font-medium uppercase tracking-[0.18em]">
            <SlidersHorizontal size={14} /> Filter & sort
            {activeCount > 0 && (
              <span className="flex h-4 min-w-4 items-center justify-center rounded-full bg-clay px-1 text-[8px] text-white">
                {activeCount}
              </span>
            )}
          </span>
          <ChevronDown size={15} className="transition-transform group-open:rotate-180" />
        </summary>
        <div className="pb-6">
          <FilterForm
            basePath={basePath}
            params={params}
            sizes={sizes}
            collections={collections}
            hideCollection={hideCollection}
          />
        </div>
      </details>

      {/* Desktop sidebar */}
      <aside className="hidden lg:block">
        <div className="sticky top-28">
          <div className="flex items-center justify-between border-b border-line pb-4">
            <p className="text-[10px] font-medium uppercase tracking-[0.2em]">Filters</p>
            {hasActive && (
              <Link
                href={basePath}
                className="flex items-center gap-1 text-[9px] uppercase tracking-[0.12em] text-clay hover:underline"
              >
                Clear <X size={10} />
              </Link>
            )}
          </div>
          <FilterForm
            basePath={basePath}
            params={params}
            sizes={sizes}
            collections={collections}
            hideCollection={hideCollection}
          />
          <p className="mt-8 text-[10.5px] leading-relaxed text-muted">
            {total} thoughtfully made {total === 1 ? "piece" : "pieces"} in this edit.
          </p>
        </div>
      </aside>
    </div>
  );
}

function FilterForm({
  basePath,
  params,
  sizes,
  collections,
  hideCollection,
}: {
  basePath: string;
  params: CatalogParams;
  sizes: string[];
  collections: Collection[];
  hideCollection: boolean;
}) {
  return (
    <form action={basePath} method="get" className="mt-5 space-y-6">
      <div>
        <label className="label" htmlFor="q">
          Search
        </label>
        <input
          id="q"
          name="q"
          defaultValue={params.q || ""}
          placeholder="Search this edit"
          className="input h-11 text-[12.5px]"
        />
      </div>

      <div>
        <label className="label" htmlFor="sort">
          Sort by
        </label>
        <div className="relative">
          <select
            id="sort"
            name="sort"
            defaultValue={params.sort || "featured"}
            className="select h-11 text-[12.5px]"
          >
            {SORT_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          <ChevronDown size={14} className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-muted" />
        </div>
      </div>

      <div>
        <p className="label">Size</p>
        <div className="flex flex-wrap gap-1.5">
          <Link
            href={buildFilterHref(basePath, params, "size", undefined)}
            className={`border px-3 py-1.5 text-[10.5px] transition-colors ${
              !params.size
                ? "border-ink bg-ink text-cream"
                : "border-line text-muted hover:border-ink hover:text-ink"
            }`}
          >
            All
          </Link>
          {sizes.map((size) => (
            <Link
              key={size}
              href={buildFilterHref(basePath, params, "size", params.size === size ? undefined : size)}
              className={`border px-3 py-1.5 text-[10.5px] transition-colors ${
                params.size === size
                  ? "border-ink bg-ink text-cream"
                  : "border-line text-muted hover:border-ink hover:text-ink"
              }`}
            >
              {size}
            </Link>
          ))}
        </div>
      </div>

      <div>
        <p className="label">Price</p>
        <div className="space-y-1.5">
          {PRICE_OPTIONS.map((option) => (
            <Link
              key={option.value || "all"}
              href={buildFilterHref(basePath, params, "price", option.value || undefined)}
              className={`flex items-center justify-between py-1 text-[12px] transition-colors ${
                (params.price || "") === option.value
                  ? "font-medium text-ink"
                  : "text-muted hover:text-ink"
              }`}
            >
              {option.label}
              {(params.price || "") === option.value && (
                <span className="h-1.5 w-1.5 rounded-full bg-clay" />
              )}
            </Link>
          ))}
        </div>
      </div>

      {!hideCollection && (
        <div>
          <p className="label">Collection</p>
          <div className="space-y-1.5">
            <Link
              href={buildFilterHref(basePath, params, "collection", undefined)}
              className={`block py-1 text-[12px] transition-colors ${
                !params.collection ? "font-medium text-ink" : "text-muted hover:text-ink"
              }`}
            >
              All collections
            </Link>
            {collections.map((collection) => (
              <Link
                key={collection.handle}
                href={buildFilterHref(basePath, params, "collection", collection.handle)}
                className={`block py-1 text-[12px] transition-colors ${
                  params.collection === collection.handle
                    ? "font-medium text-ink"
                    : "text-muted hover:text-ink"
                }`}
              >
                {collection.title}
              </Link>
            ))}
          </div>
        </div>
      )}

      <div className="flex flex-col gap-2 pt-1">
        <button type="submit" className="btn-dark btn-sm w-full">
          Apply filters
        </button>
        <Link
          href={basePath}
          className="text-center text-[9px] uppercase tracking-[0.16em] text-muted hover:text-ink"
        >
          Reset
        </Link>
      </div>
    </form>
  );
}

function buildFilterHref(
  basePath: string,
  params: CatalogParams,
  key: keyof CatalogParams,
  value?: string
) {
  const next = new URLSearchParams();
  const merged = { ...params, [key]: value };
  (Object.keys(merged) as (keyof CatalogParams)[]).forEach((k) => {
    const v = merged[k];
    if (v && !(k === "sort" && v === "featured")) next.set(k, v);
  });
  const qs = next.toString();
  return qs ? `${basePath}?${qs}` : basePath;
}

export function Pagination({
  basePath,
  params,
  page,
  pageCount,
}: {
  basePath: string;
  params: CatalogParams;
  page: number;
  pageCount: number;
}) {
  if (pageCount <= 1) return null;

  const href = (p: number) => {
    const next = new URLSearchParams();
    const merged = { ...params };
    Object.entries(merged).forEach(([k, v]) => {
      if (v && !(k === "sort" && v === "featured")) next.set(k, v);
    });
    if (p > 1) next.set("page", String(p));
    const qs = next.toString();
    return qs ? `${basePath}?${qs}` : basePath;
  };

  return (
    <nav className="mt-14 flex items-center justify-center gap-1.5" aria-label="Pagination">
      <Link
        href={href(Math.max(1, page - 1))}
        aria-disabled={page <= 1}
        className={`flex h-9 min-w-9 items-center justify-center border px-3 text-[10px] uppercase tracking-[0.12em] transition-colors ${
          page <= 1
            ? "pointer-events-none border-line text-muted/40"
            : "border-line text-muted hover:border-ink hover:text-ink"
        }`}
      >
        Prev
      </Link>
      {Array.from({ length: pageCount }, (_, i) => i + 1)
        .filter((p) => p === 1 || p === pageCount || Math.abs(p - page) <= 1)
        .map((p, idx, arr) => (
          <span key={p} className="flex items-center gap-1.5">
            {idx > 0 && arr[idx - 1] !== p - 1 && (
              <span className="px-1 text-[11px] text-muted">…</span>
            )}
            <Link
              href={href(p)}
              className={`flex h-9 w-9 items-center justify-center border text-[11px] transition-colors ${
                p === page
                  ? "border-ink bg-ink text-cream"
                  : "border-line text-muted hover:border-ink hover:text-ink"
              }`}
            >
              {p}
            </Link>
          </span>
        ))}
      <Link
        href={href(Math.min(pageCount, page + 1))}
        aria-disabled={page >= pageCount}
        className={`flex h-9 min-w-9 items-center justify-center border px-3 text-[10px] uppercase tracking-[0.12em] transition-colors ${
          page >= pageCount
            ? "pointer-events-none border-line text-muted/40"
            : "border-line text-muted hover:border-ink hover:text-ink"
        }`}
      >
        Next
      </Link>
    </nav>
  );
}

export function ActiveFilterChips({
  basePath,
  params,
}: {
  basePath: string;
  params: CatalogParams;
}) {
  const chips: { key: keyof CatalogParams; label: string }[] = [];
  if (params.q) chips.push({ key: "q", label: `“${params.q}”` });
  if (params.size) chips.push({ key: "size", label: params.size });
  if (params.price)
    chips.push({
      key: "price",
      label: PRICE_OPTIONS.find((p) => p.value === params.price)?.label || params.price,
    });
  if (params.collection) chips.push({ key: "collection", label: params.collection.replace(/-/g, " ") });
  if (params.sort && params.sort !== "featured")
    chips.push({ key: "sort", label: SORT_OPTIONS.find((s) => s.value === params.sort)?.label || params.sort });

  if (!chips.length) return null;

  return (
    <div className="flex flex-wrap items-center gap-2 border-b border-line pb-4">
      <span className="text-[9px] uppercase tracking-[0.18em] text-muted">Active:</span>
      {chips.map((chip) => (
        <Link
          key={chip.key + chip.label}
          href={buildFilterHref(basePath, params, chip.key, undefined)}
          className="flex items-center gap-1.5 bg-sand px-2.5 py-1 text-[10px] capitalize text-ink transition-colors hover:bg-blush"
        >
          {chip.label}
          <X size={10} />
        </Link>
      ))}
    </div>
  );
}
