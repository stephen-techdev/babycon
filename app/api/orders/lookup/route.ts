import { NextResponse } from "next/server";
import { getOrderByNumber } from "@/lib/db";

export async function POST(request: Request) {
  try {
    const { orderNumber, contact } = await request.json();
    const order = getOrderByNumber(String(orderNumber || "").trim().toUpperCase());
    if (!order) {
      return NextResponse.json(
        { ok: false, message: "We couldn't find an order with that number." },
        { status: 404 }
      );
    }

    const cleaned = String(contact || "").trim().toLowerCase();
    const phone = cleaned.replace(/\D/g, "").slice(-10);
    const matchesEmail = cleaned.length > 0 && cleaned === order.email.toLowerCase();
    const matchesPhone = phone.length === 10 && phone === order.phone.replace(/\D/g, "").slice(-10);

    if (!matchesEmail && !matchesPhone) {
      return NextResponse.json(
        { ok: false, message: "That email or phone doesn't match this order." },
        { status: 403 }
      );
    }

    return NextResponse.json({
      ok: true,
      orderNumber: order.orderNumber,
      token: order.accessToken,
    });
  } catch {
    return NextResponse.json(
      { ok: false, message: "Something went wrong. Please try again." },
      { status: 400 }
    );
  }
}
