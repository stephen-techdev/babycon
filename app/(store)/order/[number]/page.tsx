import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import {
  ArrowRight,
  BadgeCheck,
  Check,
  CircleDollarSign,
  Clock3,
  Home,
  MapPin,
  Package,
  Phone,
  Truck,
  XCircle,
} from "lucide-react";
import { getAdminSession, getCustomerSession } from "@/lib/auth-server";
import { getOrderByNumber } from "@/lib/db";
import { formatINR } from "@/lib/money";
import { formatDate } from "@/lib/utils";
import { PrintButton } from "@/components/order/print-button";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Your order",
  description: "Order details and delivery status.",
  robots: { index: false, follow: false },
};

type Props = {
  params: Promise<{ number: string }>;
  searchParams: Promise<{ token?: string | string[] }>;
};

const STEPS = [
  { key: "placed", label: "Order placed", note: "We have your order" },
  { key: "confirmed", label: "Confirmed", note: "Payment & stock verified" },
  { key: "packed", label: "Packed", note: "Wrapped with care" },
  { key: "shipped", label: "Shipped", note: "On its way to you" },
  { key: "delivered", label: "Delivered", note: "Home, safely" },
];

export default async function OrderPage({ params, searchParams }: Props) {
  const { number } = await params;
  const query = await searchParams;
  const token = Array.isArray(query.token) ? query.token[0] : query.token;
  const order = getOrderByNumber(number.toUpperCase());
  if (!order) notFound();

  const [customer, admin] = await Promise.all([getCustomerSession(), getAdminSession()]);
  const authorized =
    Boolean(token && token === order.accessToken) ||
    Boolean(customer && customer.email.toLowerCase() === order.email.toLowerCase()) ||
    Boolean(admin);

  if (!authorized) {
    redirect(`/track-order?order=${encodeURIComponent(order.orderNumber)}`);
  }

  const address = order.address;
  const itemCount = order.items.reduce((sum, item) => sum + item.qty, 0);
  const statusIndex = STEPS.findIndex((step) => step.key === order.status);
  const isSpecial = order.status === "cancelled" || order.status === "returned";
  const currentIndex = statusIndex >= 0 ? statusIndex : 0;

  const paymentLabel: Record<string, string> = {
    paid: "Paid",
    pending: "Payment pending",
    failed: "Payment failed",
    refunded: "Refunded",
  };

  return (
    <section className="container-x py-10 sm:py-14">
      <nav className="no-print flex flex-wrap items-center gap-2 text-[9.5px] uppercase tracking-[0.16em] text-muted">
        <Link href="/" className="hover:text-ink">Home</Link>
        <span>/</span>
        <Link href="/account" className="hover:text-ink">Account</Link>
        <span>/</span>
        <span className="text-ink">Order {order.orderNumber}</span>
      </nav>

      <div className="mt-7 flex flex-col justify-between gap-5 border-b border-line pb-7 sm:flex-row sm:items-end">
        <div>
          <p className="eyebrow flex items-center gap-3 text-clay">
            <span className="h-px w-8 bg-clay/60" /> {order.orderNumber}
          </p>
          <h1 className="display mt-3 text-[38px] sm:text-[50px]">
            {order.status === "delivered" ? (
              <>Delivered with <em className="italic text-clay">love.</em></>
            ) : isSpecial ? (
              <>An update on <em className="italic text-clay">your order.</em></>
            ) : (
              <>Thank you, <em className="italic text-clay">{order.customerName.split(" ")[0]}.</em></>
            )}
          </h1>
          <p className="mt-3 max-w-xl text-[13px] leading-relaxed text-muted">
            Placed {formatDate(order.createdAt, { hour: "numeric", minute: "2-digit" })} ·{" "}
            {itemCount} {itemCount === 1 ? "piece" : "pieces"} · A confirmation has been sent to{" "}
            <span className="text-ink">{order.email}</span>.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <PrintButton />
          <Link
            href={`/track-order?order=${order.orderNumber}`}
            className="no-print inline-flex h-10 items-center gap-2 border border-ink bg-ink px-4 text-[10px] font-medium uppercase tracking-[0.14em] text-cream transition-colors hover:bg-forest"
          >
            Track order <ArrowRight size={13} />
          </Link>
        </div>
      </div>

      <div className="mt-8 grid gap-8 lg:grid-cols-[1.3fr_0.7fr] lg:gap-12">
        <div className="space-y-6">
          <div className="border border-line bg-sand/30 p-6 sm:p-7">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <span
                  className={`flex h-10 w-10 items-center justify-center rounded-full ${
                    isSpecial ? "bg-clay/15 text-clay" : "bg-sage/15 text-sage"
                  }`}
                >
                  {isSpecial ? <XCircle size={20} /> : <BadgeCheck size={20} />}
                </span>
                <div>
                  <p className="text-[10px] uppercase tracking-[0.18em] text-muted">Status</p>
                  <p className="font-serif text-[21px] capitalize">
                    {isSpecial ? order.status : STEPS[currentIndex]?.label}
                  </p>
                </div>
              </div>
              <span
                className={`badge ${
                  order.paymentStatus === "paid"
                    ? "bg-sage/15 text-sage"
                    : order.paymentStatus === "refunded"
                      ? "bg-ink/10 text-ink"
                      : "bg-butter text-ink/70"
                }`}
              >
                {paymentLabel[order.paymentStatus] || order.paymentStatus}
              </span>
            </div>

            {isSpecial ? (
              <div className="mt-5 border-t border-line pt-5 text-[12.5px] leading-relaxed text-muted">
                {order.status === "cancelled" ? (
                  <>
                    This order was cancelled. If a payment was captured, the refund is issued to the
                    original payment method within 5–7 working days. Write to us if you need help
                    placing a new order.
                  </>
                ) : (
                  <>
                    This order has been marked as returned. Once the pieces reach our studio and pass
                    inspection, your refund will be processed within 5–7 working days.
                  </>
                )}
              </div>
            ) : (
              <>
                <div className="mt-7 flex items-center">
                  {STEPS.map((step, index) => {
                    const done = index <= currentIndex;
                    const active = index === currentIndex;
                    return (
                      <div key={step.key} className="flex flex-1 items-center last:flex-none">
                        <div className="flex flex-col items-center">
                          <span
                            className={`flex h-7 w-7 items-center justify-center rounded-full border text-[10px] transition-colors ${
                              done
                                ? "border-clay bg-clay text-white"
                                : "border-line bg-cream text-muted"
                            } ${active ? "ring-4 ring-clay/15" : ""}`}
                          >
                            {done && !active ? <Check size={12} /> : index + 1}
                          </span>
                          <span
                            className={`mt-2 hidden whitespace-nowrap text-[9px] uppercase tracking-[0.1em] sm:block ${
                              done ? "text-ink" : "text-muted/60"
                            }`}
                          >
                            {step.label}
                          </span>
                        </div>
                        {index < STEPS.length - 1 && (
                          <span
                            className={`mx-1 mb-5 h-px flex-1 sm:mx-2 ${
                              index < currentIndex ? "bg-clay" : "bg-line"
                            }`}
                          />
                        )}
                      </div>
                    );
                  })}
                </div>
                <p className="mt-4 flex items-center gap-2 text-[11px] text-muted">
                  <Clock3 size={12} className="text-clay" />
                  {order.status === "delivered"
                    ? `Delivered on ${formatDate(order.updatedAt)}`
                    : "Estimated delivery: 2–4 working days for metros, 4–7 days elsewhere."}
                </p>
              </>
            )}
          </div>

          <div className="border border-line">
            <div className="flex items-center justify-between border-b border-line px-6 py-4">
              <h2 className="text-[10px] font-medium uppercase tracking-[0.2em]">
                Your pieces ({itemCount})
              </h2>
              <Link
                href="/shop"
                className="no-print text-[9.5px] uppercase tracking-[0.12em] text-clay hover:underline"
              >
                Shop again
              </Link>
            </div>
            <ul className="divide-y divide-line px-6">
              {order.items.map((item, index) => (
                <li key={`${item.handle}-${index}`} className="flex gap-4 py-5">
                  <Link
                    href={`/products/${item.handle}`}
                    className="relative h-[104px] w-[82px] shrink-0 overflow-hidden bg-sand"
                  >
                    {item.image && (
                      <Image
                        src={item.image}
                        alt={item.title}
                        fill
                        sizes="82px"
                        className="object-cover"
                      />
                    )}
                  </Link>
                  <div className="flex min-w-0 flex-1 flex-col">
                    <Link
                      href={`/products/${item.handle}`}
                      className="font-serif text-[17px] leading-snug hover:text-clay"
                    >
                      {item.title}
                    </Link>
                    <p className="mt-1 text-[10px] uppercase tracking-[0.12em] text-muted">
                      {[item.size, item.color].filter(Boolean).join(" · ")}
                    </p>
                    <p className="mt-1 text-[11px] text-muted">Qty {item.qty}</p>
                    <p className="mt-auto pt-2 text-[13px] font-medium">
                      {formatINR(item.price * item.qty)}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="border border-line p-5">
              <p className="flex items-center gap-2 text-[10px] font-medium uppercase tracking-[0.16em] text-muted">
                <Home size={13} className="text-clay" /> Delivery address
              </p>
              <p className="mt-3 text-[13px] font-medium">{order.customerName}</p>
              <p className="mt-1 text-[12.5px] leading-relaxed text-muted">
                {address.line1}
                {address.line2 ? `, ${address.line2}` : ""}
                <br />
                {address.city}, {address.state} {address.pincode}
                <br />
                {address.country}
              </p>
              <p className="mt-3 flex items-center gap-2 text-[12px] text-muted">
                <Phone size={12} /> +91 {order.phone}
              </p>
            </div>
            <div className="border border-line p-5">
              <p className="flex items-center gap-2 text-[10px] font-medium uppercase tracking-[0.16em] text-muted">
                <CircleDollarSign size={13} className="text-clay" /> Payment
              </p>
              <p className="mt-3 text-[13px] font-medium">{order.paymentMethod}</p>
              <p className="mt-1 text-[12px] text-muted">
                {paymentLabel[order.paymentStatus] || order.paymentStatus}
                {order.paymentId ? ` · ${order.paymentId}` : ""}
              </p>
              <p className="mt-3 flex items-center gap-2 text-[11px] text-muted">
                <MapPin size={12} /> Billed to the address above
              </p>
              {order.paymentMethod.includes("Demo") && (
                <p className="mt-3 inline-flex bg-amber-50 px-2 py-1 text-[9px] uppercase tracking-[0.12em] text-amber-800">
                  Demo payment · no real charge
                </p>
              )}
            </div>
          </div>
        </div>

        <aside className="space-y-4 lg:sticky lg:top-28 lg:h-fit">
          <div className="border border-line bg-sand/40 p-5 sm:p-6">
            <h2 className="text-[10px] font-medium uppercase tracking-[0.2em]">Order summary</h2>
            <dl className="mt-4 space-y-2.5 text-[12px]">
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
                <dt className="text-[10px] uppercase tracking-[0.18em] text-muted">Total</dt>
                <dd className="font-serif text-[24px]">{formatINR(order.total)}</dd>
              </div>
            </dl>
            <p className="mt-2 text-[10px] text-muted">Inclusive of all taxes.</p>
          </div>

          <div className="border border-line p-5">
            <p className="flex items-center gap-2 text-[10px] font-medium uppercase tracking-[0.16em] text-muted">
              <Truck size={13} className="text-clay" /> Delivery
            </p>
            <p className="mt-3 text-[12.5px] leading-relaxed text-muted">
              Dispatched within 24–48 hours. You&apos;ll receive tracking details by email and SMS
              once your parcel leaves our studio.
            </p>
            <div className="mt-4 space-y-2 border-t border-line pt-4 text-[10.5px] text-muted">
              <p className="flex items-center gap-2">
                <Package size={12} /> Easy 7-day returns
              </p>
              <p className="flex items-center gap-2">
                <BadgeCheck size={12} /> Packed in tissue, ready to gift
              </p>
            </div>
          </div>

          <div className="border border-line p-5 text-[12px] leading-relaxed text-muted">
            <p className="font-medium text-ink">Need a hand?</p>
            <p className="mt-1">
              Write to{" "}
              <a href="mailto:care@babycon.in" className="text-clay underline underline-offset-2">
                care@babycon.in
              </a>{" "}
              with your order number and we&apos;ll reply within one working day.
            </p>
            <Link href="/contact" className="link-line mt-3 text-[9.5px] text-ink">
              Contact us <ArrowRight size={11} />
            </Link>
          </div>

          <div className="border border-line p-5">
            <p className="text-[9px] uppercase tracking-[0.18em] text-muted">Invoice details</p>
            <p className="mt-2 text-[10.5px] leading-relaxed text-muted">
              Babycon Retail LLP · GSTIN 33ABCFB1234C1ZQ
              <br />
              No. 12, Kutchery Road, Mylapore, Chennai 600 004
              <br />
              Invoice date: {formatDate(order.createdAt)}
            </p>
          </div>
        </aside>
      </div>
    </section>
  );
}
