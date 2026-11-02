import { NextResponse } from "next/server";
import { validateCoupon } from "@/lib/db";

export async function POST(request: Request) {
  try {
    const { code, subtotal } = await request.json();
    if (!code || typeof subtotal !== "number") {
      return NextResponse.json({ valid: false, message: "Enter a code." }, { status: 400 });
    }
    const result = validateCoupon(String(code), Math.max(0, Math.round(subtotal)));
    return NextResponse.json(result);
  } catch {
    return NextResponse.json({ valid: false, message: "Invalid request." }, { status: 400 });
  }
}
