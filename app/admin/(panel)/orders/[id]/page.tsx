import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowLeft,
  ArrowUpRight,
  CheckCircle2,
  CreditCard,
  Mail,
  MapPin,
  Phone,
  StickyNote,
  Truck,
} from "lucide-react";
import { updateOrder } from "@/app/admin/actions";
import {
  AdminCard,
  AdminPageHeader,
  Field,
  StatusPill,
  adminButton,
  adminSelect,
  adminTextarea,
} from "@/components/admin/ui";
import { getOrderById } from "@/lib/db";
import { formatINR } from "@/lib/money";
import { formatDate } from "@/lib/utils";
import { PrintButton } from "@/components/order/print-button";

export const metadata: Metadata = { title: "Order · Admin" };
export const dynamic = "force-dynamic";

type Props = {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ saved?: string | string[] }>;
};

const ORDER_STATUSES = ["placed", "confirmed", "packed", "shipped", "delivered", "cancelled", "returned"];
const PAYMENT_STATUSES = ["pending", "paid", "failed", "refunded"];

export default async function AdminOrderPage({ params, searchParams }: Props) {
  const { id } = await params;
  const raw = await searchParams;
  const saved = Array.isArray(raw.saved) ? raw.saved[0] : raw.saved;
  const order = getOrderById(Number(id));
  if (!order) notFound();

  const itemCount = order.items.reduce((sum, item) => sum + item.qty, 0);

  return (
    <>
      <AdminPageHeader
        eyebrow={`Order · ${formatDate(order.createdAt)}`}
        title={order.orderNumber}
        description={`${order.customerName} · ${itemCount} ${itemCount === 1 ? "piece" : "pieces"} · placed ${formatDate(order.createdAt, { hour: "numeric", minute: "2-digit" })}`}
        action={
          <>
            <Link
              href="/admin/orders"
              className="inline-flex h-10 items-center gap-2 border border-line bg-white px-4 text-[9.5px] font-medium uppercase tracking-[0.14em] text-muted transition-colors hover:border-ink hover:text-ink"
            >
              <ArrowLeft size={12} /> All orders
            </Link>
            <Link
              href={`/order/${order.orderNumber}?token=${order.accessToken}`}
              target="_blank"
              className="inline-flex h-10 items-center gap-2 bg-ink px-4 text-[9.5px] font-medium uppercase tracking-[0.14em] text-cream transition-colors hover:bg-forest"
            >
              Customer view <ArrowUpRight size={12} />
            </Link>
          </>
        }
      />

      {saved && (
        <div className="mb-4 flex items-center gap-2 border border-sage/40 bg-sage/10 px-4 py-2.5 text-[11px] text-sage">
          <CheckCircle2 size={14} /> Order updated. The customer view reflects the new status.
        </div>
      )}

      <div className="grid gap-4 xl:grid-cols-[1.5fr_1fr]">
        <div className="space-y-4">
          <AdminCard title="Items" description={`${itemCount} pieces in this order`} padded={false}>
            <ul className="divide-y divide-line">
              {order.items.map((item, index) => (
                <li key={`${item.handle}-${index}`} className="flex gap-4 px-5 py-4">
                  <div className="relative h-[92px] w-[72px] shrink-0 overflow-hidden bg-sand">
                    {item.image && (
                      <Image src={item.image} alt={item.title} fill sizes="72px" className="object-cover" />
                    )}
                  </div>
                  <div className="flex min-w-0 flex-1 flex-col">
                    <Link
                      href={`/products/${item.handle}`}
                      target="_blank"
                      className="font-serif text-[17px] leading-snug text-ink hover:text-clay"
                    >
                      {item.title}
                    </Link>
                    <p className="mt-1 text-[10px] uppercase tracking-[0.12em] text-muted">
                      {[item.size, item.color].filter(Boolean).join(" · ")}
                    </p>
                    <p className="mt-1 text-[10.5px] text-muted">
                      {formatINR(item.price)} × {item.qty}
                    </p>
                    <p className="mt-auto pt-2 text-[13px] font-medium text-ink">
                      {formatINR(item.price * item.qty)}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          </AdminCard>

          <div className="grid gap-4 sm:grid-cols-2">
            <AdminCard title="Customer">
              <div className="space-y-3 text-[12px]">
                <p className="font-serif text-[19px] text-ink">{order.customerName}</p>
                <a href={`mailto:${order.email}`} className="flex items-center gap-2 text-muted hover:text-clay">
                  <Mail size={13} /> {order.email}
                </a>
                <a href={`tel:+91${order.phone}`} className="flex items-center gap-2 text-muted hover:text-clay">
                  <Phone size={13} /> +91 {order.phone}
                </a>
                <a
                  href={`https://wa.me/91${order.phone.replace(/\D/g, "")}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="link-line mt-1 inline-flex text-[9px] text-ink"
                >
                  Message on WhatsApp
                </a>
              </div>
            </AdminCard>

            <AdminCard title="Delivery address">
              <p className="flex items-start gap-2 text-[12.5px] leading-relaxed text-muted">
                <MapPin size={14} className="mt-0.5 shrink-0 text-clay" />
                <span>
                  {order.address.line1}
                  {order.address.line2 ? `, ${order.address.line2}` : ""}
                  <br />
                  {order.address.city}, {order.address.state} {order.address.pincode}
                  <br />
                  {order.address.country}
                </span>
              </p>
            </AdminCard>
          </div>

          <AdminCard title="Payment & totals">
            <div className="flex flex-wrap items-center gap-3 border-b border-line pb-4">
              <span className="flex h-9 w-9 items-center justify-center rounded-full bg-sand text-clay">
                <CreditCard size={15} />
              </span>
              <div className="min-w-0 flex-1">
                <p className="text-[12px] font-medium text-ink">{order.paymentMethod}</p>
                <p className="text-[10px] text-muted">
                  {order.paymentId ? order.paymentId : "No payment reference"}
                  {order.paymentMethod.includes("Demo") ? " · simulated" : ""}
                </p>
              </div>
              <StatusPill status={order.paymentStatus} />
            </div>
            <dl className="mt-4 space-y-2 text-[12px]">
              <div className="flex justify-between">
                <dt className="text-muted">Subtotal</dt>
                <dd>{formatINR(order.subtotal)}</dd>
              </div>
              {order.discount > 0 && (
                <div className="flex justify-between text-sage">
                  <dt>Discount {order.couponCode ? `(${order.couponCode})` : ""}</dt>
                  <dd>−{formatINR(order.discount)}</dd>
                </div>
              )}
              <div className="flex justify-between">
                <dt className="text-muted">Shipping</dt>
                <dd>{order.shipping === 0 ? "Free" : formatINR(order.shipping)}</dd>
              </div>
              {order.codFee > 0 && (
                <div className="flex justify-between">
                  <dt className="text-muted">COD handling</dt>
                  <dd>{formatINR(order.codFee)}</dd>
                </div>
              )}
              <div className="flex items-baseline justify-between border-t border-line pt-3">
                <dt className="text-[10px] uppercase tracking-[0.16em] text-muted">Total</dt>
                <dd className="font-serif text-[24px]">{formatINR(order.total)}</dd>
              </div>
            </dl>
          </AdminCard>
        </div>

        <div className="space-y-4 xl:sticky xl:top-20 xl:h-fit">
          <AdminCard title="Update order" description="Changes are logged against the order.">
            <form action={updateOrder} className="space-y-3.5">
              <input type="hidden" name="id" value={order.id} />
              <Field label="Fulfilment status">
                <select name="status" defaultValue={order.status} className={adminSelect}>
                  {ORDER_STATUSES.map((status) => (
                    <option key={status} value={status}>
                      {status.charAt(0).toUpperCase() + status.slice(1)}
                    </option>
                  ))}
                </select>
              </Field>
              <Field label="Payment status">
                <select name="paymentStatus" defaultValue={order.paymentStatus} className={adminSelect}>
                  {PAYMENT_STATUSES.map((status) => (
                    <option key={status} value={status}>
                      {status.charAt(0).toUpperCase() + status.slice(1)}
                    </option>
                  ))}
                </select>
              </Field>
              <Field label="Internal notes" hint="Only visible to the studio team.">
                <textarea
                  name="notes"
                  defaultValue={order.notes}
                  className={`${adminTextarea} min-h-[90px]`}
                  placeholder="Packed with a handwritten note…"
                />
              </Field>
              <button type="submit" className={`${adminButton} w-full`}>
                Save changes
              </button>
            </form>
          </AdminCard>

          <AdminCard title="Timeline">
            <ol className="space-y-3 text-[11px]">
              <li className="flex gap-3">
                <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-sage/15 text-sage">
                  <CheckCircle2 size={11} />
                </span>
                <div>
                  <p className="text-ink">Order placed</p>
                  <p className="text-[9.5px] text-muted">{formatDate(order.createdAt, { hour: "numeric", minute: "2-digit" })}</p>
                </div>
              </li>
              <li className="flex gap-3">
                <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-sand text-muted">
                  <Truck size={11} />
                </span>
                <div>
                  <p className="text-ink capitalize">{order.status}</p>
                  <p className="text-[9.5px] text-muted">
                    Last updated {formatDate(order.updatedAt, { hour: "numeric", minute: "2-digit" })}
                  </p>
                </div>
              </li>
            </ol>
            {order.notes && (
              <div className="mt-4 border-t border-line pt-3">
                <p className="flex items-center gap-1.5 text-[9px] uppercase tracking-[0.14em] text-muted">
                  <StickyNote size={10} /> Note
                </p>
                <p className="mt-1.5 text-[11px] leading-relaxed text-muted">{order.notes}</p>
              </div>
            )}
          </AdminCard>

          <AdminCard title="Tools">
            <div className="flex flex-col gap-2">
              <PrintButton label="Print invoice" />
              <p className="border-t border-line pt-3 text-[9.5px] leading-relaxed text-muted">
                This is a demo store. Payments are simulated, so no capture or refund reaches a real
                gateway. Use the customer view to see the storefront timeline.
              </p>
            </div>
          </AdminCard>
        </div>
      </div>
    </>
  );
}
