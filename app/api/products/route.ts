import { NextResponse } from "next/server";
import { listProducts } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const q = searchParams.get("q") || "";
  const collection = searchParams.get("collection") || undefined;
  const limit = Math.min(Number(searchParams.get("limit") || 24), 60);
  const handles = searchParams.get("handles");

  let products = listProducts({ q, collection, limit: handles ? 200 : limit });

  if (handles) {
    const wanted = new Set(handles.split(",").filter(Boolean));
    products = products.filter((p) => wanted.has(p.handle));
  }

  return NextResponse.json({
    products: products.map((p) => ({
      id: p.id,
      handle: p.handle,
      title: p.title,
      price: p.price,
      compareAtPrice: p.compareAtPrice,
      image: p.images[0] || "",
      images: p.images.slice(0, 2),
      category: p.category,
      rating: p.rating,
      reviewCount: p.reviewCount,
      colors: p.colors.slice(0, 4),
      sizes: p.sizes,
      stock: p.stock,
      badge: p.badge,
    })),
    count: products.length,
  });
}
