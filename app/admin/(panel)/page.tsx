import Link from "next/link";
import {
  AlertTriangle,
  ArrowRight,
  ArrowUpRight,
  IndianRupee,
  Package,
  Plus,
  ShoppingBag,
  Users,
} from "lucide-react";
import {
  AdminCard,
  AdminEmpty,
  AdminPageHeader,
  StatCard,
  StatusPill,
} from "@/components/admin/ui";
import { dashboardStats, lowStockProducts } from "@/lib/db";
import { formatINR } from "@/lib/money";
import { formatDate, timeAgo } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default function AdminDashboardPage() {
  const stats = dashboardStats();
  const lowStock = lowStockProducts(10).slice(0, 5);
  const maxRevenue = Math.max(...stats.days.map((day) => day.revenue), 1);

  return (
    <>
      <AdminPageHeader
        eyebrow="Overview"
        title="Good morning, studio."
        description="A quiet look at how the store is doing — orders, revenue and the little things that need attention."
        action={
          <>
            <Link
              href="/admin/products/new"
              className="inline-flex h-10 items-center gap-2 bg-ink px-4 text-[9.5px] font-medium uppercase tracking-[0.14em] text-cream transition-colors hover:bg-forest"
            >
              <Plus size={13} /> New product
            </Link>
            <Link
              href="/admin/orders"
              className="inline-flex h-10 items-center gap-2 border border-line bg-white px-4 text-[9.5px] font-medium uppercase tracking-[0.14em] text-muted transition-colors hover:border-ink hover:text-ink"
            >
              View orders <ArrowRight size={12} />
            </Link>
          </>
        }
      />

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label="Total revenue"
          value={formatINR(stats.revenue)}
          note={`${stats.orders} orders · AOV ${formatINR(stats.aov)}`}
          icon={IndianRupee}
          tone="forest"
        />
        <StatCard
          label="Orders"
          value={String(stats.orders)}
          note={`${stats.pending} awaiting action`}
          icon={ShoppingBag}
          tone="clay"
        />
        <StatCard
          label="Customers"
          value={String(stats.customers)}
          note="Accounts on the store"
          icon={Users}
          tone="sage"
        />
        <StatCard
          label="Catalog"
          value={String(stats.products)}
          note={`${stats.lowStock} low on stock`}
          icon={Package}
        />
      </div>

      <div className="mt-4 grid gap-4 xl:grid-cols-[1.6fr_1fr]">
        <AdminCard
          title="Revenue · last 14 days"
          description="Includes all non-cancelled, non-returned orders."
          action={
            <span className="text-[9px] uppercase tracking-[0.12em] text-muted">
              Peak {formatINR(maxRevenue)}
            </span>
          }
        >
          <div className="flex h-44 items-end gap-1 sm:gap-1.5">
            {stats.days.map((day) => (
              <div key={day.label} className="group relative flex h-full flex-1 flex-col justify-end">
                <div
                  className="w-full bg-clay/25 transition-colors group-hover:bg-clay"
                  style={{ height: `${Math.max(2, (day.revenue / maxRevenue) * 100)}%` }}
                  title={`${day.label}: ${formatINR(day.revenue)} · ${day.orders} orders`}
                />
              </div>
            ))}
          </div>
          <div className="mt-2 flex justify-between border-t border-line pt-2 text-[8.5px] uppercase tracking-[0.08em] text-muted">
            <span>{stats.days[0]?.label}</span>
            <span>{stats.days[6]?.label}</span>
            <span>{stats.days[13]?.label}</span>
          </div>
        </AdminCard>

        <AdminCard title="Order pipeline" description="Where everything sits right now.">
          <div className="space-y-2.5">
            {[
              { key: "placed", label: "Placed" },
              { key: "confirmed", label: "Confirmed" },
              { key: "packed", label: "Packed" },
              { key: "shipped", label: "Shipped" },
              { key: "delivered", label: "Delivered" },
              { key: "cancelled", label: "Cancelled" },
              { key: "returned", label: "Returned" },
            ].map(({ key, label }) => {
              const count = stats.statusCounts[key] || 0;
              const pct = stats.orders ? Math.round((count / stats.orders) * 100) : 0;
              return (
                <div key={key}>
                  <div className="flex items-center justify-between text-[10.5px]">
                    <span className="text-muted">{label}</span>
                    <span className="font-medium text-ink">{count}</span>
                  </div>
                  <div className="mt-1 h-1.5 bg-sand">
                    <div className="h-full bg-ink/70" style={{ width: `${pct}%` }} />
                  </div>
                </div>
              );
            })}
          </div>
        </AdminCard>
      </div>

      <div className="mt-4 grid gap-4 xl:grid-cols-[1.6fr_1fr]">
        <AdminCard
          title="Recent orders"
          description="The latest five orders across the store."
          action={
            <Link
              href="/admin/orders"
              className="text-[9px] font-medium uppercase tracking-[0.12em] text-clay hover:underline"
            >
              All orders
            </Link>
          }
          padded={false}
        >
          <div className="overflow-x-auto">
            <table className="w-full min-w-[620px] text-left">
              <thead>
                <tr className="border-b border-line text-[8.5px] uppercase tracking-[0.12em] text-muted">
                  <th className="px-5 py-3 font-medium">Order</th>
                  <th className="px-3 py-3 font-medium">Customer</th>
                  <th className="px-3 py-3 font-medium">Total</th>
                  <th className="px-3 py-3 font-medium">Status</th>
                  <th className="px-3 py-3 font-medium">Date</th>
                  <th className="px-5 py-3" />
                </tr>
              </thead>
              <tbody className="divide-y divide-line/70">
                {stats.recentOrders.map((order) => (
                  <tr key={order.id} className="text-[11.5px] transition-colors hover:bg-sand/30">
                    <td className="px-5 py-3 font-medium text-ink">{order.orderNumber}</td>
                    <td className="px-3 py-3 text-muted">{order.customerName}</td>
                    <td className="px-3 py-3 text-ink">{formatINR(order.total)}</td>
                    <td className="px-3 py-3">
                      <StatusPill status={order.status} />
                    </td>
                    <td className="px-3 py-3 text-muted">{formatDate(order.createdAt)}</td>
                    <td className="px-5 py-3 text-right">
                      <Link
                        href={`/admin/orders/${order.id}`}
                        className="inline-flex text-muted transition-colors hover:text-clay"
                      >
                        <ArrowUpRight size={14} />
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </AdminCard>

        <AdminCard
          title="Best sellers"
          description="By units sold across valid orders."
          padded={false}
        >
          {stats.topProducts.length ? (
            <ul className="divide-y divide-line/70">
              {stats.topProducts.map((product, index) => (
                <li key={product.title} className="flex items-center gap-3 px-5 py-3">
                  <span className="w-4 text-[9px] text-muted">0{index + 1}</span>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-[11.5px] text-ink">{product.title}</p>
                    <p className="text-[9.5px] text-muted">
                      {product.qty} sold · {formatINR(product.revenue)}
                    </p>
                  </div>
                  <span className="text-[10px] font-medium text-ink">{product.qty}</span>
                </li>
              ))}
            </ul>
          ) : (
            <div className="p-5">
              <AdminEmpty title="No sales yet" description="Orders will populate this list." />
            </div>
          )}
        </AdminCard>
      </div>

      <div className="mt-4 grid gap-4 xl:grid-cols-[1.6fr_1fr]">
        <AdminCard
          title="Low stock"
          description="Ten units or fewer — time for a gentle restock."
          action={
            <Link
              href="/admin/products"
              className="text-[9px] font-medium uppercase tracking-[0.12em] text-clay hover:underline"
            >
              Manage products
            </Link>
          }
          padded={false}
        >
          {lowStock.length ? (
            <ul className="divide-y divide-line/70">
              {lowStock.map((product) => (
                <li key={product.id} className="flex items-center justify-between gap-3 px-5 py-3">
                  <div className="flex min-w-0 items-center gap-3">
                    <AlertTriangle size={13} className="shrink-0 text-clay" />
                    <div className="min-w-0">
                      <p className="truncate text-[11.5px] text-ink">{product.title}</p>
                      <p className="text-[9.5px] text-muted">{product.sku}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span
                      className={`text-[10.5px] font-medium ${
                        product.stock <= 3 ? "text-clay" : "text-ink"
                      }`}
                    >
                      {product.stock} left
                    </span>
                    <Link
                      href={`/admin/products/${product.id}`}
                      className="text-muted transition-colors hover:text-clay"
                    >
                      <ArrowUpRight size={13} />
                    </Link>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <div className="p-5">
              <AdminEmpty title="Everything in stock" description="No pieces below ten units." />
            </div>
          )}
        </AdminCard>

        <AdminCard title="Quick actions">
          <div className="grid gap-2">
            {[
              { label: "Add a product", href: "/admin/products/new" },
              { label: "Create a coupon", href: "/admin/coupons" },
              { label: "Review pending reviews", href: "/admin/reviews" },
              { label: "Read new messages", href: "/admin/messages" },
              { label: "Update store settings", href: "/admin/settings" },
            ].map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="group flex items-center justify-between border border-line px-3.5 py-2.5 text-[11px] text-muted transition-colors hover:border-ink/30 hover:text-ink"
              >
                {item.label}
                <ArrowRight size={12} className="transition-transform group-hover:translate-x-0.5" />
              </Link>
            ))}
          </div>
          <p className="mt-4 border-t border-line pt-3 text-[9.5px] leading-relaxed text-muted">
            Last seeded activity {timeAgo(stats.recentOrders[0]?.createdAt || new Date())}. This is
            a demo studio — all orders and payments are simulated.
          </p>
        </AdminCard>
      </div>
    </>
  );
}
