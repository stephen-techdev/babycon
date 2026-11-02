import { NextResponse } from "next/server";
import { getProductById, getProduct, getProductReviews } from "@/lib/db";
import { getCustomerSession } from "@/lib/auth-server";
import { getDatabase } from "@/lib/database";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const user = await getCustomerSession();
    const name = String(body.name || user?.name || "").trim();
    const rating = Math.max(1, Math.min(5, Number(body.rating) || 5));
    const title = String(body.title || "").trim().slice(0, 80);
    const text = String(body.body || "").trim().slice(0, 800);
    const product = body.handle ? getProduct(String(body.handle)) : body.productId ? getProductById(Number(body.productId)) : null;
    if (!product) return NextResponse.json({ ok: false, message: "Product not found." }, { status: 404 });
    if (name.length < 2 || text.length < 10)
      return NextResponse.json({ ok: false, message: "Add your name and a few words." }, { status: 400 });

    getDatabase()
      .prepare(
        "INSERT INTO reviews (product_id, name, rating, title, body, approved) VALUES (?, ?, ?, ?, ?, 0)"
      )
      .run(product.id, name, rating, title || "Lovely", text);

    return NextResponse.json({
      ok: true,
      message: "Thank you — your review is with our team for approval.",
      reviews: getProductReviews(product.id).length,
    });
  } catch {
    return NextResponse.json({ ok: false, message: "Something went wrong." }, { status: 400 });
  }
}
