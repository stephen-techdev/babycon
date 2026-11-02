import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Heart, MapPin, Package, Sparkles } from "lucide-react";
import { OrderList } from "@/components/account/order-list";
import { getCustomerSession } from "@/lib/auth-server";
import { getOrdersByEmail } from "@/lib/db";
import { formatINR } from "@/lib/money";
import { formatDate } from "@/lib/utils";

export const metadata: Metadata = {
  title: "My account",
  description: "Your Babycon orders, details and saved pieces.",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

export default async function AccountPage() {
  const customer = await getCustomerSession();
  if (!customer) return null;

  const orders = getOrdersByEmail(customer.email);
  const valid = orders.filter((o) => o.status !== "cancelled" && o.status !== "returned");
  const spent = valid.reduce((sum, order) => sum + order.total, 0);
  const latestAddress = orders[0]?.address;

  return (
    <>
      <div className="flex flex-col justify-between gap-4 border-b border-line pb-6 sm:flex-row sm:items-end">
        <div>
          <p className="eyebrow flex items-center gap-3 text-clay">
            <span className="h-px w-8 bg-clay/60" /> Your little corner
          </p>
          <h1 className="display mt-3 text-[38px] sm:text-[46px]">
            Hello, <em className="italic text-clay">{customer.name.split(" ")[0]}.</em>
          </h1>
          <p className="mt-2 text-[12.5px] text-muted">
            Member since {formatDate(customer.createdAt, { month: "long", year: "numeric" })}.
          </p>
        </div>
        <Link href="/shop" className="btn-outline btn-sm w-fit">
          Shop new arrivals <ArrowRight size={12} />
        </Link>
      </div>

      <div className="mt-6 grid gap-3 sm:grid-cols-3">
        {[
          { icon: Package, label: "Orders placed", value: String(orders.length), note: `${valid.length} completed` },
          { icon: Sparkles, label: "Lifetime spend", value: formatINR(spent), note: "Excluding cancelled orders" },
          { icon: Heart, label: "Saved pieces", value: "Wishlist", note: "Open your saved edit", href: "/wishlist" },
        ].map(({ icon: Icon, label, value, note, href }) => {
          const content = (
            <>
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-sand text-clay">
                <Icon size={14} strokeWidth={1.4} />
              </span>
              <p className="mt-4 text-[9.5px] uppercase tracking-[0.16em] text-muted">{label}</p>
              <p className="mt-1 font-serif text-[25px] leading-none">{value}</p>
              <p className="mt-1.5 text-[10.5px] text-muted">{note}</p>
            </>
          );
          return href ? (
            <Link key={label} href={href} className="border border-line p-5 transition-colors hover:border-ink/30">
              {content}
            </Link>
          ) : (
            <div key={label} className="border border-line p-5">
              {content}
            </div>
          );
        })}
      </div>

      <div className="mt-10">
        <div className="mb-4 flex items-end justify-between">
          <h2 className="font-serif text-[26px] font-light">Recent orders</h2>
          <Link href="/account/orders" className="link-line text-[9.5px] text-ink">
            View all <ArrowRight size={11} />
          </Link>
        </div>
        <OrderList orders={orders.slice(0, 3)} />
      </div>

      <div className="mt-8 grid gap-4 sm:grid-cols-2">
        <div className="border border-line p-5">
          <p className="text-[9.5px] uppercase tracking-[0.16em] text-muted">Profile details</p>
          <p className="mt-3 font-serif text-[19px]">{customer.name}</p>
          <p className="mt-1 text-[12px] text-muted">{customer.email}</p>
          {customer.phone && <p className="text-[12px] text-muted">+91 {customer.phone}</p>}
          <p className="mt-4 text-[10.5px] leading-relaxed text-muted">
            Need to update your details? Write to{" "}
            <a href="mailto:care@babycon.in" className="text-clay underline underline-offset-2">
              care@babycon.in
            </a>{" "}
            and we&apos;ll take care of it.
          </p>
        </div>
        <div className="border border-line p-5">
          <p className="flex items-center gap-2 text-[9.5px] uppercase tracking-[0.16em] text-muted">
            <MapPin size={12} className="text-clay" /> Last delivery address
          </p>
          {latestAddress ? (
            <p className="mt-3 text-[12.5px] leading-relaxed text-muted">
              {latestAddress.line1}
              {latestAddress.line2 ? `, ${latestAddress.line2}` : ""}
              <br />
              {latestAddress.city}, {latestAddress.state} {latestAddress.pincode}
            </p>
          ) : (
            <p className="mt-3 text-[12.5px] text-muted">
              Your delivery address will appear here after your first order.
            </p>
          )}
          <Link href="/track-order" className="link-line mt-4 text-[9.5px] text-ink">
            Track an order <ArrowRight size={11} />
          </Link>
        </div>
      </div>
    </>
  );
}
