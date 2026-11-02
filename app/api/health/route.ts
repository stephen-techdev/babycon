import { NextResponse } from "next/server";
import { getDatabase } from "@/lib/database";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const db = getDatabase();
    const products = db.prepare("SELECT COUNT(*) AS count FROM products").get() as { count: number };
    const orders = db.prepare("SELECT COUNT(*) AS count FROM orders").get() as { count: number };
    return NextResponse.json({
      ok: true,
      service: "babycon",
      time: new Date().toISOString(),
      products: products.count,
      orders: orders.count,
    });
  } catch (error) {
    return NextResponse.json(
      { ok: false, message: error instanceof Error ? error.message : "db error" },
      { status: 500 }
    );
  }
}
