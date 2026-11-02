import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { CheckCircle2, Pencil, Plus, Search } from "lucide-react";
import { AdminEmpty, AdminPageHeader, StatusPill } from "@/components/admin/ui";
import { listProducts } from "@/lib/db";
import { formatINR } from "@/lib/money";
import { discountPercent } from "@/lib/money";

export const metadata: Metadata = { title: "Products · Admin" };
export const dynamic = "force-dynamic";

const PAGE_SIZE = 20;

type Props = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export default async function AdminProductsPage({ searchParams }: Props) {
  const raw = await searchParams;
  const get = (key: string) => (Array.isArray(raw[key]) ? raw[key]?.[0] : raw[key]);
  const q = (get("q") || "").toLowerCase();
  const page = Math.max(1, Number(get("page") || 1));
  const saved = get("saved");
  const deleted = get("deleted");

  let products = listProducts({ includeInactive: true, sort: "featured" });
  if (q) {
    products = products.filter(
      (product) =>
        product.title.toLowerCase().includes(q) ||
        product.handle.toLowerCase().includes(q) ||
        product.sku.toLowerCase().includes(q) ||
        product.category.toLowerCase().includes(q)
    );
  }

  const total = products.length;
  const pageCount = Math.max(1, Math.ceil(total / PAGE_SIZE));
  const current = Math.min(page, pageCount);
  const rows = products.slice((current - 1) * PAGE_SIZE, current * PAGE_SIZE);

  return (
    <>
      <AdminPageHeader
        eyebrow="Catalog"
        title="Products"
        description={`${total} pieces in the catalog, including hidden drafts. Manage pricing, stock, imagery and collections.`}
        action={
          <Link
            href="/admin/products/new"
            className="inline-flex h-10 items-center gap-2 bg-ink px-4 text-[9.5px] font-medium uppercase tracking-[0.14em] text-cream transition-colors hover:bg-forest"
          >
            <Plus size={13} /> New product
          </Link>
        }
      />

      {(saved || deleted) && (
        <div className="mb-4 flex items-center gap-2 border border-sage/40 bg-sage/10 px-4 py-2.5 text-[11px] text-sage">
          <CheckCircle2 size={14} />
          {deleted ? "Product deleted." : saved === "updated" ? "Product updated." : "Product created."}
        </div>
      )}

      <div className="border border-line bg-white">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-line px-4 py-3">
          <form action="/admin/products" method="get" className="relative w-full max-w-xs">
            <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
            <input
              name="q"
              defaultValue={get("q") || ""}
              placeholder="Search title, SKU, category…"
              className="h-9 w-full border border-line bg-white pl-8 pr-3 text-[11px] outline-none focus:border-ink"
            />
          </form>
          <p className="text-[9.5px] uppercase tracking-[0.12em] text-muted">
            Showing {rows.length} of {total}
          </p>
        </div>

        {rows.length ? (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[820px] text-left">
              <thead>
                <tr className="border-b border-line text-[8.5px] uppercase tracking-[0.12em] text-muted">
                  <th className="px-4 py-3 font-medium">Piece</th>
                  <th className="px-3 py-3 font-medium">Category</th>
                  <th className="px-3 py-3 font-medium">Price</th>
                  <th className="px-3 py-3 font-medium">Stock</th>
                  <th className="px-3 py-3 font-medium">Status</th>
                  <th className="px-3 py-3 font-medium">Flags</th>
                  <th className="px-4 py-3" />
                </tr>
              </thead>
              <tbody className="divide-y divide-line/70">
                {rows.map((product) => (
                  <tr key={product.id} className="text-[11.5px] transition-colors hover:bg-sand/25">
                    <td className="px-4 py-2.5">
                      <div className="flex items-center gap-3">
                        <div className="relative h-12 w-10 shrink-0 overflow-hidden bg-sand">
                          {product.images[0] && (
                            <Image
                              src={product.images[0]}
                              alt={product.title}
                              fill
                              sizes="40px"
                              className="object-cover"
                            />
                          )}
                        </div>
                        <div className="min-w-0">
                          <Link
                            href={`/admin/products/${product.id}`}
                            className="block max-w-[260px] truncate font-medium text-ink hover:text-clay"
                          >
                            {product.title}
                          </Link>
                          <p className="text-[9px] text-muted">
                            {product.sku || "No SKU"} · {product.handle}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-3 py-2.5 text-muted">{product.category}</td>
                    <td className="px-3 py-2.5">
                      <p className="text-ink">{formatINR(product.price)}</p>
                      {product.compareAtPrice && (
                        <p className="text-[9px] text-muted">
                          <span className="line-through">{formatINR(product.compareAtPrice)}</span>{" "}
                          · {discountPercent(product.price, product.compareAtPrice)}% off
                        </p>
                      )}
                    </td>
                    <td className="px-3 py-2.5">
                      <span className={product.stock <= 10 ? "font-medium text-clay" : "text-ink"}>
                        {product.stock}
                      </span>
                    </td>
                    <td className="px-3 py-2.5">
                      <StatusPill status={product.active ? "active" : "inactive"} />
                    </td>
                    <td className="px-3 py-2.5">
                      <div className="flex flex-wrap gap-1">
                        {product.featured && (
                          <span className="bg-butter px-1.5 py-0.5 text-[8px] uppercase tracking-[0.08em] text-ink/70">
                            Featured
                          </span>
                        )}
                        {product.badge && (
                          <span className="bg-sand px-1.5 py-0.5 text-[8px] uppercase tracking-[0.08em] text-muted">
                            {product.badge}
                          </span>
                        )}
                        {!product.featured && !product.badge && (
                          <span className="text-[9px] text-muted/50">—</span>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-2.5 text-right">
                      <Link
                        href={`/admin/products/${product.id}`}
                        className="inline-flex h-7 w-7 items-center justify-center border border-line text-muted transition-colors hover:border-ink hover:text-ink"
                        aria-label={`Edit ${product.title}`}
                      >
                        <Pencil size={12} />
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-6">
            <AdminEmpty
              title="No products match"
              description="Try a different search, or add a new piece to the catalog."
              action={
                <Link href="/admin/products/new" className="inline-flex h-9 items-center gap-2 bg-ink px-4 text-[9px] uppercase tracking-[0.12em] text-cream">
                  <Plus size={12} /> New product
                </Link>
              }
            />
          </div>
        )}

        {pageCount > 1 && (
          <div className="flex items-center justify-between border-t border-line px-4 py-3">
            <p className="text-[9.5px] text-muted">
              Page {current} of {pageCount}
            </p>
            <div className="flex gap-2">
              {current > 1 && (
                <Link
                  href={`/admin/products?${new URLSearchParams({ ...(get("q") ? { q: get("q")! } : {}), page: String(current - 1) })}`}
                  className="inline-flex h-8 items-center border border-line px-3 text-[9px] uppercase tracking-[0.1em] text-muted hover:border-ink hover:text-ink"
                >
                  Previous
                </Link>
              )}
              {current < pageCount && (
                <Link
                  href={`/admin/products?${new URLSearchParams({ ...(get("q") ? { q: get("q")! } : {}), page: String(current + 1) })}`}
                  className="inline-flex h-8 items-center border border-line px-3 text-[9px] uppercase tracking-[0.1em] text-muted hover:border-ink hover:text-ink"
                >
                  Next
                </Link>
              )}
            </div>
          </div>
        )}
      </div>
    </>
  );
}
