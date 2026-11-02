import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ActiveFilterChips,
  CatalogFilters,
  Pagination,
  parsePriceRange,
  type CatalogParams,
} from "@/components/shop/catalog";
import { ProductGrid } from "@/components/product/product-grid";
import { getCollection, getAllSizes, listCollections, listProducts } from "@/lib/db";
import { absoluteUrl } from "@/lib/seo";

export const revalidate = 300;

const PAGE_SIZE = 24;

type Props = {
  params: Promise<{ handle: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { handle } = await params;
  const collection = getCollection(handle);
  if (!collection) return { title: "Collection not found" };
  return {
    title: `${collection.title} — Babycon`,
    description: collection.description,
    alternates: { canonical: `/collections/${collection.handle}` },
    openGraph: {
      title: `${collection.title} | Babycon`,
      description: collection.description,
      images: collection.image ? [collection.image] : undefined,
      url: absoluteUrl(`/collections/${collection.handle}`),
    },
  };
}

export default async function CollectionPage({ params, searchParams }: Props) {
  const { handle } = await params;
  const collection = getCollection(handle);
  if (!collection) notFound();

  const raw = await searchParams;
  const get = (key: string) => (Array.isArray(raw[key]) ? raw[key]?.[0] : raw[key]);
  const query: CatalogParams = {
    q: get("q") || undefined,
    sort: get("sort") || undefined,
    size: get("size") || undefined,
    price: get("price") || undefined,
  };
  const page = Math.max(1, Number(get("page") || 1));
  const { min, max } = parsePriceRange(query.price);

  let products = listProducts({
    collection: handle,
    q: query.q,
    size: query.size,
    sort: (query.sort as any) || "featured",
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
      <section className="relative overflow-hidden bg-ink">
        <div className="absolute inset-0">
          {collection.image && (
            <Image
              src={collection.image}
              alt={collection.title}
              fill
              priority
              sizes="100vw"
              className="object-cover opacity-75"
            />
          )}
          <div className="absolute inset-0 bg-gradient-to-r from-ink/80 via-ink/45 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-ink/70 to-transparent" />
        </div>
        <div className="container-x relative z-10 flex min-h-[380px] flex-col justify-end py-12 text-cream sm:min-h-[440px] sm:py-16">
          <nav className="mb-6 flex items-center gap-2 text-[9.5px] uppercase tracking-[0.16em] text-cream/55">
            <Link href="/" className="hover:text-cream">Home</Link>
            <span>/</span>
            <Link href="/collections" className="hover:text-cream">Collections</Link>
            <span>/</span>
            <span className="text-cream/90">{collection.title}</span>
          </nav>
          <p className="eyebrow text-cream/60">{total} pieces in this edit</p>
          <h1 className="display mt-3 max-w-2xl text-[46px] sm:text-[64px]">
            {collection.title}
          </h1>
          <p className="mt-4 max-w-lg text-[13px] leading-relaxed text-cream/70 sm:text-[14px]">
            {collection.description}
          </p>
        </div>
      </section>

      <section className="container-x py-10 sm:py-14">
        <div className="grid gap-8 lg:grid-cols-[220px_1fr] lg:gap-12">
          <CatalogFilters
            basePath={`/collections/${handle}`}
            params={query}
            sizes={sizes}
            collections={collections}
            total={total}
            hideCollection
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
              <Link
                href="/collections"
                className="text-[10px] uppercase tracking-[0.14em] text-muted hover:text-ink"
              >
                All collections
              </Link>
            </div>
            <ActiveFilterChips basePath={`/collections/${handle}`} params={query} />
            {pageProducts.length > 0 ? (
              <>
                <div className="mt-6">
                  <ProductGrid products={pageProducts} />
                </div>
                <Pagination
                  basePath={`/collections/${handle}`}
                  params={query}
                  page={page}
                  pageCount={pageCount}
                />
              </>
            ) : (
              <div className="flex min-h-[320px] flex-col items-center justify-center border border-dashed border-line px-6 text-center">
                <p className="font-serif text-[26px]">Nothing here — for now.</p>
                <p className="mt-2 max-w-sm text-[13px] text-muted">
                  This edit is being restocked. Explore the rest of the collection in the meantime.
                </p>
                <Link href="/shop" className="btn-outline btn-sm mt-6">
                  Shop all
                </Link>
              </div>
            )}
          </div>
        </div>
      </section>
    </>
  );
}
