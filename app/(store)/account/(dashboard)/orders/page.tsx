import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { OrderList } from "@/components/account/order-list";
import { getCustomerSession } from "@/lib/auth-server";
import { getOrdersByEmail } from "@/lib/db";

export const metadata: Metadata = {
  title: "My orders",
  description: "All your Babycon orders in one place.",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

export default async function AccountOrdersPage() {
  const customer = await getCustomerSession();
  if (!customer) return null;
  const orders = getOrdersByEmail(customer.email);
  const active = orders.filter((o) => !["delivered", "cancelled", "returned"].includes(o.status));
  const past = orders.filter((o) => ["delivered", "cancelled", "returned"].includes(o.status));

  return (
    <>
      <div className="flex flex-col justify-between gap-4 border-b border-line pb-6 sm:flex-row sm:items-end">
        <div>
          <p className="eyebrow flex items-center gap-3 text-clay">
            <span className="h-px w-8 bg-clay/60" /> Order history
          </p>
          <h1 className="display mt-3 text-[36px] sm:text-[44px]">My orders</h1>
          <p className="mt-2 text-[12.5px] text-muted">
            {orders.length} {orders.length === 1 ? "order" : "orders"} placed with Babycon.
          </p>
        </div>
        <Link href="/track-order" className="link-line w-fit text-[9.5px] text-ink">
          Track with order number <ArrowRight size={11} />
        </Link>
      </div>

      <div className="mt-7">
        <h2 className="mb-3 text-[9.5px] uppercase tracking-[0.18em] text-muted">
          In progress · {active.length}
        </h2>
        <OrderList orders={active} />
      </div>

      <div className="mt-9">
        <h2 className="mb-3 text-[9.5px] uppercase tracking-[0.18em] text-muted">
          Past orders · {past.length}
        </h2>
        <OrderList orders={past} />
      </div>
    </>
  );
}
