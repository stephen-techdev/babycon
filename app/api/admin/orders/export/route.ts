import { NextResponse } from "next/server";
import { getAdminSession } from "@/lib/auth-server";
import { listOrders } from "@/lib/db";

function escape(value: unknown): string {
  const text = String(value ?? "");
  return /[",\n]/.test(text) ? `"${text.replace(/"/g, '""')}"` : text;
}

export async function GET() {
  const admin = await getAdminSession();
  if (!admin) {
    return NextResponse.json({ ok: false, message: "Unauthorised" }, { status: 401 });
  }

  const orders = listOrders();
  const header = [
    "Order number",
    "Date",
    "Customer",
    "Email",
    "Phone",
    "City",
    "State",
    "Pincode",
    "Items",
    "Subtotal",
    "Discount",
    "Shipping",
    "COD fee",
    "Total",
    "Coupon",
    "Payment method",
    "Payment status",
    "Order status",
    "Notes",
  ];

  const rows = orders.map((order) => [
    order.orderNumber,
    order.createdAt,
    order.customerName,
    order.email,
    order.phone,
    order.address.city,
    order.address.state,
    order.address.pincode,
    order.items.map((item) => `${item.title} × ${item.qty}`).join(" | "),
    order.subtotal,
    order.discount,
    order.shipping,
    order.codFee,
    order.total,
    order.couponCode || "",
    order.paymentMethod,
    order.paymentStatus,
    order.status,
    order.notes,
  ]);

  const csv = [header, ...rows].map((row) => row.map(escape).join(",")).join("\r\n");

  return new NextResponse(csv, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="babycon-orders-${new Date().toISOString().slice(0, 10)}.csv"`,
      "Cache-Control": "no-store",
    },
  });
}
