import Image from "next/image";
import Link from "next/link";
import { ArrowRight, PackageOpen } from "lucide-react";
import type { Order } from "@/lib/types";
import { formatINR } from "@/lib/money";
import { formatDate, orderStatusLabel } from "@/lib/utils";

function statusClass(status: Order["status"]) {
  switch (status) {
    case "delivered":
      return "bg-sage/15 text-sage";
    case "shipped":
      return "bg-blue-50 text-blue-700";
    case "confirmed":
    case "packed":
      return "bg-butter text-ink/70";
    case "cancelled":
    case "returned":
      return "bg-clay/10 text-clay";
    default:
      return "bg-sand text-ink/70";
  }
}

export function OrderList({ orders }: { orders: Order[] }) {
  if (!orders.length) {
    return (
      <div className="flex flex-col items-center border border-dashed border-line px-6 py-14 text-center">
        <span className="flex h-16 w-16 items-center justify-center rounded-full bg-sand">
          <PackageOpen size={24} strokeWidth={1.2} className="text-muted" />
        </span>
        <p className="mt-5 font-serif text-[24px]">No orders yet.</p>
        <p className="mt-2 max-w-sm text-[12.5px] leading-relaxed text-muted">
          When you place your first order, it will appear here with tracking and delivery details.
        </p>
        <Link href="/shop" className="btn-dark btn-sm mt-6">
          Start shopping <ArrowRight size={12} />
        </Link>
      </div>
    );
  }

  return (
    <ul className="space-y-3">
      {orders.map((order) => {
        const count = order.items.reduce((n, item) => n + item.qty, 0);
        const href = `/order/${order.orderNumber}?token=${order.accessToken}`;
        return (
          <li key={order.id} className="border border-line bg-white/40">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-line/70 px-5 py-3">
              <div className="flex flex-wrap items-center gap-x-4 gap-y-1">
                <p className="text-[10px] font-medium uppercase tracking-[0.14em]">{order.orderNumber}</p>
                <span className="text-[10.5px] text-muted">
                  Placed {formatDate(order.createdAt)}
                </span>
              </div>
              <span className={`badge ${statusClass(order.status)}`}>
                {orderStatusLabel(order.status)}
              </span>
            </div>

            <div className="flex flex-col justify-between gap-4 px-5 py-4 sm:flex-row sm:items-center">
              <div className="flex items-center gap-3">
                <div className="flex -space-x-3">
                  {order.items.slice(0, 3).map((item, i) => (
                    <span
                      key={`${item.handle}-${i}`}
                      className="relative h-12 w-10 overflow-hidden border-2 border-cream bg-sand"
                    >
                      {item.image && (
                        <Image src={item.image} alt={item.title} fill sizes="40px" className="object-cover" />
                      )}
                    </span>
                  ))}
                </div>
                <div className="min-w-0">
                  <p className="truncate text-[12.5px] text-ink">
                    {order.items[0]?.title}
                    {order.items.length > 1 ? ` + ${order.items.length - 1} more` : ""}
                  </p>
                  <p className="text-[10.5px] text-muted">
                    {count} {count === 1 ? "piece" : "pieces"} · {formatINR(order.total)}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <span className="text-[10.5px] text-muted">
                  {order.paymentStatus === "paid" ? "Paid" : order.paymentStatus === "refunded" ? "Refunded" : "Payment pending"}
                </span>
                <Link href={href} className="link-line text-[9.5px] text-ink">
                  View order <ArrowRight size={11} />
                </Link>
              </div>
            </div>
          </li>
        );
      })}
    </ul>
  );
}
