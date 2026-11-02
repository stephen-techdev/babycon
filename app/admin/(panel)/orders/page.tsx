import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight, Download, Search, ShoppingBag } from "lucide-react";
import { AdminEmpty, AdminPageHeader, StatusPill } from "@/components/admin/ui";
import { listOrders } from "@/lib/db";
import { formatINR } from "@/lib/money";
import { formatDate } from "@/lib/utils";

export const metadata: Metadata = { title: "Orders · Admin" };
export const dynamic = "force-dynamic";

const PAGE_SIZE = 15;

const STATUSES = [
  { key: "", label: "All" },
  { key: "placed", label: "Placed" },
  { key: "confirmed", label: "Confirmed" },
  { key: "packed", label: "Packed" },
  { key: "shipped", label: "Shipped" },
  { key: "delivered", label: "Delivered" },
  { key: "cancelled", label: "Cancelled" },
  { key: "returned", label: "Returned" },
];

type Props = { searchParams: Promise<Record<string, string | string[] | undefined>> };

export default async function AdminOrdersPage({ searchParams }: Props) {
  const raw = await searchParams;
  const get = (key: string) => (Array.isArray(raw[key]) ? raw[key]?.[0] : raw[key]);
  const status = get("status") || "";
  const q = (get("q") || "").toLowerCase().trim();
  const page = Math.max(1, Number(get("page") || 1));

  const all = listOrders();
  const counts = all.reduce<Record<string, number>>((acc, order) => {
    acc[order.status] = (acc[order.status] || 0) + 1;
    return acc;
  }, {});

  let orders = all;
  if (status) orders = orders.filter((order) => order.status === status);
  if (q) {
    orders = orders.filter(
      (order) =>
        order.orderNumber.toLowerCase().includes(q) ||
        order.customerName.toLowerCase().includes(q) ||
        order.email.toLowerCase().includes(q) ||
        order.phone.includes(q)
    );
  }

  const total = orders.length;
  const pageCount = Math.max(1, Math.ceil(total / PAGE_SIZE));
  const current = Math.min(page, pageCount);
  const rows = orders.slice((current - 1) * PAGE_SIZE, current * PAGE_SIZE);
  const revenue = all
    .filter((order) => order.status !== "cancelled" && order.status !== "returned")
    .reduce((sum, order) => sum + order.total, 0);

  function href(next: { status?: string; page?: number }) {
    const params = new URLSearchParams();
    const nextStatus = next.status ?? status;
    if (nextStatus) params.set("status", nextStatus);
    if (q) params.set("q", q);
    if (next.page && next.page > 1) params.set("page", String(next.page));
    const string = params.toString();
    return `/admin/orders${string ? `?${string}` : ""}`;
  }

  return (
    <>
      <AdminPageHeader
        eyebrow="Fulfilment"
        title="Orders"
        description={`${all.length} orders · ${formatINR(revenue)} in valid revenue. Update status, payment and internal notes from each order.`}
        action={
          <Link
            href="/api/admin/orders/export"
            className="inline-flex h-10 items-center gap-2 border border-line bg-white px-4 text-[9.5px] font-medium uppercase tracking-[0.14em] text-muted transition-colors hover:border-ink hover:text-ink"
          >
            <Download size={12} /> Export CSV
          </Link>
        }
      />

      <div className="border border-line bg-white">
        <div className="flex flex-wrap items-center gap-2 border-b border-line px-4 py-3">
          <div className="flex flex-wrap gap-1">
            {STATUSES.map((item) => {
              const count = item.key ? counts[item.key] || 0 : all.length;
              const active = status === item.key;
              return (
                <Link
                  key={item.key || "all"}
                  href={href({ status: item.key, page: 1 })}
                  className={`inline-flex h-8 items-center gap-1.5 px-2.5 text-[9.5px] uppercase tracking-[0.1em] transition-colors ${
                    active ? "bg-ink text-cream" : "border border-line text-muted hover:border-ink hover:text-ink"
                  }`}
                >
                  {item.label}
                  <span className={active ? "text-cream/50" : "text-muted/50"}>{count}</span>
                </Link>
              );
            })}
          </div>
          <form action="/admin/orders" method="get" className="relative ml-auto w-full max-w-xs">
            {status && <input type="hidden" name="status" value={status} />}
            <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
            <input
              name="q"
              defaultValue={get("q") || ""}
              placeholder="Order, name, email or phone…"
              className="h-9 w-full border border-line bg-white pl-8 pr-3 text-[11px] outline-none focus:border-ink"
            />
          </form>
        </div>

        {rows.length ? (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[860px] text-left">
              <thead>
                <tr className="border-b border-line text-[8.5px] uppercase tracking-[0.12em] text-muted">
                  <th className="px-4 py-3 font-medium">Order</th>
                  <th className="px-3 py-3 font-medium">Customer</th>
                  <th className="px-3 py-3 font-medium">Items</th>
                  <th className="px-3 py-3 font-medium">Total</th>
                  <th className="px-3 py-3 font-medium">Payment</th>
                  <th className="px-3 py-3 font-medium">Status</th>
                  <th className="px-3 py-3 font-medium">Placed</th>
                  <th className="px-4 py-3" />
                </tr>
              </thead>
              <tbody className="divide-y divide-line/70">
                {rows.map((order) => {
                  const count = order.items.reduce((sum, item) => sum + item.qty, 0);
                  return (
                    <tr key={order.id} className="text-[11.5px] transition-colors hover:bg-sand/25">
                      <td className="px-4 py-3">
                        <Link href={`/admin/orders/${order.id}`} className="font-medium text-ink hover:text-clay">
                          {order.orderNumber}
                        </Link>
                        <p className="text-[9px] text-muted">{order.paymentMethod}</p>
                      </td>
                      <td className="px-3 py-3">
                        <p className="text-ink">{order.customerName}</p>
                        <p className="text-[9px] text-muted">{order.email}</p>
                      </td>
                      <td className="px-3 py-3 text-muted">
                        {count} {count === 1 ? "piece" : "pieces"}
                      </td>
                      <td className="px-3 py-3 font-medium text-ink">{formatINR(order.total)}</td>
                      <td className="px-3 py-3">
                        <StatusPill status={order.paymentStatus} />
                      </td>
                      <td className="px-3 py-3">
                        <StatusPill status={order.status} />
                      </td>
                      <td className="px-3 py-3 text-muted">{formatDate(order.createdAt)}</td>
                      <td className="px-4 py-3 text-right">
                        <Link
                          href={`/admin/orders/${order.id}`}
                          className="inline-flex h-7 w-7 items-center justify-center border border-line text-muted transition-colors hover:border-ink hover:text-ink"
                          aria-label={`Open ${order.orderNumber}`}
                        >
                          <ArrowUpRight size={13} />
                        </Link>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-6">
            <AdminEmpty
              title="No orders here"
              description={
                q || status
                  ? "Try clearing the filters or searching with a different term."
                  : "New orders will appear here as they come in."
              }
              action={
                (q || status) && (
                  <Link href="/admin/orders" className="inline-flex h-9 items-center gap-2 border border-line px-4 text-[9px] uppercase tracking-[0.12em] text-muted hover:border-ink hover:text-ink">
                    <ShoppingBag size={12} /> Clear filters
                  </Link>
                )
              }
            />
          </div>
        )}

        <div className="flex items-center justify-between border-t border-line px-4 py-3">
          <p className="text-[9.5px] text-muted">
            Showing {rows.length} of {total}
          </p>
          {pageCount > 1 && (
            <div className="flex items-center gap-2">
              <p className="text-[9.5px] text-muted">
                Page {current} of {pageCount}
              </p>
              {current > 1 && (
                <Link href={href({ page: current - 1 })} className="inline-flex h-8 items-center border border-line px-3 text-[9px] uppercase tracking-[0.1em] text-muted hover:border-ink hover:text-ink">
                  Previous
                </Link>
              )}
              {current < pageCount && (
                <Link href={href({ page: current + 1 })} className="inline-flex h-8 items-center border border-line px-3 text-[9px] uppercase tracking-[0.1em] text-muted hover:border-ink hover:text-ink">
                  Next
                </Link>
              )}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
