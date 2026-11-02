import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight, IndianRupee, Repeat2, Search, UserPlus, Users } from "lucide-react";
import { AdminCard, AdminEmpty, AdminPageHeader, StatCard } from "@/components/admin/ui";
import { listCustomers } from "@/lib/db";
import { formatINR } from "@/lib/money";
import { formatDate, initials } from "@/lib/utils";

export const metadata: Metadata = { title: "Customers · Admin" };
export const dynamic = "force-dynamic";

type Props = { searchParams: Promise<Record<string, string | string[] | undefined>> };

export default async function AdminCustomersPage({ searchParams }: Props) {
  const raw = await searchParams;
  const q = ((Array.isArray(raw.q) ? raw.q[0] : raw.q) || "").toLowerCase().trim();
  const sort = (Array.isArray(raw.sort) ? raw.sort[0] : raw.sort) || "spent";

  const all = listCustomers();
  let customers = all.filter(
    (customer) =>
      !q ||
      customer.name.toLowerCase().includes(q) ||
      customer.email.toLowerCase().includes(q) ||
      customer.phone.includes(q)
  );

  customers = [...customers].sort((a, b) => {
    if (sort === "orders") return b.orderCount - a.orderCount || b.spent - a.spent;
    if (sort === "newest") return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    if (sort === "name") return a.name.localeCompare(b.name);
    return b.spent - a.spent;
  });

  const repeat = all.filter((customer) => customer.orderCount > 1).length;
  const totalSpent = all.reduce((sum, customer) => sum + customer.spent, 0);
  const withOrders = all.filter((customer) => customer.orderCount > 0).length;

  return (
    <>
      <AdminPageHeader
        eyebrow="Relationships"
        title="Customers"
        description="Everyone who has created an account, with their order history and lifetime value. Customer data is demo-only."
      />

      <div className="mb-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Customers" value={String(all.length)} note={`${withOrders} have ordered`} icon={Users} tone="forest" />
        <StatCard label="Repeat customers" value={String(repeat)} note="Two or more orders" icon={Repeat2} tone="sage" />
        <StatCard label="Lifetime value" value={formatINR(totalSpent)} note="Valid orders only" icon={IndianRupee} tone="clay" />
        <StatCard
          label="Joined recently"
          value={String(all.filter((c) => Date.now() - new Date(c.createdAt).getTime() < 30 * 86400000).length)}
          note="In the last 30 days"
          icon={UserPlus}
        />
      </div>

      <AdminCard padded={false}>
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-line px-4 py-3">
          <form action="/admin/customers" method="get" className="relative w-full max-w-xs">
            <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
            <input
              name="q"
              defaultValue={q}
              placeholder="Search name, email or phone…"
              className="h-9 w-full border border-line bg-white pl-8 pr-3 text-[11px] outline-none focus:border-ink"
            />
          </form>
          <div className="flex flex-wrap gap-1">
            {[
              { key: "spent", label: "Top spend" },
              { key: "orders", label: "Most orders" },
              { key: "newest", label: "Newest" },
              { key: "name", label: "A–Z" },
            ].map((option) => {
              const params = new URLSearchParams({ sort: option.key });
              if (q) params.set("q", q);
              return (
                <Link
                  key={option.key}
                  href={`/admin/customers?${params.toString()}`}
                  className={`inline-flex h-8 items-center px-2.5 text-[9px] uppercase tracking-[0.1em] transition-colors ${
                    sort === option.key
                      ? "bg-ink text-cream"
                      : "border border-line text-muted hover:border-ink hover:text-ink"
                  }`}
                >
                  {option.label}
                </Link>
              );
            })}
          </div>
        </div>

        {customers.length ? (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[760px] text-left">
              <thead>
                <tr className="border-b border-line text-[8.5px] uppercase tracking-[0.12em] text-muted">
                  <th className="px-4 py-3 font-medium">Customer</th>
                  <th className="px-3 py-3 font-medium">Contact</th>
                  <th className="px-3 py-3 font-medium">Orders</th>
                  <th className="px-3 py-3 font-medium">Lifetime spend</th>
                  <th className="px-3 py-3 font-medium">Joined</th>
                  <th className="px-4 py-3" />
                </tr>
              </thead>
              <tbody className="divide-y divide-line/70">
                {customers.map((customer, index) => (
                  <tr key={customer.id} className="text-[11.5px] transition-colors hover:bg-sand/25">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-sand text-[10px] font-medium text-ink">
                          {initials(customer.name)}
                        </span>
                        <div className="min-w-0">
                          <p className="font-medium text-ink">{customer.name}</p>
                          <p className="text-[9px] text-muted">
                            {index === 0 && sort === "spent" ? "Top customer" : `Customer #${customer.id}`}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-3 py-3">
                      <p className="text-muted">{customer.email}</p>
                      <p className="text-[9.5px] text-muted">{customer.phone || "No phone"}</p>
                    </td>
                    <td className="px-3 py-3 text-ink">{customer.orderCount}</td>
                    <td className="px-3 py-3 font-medium text-ink">{formatINR(customer.spent)}</td>
                    <td className="px-3 py-3 text-muted">{formatDate(customer.createdAt)}</td>
                    <td className="px-4 py-3 text-right">
                      <Link
                        href={`/admin/orders?q=${encodeURIComponent(customer.email)}`}
                        className="inline-flex items-center gap-1 text-[9px] uppercase tracking-[0.1em] text-clay hover:underline"
                      >
                        Orders <ArrowUpRight size={11} />
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
              title="No customers match"
              description="Try a different search term."
              action={
                <Link href="/admin/customers" className="inline-flex h-9 items-center border border-line px-4 text-[9px] uppercase tracking-[0.12em] text-muted hover:border-ink hover:text-ink">
                  Clear search
                </Link>
              }
            />
          </div>
        )}
      </AdminCard>

      <div className="mt-4 border border-line bg-white p-4">
        <p className="text-[9px] font-semibold uppercase tracking-[0.16em] text-ink">Demo accounts</p>
        <p className="mt-1.5 text-[10.5px] leading-relaxed text-muted">
          The seeded customers all use the password <code className="bg-sand px-1 py-0.5 text-ink">Baby@12345</code>.
          You can sign in as any of them on the storefront to test the account area, order history and
          tracking. Accounts are stored locally in SQLite.
        </p>
      </div>
    </>
  );
}
